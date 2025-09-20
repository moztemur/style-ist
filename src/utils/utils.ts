function centroidPx(points: Coordinate[]): Coordinate {
    let sx = 0,
        sy = 0;
    for (let i = 0; i < points.length; i++) {
        sx += points[i].x;
        sy += points[i].y;
    }
    const n = Math.max(1, points.length);
    return { x: sx / n, y: sy / n };
}

/*
  Sometimes landmarks miss the very corner of the lips, so your mask leaves a tiny gap.
  Dilation = expand the mask outward by a pixel or two before feathering.
  This ensures full coverage without little “holes” at the lip corners.
*/
function dilatePointsPx(points: Coordinate[], amountPx: number): Coordinate[] {
    if (amountPx === 0) return points.slice();
    const c: Coordinate = centroidPx(points);
    const out = new Array(points.length);
    for (let i = 0; i < points.length; i++) {
        const vx = points[i].x - c.x;
        const vy = points[i].y - c.y;
        const len = Math.hypot(vx, vy) || 1;
        const ux = vx / len,
            uy = vy / len;
        out[i] = { x: points[i].x + ux * amountPx, y: points[i].y + uy * amountPx };
    }
    return out;
}

export { dilatePointsPx };