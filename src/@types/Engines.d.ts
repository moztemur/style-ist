import LocatorEngines from '../enums/LocatorEngines';
import PainterEngines from '../enums/PainterEngines';

declare global {
  type LocatorEngines = $Values<typeof LocatorEngines>;
  type PainterEngines = $Values<typeof PainterEngines>;
}