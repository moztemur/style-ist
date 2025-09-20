import TensorflowLocatorEngine from "../engines/TensorflowLocatorEngine";
import Locator from "../Locator";

/**
 * BlushLocator is a class that represents a blush locator.
 * @template T - The output of the locator engine.
 */
abstract class TensorflowLocator<T> extends Locator<T, TensorflowLocatorEngineOutput> {
  constructor(tensorflowLocatorEngine: TensorflowLocatorEngine) {
    super(tensorflowLocatorEngine);
  }

  abstract locateForTool(): T;
}

export default TensorflowLocator;