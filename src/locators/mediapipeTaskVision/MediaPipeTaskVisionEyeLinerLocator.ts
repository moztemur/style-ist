import { dilatePointsPx } from "../../utils/utils";
import Smoother from "../Smoother";
import MediaPipeTaskVisionLocatorEngine from "../engines/MediaPipeTaskVisionLocatorEngine";
import MediaPipeTaskVisionLocator from "./MediaPipeTaskVisionLocator";
import { FaceLandmarker } from '@mediapipe/tasks-vision'

const EYELINER_WIDTH_PX = 5;               // thickness of eyeliner band in px (screen space)

class MediaPipeTaskVisionEyeLinerLocator extends MediaPipeTaskVisionLocator<EyeLinerLocations> {

  // LEFT_EYE_BOTTOM: number[];
  LEFT_EYE_TOP: number[];
  // LEFT_EYE: number[];
  // RIGHT_EYE_BOTTOM: number[];
  RIGHT_EYE_TOP: number[];
  // RIGHT_EYE: number[];
  smoother: Smoother;


  constructor(locatorEngine: MediaPipeTaskVisionLocatorEngine) {
    super(locatorEngine);
 
    const leftEye = FaceLandmarker.FACE_LANDMARKS_LEFT_EYE.map(({start, end}: {start: number, end: number}) => {
      return start
    })

    const rightEye = FaceLandmarker.FACE_LANDMARKS_RIGHT_EYE.map(({start, end}: {start: number, end: number}) => {
      return start
    })
    // this.LEFT_EYE_BOTTOM = contours.leftEye.slice(0, 8);
    this.LEFT_EYE_TOP = leftEye.slice(9, 16).reverse();
    // this.LEFT_EYE = [...this.LEFT_EYE_BOTTOM, ...this.LEFT_EYE_TOP];
    //  this.RIGHT_EYE_BOTTOM = contours.rightEye.slice(0, 8);
    this.RIGHT_EYE_TOP = rightEye.slice(9, 16).reverse();
    // this.RIGHT_EYE = [...this.RIGHT_EYE_BOTTOM, ...this.RIGHT_EYE_TOP];


    this.smoother = new Smoother([
      ...this.LEFT_EYE_TOP, ...this.RIGHT_EYE_TOP,
    ]);
  };

  locateForTool(): EyeLinerLocations {
    const locations = this.getLocations();
    if (!locations) {
      throw new Error('No locations found');
    }

    const leftTopPx = this.smoother!.collectSmoothedPointsPx(this.LEFT_EYE_TOP, locations.faceLandmarks[0]);
    const leftOuterPx = dilatePointsPx(leftTopPx, EYELINER_WIDTH_PX);
    const rightTopPx = this.smoother!.collectSmoothedPointsPx(this.RIGHT_EYE_TOP, locations.faceLandmarks[0]);
    const rightOuterPx = dilatePointsPx(rightTopPx, EYELINER_WIDTH_PX);

    return { leftEyeTop: leftTopPx, rightEyeTop: rightTopPx, leftEyeTopOuter: leftOuterPx, rightEyeTopOuter: rightOuterPx };
  }
}

export default MediaPipeTaskVisionEyeLinerLocator;
