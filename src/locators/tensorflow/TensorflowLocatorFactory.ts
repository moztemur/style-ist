import { LocatorFactory } from '../LocatorFactory';
import TensorflowLipStickLocator from './TensorflowLipStickLocator';
import TensorflowEyeLinerLocator from './TensorflowEyeLinerLocator';
import PredefinedStylingTools from '../../enums/PredefinedStylingTools';
import TensorflowLocator from './TensorflowLocator';
import TensorflowLocatorEngine from '../engines/TensorflowLocatorEngine';

export default class TensorflowLocatorFactory extends LocatorFactory<TensorflowLocatorEngineOutput> {
  constructor(tensorflowLocatorEngine: TensorflowLocatorEngine) {
    super(tensorflowLocatorEngine);
  }

  createLocator(name: PredefinedStylingTools): TensorflowLocator<any> {
    if (name === PredefinedStylingTools.LIPSTICK) {
      return new TensorflowLipStickLocator(this.locatorEngine);
    } else if (name === PredefinedStylingTools.EYELINER) {
      return new TensorflowEyeLinerLocator(this.locatorEngine);
    }

    throw new Error(`Locator ${name} not found`);
  }
}