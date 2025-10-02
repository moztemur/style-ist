import { LocatorFactory } from '../LocatorFactory';
import MediaPipeFaceMeshLipStickLocator from './MediaPipeFaceMeshLipStickLocator';
import MediaPipeFaceMeshEyeLinerLocator from './MediaPipeFaceMeshEyeLinerLocator';
import PredefinedStylingTools from '../../enums/PredefinedStylingTools';
import MediaPipeFaceMeshLocator from './MediaPipeFaceMeshLocator';
import MediaPipeFaceMeshLocatorEngine from '../engines/MediaPipeFaceMeshLocatorEngine';

export default class MediaPipeFaceMeshLocatorFactory extends LocatorFactory<MediaPipeFaceMeshLocatorEngineOutput> {
  constructor(mediaPipeFaceMeshLocatorEngine: MediaPipeFaceMeshLocatorEngine) {
    super(mediaPipeFaceMeshLocatorEngine);
  }

  createLocator(name: PredefinedStylingTools): MediaPipeFaceMeshLocator<any> {
    if (name === PredefinedStylingTools.LIPSTICK) {
      return new MediaPipeFaceMeshLipStickLocator(this.locatorEngine as MediaPipeFaceMeshLocatorEngine);
    } else if (name === PredefinedStylingTools.EYELINER) {
      return new MediaPipeFaceMeshEyeLinerLocator(this.locatorEngine as MediaPipeFaceMeshLocatorEngine);
    }

    throw new Error(`Locator ${name} not found`);
  }
}
