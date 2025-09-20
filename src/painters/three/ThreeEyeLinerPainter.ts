import * as THREE from "three";
import ThreePainter from "./ThreePainter";
import { buildStripGeometryFromOrthoLoops } from "./utils";
import ThreePainterEngine from "../engines/ThreePainterEngine";

class ThreeEyeLinerPainter extends ThreePainter<EyeLinerLocations> {
  leftEyelinerMesh: THREE.Mesh;
  rightEyelinerMesh: THREE.Mesh;
  eyelinerMaterial: THREE.MeshBasicMaterial;

  constructor(threePainterEngine: ThreePainterEngine) {
    super(threePainterEngine);

    // Eyeliner meshes (thin ribbons above upper eyelids)
    this.eyelinerMaterial = new THREE.MeshBasicMaterial({ color: '#ff3366', transparent: true, opacity: 0.9, depthTest: false, depthWrite: false, side: THREE.DoubleSide });
    this.leftEyelinerMesh = new THREE.Mesh(new THREE.BufferGeometry(), this.eyelinerMaterial);
    this.rightEyelinerMesh = new THREE.Mesh(new THREE.BufferGeometry(), this.eyelinerMaterial);

    this.leftEyelinerMesh.frustumCulled = false;
    this.rightEyelinerMesh.frustumCulled = false;
    // Ensure eyeliner renders on top of foundation/other transparent meshes
    this.leftEyelinerMesh.renderOrder = 10;
    this.rightEyelinerMesh.renderOrder = 10;

    // @ts-ignore
    this.painterEngine.scene!.add(this.leftEyelinerMesh);
    // @ts-ignore
    this.painterEngine.scene!.add(this.rightEyelinerMesh);
  };

  setColor(hexColor: string) {
    this.eyelinerMaterial.color = new THREE.Color(hexColor);
  }

  paintEyeliner(eyeTop: Coordinate[], eyeTopOuter: Coordinate[], eyeLinerMesh: THREE.Mesh) {
    const geom = buildStripGeometryFromOrthoLoops(eyeTopOuter, eyeTop, this.painterEngine!.video!.videoWidth, this.painterEngine!.video!.videoHeight);
    eyeLinerMesh.geometry.dispose();
    eyeLinerMesh.geometry = geom;
  }

  paint(stylingLocations: EyeLinerLocations) {
    const { rightEyeTop, leftEyeTop, leftEyeTopOuter, rightEyeTopOuter } = stylingLocations;

    this.paintEyeliner(leftEyeTop, leftEyeTopOuter, this.leftEyelinerMesh);
    this.paintEyeliner(rightEyeTop, rightEyeTopOuter, this.rightEyelinerMesh);
  }

  erase() {
    this.leftEyelinerMesh.visible = false;
    this.rightEyelinerMesh.visible = false;
  }
}


export default ThreeEyeLinerPainter;