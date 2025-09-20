import LocatorEngines from '../enums/LocatorEngines';
import TensorflowLocatorFactory from './tensorflow/TensorflowLocatorFactory';
import LocatorEngine from './engines/LocatorEngine';
import { LocatorFactory } from './LocatorFactory';

export default class LocatorFactoryFactory {

  locatorEngine: LocatorEngine<any>;
  constructor(locatorEngine: LocatorEngine<any>) {
    this.locatorEngine = locatorEngine;
  }

  createLocatorFactory(): LocatorFactory<any> {
    if (this.locatorEngine.name === LocatorEngines.TENSORFLOW) {
      return new TensorflowLocatorFactory(this.locatorEngine);
    }

    throw new Error(`Locator engine ${this.locatorEngine.name} not found`);
  }
}