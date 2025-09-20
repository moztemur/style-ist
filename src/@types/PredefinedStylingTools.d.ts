import PredefinedStylingTools from '../enums/PredefinedStylingTools';

declare global {
  type PredefinedStylingTools = $Values<typeof PredefinedStylingTools>;
}