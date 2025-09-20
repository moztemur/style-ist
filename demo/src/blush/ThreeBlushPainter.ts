import * as THREE from "three";
import ThreePainter from "../../../src/painters/three/ThreePainter";
import { buildFillShapePx } from "../../../src/painters/three/utils";
import { BlushLocations } from "./BlushLocations";
import ThreePainterEngine from "../../../src/painters/engines/ThreePainterEngine";

class ThreeBlushPainter extends ThreePainter<BlushLocations> {
  leftBlushMesh: THREE.Mesh;
  rightBlushMesh: THREE.Mesh;
  blushMaterial: THREE.MeshBasicMaterial;

  constructor(threePainterEngine: ThreePainterEngine) {
    super(threePainterEngine);

    this.blushMaterial = new THREE.MeshBasicMaterial({
      color: "#ff6699",
      transparent: true,
      opacity: 0.35,
      depthTest: false,
      depthWrite: false,
      side: THREE.DoubleSide,
    });

    this.leftBlushMesh = new THREE.Mesh(new THREE.BufferGeometry(), this.blushMaterial);
    this.rightBlushMesh = new THREE.Mesh(new THREE.BufferGeometry(), this.blushMaterial);
    this.leftBlushMesh.frustumCulled = false;
    this.rightBlushMesh.frustumCulled = false;

    // @ts-ignore
    this.painterEngine.scene!.add(this.leftBlushMesh);
    // @ts-ignore
    this.painterEngine.scene!.add(this.rightBlushMesh);
  };

  setColor(hexColor: string) {
    this.blushMaterial.color = new THREE.Color(hexColor);
  };

  paint(stylingLocations: BlushLocations) {
    const { leftCheek, rightCheek } = stylingLocations;

    if (leftCheek && leftCheek.length >= 5) {
      const lShape = buildFillShapePx(leftCheek, this.painterEngine!.video!.videoWidth, this.painterEngine!.video!.videoHeight);
      if (this.leftBlushMesh.geometry) this.leftBlushMesh.geometry.dispose();
      this.leftBlushMesh.geometry = new THREE.ShapeGeometry(lShape);
      this.leftBlushMesh.visible = true;
    } else {
      this.leftBlushMesh.visible = false;
    }

    if (rightCheek && rightCheek.length >= 5) {
      const rShape = buildFillShapePx(rightCheek, this.painterEngine!.video!.videoWidth, this.painterEngine!.video!.videoHeight);
      if (this.rightBlushMesh.geometry) this.rightBlushMesh.geometry.dispose();
      this.rightBlushMesh.geometry = new THREE.ShapeGeometry(rShape);
      this.rightBlushMesh.visible = true;
    } else {
      this.rightBlushMesh.visible = false;
    }
  }

  erase() {
    this.leftBlushMesh.visible = false;
    this.rightBlushMesh.visible = false;
  }
}

export default ThreeBlushPainter;


