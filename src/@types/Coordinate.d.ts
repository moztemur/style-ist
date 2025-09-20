type Coordinate = {
  x: number;
  y: number;
  z?: number;
};


type LipStickLocations = {
  outerBase: Coordinate[];
  innerBase: Coordinate[];
  outerFeather1: Coordinate[];
  outerFeather2: Coordinate[];
};

type EyeLinerLocations = {
  leftEyeTop: Coordinate[];
  rightEyeTop: Coordinate[];
  leftEyeTopOuter: Coordinate[];
  rightEyeTopOuter: Coordinate[];
};
