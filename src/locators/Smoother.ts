const SMOOTH_ALPHA = 0.45; // EMA for landmark smoothing

class Smoother {
  smoothMap: Map<number, Coordinate>;
  USED_INDICES: Set<number>;
  constructor(indices: number[]) {
    this.smoothMap = new Map();
    this.USED_INDICES = new Set(indices);
  }

  /*
      Landmarks jump around frame to frame (jitter). That makes your mask edges “vibrate”.
      Temporal smoothing = average points over time:
      EMA (Exponential Moving Average): p_smooth = 0.7 * prev + 0.3 * current.
      One-Euro filter: a smarter adaptive filter that smooths noise but keeps fast motion responsive.
      This makes the mask stable — lips don’t flicker even if the detector jitters.
  */
  smoothPoint(
    index: number,
    x: number,
    y: number,
    alpha = SMOOTH_ALPHA
  ) {
    
    if (!this.USED_INDICES.has(index)) return { x, y };
    const prev = this.smoothMap.get(index);
    if (!prev) {
      const cur = { x, y };
      this.smoothMap.set(index, cur);
      return cur;
    }
    const nx = prev.x * (1 - alpha) + x * alpha;
    const ny = prev.y * (1 - alpha) + y * alpha;
    const cur = { x: nx, y: ny };
    this.smoothMap.set(index, cur);
    return cur;
  }

  collectSmoothedPointsPx(indices: number[], pts: Coordinate[]) {
    const arr = [];
    for (let i = 0; i < indices.length; i++) {
      const idx = indices[i];
      const kp: Coordinate = pts[idx];
      const s = this.smoothPoint(idx, kp.x, kp.y);
      // @ts-ignore
      arr.push({ x: s.x, y: s.y });
    }
    return arr;
  }
}

export default Smoother;