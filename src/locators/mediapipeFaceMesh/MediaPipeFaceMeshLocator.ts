import MediaPipeFaceMeshLocatorEngine from "../engines/MediaPipeFaceMeshLocatorEngine";
import Locator from "../Locator";

/**
 * BlushLocator is a class that represents a blush locator.
 * @template T - The output of the locator engine.
 */
abstract class MediaPipeFaceMeshLocator<T> extends Locator<T, MediaPipeFaceMeshLocatorEngineOutput> {
  constructor(mediaPipeFaceMeshLocatorEngine: MediaPipeFaceMeshLocatorEngine) {
    super(mediaPipeFaceMeshLocatorEngine);
  }

  abstract locateForTool(): T;
}

export default MediaPipeFaceMeshLocator;
