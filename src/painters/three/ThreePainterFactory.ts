import ThreeLipStickPainter from './ThreeLipStickPainter';
import ThreeEyeLinerPainter from './ThreeEyeLinerPainter';
import { PainterFactory } from '../PainterFactory';
import ThreePainter from './ThreePainter';
import PredefinedStylingTools from '../../enums/PredefinedStylingTools';
import ThreePainterEngine from '../engines/ThreePainterEngine';

export default class ThreePainterFactory extends PainterFactory {
  constructor(threePainterEngine: ThreePainterEngine) {
    super(threePainterEngine);
  }

  createPainter(name: PredefinedStylingTools): ThreePainter<any> {
    if (name === PredefinedStylingTools.LIPSTICK) {
      return new ThreeLipStickPainter(this.painterEngine as ThreePainterEngine);
    } else if (name === PredefinedStylingTools.EYELINER) {
      return new ThreeEyeLinerPainter(this.painterEngine as ThreePainterEngine);
    }
    throw new Error(`Painter ${name} not found`);
  }
}
