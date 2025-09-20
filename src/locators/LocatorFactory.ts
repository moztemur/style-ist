// src/locators/LocatorFactory.ts
import LocatorEngine from './engines/LocatorEngine';
import Locator from './Locator';

/**
 * LocatorFactory is a class that represents a locator factory.
 * @template T - The output of the locator engine.
 */
export abstract class LocatorFactory<T> {
  locatorEngine: LocatorEngine<T>;
  constructor(locatorEngine: LocatorEngine<T>) {
    this.locatorEngine = locatorEngine;
  }

  abstract createLocator<U>(name: string): Locator<U, T>;
}