import { dilatePointsPx } from "../../utils/utils";
import Smoother from "../Smoother";
import MediaPipeTaskVisionLocator from "./MediaPipeTaskVisionLocator";
import MediaPipeTaskVisionLocatorEngine from "../engines/MediaPipeTaskVisionLocatorEngine";
import { FaceLandmarker } from '@mediapipe/tasks-vision'

const BASE_OUTER_DILATE_PX = 0; // cover corner gaps
const INNER_MOUTH_EXPAND_PX = 0; // ensure teeth/tongue stay clear
const FEATHER_WIDTHS_PX = [3, 6]; // two feather rings outward

class MediaPipeTaskVisionLipStickLocator extends MediaPipeTaskVisionLocator<LipStickLocations> {

  LIPS_INNER_ALL: number[];
  LIPS_OUTER_ALL: number[];
  smoother: Smoother;

  constructor(locatorEngine: MediaPipeTaskVisionLocatorEngine) {
    super(locatorEngine);

    const lips = FaceLandmarker.FACE_LANDMARKS_LIPS.map(({start, end}: {start: number, end: number}) => {
      return start
    })

    const LIPS_BOTTOM_OUTER = lips.slice(0, 10);
    const LIPS_BOTTOM_INNER = lips.slice(21, 30).reverse();
    const LIPS_TOP_OUTER = lips.slice(11, 20);
    const LIPS_TOP_INNER = lips.slice(31, 40).reverse();
    this.LIPS_OUTER_ALL = [...LIPS_BOTTOM_OUTER, ...LIPS_TOP_OUTER.reverse()];
    this.LIPS_INNER_ALL = [...LIPS_BOTTOM_INNER, ...LIPS_TOP_INNER.reverse()];

    this.smoother = new Smoother([...this.LIPS_OUTER_ALL, ...this.LIPS_INNER_ALL]);
  }

  locateForTool(): LipStickLocations {
    const locations = this.getLocations();
    if (!locations) {
      throw new Error('No locations found');
    }

    const outerPx = this.smoother!.collectSmoothedPointsPx(this.LIPS_OUTER_ALL, locations.faceLandmarks[0]);
    const innerPx = this.smoother!.collectSmoothedPointsPx(this.LIPS_INNER_ALL, locations.faceLandmarks[0]);

    const outerBase = dilatePointsPx(outerPx, BASE_OUTER_DILATE_PX);
    const innerBase = dilatePointsPx(innerPx, INNER_MOUTH_EXPAND_PX);

    const outerF1 = dilatePointsPx(
      outerPx,
      BASE_OUTER_DILATE_PX + FEATHER_WIDTHS_PX[0]
    );

    const outerF2 = dilatePointsPx(
      outerPx,
      BASE_OUTER_DILATE_PX + FEATHER_WIDTHS_PX[1]
    );

    return { outerBase: outerBase, innerBase: innerBase, outerFeather1: outerF1, outerFeather2: outerF2 };
  }
}

export default MediaPipeTaskVisionLipStickLocator;
