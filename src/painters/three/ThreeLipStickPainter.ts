import * as THREE from "three";
import ThreePainter from "./ThreePainter";
import { buildRingGeometryFromOrthoLoops, buildShapeWithHolesPx } from "./utils";
import ThreePainterEngine from "../engines/ThreePainterEngine";

class ThreeLipStickPainter extends ThreePainter<LipStickLocations> {

  lipMesh: THREE.Mesh;
  lipFeather1Mesh: THREE.Mesh;
  lipFeather2Mesh: THREE.Mesh;
  lipMaterial: THREE.MeshBasicMaterial;

  constructor(threePainterEngine: ThreePainterEngine) {
    super(threePainterEngine);

    this.lipMaterial = new THREE.MeshBasicMaterial({
      color: '#ff3366',
      transparent: true,
      opacity: 0.5,
      depthTest: false,
      depthWrite: false,
      side: THREE.DoubleSide,
    });

    this.lipMesh = new THREE.Mesh(new THREE.ShapeGeometry(new THREE.Shape()), this.lipMaterial);

    const matFeather1 = new THREE.MeshBasicMaterial({ color: '#ff3366', transparent: true, opacity: 0.18, depthTest: false, depthWrite: false, side: THREE.DoubleSide });
    const matFeather2 = new THREE.MeshBasicMaterial({ color: '#ff3366', transparent: true, opacity: 0.09, depthTest: false, depthWrite: false, side: THREE.DoubleSide });
    this.lipFeather1Mesh = new THREE.Mesh(new THREE.ShapeGeometry(new THREE.Shape()), matFeather1);
    this.lipFeather2Mesh = new THREE.Mesh(new THREE.ShapeGeometry(new THREE.Shape()), matFeather2);

    (this.painterEngine as ThreePainterEngine).scene!.add(this.lipMesh);
    (this.painterEngine as ThreePainterEngine).scene!.add(this.lipFeather1Mesh);
    (this.painterEngine as ThreePainterEngine).scene!.add(this.lipFeather2Mesh);
  };

  setColor(hexColor: string) {
    this.lipMaterial.color = new THREE.Color(hexColor);
    const f1Mat = this.lipFeather1Mesh.material as THREE.MeshBasicMaterial;
    const f2Mat = this.lipFeather2Mesh.material as THREE.MeshBasicMaterial;
    if (f1Mat) f1Mat.color = new THREE.Color(hexColor);
    if (f2Mat) f2Mat.color = new THREE.Color(hexColor);
  }

  paint(stylingLocations: LipStickLocations) {
    const { outerBase, innerBase, outerFeather1, outerFeather2 } = stylingLocations;

    // 3) Build core filled lips (outer minus inner)
    const coreShape = buildShapeWithHolesPx(outerBase, [innerBase], this.painterEngine!.video!.videoWidth, this.painterEngine!.video!.videoHeight);

    this.lipMesh.geometry.dispose();
    this.lipMesh.geometry = new THREE.ShapeGeometry(coreShape);

    // TODO: feather addition
    // 4) Feather ring with stable geometry (annulus strip)
    const ring1Geom = buildRingGeometryFromOrthoLoops(
      outerFeather1,
      outerBase,
      this.painterEngine!.video!.videoWidth,
      this.painterEngine!.video!.videoHeight
    );
    this.lipFeather1Mesh.geometry.dispose();
    this.lipFeather1Mesh.geometry = ring1Geom;

    const ring2Geom = buildRingGeometryFromOrthoLoops(outerFeather2, outerFeather1, this.painterEngine!.video!.videoWidth, this.painterEngine!.video!.videoHeight);
    this.lipFeather2Mesh.geometry.dispose();
    this.lipFeather2Mesh.geometry = ring2Geom;
  }

  erase() {
    if (!this.lipMesh || !this.lipFeather1Mesh || !this.lipFeather2Mesh) throw new Error('Lip stick painter not initialized');

    this.lipMesh.visible = false;
    this.lipFeather1Mesh.visible = false;
    this.lipFeather2Mesh.visible = false;
  }
}


export default ThreeLipStickPainter;