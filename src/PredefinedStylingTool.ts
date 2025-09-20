import { LocatorFactory } from "./locators/LocatorFactory";
import { PainterFactory } from "./painters/PainterFactory";
import StylingTool from "./StylingTool";

/**
 * StylingTool is a class that represents a styling tool.
 * @template T - The the locations for the styling tool.
 * @template U - The output of the locator engine.
 */
class PredefinedStylingTool<T, U> extends StylingTool<T, U> {

  constructor(name: PredefinedStylingTools, locatorFactory: LocatorFactory<U>, painterFactory: PainterFactory ) {
    super(name, locatorFactory.createLocator<T>(name), painterFactory.createPainter<T>(name));
  }
}

export default PredefinedStylingTool;


