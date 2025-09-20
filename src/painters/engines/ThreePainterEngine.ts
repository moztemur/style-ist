import * as THREE from "three";
import PainterEngine from "./PainterEngine";
import PainterEngines from "../../enums/PainterEngines";

class ThreePainterEngine extends PainterEngine {
  private renderer: THREE.WebGLRenderer | null;
  private camera: THREE.OrthographicCamera | null;
  scene: THREE.Scene | null;

  constructor(video: HTMLVideoElement, canvas: HTMLCanvasElement) {
    super(PainterEngines.THREE, video, canvas);
    this.renderer = null;
    this.camera = null;
    this.scene = null;
  }

  async initialize(): Promise<void> {
    // renderer
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      canvas: this.canvas!,
    });

    this.renderer.setClearColor(0x000000, 0); // transparent

    // camera
    this.camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.01, 10);
    this.camera.position.z = 1;

    // scene
    this.scene = new THREE.Scene();
    this.resizeToVideo();
  }

  private resizeToVideo() {
    if (this.video && this.renderer) {
      const w = this.video.videoWidth || 640;
      const h = this.video.videoHeight || 480;
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      this.renderer.setPixelRatio(dpr);
      this.renderer.setSize(w, h, false);
      // Orthographic camera covers [-1,1] in both axes; no aspect updates needed
    }
  };

  render(): void {
    if (this.renderer && this.scene && this.camera) {
      this.renderer.render(this.scene, this.camera);
    }
  }
}

export default ThreePainterEngine;