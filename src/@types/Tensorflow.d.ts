type TensorflowLocatorEngineKeypoint = {
  x: number;
  y: number;
  z: number;
  name?: string;
};

type TensorflowLocatorEngineBox = {
  xMin: number;
  yMin: number;
  xMax: number;
  yMax: number;
  width: number;
  height: number;
};

type TensorflowLocatorEngineFace = {
  keypoints: TensorflowLocatorEngineKeypoint[];
  box: TensorflowLocatorEngineBox;
};

type TensorflowLocatorEngineOutput = TensorflowLocatorEngineFace[]

type TensorflowLocatorEngineConfig = {
  maxFaces?: number;
  runtime?: 'mediapipe' | 'tfjs';
  refineLandmarks?: boolean;
  solutionPath?: string;
};