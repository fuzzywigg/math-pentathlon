/**
 * q-mp-431 — Characterize timeout-handle + coord-map residuals (tests-only).
 *
 * Structural asserts only. Fake timers for all timeout paths — no real-time
 * awaits and no AI move / timing / delay pins. Hex Hard 450ms untouched.
 * No player-facing copy pins. No `src/` product edits.
 *
 * Live tip re-measure (`cursor/mp-tip-post865` @ `7f8a7147`):
 * - `timeout-handle.ts` 79 LOC; dedicated hosts: mutation-ui + mutation-ui11
 *   (+ ui-helper-dedupe characterization / burn-r5 coverage elsewhere).
 * - `coord-map.ts` 110 LOC; dedicated hosts: coord-map.test + mutation-ui +
 *   mutation-ui11 (+ burn-r2 scale/DPR edges).
 * Wave 11 (#875) owns mutation scores; this file owns post865 residual soft
 * edges (reschedule / idempotent clear / delay-0 / padding boundaries /
 * asymmetric fallback / DPR floor / zero-CSS backing).
 *
 * Narrowed vs open drafts into tip:
 * - #875 q-mp-350 mutation w11 — serialize lightly; keep characterization-only
 * - #893/#885/#884 other residual chars — disjoint hosts
 * - q-mp-430 game-error-boundary/offline — leave alone
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import {
  CANVAS_2D_PIXEL_RATIO_CAP,
  clientToNdc,
  clientToSvgUser,
  configureCanvas2dBackingStore,
  resolveCanvas2dPixelRatio,
  svgUserToGridCell,
} from '../../src/ui/coord-map';
import {
  bumpGeneration,
  clearGenerationTimeout,
  clearNullableTimeout,
  createGenerationTimeoutHandle,
  scheduleGenerationGated,
  scheduleGenerationTimeout,
} from '../../src/ui/timeout-handle';

describe('q-mp-431 timeout-handle — reschedule / clear residuals', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    try {
      vi.clearAllTimers();
    } catch {
      // ignore when timers already real
    }
    vi.useRealTimers();
  });

  it('reschedule replaces pending callback; only the latest fires', () => {
    const handle = createGenerationTimeoutHandle();
    const first = vi.fn();
    const second = vi.fn();
    scheduleGenerationTimeout(handle, first, 40);
    const pending = handle.timer;
    expect(pending).not.toBeNull();
    scheduleGenerationTimeout(handle, second, 40);
    expect(handle.timer).not.toBeNull();
    expect(handle.timer).not.toBe(pending);
    vi.advanceTimersByTime(40);
    expect(first).not.toHaveBeenCalled();
    expect(second).toHaveBeenCalledOnce();
    expect(handle.timer).toBeNull();
  });

  it('clearGenerationTimeout is idempotent when timer already null', () => {
    const handle = createGenerationTimeoutHandle();
    expect(handle.timer).toBeNull();
    clearGenerationTimeout(handle);
    expect(handle.timer).toBeNull();
    scheduleGenerationTimeout(handle, () => undefined, 20);
    clearGenerationTimeout(handle);
    clearGenerationTimeout(handle);
    expect(handle.timer).toBeNull();
    vi.advanceTimersByTime(20);
  });

  it('delayMs 0 fires on fake-timer flush when generation is stable', () => {
    const handle = createGenerationTimeoutHandle();
    const ran = vi.fn();
    scheduleGenerationTimeout(handle, ran, 0);
    expect(ran).not.toHaveBeenCalled();
    vi.advanceTimersByTime(0);
    expect(ran).toHaveBeenCalledOnce();
    expect(handle.timer).toBeNull();
  });

  it('bump then schedule uses the new generation and fires', () => {
    const handle = createGenerationTimeoutHandle();
    const stale = vi.fn();
    scheduleGenerationTimeout(handle, stale, 15);
    bumpGeneration(handle);
    bumpGeneration(handle);
    expect(handle.generation).toBe(2);
    const fresh = vi.fn();
    scheduleGenerationTimeout(handle, fresh, 15);
    vi.advanceTimersByTime(15);
    expect(stale).not.toHaveBeenCalled();
    expect(fresh).toHaveBeenCalledOnce();
  });

  it('scheduleGenerationGated reschedule clears prior timer binding', () => {
    let timer: ReturnType<typeof setTimeout> | null = null;
    let generation = 0;
    const clearCalls = vi.fn(() => {
      if (timer !== null) clearTimeout(timer);
      timer = null;
    });
    const first = vi.fn();
    const second = vi.fn();
    const opts = {
      clearTimer: clearCalls,
      setTimer: (id: ReturnType<typeof setTimeout> | null) => {
        timer = id;
      },
      getGeneration: () => generation,
    };
    scheduleGenerationGated(opts, first, 25);
    expect(clearCalls).toHaveBeenCalledTimes(1);
    expect(timer).not.toBeNull();
    scheduleGenerationGated(opts, second, 25);
    expect(clearCalls).toHaveBeenCalledTimes(2);
    vi.advanceTimersByTime(25);
    expect(first).not.toHaveBeenCalled();
    expect(second).toHaveBeenCalledOnce();
    expect(timer).toBeNull();
  });

  it('clearNullableTimeout after scheduleGenerationTimeout drops the fire', () => {
    const handle = createGenerationTimeoutHandle();
    const ran = vi.fn();
    scheduleGenerationTimeout(handle, ran, 30);
    expect(handle.timer).not.toBeNull();
    handle.timer = clearNullableTimeout(handle.timer);
    expect(handle.timer).toBeNull();
    vi.advanceTimersByTime(30);
    expect(ran).not.toHaveBeenCalled();
  });
});

describe('q-mp-431 coord-map — asymmetric / padding / DPR residuals', () => {
  it('clientToSvgUser applies left/top offsets with independent axis fallback', () => {
    // viewBoxWidth 0 → scaleX=1; viewBoxHeight ok → scaleY = height/vbH.
    const p = clientToSvgUser(
      15,
      30,
      { left: 5, top: 10, width: 40, height: 80 },
      0,
      160
    );
    expect(p.x).toBeCloseTo(10); // (15-5)/1
    expect(p.y).toBeCloseTo(40); // (30-10)/(80/160)
  });

  it('negative viewBox dimensions fall back to scale 1 on both axes', () => {
    const p = clientToSvgUser(
      8,
      12,
      { left: 2, top: 4, width: 50, height: 50 },
      -100,
      -50
    );
    expect(p).toEqual({ x: 6, y: 8 });
  });

  it('svgUserToGridCell pins padding boundary and single-axis negatives', () => {
    const cellSize = 10;
    const padding = 4;
    // Exactly on padding → cell (0,0).
    expect(svgUserToGridCell(padding, padding, cellSize, padding)).toEqual({
      row: 0,
      col: 0,
    });
    // Just inside padding on X → col negative → null.
    expect(
      svgUserToGridCell(padding - 0.1, padding + 1, cellSize, padding)
    ).toBeNull();
    // Just inside padding on Y → row negative → null.
    expect(
      svgUserToGridCell(padding + 1, padding - 0.1, cellSize, padding)
    ).toBeNull();
    // Floor edge of next cell.
    expect(
      svgUserToGridCell(
        padding + cellSize,
        padding + 2 * cellSize,
        cellSize,
        padding
      )
    ).toEqual({ row: 2, col: 1 });
  });

  it('clientToNdc maps with non-zero origin; outside rect is unclamped', () => {
    const rect = { left: 100, top: 50, width: 200, height: 100 };
    expect(clientToNdc(100, 50, rect)).toEqual({ x: -1, y: 1 });
    expect(clientToNdc(300, 150, rect)).toEqual({ x: 1, y: -1 });
    // Left of rect → x < -1 (no clamp).
    expect(clientToNdc(0, 100, rect)?.x).toBeLessThan(-1);
    // Above rect → y > 1.
    expect(clientToNdc(200, 0, rect)?.y).toBeGreaterThan(1);
  });

  it('resolveCanvas2dPixelRatio floors tiny/negative; non-finite dpr/cap soft-fail', () => {
    expect(CANVAS_2D_PIXEL_RATIO_CAP).toBe(2);
    expect(resolveCanvas2dPixelRatio(1e-9)).toBeCloseTo(1e-6);
    expect(resolveCanvas2dPixelRatio(-3)).toBeCloseTo(1e-6);
    // Infinity is not finite → dpr soft-defaults to 1 (not the cap).
    expect(resolveCanvas2dPixelRatio(Number.POSITIVE_INFINITY)).toBe(1);
    // Non-finite cap soft-defaults to CANVAS_2D_PIXEL_RATIO_CAP.
    expect(resolveCanvas2dPixelRatio(4, Number.POSITIVE_INFINITY)).toBe(2);
    expect(resolveCanvas2dPixelRatio(0.5, 0.25)).toBeCloseTo(0.25);
  });

  it('configureCanvas2dBackingStore keeps backing ≥1 for zero/negative CSS', () => {
    const canvas = document.createElement('canvas');
    const dpr = configureCanvas2dBackingStore(canvas, 0, 0, { dpr: 2 });
    expect(dpr).toBe(2);
    expect(canvas.width).toBe(1);
    expect(canvas.height).toBe(1);
    expect(canvas.style.width).toBe('0px');
    expect(canvas.style.height).toBe('0px');

    const canvasNeg = document.createElement('canvas');
    const dpr2 = configureCanvas2dBackingStore(canvasNeg, -10, 8, {
      dpr: 1,
      cap: 0,
    });
    // Non-positive cap falls back to CANVAS_2D_PIXEL_RATIO_CAP; dpr still 1.
    expect(dpr2).toBe(1);
    expect(canvasNeg.width).toBe(1); // max(1, round(-10))
    expect(canvasNeg.height).toBe(8);
    // jsdom rejects negative CSS lengths → empty style width residual.
    expect(canvasNeg.style.width).toBe('');
    expect(canvasNeg.style.height).toBe('8px');
  });

  it('configureCanvas2dBackingStore rounds fractional CSS via dpr scale', () => {
    const canvas = document.createElement('canvas');
    const dpr = configureCanvas2dBackingStore(canvas, 10.4, 7.6, { dpr: 1.5 });
    expect(dpr).toBe(1.5);
    expect(canvas.width).toBe(Math.round(10.4 * 1.5));
    expect(canvas.height).toBe(Math.round(7.6 * 1.5));
    expect(canvas.style.width).toBe('10.4px');
    expect(canvas.style.height).toBe('7.6px');
  });
});
