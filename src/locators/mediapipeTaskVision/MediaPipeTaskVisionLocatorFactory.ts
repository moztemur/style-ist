import { LocatorFactory } from '../LocatorFactory';
import MediaPipeTaskVisionLipStickLocator from './MediaPipeTaskVisionLipStickLocator';
import MediaPipeTaskVisionEyeLinerLocator from './MediaPipeTaskVisionEyeLinerLocator';
import PredefinedStylingTools from '../../enums/PredefinedStylingTools';
import MediaPipeTaskVisionLocator from './MediaPipeTaskVisionLocator';
import MediaPipeTaskVisionLocatorEngine from '../engines/MediaPipeTaskVisionLocatorEngine';

export default class MediaPipeTaskVisionLocatorFactory extends LocatorFactory<MediaPipeTaskVisionLocatorEngineOutput> {
  constructor(mediaPipeLocatorEngine: MediaPipeTaskVisionLocatorEngine) {
    super(mediaPipeLocatorEngine);
  }

  createLocator(name: PredefinedStylingTools): MediaPipeTaskVisionLocator<any> {
    if (name === PredefinedStylingTools.LIPSTICK) {
      return new MediaPipeTaskVisionLipStickLocator(this.locatorEngine as MediaPipeTaskVisionLocatorEngine);
    } else if (name === PredefinedStylingTools.EYELINER) {
      return new MediaPipeTaskVisionEyeLinerLocator(this.locatorEngine as MediaPipeTaskVisionLocatorEngine);
    }

    throw new Error(`Locator ${name} not found`);
  }
}
