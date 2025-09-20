import LocatorEngine from "./engines/LocatorEngine";

/**
 * Locator is a class that represents a locator.
 * @template T - The the locations for the styling tool.
 * @template U - The output of the locator engine.
 */
abstract class Locator<T, U> {
  protected locatorEngine: LocatorEngine<U>;
  locations: U | null = null;

  constructor(locatorEngine: LocatorEngine<U>) {
    this.locatorEngine = locatorEngine;
  }

  locate(): T {
    const locations = this.locatorEngine.getLocations();
    if (!locations) {
      throw new Error('No locations found');
    }
    this.locations = locations;
    return this.locateForTool();
  }

  getLocations(): U | null {
    return this.locations;
  }

  abstract locateForTool(): T;
}

export default Locator;