type MediaPipeFaceMeshLocatorEngineKeypoint = {
  x: number;
  y: number;
  z: number;
  name?: string;
};

type MediaPipeFaceMeshLocatorEngineBox = {
  xMin: number;
  yMin: number;
  xMax: number;
  yMax: number;
  width: number;
  height: number;
};

type MediaPipeFaceMeshLocatorEngineFace = {
  keypoints: MediaPipeFaceMeshLocatorEngineKeypoint[];
  box: MediaPipeFaceMeshLocatorEngineBox;
};

type MediaPipeFaceMeshLocatorEngineOutput = MediaPipeFaceMeshLocatorEngineFace[]

type MediaPipeFaceMeshLocatorEngineConfig = {
  maxFaces?: number;
  runtime?: 'mediapipe' | 'tfjs';
  refineLandmarks?: boolean;
  solutionPath?: string;
};