import LocatorEngine from "./LocatorEngine";
import LocatorEngines from "../../enums/LocatorEngines";
import { FilesetResolver, FaceLandmarker } from '@mediapipe/tasks-vision'

class MediaPipeTaskVisionLocatorEngine extends LocatorEngine<MediaPipeTaskVisionLocatorEngineOutput> {
  lastVideoTime: number = -1;
  constructor(video: HTMLVideoElement, config?: MediaPipeTaskVisionLocatorEngineConfig) {
    super(LocatorEngines.MEDIAPIPE_TASK_VISION, video, config);
  }

  async initialize(): Promise<void> {
    try {
      const filesetResolver = await FilesetResolver.forVisionTasks(
        "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision/wasm"
      );
        
      this.detector = await FaceLandmarker.createFromOptions(filesetResolver, {
        baseOptions: {
          modelAssetPath: `https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task`,
          delegate: "GPU"
        },
        runningMode: 'VIDEO',
        numFaces: 1
      });
    } catch (error) {
      console.error('error initializing detection', error);
    }
  }

  async detect(): Promise<void> {
    if (!this.detector) {
      throw new Error('Detector is not initialized');
    }
      let ts = Math.floor(this.video!.currentTime * 1000);
      if (ts <= this.lastVideoTime) ts = this.lastVideoTime + 1;
      const results = this.detector.detectForVideo(this.video, ts);
      const newLocations = {
        faceBlendshapes: results.faceBlendshapes,
        faceLandmarks: results.faceLandmarks.map(
          (faceLandmark: any) => faceLandmark.map(
            (landmark: any) => {
              return {
                x: landmark.x * this.video!.videoWidth,
                y: landmark.y * this.video!.videoHeight,
                z: 0
              }
            })),
        facialTransformationMatrixes: results.facialTransformationMatrixes
      };
      this.locations = newLocations;
      this.lastVideoTime = ts;
  }

  getLocations(): MediaPipeTaskVisionLocatorEngineOutput | null {
    return this.locations;
  }
}

export default MediaPipeTaskVisionLocatorEngine;
