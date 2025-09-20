import Locator from "./locators/Locator";
import Painter from "./painters/Painter";

/**
 * StylingTool is a class that represents a styling tool.
 * @template T - The the locations for the styling tool.
 * @template U - The output of the locator engine.
 */
class StylingTool<T, U> {
  name: string;
  active: boolean;
  stylingLocator: Locator<T, U>;
  stylingPainter: Painter<T>;

  constructor(name: string, stylingLocator: Locator<T, U>, stylingPainter: Painter<T>) {
    this.name = name;
    this.active = false;
    this.stylingLocator = stylingLocator;
    this.stylingPainter =  stylingPainter;
  }

  start(): void {
    this.active = true;
  }

  stop(): void {
    this.active = false;
    this.stylingPainter.erase();
  }

  apply(): void {
    if (!this.active) return;
    const stylingLocations = this.stylingLocator.locate();
    this.stylingPainter.paint(stylingLocations);
  }
}

export default StylingTool;


