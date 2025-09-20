import { PainterFactory } from './PainterFactory';
import PainterEngines from '../enums/PainterEngines';
import ThreePainterFactory from './three/ThreePainterFactory';
import PainterEngine from './engines/PainterEngine';
import ThreePainterEngine from './engines/ThreePainterEngine';

export default class PainterFactoryFactory {
  painterEngine: PainterEngine;
  constructor(painterEngine: PainterEngine) {
    this.painterEngine = painterEngine;
  }

  createPainterFactory(): PainterFactory {
    if (this.painterEngine.name === PainterEngines.THREE) {
      return new ThreePainterFactory(this.painterEngine as ThreePainterEngine);
    }

    throw new Error(`Painter engine ${this.painterEngine.name} not found`);
  }
}
