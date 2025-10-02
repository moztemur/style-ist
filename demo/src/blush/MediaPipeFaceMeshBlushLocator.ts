import { MediaPipeFaceMeshLocatorEngine, MediaPipeFaceMeshLocator } from "style-ist";

class MediaPipeFaceMeshBlushLocator extends MediaPipeFaceMeshLocator<BlushLocations> {
  leftCheek: {x: number, y: number}[] = [];
  rightCheek: {x: number, y: number}[] = [];

  CHEEKS_LEFT: number[];
  CHEEKS_RIGHT: number[];

    constructor(mediaPipeLocatorEngine: MediaPipeFaceMeshLocatorEngine) {
    super(mediaPipeLocatorEngine);

    this.CHEEKS_LEFT = [205, 36, 101, 118, 123, 147, 187];
    this.CHEEKS_RIGHT = [330, 347, 352, 376, 411, 425, 266];
  }

  locateForTool(): BlushLocations {
    const locations = this.getLocations();
    if (!locations) {
      throw new Error('No locations found');
    }

    const lCore = this.CHEEKS_LEFT.map((idx) => {
      const kp = locations[0].keypoints[idx];
      return { x: kp.x, y: kp.y };
    });
    const rCore = this.CHEEKS_RIGHT.map((idx) => {
      const kp = locations[0].keypoints[idx];
      return { x: kp.x, y: kp.y };
    });

    this.leftCheek = lCore;
    this.rightCheek = rCore;

    return { leftCheek: this.leftCheek, rightCheek: this.rightCheek };
  }
}

export default MediaPipeFaceMeshBlushLocator;
