/**
 * Coordinate-mapping helpers for board hit-testing.
 *
 * CSS layout size and SVG/canvas backing units can diverge after resize,
 * orientation change, or HiDPI scaling. These helpers keep pointer math in
 * the same space as the drawn board.
 */

/** Cap for 2D canvas backing stores — avoids huge buffers on 3× phones. */
export const CANVAS_2D_PIXEL_RATIO_CAP = 2;

export type CssRect = {
  left: number;
  top: number;
  width: number;
  height: number;
};

/**
 * Map a client (CSS pixel) point into SVG user units, accounting for
 * CSS↔viewBox scale (e.g. `width: 100%` after a resize).
 */
export function clientToSvgUser(
  clientX: number,
  clientY: number,
  rect: CssRect,
  viewBoxWidth: number,
  viewBoxHeight: number
): { x: number; y: number } {
  const scaleX =
    viewBoxWidth > 0 && rect.width > 0 ? rect.width / viewBoxWidth : 1;
  const scaleY =
    viewBoxHeight > 0 && rect.height > 0 ? rect.height / viewBoxHeight : 1;
  return {
    x: (clientX - rect.left) / scaleX,
    y: (clientY - rect.top) / scaleY,
  };
}

/**
 * Map SVG-user coordinates onto a uniform grid (polyomino-style boards).
 * Returns null when the point falls in padding / negative space.
 */
export function svgUserToGridCell(
  x: number,
  y: number,
  cellSize: number,
  padding: number
): { row: number; col: number } | null {
  if (cellSize <= 0) return null;
  const col = Math.floor((x - padding) / cellSize);
  const row = Math.floor((y - padding) / cellSize);
  if (row < 0 || col < 0) return null;
  return { row, col };
}

/**
 * Normalize a client point against a canvas CSS rect into Three.js NDC.
 * Returns null when the rect has no area (hidden / not laid out).
 */
export function clientToNdc(
  clientX: number,
  clientY: number,
  rect: CssRect
): { x: number; y: number } | null {
  if (rect.width === 0 || rect.height === 0) return null;
  return {
    x: ((clientX - rect.left) / rect.width) * 2 - 1,
    y: -((clientY - rect.top) / rect.height) * 2 + 1,
  };
}

/** Cap devicePixelRatio for 2D canvas backing stores. */
export function resolveCanvas2dPixelRatio(
  devicePixelRatio: number = typeof window !== 'undefined'
    ? window.devicePixelRatio || 1
    : 1,
  cap: number = CANVAS_2D_PIXEL_RATIO_CAP
): number {
  const dpr = Number.isFinite(devicePixelRatio) ? devicePixelRatio : 1;
  const safeCap =
    Number.isFinite(cap) && cap > 0 ? cap : CANVAS_2D_PIXEL_RATIO_CAP;
  return Math.min(Math.max(dpr, 1e-6), safeCap);
}

/**
 * Size a 2D canvas for HiDPI: CSS size stays in layout pixels; backing
 * store uses a capped DPR. Returns the scale applied (for `ctx.setTransform`).
 */
export function configureCanvas2dBackingStore(
  canvas: HTMLCanvasElement,
  cssWidth: number,
  cssHeight: number,
  options: { dpr?: number; cap?: number } = {}
): number {
  const dpr = resolveCanvas2dPixelRatio(options.dpr, options.cap);
  const w = Math.max(1, Math.round(cssWidth * dpr));
  const h = Math.max(1, Math.round(cssHeight * dpr));
  canvas.width = w;
  canvas.height = h;
  canvas.style.width = `${cssWidth}px`;
  canvas.style.height = `${cssHeight}px`;
  return dpr;
}
