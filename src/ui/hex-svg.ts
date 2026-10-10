/**
 * Shared SVG hex geometry used by hex board UIs (pointy-top polygon / path).
 * Formulas match the inlined helpers in hex-a-gone / remainder / queens-guards
 * / hex board-ui (pointy-top starts at -30°), not the test-only
 * helpers/core-hex lattice (+30° start).
 */

type PixelPoint = { x: number; y: number };

/**
 * Pointy-top hex corner pixels.
 * Angle: `(π/3)*i - π/6` (i=0 → -30°) — identical to hex-a-gone / queens-guards.
 */
export function pointyTopHexCorners(
  cx: number,
  cy: number,
  size: number
): PixelPoint[] {
  const corners: PixelPoint[] = [];
  for (let i = 0; i < 6; i++) {
    const angle = (Math.PI / 3) * i - Math.PI / 6;
    corners.push({
      x: cx + size * Math.cos(angle),
      y: cy + size * Math.sin(angle),
    });
  }
  return corners;
}

/**
 * SVG `<polygon points="…">` string for a pointy-top hex
 * (hex-a-gone `hexagonPath` / remainder `hexPoints`).
 */
export function pointyTopHexPolygonPoints(
  cx: number,
  cy: number,
  size: number
): string {
  return pointyTopHexCorners(cx, cy, size)
    .map((c) => `${c.x},${c.y}`)
    .join(' ');
}

/** SVG path `d` for a pointy-top hex (queens-guards `hexPath`). */
export function pointyTopHexPathD(
  cx: number,
  cy: number,
  size: number
): string {
  const corners = pointyTopHexCorners(cx, cy, size);
  return (
    corners
      .map((c, i) => (i === 0 ? `M ${c.x} ${c.y}` : `L ${c.x} ${c.y}`))
      .join(' ') + ' Z'
  );
}

/**
 * Flat-top axial → pixel (hex-a-gone board), origin at (0,0).
 * Formula: x = size*(3/2)*q, y = size*((√3/2)*q + √3*r).
 */
export function flatTopAxialToPixel(
  q: number,
  r: number,
  size: number
): PixelPoint {
  const x = size * ((3 / 2) * q);
  const y = size * ((Math.sqrt(3) / 2) * q + Math.sqrt(3) * r);
  return { x, y };
}
