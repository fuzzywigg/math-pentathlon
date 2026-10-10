/**
 * q-mp-638 — Close `coord-map` residual branches (tests-only).
 *
 * Live tip re-measure (`cursor/mp-tip-post1023` @ tip head):
 * `src/ui/coord-map.ts` — 100% lines / **87.09%** branches; uncovered branch
 * lines **81–82** (`resolveCanvas2dPixelRatio` default-param SSR / DPR arms).
 *
 * Structural / numeric asserts only. No `src/` product edits. No player-facing
 * copy / aria / label pins. No AI / rules / scoring / legal-move changes.
 * Hex Hard 450ms untouched. No ratchet JSON.
 *
 * Open-draft check: no PR into `cursor/mp-tip-post1023` owns closing these
 * residual branches under the `*coord-map*` verification glob. Leave
 * `#906`/`431` characterization and mutation w11 `#875` open (**contained**).
 */
import { describe, expect, it } from 'vitest';

import {
  CANVAS_2D_PIXEL_RATIO_CAP,
  resolveCanvas2dPixelRatio,
} from '../../src/ui/coord-map';

describe('q-mp-638 coord-map — resolveCanvas2dPixelRatio default-param branches', () => {
  const dprDescriptor = () =>
    Object.getOwnPropertyDescriptor(window, 'devicePixelRatio');

  it('omitted dpr reads truthy window.devicePixelRatio (L81–82 true/truthy arms)', () => {
    const prev = dprDescriptor();
    Object.defineProperty(window, 'devicePixelRatio', {
      configurable: true,
      value: 1.75,
    });
    try {
      // Omitted arg → default param evaluates `typeof window !== 'undefined'
      // ? window.devicePixelRatio || 1 : 1`.
      expect(resolveCanvas2dPixelRatio()).toBe(1.75);
      expect(resolveCanvas2dPixelRatio(undefined as unknown as number)).toBe(
        1.75
      );
    } finally {
      if (prev) {
        Object.defineProperty(window, 'devicePixelRatio', prev);
      }
    }
  });

  it('omitted dpr with falsy window.devicePixelRatio soft-defaults to 1', () => {
    const prev = dprDescriptor();
    Object.defineProperty(window, 'devicePixelRatio', {
      configurable: true,
      value: 0,
    });
    try {
      expect(resolveCanvas2dPixelRatio()).toBe(1);
      expect(resolveCanvas2dPixelRatio(undefined as unknown as number)).toBe(1);
    } finally {
      if (prev) {
        Object.defineProperty(window, 'devicePixelRatio', prev);
      }
    }
  });

  it('omitted dpr when window is undefined soft-defaults to 1 (SSR arm)', () => {
    // L81–82: `typeof window !== 'undefined' ? … : 1` false arm.
    // Prior *coord-map* hosts only exercise the jsdom true arm.
    const retained = globalThis.window;
    // eslint-disable-next-line @typescript-eslint/no-dynamic-delete -- SSR probe
    delete (globalThis as { window?: Window & typeof globalThis }).window;
    try {
      expect(typeof (globalThis as { window?: unknown }).window).toBe(
        'undefined'
      );
      expect(resolveCanvas2dPixelRatio()).toBe(1);
      expect(resolveCanvas2dPixelRatio(undefined as unknown as number)).toBe(1);
      // Cap default still applies; explicit oversize dpr still capped.
      expect(resolveCanvas2dPixelRatio(9)).toBe(CANVAS_2D_PIXEL_RATIO_CAP);
    } finally {
      (globalThis as { window: Window & typeof globalThis }).window = retained;
    }
  });

  it('omitted cap keeps CANVAS_2D_PIXEL_RATIO_CAP when only dpr is supplied', () => {
    // Second default param arm is already exercised elsewhere; pin omitted-cap
    // alongside the L81–82 path so the suite stays self-contained.
    expect(resolveCanvas2dPixelRatio(3)).toBe(CANVAS_2D_PIXEL_RATIO_CAP);
    expect(resolveCanvas2dPixelRatio(3, undefined as unknown as number)).toBe(
      CANVAS_2D_PIXEL_RATIO_CAP
    );
  });
});
