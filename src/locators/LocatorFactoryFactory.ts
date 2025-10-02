import LocatorEngines from '../enums/LocatorEngines';
import LocatorEngine from './engines/LocatorEngine';
import MediaPipeTaskVisionLocatorEngine from './engines/MediaPipeTaskVisionLocatorEngine';
import MediaPipeFaceMeshLocatorEngine from './engines/MediaPipeFaceMeshLocatorEngine';
import { LocatorFactory } from './LocatorFactory';
import MediaPipeTaskVisionLocatorFactory from './mediapipeTaskVision/MediaPipeTaskVisionLocatorFactory';
import MediaPipeFaceMeshLocatorFactory from './mediapipeFaceMesh/MediaPipeFaceMeshLocatorFactory';

export default class LocatorFactoryFactory {

  locatorEngine: LocatorEngine<any>;
  constructor(locatorEngine: LocatorEngine<any>) {
    this.locatorEngine = locatorEngine;
  }

  createLocatorFactory(): LocatorFactory<any> {
    if (this.locatorEngine.name === LocatorEngines.MEDIAPIPE_TASK_VISION) {
      return new MediaPipeTaskVisionLocatorFactory(this.locatorEngine as MediaPipeTaskVisionLocatorEngine);
    } else if (this.locatorEngine.name === LocatorEngines.MEDIAPIPE_FACE_MESH) {
      return new MediaPipeFaceMeshLocatorFactory(this.locatorEngine as MediaPipeFaceMeshLocatorEngine);
    }

    throw new Error(`Locator engine ${this.locatorEngine.name} not found`);
  }
}