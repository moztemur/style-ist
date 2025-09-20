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

function makePathFromOrthoPoints(orthoPoints: any) {
  const path = new THREE.Path();
  const p0 = orthoPoints[0];
  path.moveTo(p0[0], p0[1]);
  for (let i = 1; i < orthoPoints.length; i++)
    path.lineTo(orthoPoints[i][0], orthoPoints[i][1]);
  path.closePath();
  return path;
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

function buildShapeWithHolesPx(
  outerPx: any,
  holePxArr: any,
  width: number,
  height: number
) {
  const outerOrtho = splinePointsPxToOrtho(outerPx, width, height, SPLINE_SAMPLES);
  const shape = new THREE.Shape();
  const p0 = outerOrtho[0];
  shape.moveTo(p0[0], p0[1]);
  for (let i = 1; i < outerOrtho.length; i++) {
    shape.lineTo(outerOrtho[i][0], outerOrtho[i][1]);
  }
  shape.closePath();

  shape.holes = [];
  for (let h = 0; h < holePxArr.length; h++) {
    const holeOrtho = splinePointsPxToOrtho(
      holePxArr[h],
      width,
      height,
      SPLINE_SAMPLES
    );
    shape.holes.push(makePathFromOrthoPoints(holeOrtho));
  }
  return shape;
}

function buildFillShapePx(pointsPx: Coordinate[], width: number, height: number) {
  const ortho = splinePointsPxToOrtho(pointsPx, width, height, SPLINE_SAMPLES);
  const shape = new THREE.Shape();
  shape.moveTo(ortho[0][0], ortho[0][1]);
  for (let i = 1; i < ortho.length; i++) shape.lineTo(ortho[i][0], ortho[i][1]);
  shape.closePath();
  return shape;
}

function buildStripGeometryFromOrthoLoops(outerLoop: Coordinate[], innerLoop: Coordinate[], width: number, height: number) {
  const innerOrtho = splineOpenPointsPxToOrthoVectors(innerLoop, SPLINE_SAMPLES, width, height);
  const outerOrtho = splineOpenPointsPxToOrthoVectors(outerLoop, SPLINE_SAMPLES, width, height);


  const n = Math.min(outerOrtho.length, innerOrtho.length);
  if (n < 2) return new THREE.BufferGeometry();
  const segments = n - 1;
  const positions = new Float32Array(segments * 6 * 3);
  let ptr = 0;
  for (let i = 0; i < segments; i++) {
    const o0 = outerOrtho[i], o1 = outerOrtho[i + 1];
    const i0 = innerOrtho[i], i1 = innerOrtho[i + 1];
    // Triangle A: o0, i0, o1
    positions[ptr++] = o0.x; positions[ptr++] = o0.y; positions[ptr++] = 0;
    positions[ptr++] = i0.x; positions[ptr++] = i0.y; positions[ptr++] = 0;
    positions[ptr++] = o1.x; positions[ptr++] = o1.y; positions[ptr++] = 0;
    // Triangle B: o1, i0, i1
    positions[ptr++] = o1.x; positions[ptr++] = o1.y; positions[ptr++] = 0;
    positions[ptr++] = i0.x; positions[ptr++] = i0.y; positions[ptr++] = 0;
    positions[ptr++] = i1.x; positions[ptr++] = i1.y; positions[ptr++] = 0;
  }
  const geom = new THREE.BufferGeometry();
  geom.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  return geom;
}

// Open-spline variant (does not connect endpoints)
function splineOpenPointsPxToOrthoVectors(pointsPx: Coordinate[], samples = SPLINE_SAMPLES, width: number, height: number) {
  const v2 = [];
  for (let i = 0; i < pointsPx.length; i++) {
    v2.push(new THREE.Vector2(pointsPx[i].x, pointsPx[i].y));
  }
  const curve = new THREE.SplineCurve(v2);
  // @ts-ignore
  curve.closed = false;
  const pts = curve.getPoints(samples);
  const out = new Array(pts.length);
  for (let i = 0; i < pts.length; i++) out[i] = new THREE.Vector2(...uvToOrtho(toUV(pts[i].x, pts[i].y, width, height)));
  return out;
}

function splinePointsPxToOrthoVectors(pointsPx: Coordinate[], samples = SPLINE_SAMPLES, width: number, height: number): THREE.Vector2[] {
  const v2 = [];
  for (let i = 0; i < pointsPx.length; i++) v2.push(new THREE.Vector2(pointsPx[i].x, pointsPx[i].y));
  const curve = new THREE.SplineCurve(v2);
  // @ts-ignore
  curve.closed = true;
  const pts = curve.getPoints(samples);
  const out = new Array(pts.length);
  for (let i = 0; i < pts.length; i++) out[i] = new THREE.Vector2(...uvToOrtho(toUV(pts[i].x, pts[i].y, width, height)));
  return out;
}


function buildRingGeometryFromOrthoLoops(outerLoop: Coordinate[], innerLoop: Coordinate[], width: number, height: number): THREE.BufferGeometry {
  const outerOrtho = splinePointsPxToOrthoVectors(outerLoop, SPLINE_SAMPLES, width, height);
  const innerOrtho = splinePointsPxToOrthoVectors(innerLoop, SPLINE_SAMPLES, width, height);

  const n = Math.min(outerOrtho.length, innerOrtho.length);
  const positions = new Float32Array(n * 6 * 3); // 2 triangles per segment, 3 vertices each, xyz
  let ptr = 0;
  for (let i = 0; i < n; i++) {
    const i1 = (i + 1) % n;
    const o0 = outerOrtho[i],
      o1 = outerOrtho[i1];
    const i0 = innerOrtho[i],
      i1p = innerOrtho[i1];
    // Triangle A: o0, i0, o1
    positions[ptr++] = o0.x;
    positions[ptr++] = o0.y;
    positions[ptr++] = 0;
    positions[ptr++] = i0.x;
    positions[ptr++] = i0.y;
    positions[ptr++] = 0;
    positions[ptr++] = o1.x;
    positions[ptr++] = o1.y;
    positions[ptr++] = 0;
    // Triangle B: o1, i0, i1
    positions[ptr++] = o1.x;
    positions[ptr++] = o1.y;
    positions[ptr++] = 0;
    positions[ptr++] = i0.x;
    positions[ptr++] = i0.y;
    positions[ptr++] = 0;
    positions[ptr++] = i1p.x;
    positions[ptr++] = i1p.y;
    positions[ptr++] = 0;
  }
  const geom = new THREE.BufferGeometry();
  geom.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  return geom;
}

export { buildShapeWithHolesPx, buildFillShapePx, buildStripGeometryFromOrthoLoops, buildRingGeometryFromOrthoLoops };