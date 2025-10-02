import * as faceLandmarksDetection from "@tensorflow-models/face-landmarks-detection";
import { dilatePointsPx } from "../../utils/utils";
import Smoother from "../Smoother";
import MediaPipeFaceMeshLocatorEngine from "../engines/MediaPipeFaceMeshLocatorEngine";
import MediaPipeFaceMeshLocator from "./MediaPipeFaceMeshLocator";

const EYELINER_WIDTH_PX = 5;               // thickness of eyeliner band in px (screen space)

class MediaPipeFaceMeshEyeLinerLocator extends MediaPipeFaceMeshLocator<EyeLinerLocations> {

  // LEFT_EYE_BOTTOM: number[];
  LEFT_EYE_TOP: number[];
  // LEFT_EYE: number[];
  // RIGHT_EYE_BOTTOM: number[];
  RIGHT_EYE_TOP: number[];
  // RIGHT_EYE: number[];
  smoother: Smoother;


  constructor(locatorEngine: MediaPipeFaceMeshLocatorEngine) {
    super(locatorEngine);
    const contours = faceLandmarksDetection.util.getKeypointIndexByContour(
      faceLandmarksDetection.SupportedModels.MediaPipeFaceMesh
    );

    // this.LEFT_EYE_BOTTOM = contours.leftEye.slice(0, 8);
    this.LEFT_EYE_TOP = contours.leftEye.slice(9, 16).reverse();
    // this.LEFT_EYE = [...this.LEFT_EYE_BOTTOM, ...this.LEFT_EYE_TOP];
    //  this.RIGHT_EYE_BOTTOM = contours.rightEye.slice(0, 8);
    this.RIGHT_EYE_TOP = contours.rightEye.slice(9, 16).reverse();
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

    const leftTopPx = this.smoother!.collectSmoothedPointsPx(this.LEFT_EYE_TOP, locations[0].keypoints);
    const leftOuterPx = dilatePointsPx(leftTopPx, EYELINER_WIDTH_PX);
    const rightTopPx = this.smoother!.collectSmoothedPointsPx(this.RIGHT_EYE_TOP, locations[0].keypoints);
    const rightOuterPx = dilatePointsPx(rightTopPx, EYELINER_WIDTH_PX);

    return { leftEyeTop: leftTopPx, rightEyeTop: rightTopPx, leftEyeTopOuter: leftOuterPx, rightEyeTopOuter: rightOuterPx };
  }
}

export default MediaPipeFaceMeshEyeLinerLocator;
