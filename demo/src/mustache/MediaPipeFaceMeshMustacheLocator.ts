import { MediaPipeFaceMeshLocatorEngine, MediaPipeFaceMeshLocator } from "style-ist";
import { FaceLandmarker } from '@mediapipe/tasks-vision'

class MediaPipeFaceMeshMustacheLocator extends MediaPipeFaceMeshLocator<MustacheLocations> {
  upperLip: {x: number, y: number}[] = [];
  noseBottomLine: {x: number, y: number}[] = [];

  NOSE_BOTTOM_LINE: number[];
  LIPS_TOP_OUTER: number[];

constructor(mediaPipeLocatorEngine: MediaPipeFaceMeshLocatorEngine) {
    super(mediaPipeLocatorEngine);  
    const lips = FaceLandmarker.FACE_LANDMARKS_LIPS.map(({start, end}: {start: number, end: number}) => {
      return start
    })

    this.NOSE_BOTTOM_LINE = [432, 410, 322, 391, 393, 164, 167, 165, 92, 186, 57    ]
    // These points represent the upper lip area where we want to place the mustache
    this.LIPS_TOP_OUTER = lips.slice(11, 20);
  }

  locateForTool(): MustacheLocations {
    const locations = this.getLocations();
    if (!locations) {
      throw new Error('No locations found');
    }

    const upperLipPoints = this.LIPS_TOP_OUTER.map((idx) => {
      const kp = locations[0].keypoints[idx];
      return { x: kp.x, y: kp.y };
    });
    const noseBottomLine = this.NOSE_BOTTOM_LINE.map((idx) => {
      const kp = locations[0].keypoints[idx];
      return { x: kp.x, y: kp.y };
    });

    this.upperLip = upperLipPoints;
    this.noseBottomLine = noseBottomLine;

    return { upperLip: this.upperLip, noseBottomLine: this.noseBottomLine };
  }
}

export default MediaPipeFaceMeshMustacheLocator;
