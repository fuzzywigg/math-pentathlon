/**
 * Shared tablet-friendly WebGL helpers for 3D boards.
 *
 * - Cap pixel ratio / prefer low-power (applied by each board)
 * - Gate preserveDrawingBuffer to Playwright / explicit opt-in
 * - Pause paints while the document is hidden
 * - Optional test-only low-quality render path (board3dLQ) for CI e2e
 */

const PRESERVE_PARAM = 'preserveDrawingBuffer';
const PRESERVE_STORAGE_KEY = 'mp-preserve-drawing-buffer';

/** Opt-in low-quality 3D path for Playwright / CI (not a player-facing setting). */
export const BOARD_3D_LQ_PARAM = 'board3dLQ';
export const BOARD_3D_LQ_STORAGE_KEY = 'mp-board3d-lq';

/** Match FIAR / Queens / Pent'Em In tablet profile. */
export const TABLET_PIXEL_RATIO_CAP = 1.5;

/** Cap used when `board3dLQ` is enabled (software GL / parallel e2e). */
export const BOARD_3D_LQ_PIXEL_RATIO_CAP = 1;

function hashQueryParams(): URLSearchParams {
  if (typeof window === 'undefined') return new URLSearchParams();
  const hash = window.location.hash;
  const q = hash.indexOf('?');
  if (q === -1) return new URLSearchParams();
  return new URLSearchParams(hash.slice(q + 1));
}

function readFlag(
  param: string,
  storageKey: string
): boolean | null {
  if (typeof window === 'undefined') return null;

  try {
    const search = new URLSearchParams(window.location.search);
    const hashQ = hashQueryParams();
    const flag = search.get(param) ?? hashQ.get(param);
    if (flag === '1' || flag === 'true') return true;
    if (flag === '0' || flag === 'false') return false;
    return localStorage.getItem(storageKey) === '1' ? true : null;
  } catch {
    return null;
  }
}

/**
 * `preserveDrawingBuffer` costs GPU memory; only enable when Playwright
 * needs `canvas.screenshot()` / toDataURL, or when explicitly opted in.
 */
export function shouldPreserveDrawingBuffer(): boolean {
  // Playwright sets navigator.webdriver; canvas.screenshot needs the buffer.
  if (typeof navigator !== 'undefined' && navigator.webdriver) {
    return true;
  }
  if (typeof window === 'undefined') return false;

  const flag = readFlag(PRESERVE_PARAM, PRESERVE_STORAGE_KEY);
  return flag === true;
}

/**
 * Test-only low-quality 3D render. Enable with `?board3dLQ=1` (search or hash)
 * or localStorage `mp-board3d-lq=1`. Never on by default for players.
 */
export function isBoard3dLowQuality(): boolean {
  return readFlag(BOARD_3D_LQ_PARAM, BOARD_3D_LQ_STORAGE_KEY) === true;
}

/**
 * Pixel ratio for WebGLRenderer — tablet cap, or LQ cap when opted in.
 */
export function resolveBoard3dPixelRatio(
  devicePixelRatio: number = typeof window !== 'undefined'
    ? window.devicePixelRatio || 1
    : 1
): number {
  const cap = isBoard3dLowQuality()
    ? BOARD_3D_LQ_PIXEL_RATIO_CAP
    : TABLET_PIXEL_RATIO_CAP;
  return Math.min(devicePixelRatio, cap);
}

/** Mark canvas after first successful paint so e2e can wait on scene readiness. */
export function markBoard3dCanvasReady(canvas: HTMLCanvasElement): void {
  if (canvas.getAttribute('data-mp3d-ready') === '1') return;
  canvas.setAttribute('data-mp3d-ready', '1');
}

/** Skip on-demand paints while the tab is backgrounded. */
export function canPaint3d(): boolean {
  if (typeof document === 'undefined') return true;
  return !document.hidden;
}

/**
 * Call `onHidden` / `onVisible` on visibilitychange.
 * Returns an unsubscribe function.
 */
export function bindPageVisibility(handlers: {
  onHidden?: () => void;
  onVisible?: () => void;
}): () => void {
  if (typeof document === 'undefined') return () => undefined;

  const onChange = (): void => {
    if (document.hidden) handlers.onHidden?.();
    else handlers.onVisible?.();
  };
  document.addEventListener('visibilitychange', onChange);
  return () => document.removeEventListener('visibilitychange', onChange);
}
