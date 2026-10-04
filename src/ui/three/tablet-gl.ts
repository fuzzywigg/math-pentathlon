/**
 * Shared tablet-friendly WebGL helpers for 3D boards.
 *
 * - Cap pixel ratio / prefer low-power (applied by each board)
 * - Gate preserveDrawingBuffer to Playwright / explicit opt-in
 * - Pause paints while the document is hidden
 */

const PRESERVE_PARAM = 'preserveDrawingBuffer';
const PRESERVE_STORAGE_KEY = 'mp-preserve-drawing-buffer';

/** Match FIAR / Queens / Pent'Em In tablet profile. */
export const TABLET_PIXEL_RATIO_CAP = 1.5;

function hashQueryParams(): URLSearchParams {
  if (typeof window === 'undefined') return new URLSearchParams();
  const hash = window.location.hash;
  const q = hash.indexOf('?');
  if (q === -1) return new URLSearchParams();
  return new URLSearchParams(hash.slice(q + 1));
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

  try {
    const search = new URLSearchParams(window.location.search);
    const hashQ = hashQueryParams();
    const flag = search.get(PRESERVE_PARAM) ?? hashQ.get(PRESERVE_PARAM);
    if (flag === '1' || flag === 'true') return true;
    if (flag === '0' || flag === 'false') return false;
    return localStorage.getItem(PRESERVE_STORAGE_KEY) === '1';
  } catch {
    return false;
  }
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
