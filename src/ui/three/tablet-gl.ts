/**
 * Shared tablet-friendly WebGL helpers for 3D boards.
 *
 * - Cap pixel ratio / prefer low-power (applied by each board)
 * - Gate preserveDrawingBuffer to Playwright / explicit opt-in
 * - Pause paints while the document is hidden
 * - Optional test-only low-quality render path (board3dLQ) for CI e2e
 * - Reliable first-paint readiness signal for software GL (SwiftShader)
 */

const PRESERVE_PARAM = 'preserveDrawingBuffer';
const PRESERVE_STORAGE_KEY = 'mp-preserve-drawing-buffer';

/** Opt-in low-quality 3D path for Playwright / CI (not a player-facing setting). */
const BOARD_3D_LQ_PARAM = 'board3dLQ';
const BOARD_3D_LQ_STORAGE_KEY = 'mp-board3d-lq';

/** Match FIAR / Queens / Pent'Em In tablet profile. */
export const TABLET_PIXEL_RATIO_CAP = 1.5;

/** Cap used when `board3dLQ` is enabled (software GL / parallel e2e). */
export const BOARD_3D_LQ_PIXEL_RATIO_CAP = 1;

/** Set on the canvas after the first successful `renderer.render`. */
const MP3D_READY_ATTR = 'data-mp3d-ready';

/**
 * Set on the board host when WebGL mount fails or context is permanently lost
 * so e2e can fail fast instead of waiting for a canvas that will never appear.
 */
export const MP3D_FALLBACK_ATTR = 'data-mp3d-fallback';

function hashQueryParams(): URLSearchParams {
  if (typeof window === 'undefined') return new URLSearchParams();
  const hash = window.location.hash;
  const q = hash.indexOf('?');
  if (q === -1) return new URLSearchParams();
  return new URLSearchParams(hash.slice(q + 1));
}

function readFlag(param: string, storageKey: string): boolean | null {
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
  if (canvas.getAttribute(MP3D_READY_ATTR) === '1') return;
  canvas.setAttribute(MP3D_READY_ATTR, '1');
  canvas.dispatchEvent(
    new CustomEvent('mp3d-ready', { bubbles: true, detail: { ready: true } })
  );
}

/** Controllers call this when WebGL mount fails so e2e can fail fast. */
export function markBoard3dWebGlFallback(
  host: HTMLElement | null | undefined,
  reason: string
): void {
  if (!host) return;
  host.setAttribute(MP3D_FALLBACK_ATTR, reason || 'webgl');
}

export function clearBoard3dWebGlFallback(
  host: HTMLElement | null | undefined
): void {
  if (!host) return;
  host.removeAttribute(MP3D_FALLBACK_ATTR);
}

/**
 * Run one on-demand paint and mark the canvas ready on success.
 * Under software GL the first `render()` can throw transiently — retry once
 * on the next animation frame. Skips while the tab is hidden (`canPaint3d`).
 */
export function paintBoard3dAndMarkReady(
  canvas: HTMLCanvasElement,
  render: () => void,
  isDisposed: () => boolean = () => false
): void {
  if (isDisposed()) return;
  if (!canPaint3d()) return;
  try {
    render();
    markBoard3dCanvasReady(canvas);
  } catch {
    if (typeof requestAnimationFrame !== 'function') return;
    requestAnimationFrame(() => {
      if (isDisposed() || !canPaint3d()) return;
      try {
        render();
        markBoard3dCanvasReady(canvas);
      } catch {
        // Leave unmarked; a later update()/resize()/visibility paint retries.
      }
    });
  }
}

/**
 * After mount + sync resize, schedule one more paint once layout has settled.
 * Software GL (SwiftShader) often needs a post-layout frame before the first
 * real paint succeeds and the ready attribute can be set.
 */
export function scheduleBoard3dMountPaint(paint: () => void): void {
  if (typeof requestAnimationFrame !== 'function') {
    paint();
    return;
  }
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      paint();
    });
  });
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
