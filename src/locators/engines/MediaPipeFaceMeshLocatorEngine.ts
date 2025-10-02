import * as tf from "@tensorflow/tfjs";
import * as faceLandmarksDetection from "@tensorflow-models/face-landmarks-detection";
import LocatorEngine from "./LocatorEngine";
import LocatorEngines from "../../enums/LocatorEngines";

class MediaPipeFaceMeshLocatorEngine extends LocatorEngine<MediaPipeFaceMeshLocatorEngineOutput> {
  constructor(video: HTMLVideoElement, config?: MediaPipeFaceMeshLocatorEngineConfig) {
    super(LocatorEngines.MEDIAPIPE_FACE_MESH, video, config);
  }

  async initialize(): Promise<void> {
    try {
      if (!tf) {
        throw new Error('TensorFlow.js is not loaded');
      }

      if (!faceLandmarksDetection) {
        throw new Error('Face Landmarks Detection is not loaded');
      }

      await tf.setBackend("webgl");
      await tf.ready();

      this.detector = await faceLandmarksDetection.createDetector(
        faceLandmarksDetection.SupportedModels.MediaPipeFaceMesh,
        {
          runtime: 'mediapipe',
          maxFaces: this.config?.maxFaces || 1,
          refineLandmarks: this.config?.refineLandmarks || true,
          solutionPath: `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh`
        }
      );

      await this.detector.estimateFaces(tf.zeros([128, 128, 3]));
    } catch (error) {
      console.error('error initializing detection', error);
    }
  }

  async detect(): Promise<void> {
    if (!this.detector) {
      throw new Error('Detector is not initialized');
    }
    const faces = await this.detector.estimateFaces(this.video);
    this.locations = faces;
  }

  getLocations(): MediaPipeFaceMeshLocatorEngineOutput | null {
    return this.locations;
  }
}

export default MediaPipeFaceMeshLocatorEngine;
