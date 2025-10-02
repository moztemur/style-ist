type MediaPipeTaskVisionLocatorEngineLandmark = {
  x: number;
  y: number;
  z: number;
};

type MediaPipeTaskVisionLocatorFaceBlendshape = {
  categories: {
    categoryName: string,
    displayName: string,
    index: number,
    score: number
  }[],
  headIndex: number,
  headName: string,
};

type MediaPipeTaskVisionLocatorEngineOutput = {
  faceBlendshapes: MediaPipeTaskVisionLocatorFaceBlendshape[],
  faceLandmarks: MediaPipeTaskVisionLocatorEngineLandmark[][],
  facialTransformationMatrixes: any[]
}

type MediaPipeTaskVisionLocatorEngineConfig = {
  // Add any configuration options here
}
