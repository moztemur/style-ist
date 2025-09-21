import * as THREE from "three";
import ThreePainter from "../../../src/painters/three/ThreePainter";
import { buildFillShapePx } from "../../../src/painters/three/utils";
import { MustacheLocations } from "./MustacheLocations";
import ThreePainterEngine from "../../../src/painters/engines/ThreePainterEngine";

class ThreeMustachePainter extends ThreePainter<MustacheLocations> {
  mustacheMesh: THREE.Mesh;
  mustacheMaterial: THREE.MeshBasicMaterial;
  thickness: number = 1.0;
  opacity: number = 0.8;

  constructor(threePainterEngine: ThreePainterEngine) {
    super(threePainterEngine);

    this.mustacheMaterial = new THREE.MeshBasicMaterial({
      color: "#4a2f1b", // A dark brown color for the mustache
      transparent: true,
      opacity: this.opacity,
      depthTest: false,
      depthWrite: false,
      side: THREE.DoubleSide,
    });

    this.mustacheMesh = new THREE.Mesh(new THREE.BufferGeometry(), this.mustacheMaterial);
    this.mustacheMesh.frustumCulled = false;

    // @ts-ignore
    this.painterEngine.scene!.add(this.mustacheMesh);
  }

  setColor(hexColor: string) {
    this.mustacheMaterial.color = new THREE.Color(hexColor);
  }

  setThickness(thickness: number) {
    this.thickness = Math.max(0.1, Math.min(2.0, thickness));
  }

  setOpacity(opacity: number) {
    this.opacity = Math.max(0, Math.min(1, opacity));
    this.mustacheMaterial.opacity = this.opacity;
  }

  paint(stylingLocations: MustacheLocations) {
    const { upperLip, noseBottomLine } = stylingLocations;

    if (upperLip && upperLip.length >= 5 && noseBottomLine && noseBottomLine.length > 0) {
      // Create control points for the Bezier curves
      const points: { x: number, y: number }[] = [];
      
      // Start with upper lip points
      points.push(...upperLip);
      
      // Create curved sides
      // Calculate the midpoint between upper lip and nose bottom for thickness adjustment
      const midY = (upperLip[Math.floor(upperLip.length / 2)].y + noseBottomLine[Math.floor(noseBottomLine.length / 2)].y) / 2;
      const thicknessOffset = (midY - upperLip[Math.floor(upperLip.length / 2)].y) * this.thickness;

      const leftControlPoint = {
        x: (upperLip[0].x + noseBottomLine[0].x) / 2,
        y: (upperLip[0].y + noseBottomLine[0].y) / 2 + thicknessOffset
      };
      const rightControlPoint = {
        x: (upperLip[upperLip.length - 1].x + noseBottomLine[noseBottomLine.length - 1].x) / 2,
        y: (upperLip[upperLip.length - 1].y + noseBottomLine[noseBottomLine.length - 1].y) / 2 + thicknessOffset
      };
      
      // Add control points and nose bottom line points in reverse
      points.push(rightControlPoint);
      points.push(...noseBottomLine.slice().reverse());
      points.push(leftControlPoint);

      const shape = buildFillShapePx(points, this.painterEngine!.video!.videoWidth, this.painterEngine!.video!.videoHeight);
      if (this.mustacheMesh.geometry) this.mustacheMesh.geometry.dispose();
      this.mustacheMesh.geometry = new THREE.ShapeGeometry(shape);
      this.mustacheMesh.visible = true;
    } else {
      this.mustacheMesh.visible = false;
    }
  }

  erase() {
    this.mustacheMesh.visible = false;
  }
}

export default ThreeMustachePainter;
