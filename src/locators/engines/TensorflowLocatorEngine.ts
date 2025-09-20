
import * as tf from "@tensorflow/tfjs";
import * as faceLandmarksDetection from "@tensorflow-models/face-landmarks-detection";
import LocatorEngine from "./LocatorEngine";
import LocatorEngines from "../../enums/LocatorEngines";

class TensorflowLocatorEngine extends LocatorEngine<TensorflowLocatorEngineOutput> {
  constructor(video: HTMLVideoElement, config?: TensorflowLocatorEngineConfig) {
    super(LocatorEngines.TENSORFLOW, video, config);
  }

  async initialize(): Promise<void> {
    try {
      await tf.setBackend("webgl");
      await tf.ready();

      this.detector = await faceLandmarksDetection.createDetector(
        faceLandmarksDetection.SupportedModels.MediaPipeFaceMesh,
        {
          runtime: this.config?.runtime || 'mediapipe',
          maxFaces: this.config?.maxFaces || 1,
          refineLandmarks: this.config?.refineLandmarks || true,
          solutionPath: this.config?.solutionPath || "https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh",
        }
      );

      await this.detector.estimateFaces(tf.zeros([128, 128, 3]));
    } catch (error) {
      console.error('error initializing detection', error);
    }
  }

  async detect(): Promise<void> {
    const faces = await this.detector.estimateFaces(this.video);
    this.locations = faces;
  }

  getLocations(): TensorflowLocatorEngineOutput | null {
    return this.locations;
  }
}

export default TensorflowLocatorEngine;