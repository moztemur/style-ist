import PainterEngine from './engines/PainterEngine';
import Painter from './Painter';

export abstract class PainterFactory {
  painterEngine: PainterEngine;

  constructor(painterEngine: PainterEngine) {
    this.painterEngine = painterEngine;
  }

  /**
   * createPainter is a method that creates a painter.
   * @param name - The name of the painter.
   * @template T - The the locations for the styling tool.
   * @returns A painter.
   */
  abstract createPainter<T>(name: string): Painter<T>;
}
