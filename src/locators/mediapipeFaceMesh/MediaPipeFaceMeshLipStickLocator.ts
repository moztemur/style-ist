import * as faceLandmarksDetection from "@tensorflow-models/face-landmarks-detection";
import { dilatePointsPx } from "../../utils/utils";
import Smoother from "../Smoother";
import MediaPipeFaceMeshLocator from "./MediaPipeFaceMeshLocator";
import MediaPipeFaceMeshLocatorEngine from "../engines/MediaPipeFaceMeshLocatorEngine";

const BASE_OUTER_DILATE_PX = 2; // cover corner gaps
const INNER_MOUTH_EXPAND_PX = 1; // ensure teeth/tongue stay clear
const FEATHER_WIDTHS_PX = [3, 6]; // two feather rings outward

class MediaPipeFaceMeshLipStickLocator extends MediaPipeFaceMeshLocator<LipStickLocations> {

  LIPS_INNER_ALL: number[];
  LIPS_OUTER_ALL: number[];
  smoother: Smoother;

  constructor(locatorEngine: MediaPipeFaceMeshLocatorEngine) {
    super(locatorEngine);
    const contours = faceLandmarksDetection.util.getKeypointIndexByContour(
      faceLandmarksDetection.SupportedModels.MediaPipeFaceMesh
    );

    const LIPS_BOTTOM_OUTER = contours.lips.slice(0, 10);
    const LIPS_BOTTOM_INNER = contours.lips.slice(21, 30).reverse();
    const LIPS_TOP_OUTER = contours.lips.slice(11, 20);
    const LIPS_TOP_INNER = contours.lips.slice(31, 40).reverse();
    this.LIPS_OUTER_ALL = [...LIPS_BOTTOM_OUTER, ...LIPS_TOP_OUTER.reverse()];
    this.LIPS_INNER_ALL = [...LIPS_BOTTOM_INNER, ...LIPS_TOP_INNER.reverse()];

    this.smoother = new Smoother([...this.LIPS_OUTER_ALL, ...this.LIPS_INNER_ALL]);
  }

  locateForTool(): LipStickLocations {
    const locations = this.getLocations();
    if (!locations) {
      throw new Error('No locations found');
    }

    const outerPx = this.smoother!.collectSmoothedPointsPx(this.LIPS_OUTER_ALL, locations[0].keypoints);
    const innerPx = this.smoother!.collectSmoothedPointsPx(this.LIPS_INNER_ALL, locations[0].keypoints);

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

export default MediaPipeFaceMeshLipStickLocator;
