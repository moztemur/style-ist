import StylingToolSet from "./StylingToolSet";
import LocatorEngine from "./locators/engines/LocatorEngine";
import PainterEngine from "./painters/engines/PainterEngine";
import Painter from "./painters/Painter";
import Locator from "./locators/Locator";

class Stylist {
  private requestAnimationFrameValue: number | null;
  private stylingToolSet: StylingToolSet;

  private locatorEngine: LocatorEngine<any>;
  private painterEngine: PainterEngine;

  private initialized: boolean;

  constructor(
    locatorEngine: LocatorEngine<any>,
    painterEngine: PainterEngine
  ) {
    this.locatorEngine = locatorEngine;
    this.painterEngine = painterEngine;

    this.requestAnimationFrameValue = null;

    this.stylingToolSet = new StylingToolSet(this.painterEngine, this.locatorEngine);

    this.initialized = false;
  }

  addPredefinedStylingTool(name: PredefinedStylingTools) {
    if (!this.initialized) throw new Error('Stylist not initialized');
    return this.stylingToolSet.addPredefinedStylingTool(name);
  }

  addCustomStylingTool(name: string, stylingLocator: Locator<any, any>, stylingPainter: Painter<any>) {
    if (!this.initialized) throw new Error('Stylist not initialized');
    return this.stylingToolSet.addCustomStylingTool(name, stylingLocator, stylingPainter);
  }

  async loop() {
    this.requestAnimationFrameValue = requestAnimationFrame(this.loop.bind(this));
    await this.locatorEngine.detect();
    this.stylingToolSet.paintActiveStylingTools();
  };

  async initialize() {
    await this.locatorEngine.initialize();
    await this.painterEngine.initialize();
    this.initialized = true;
    if (this.requestAnimationFrameValue == null) this.loop();
  }

  stop() {
    if (this.requestAnimationFrameValue != null) cancelAnimationFrame(this.requestAnimationFrameValue);
    this.requestAnimationFrameValue = null;
  }
}

export default Stylist;