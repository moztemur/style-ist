import PainterEngine from "./engines/PainterEngine";

/**
 * Painter is a class that represents a painter.
 * @template T - The the locations for the styling tool.
 */
abstract class Painter<T> {
  painterEngine: PainterEngine;
  constructor(painterEngine: PainterEngine) {
    this.painterEngine = painterEngine;
  }

  abstract setColor(hexColor: string): void;
  abstract paint(stylingLocations: T): void;
  abstract erase(): void;
}

export default Painter;


