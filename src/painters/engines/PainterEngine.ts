abstract class PainterEngine {
  name: string;
  video: HTMLVideoElement | null;
  canvas: HTMLCanvasElement | null;
  constructor(name: string, video: HTMLVideoElement, canvas: HTMLCanvasElement) {
    this.name = name;
    this.video = video;
    this.canvas = canvas;
  }

  abstract initialize(): Promise<void>;
  abstract render(): void;
}

export default PainterEngine;