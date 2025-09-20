
import { LocatorFactory } from "./locators/LocatorFactory";
import Painter from "./painters/Painter";
import { PainterFactory } from "./painters/PainterFactory";
import PainterEngine from "./painters/engines/PainterEngine";
import StylingTool from "./StylingTool";
import PredefinedStylingTool from "./PredefinedStylingTool";
import Locator from "./locators/Locator";
import LocatorEngine from "./locators/engines/LocatorEngine";
import LocatorFactoryFactory from "./locators/LocatorFactoryFactory";
import PainterFactoryFactory from "./painters/PainterFactoryFactory";

class StylingToolSet {
  private stylingTools: Map<string, StylingTool<any, any>>;
  private painterEngine: PainterEngine;
  private locatorEngine: LocatorEngine<any>;
  private locatorFactory: LocatorFactory<any>;
  private painterFactory: PainterFactory;

  constructor(painterEngine: PainterEngine, locatorEngine: LocatorEngine<any>) {
    this.stylingTools = new Map();
    this.painterEngine = painterEngine;
    this.locatorEngine = locatorEngine;

    this.locatorFactory = new LocatorFactoryFactory(this.locatorEngine).createLocatorFactory();
    this.painterFactory = new PainterFactoryFactory(this.painterEngine).createPainterFactory();
  };

  addPredefinedStylingTool(name: PredefinedStylingTools): PredefinedStylingTool<any, any> {
    if (this.stylingTools.has(name)) {
      throw new Error(`Styling tool ${name} already exists`);
    }

    let stylingTool = new PredefinedStylingTool(name, this.locatorFactory, this.painterFactory);
    this.stylingTools.set(stylingTool.name, stylingTool);
    return stylingTool;
  }

  addCustomStylingTool(name: string, stylingLocator: Locator<any, any>, stylingPainter: Painter<any>): StylingTool<any, any> {
    if (this.stylingTools.has(name)) {
      throw new Error(`Styling tool ${name} already exists`);
    }
    let stylingTool = new StylingTool(name, stylingLocator, stylingPainter);
    this.stylingTools.set(stylingTool.name, stylingTool);
    return stylingTool;
  }

  paintActiveStylingTools() {
    Array.from(this.stylingTools.values()).filter((stylingTool) => stylingTool.active).forEach((stylingTool) => {
      stylingTool.apply();
    });
    this.painterEngine.render();
  }
}

export default StylingToolSet;