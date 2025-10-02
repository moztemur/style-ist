import MediaPipeTaskVisionLocatorEngine from "../engines/MediaPipeTaskVisionLocatorEngine";
import Locator from "../Locator";

/**
 * BlushLocator is a class that represents a blush locator.
 * @template T - The output of the locator engine.
 */
abstract class MediaPipeTaskVisionLocator<T> extends Locator<T, MediaPipeTaskVisionLocatorEngineOutput> {
  constructor(tensorflowLocatorEngine: MediaPipeTaskVisionLocatorEngine) {
    super(tensorflowLocatorEngine);
  }

  abstract locateForTool(): T;
}

export default MediaPipeTaskVisionLocator;
