import ThreePainterEngine from "../engines/ThreePainterEngine";
import Painter from "../Painter";

abstract class ThreePainter<T> extends Painter<T> {
  constructor(threePainterEngine: ThreePainterEngine) {
    super(threePainterEngine);
  }
}

export default ThreePainter;


