/**
 * LocatorEngine is a class that represents a locator engine.
 * @template T - The output of the locator engine.
 */

abstract class LocatorEngine<T> {
  name: string;
  detector: any | null;
  video: HTMLVideoElement | null;
  locations: T | null;
  config?: any;

  constructor(name: string, video: HTMLVideoElement, config?: any) {
    this.name = name;
    this.detector = null;
    this.video = video;
    this.locations = null;
    this.config = config;
  }

  abstract initialize(): Promise<void>;
  abstract detect(): Promise<void>;
  getLocations(): T | null {
    return this.locations;
  }
}

export default LocatorEngine;