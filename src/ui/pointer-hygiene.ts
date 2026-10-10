/**
 * Shared pointer / touch hygiene for boards and drag shells.
 *
 * Covers tablet/kid edge cases that raw click or pointerup-only handlers miss:
 * - pointercancel mid-gesture (no half-applied activate)
 * - secondary multi-touch fingers (isPrimary / pointerId)
 * - scroll-vs-tap (movement threshold before activate)
 * - pointer capture loss / release outside the element
 * - hybrid mouse+touch duplicate activate (claim once per gesture)
 *
 * Does not change game rules, AI, scoring, or timing.
 */

/** Max movement (CSS px) still counted as a tap rather than a pan/scroll. */
export const POINTER_TAP_SLOP_PX = 16;

type PointerTapPhase = 'idle' | 'pending' | 'cancelled';

interface PointerTapState {
  phase: PointerTapPhase;
  pointerId: number | null;
  startX: number;
  startY: number;
  /** True after a successful activate until reset — blocks hybrid click echo. */
  claimed: boolean;
}

interface PointerTapControllerOptions {
  /** Movement budget before the gesture is treated as a pan (default 16). */
  slopPx?: number;
  /**
   * When true (default), require `isPrimary !== false`.
   * Secondary fingers never start or complete a tap.
   */
  requirePrimary?: boolean;
}

interface PointerTapController {
  /** Current machine state (for unit tests / debugging). */
  getState(): Readonly<PointerTapState>;
  reset(): void;
  onPointerDown(e: PointerEvent): void;
  /**
   * Returns true when this up completes a valid tap (caller should activate).
   * Does not call side effects other than advancing the state machine.
   */
  onPointerUp(e: PointerEvent): boolean;
  onPointerMove(e: PointerEvent): void;
  onPointerCancel(e: PointerEvent): void;
  /** True if a matching click should still activate (mouse / keyboard path). */
  shouldAcceptClick(): boolean;
  /** Mark activate done so a trailing click is ignored. */
  markClaimed(): void;
}

function isPrimaryPointer(e: PointerEvent): boolean {
  // Some synthetic/test events omit isPrimary; treat undefined as primary.
  return e.isPrimary !== false;
}

/**
 * True for a primary activating pointer on pointerdown
 * (left mouse button / touch / pen; not secondary multi-touch).
 */
export function isPrimaryActivatingPointer(e: PointerEvent): boolean {
  if (!isPrimaryPointer(e)) {
    return false;
  }
  if (e.pointerType === 'mouse' && e.button !== 0) {
    return false;
  }
  return true;
}

/**
 * Pure drag/tap state machine used by canvas taps and click-deduped board cells.
 */
export function createPointerTapController(
  options: PointerTapControllerOptions = {}
): PointerTapController {
  const slopPx = options.slopPx ?? POINTER_TAP_SLOP_PX;
  const requirePrimary = options.requirePrimary !== false;

  const state: PointerTapState = {
    phase: 'idle',
    pointerId: null,
    startX: 0,
    startY: 0,
    claimed: false,
  };

  const reset = (): void => {
    state.phase = 'idle';
    state.pointerId = null;
    state.startX = 0;
    state.startY = 0;
    state.claimed = false;
  };

  const matches = (e: PointerEvent): boolean =>
    state.pointerId !== null && e.pointerId === state.pointerId;

  return {
    getState: () => state,
    reset,
    onPointerDown(e: PointerEvent): void {
      if (requirePrimary && !isPrimaryActivatingPointer(e)) {
        return;
      }
      // One active gesture — ignore extra fingers while pending.
      if (state.phase === 'pending') {
        return;
      }
      state.phase = 'pending';
      state.pointerId = e.pointerId;
      state.startX = e.clientX;
      state.startY = e.clientY;
      state.claimed = false;
    },
    onPointerMove(e: PointerEvent): void {
      if (state.phase !== 'pending' || !matches(e)) {
        return;
      }
      const dx = e.clientX - state.startX;
      const dy = e.clientY - state.startY;
      if (Math.hypot(dx, dy) > slopPx) {
        state.phase = 'cancelled';
      }
    },
    onPointerUp(e: PointerEvent): boolean {
      if (requirePrimary && !isPrimaryPointer(e)) {
        return false;
      }
      if (state.phase !== 'pending' || !matches(e)) {
        // Stale up after cancel/idle — clear if it was our id.
        if (matches(e)) {
          state.phase = 'idle';
          state.pointerId = null;
        }
        return false;
      }
      state.phase = 'idle';
      state.pointerId = null;
      state.claimed = true;
      return true;
    },
    onPointerCancel(e: PointerEvent): void {
      if (state.pointerId !== null && e.pointerId !== state.pointerId) {
        return;
      }
      state.phase = 'idle';
      state.pointerId = null;
      // Do not claim — a later click from a real mouse tap may still apply.
      state.claimed = false;
    },
    shouldAcceptClick(): boolean {
      return !state.claimed;
    },
    markClaimed(): void {
      state.claimed = true;
      state.phase = 'idle';
      state.pointerId = null;
    },
  };
}

interface BindCanvasPointerTapOptions extends PointerTapControllerOptions {
  /**
   * Called with the completing pointerup when the gesture is a valid tap.
   * Hover-only move/leave stay the caller's responsibility when needed.
   */
  onTap: (e: PointerEvent) => void;
  /** Clear hover / preview when the active pointer cancels or leaves. */
  onGestureEnd?: () => void;
  /** Capture the pointer on down so leave does not strand the gesture. */
  capture?: boolean;
}

/**
 * Bind down→up tap activation on a canvas (3D boards).
 * Ignores secondary fingers, cancels on pointercancel / oversized move,
 * and only activates when the same pointerId that went down comes up.
 */
export function bindCanvasPointerTap(
  canvas: HTMLElement,
  options: BindCanvasPointerTapOptions
): () => void {
  // Canvases use touch-action:none (no page scroll). Allow finger slide
  // across cells; only multi-touch / cancel / capture-loss abort the tap.
  const tap = createPointerTapController({
    ...options,
    slopPx: options.slopPx ?? Number.POSITIVE_INFINITY,
  });
  const capture = options.capture !== false;

  const onDown = (e: PointerEvent): void => {
    const before = tap.getState().phase;
    tap.onPointerDown(e);
    if (tap.getState().phase !== 'pending' || before === 'pending') {
      return;
    }
    if (!capture) {
      return;
    }
    try {
      canvas.setPointerCapture(e.pointerId);
    } catch {
      // Pointer may already be gone.
    }
  };

  const onMove = (e: PointerEvent): void => {
    tap.onPointerMove(e);
  };

  const onUp = (e: PointerEvent): void => {
    const tracked = tap.getState().pointerId === e.pointerId;
    const ok = tap.onPointerUp(e);
    if (ok) {
      options.onTap(e);
    } else if (tracked) {
      options.onGestureEnd?.();
    }
  };

  const onCancel = (e: PointerEvent): void => {
    const id = tap.getState().pointerId;
    tap.onPointerCancel(e);
    if (id !== null) {
      try {
        if (canvas.hasPointerCapture?.(id)) {
          canvas.releasePointerCapture(id);
        }
      } catch {
        // ignore
      }
    }
    options.onGestureEnd?.();
  };

  const onLostCapture = (e: PointerEvent): void => {
    // Treat capture loss like cancel so a half-gesture cannot activate later.
    if (tap.getState().phase === 'pending') {
      tap.onPointerCancel(e);
      options.onGestureEnd?.();
    }
  };

  canvas.addEventListener('pointerdown', onDown);
  canvas.addEventListener('pointermove', onMove);
  canvas.addEventListener('pointerup', onUp);
  canvas.addEventListener('pointercancel', onCancel);
  canvas.addEventListener('lostpointercapture', onLostCapture);

  return () => {
    canvas.removeEventListener('pointerdown', onDown);
    canvas.removeEventListener('pointermove', onMove);
    canvas.removeEventListener('pointerup', onUp);
    canvas.removeEventListener('pointercancel', onCancel);
    canvas.removeEventListener('lostpointercapture', onLostCapture);
    tap.reset();
  };
}

/**
 * Block long-press context menu / selection UI on a board surface.
 */
export function suppressBoardContextMenu(el: EventTarget): () => void {
  const handler = (e: Event): void => {
    e.preventDefault();
  };
  el.addEventListener('contextmenu', handler);
  return () => {
    el.removeEventListener('contextmenu', handler);
  };
}

/**
 * Bind activate that prefers a completed primary pointer tap, with click
 * as a fallback for mouse/keyboard (and tests). Dedupes hybrid echo.
 */
export function bindPrimaryPointerActivate(
  el: Element,
  activate: () => void,
  options: PointerTapControllerOptions = {}
): () => void {
  const tap = createPointerTapController(options);

  // Element (incl. SVG) listeners are typed as Event — narrow at the boundary.
  const onDown = (e: Event): void => {
    tap.onPointerDown(e as PointerEvent);
  };
  const onMove = (e: Event): void => {
    tap.onPointerMove(e as PointerEvent);
  };
  const onUp = (e: Event): void => {
    if (tap.onPointerUp(e as PointerEvent)) {
      activate();
    }
  };
  const onCancel = (e: Event): void => {
    tap.onPointerCancel(e as PointerEvent);
  };
  const onClick = (): void => {
    if (!tap.shouldAcceptClick()) {
      return;
    }
    tap.markClaimed();
    activate();
  };

  el.addEventListener('pointerdown', onDown);
  el.addEventListener('pointermove', onMove);
  el.addEventListener('pointerup', onUp);
  el.addEventListener('pointercancel', onCancel);
  el.addEventListener('click', onClick);

  return () => {
    el.removeEventListener('pointerdown', onDown);
    el.removeEventListener('pointermove', onMove);
    el.removeEventListener('pointerup', onUp);
    el.removeEventListener('pointercancel', onCancel);
    el.removeEventListener('click', onClick);
    tap.reset();
  };
}
