import * as THREE from "three";
const SPLINE_SAMPLES = 100;

// Utility: map pixel -> UV (0..1). Mirror if checkbox checked.
function toUV(x: number, y: number, width: number, height: number) {
  const u = x / width;
  const v = y / height;
  return [u, v];
}

// Map UV to ortho space [-1..1] (Three's OrthographicCamera)
function uvToOrtho(uv: number[]) {
  const [u, v] = uv;
  const x = u * 2 - 1;
  const y = 1 - v * 2; // invert Y so up is positive
  return [x, y];
}

function splinePointsPxToOrtho(
  pointsPx: Coordinate[],
  width: number,
  height: number,
  samples = SPLINE_SAMPLES
) {
  const v2: THREE.Vector2[] = [];
  for (let i = 0; i < pointsPx.length; i++) v2.push(new THREE.Vector2(pointsPx[i].x, pointsPx[i].y));
  const curve = new THREE.SplineCurve(v2);
  // @ts-ignore
  curve.closed = true;
  const pts = curve.getPoints(samples);
  const out = new Array(pts.length);
  for (let i = 0; i < pts.length; i++) {
    const [x, y] = uvToOrtho(toUV(pts[i].x, pts[i].y, width, height));
    out[i] = [x, y];
  }
  return out as Array<[number, number]>;
}

function buildFillShapePx(pointsPx: Coordinate[], width: number, height: number) {
  const ortho = splinePointsPxToOrtho(pointsPx, width, height, SPLINE_SAMPLES);
  const shape = new THREE.Shape();
  shape.moveTo(ortho[0][0], ortho[0][1]);
  for (let i = 1; i < ortho.length; i++) shape.lineTo(ortho[i][0], ortho[i][1]);
  shape.closePath();
  return shape;
}

export { buildFillShapePx };