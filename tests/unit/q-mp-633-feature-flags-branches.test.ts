/**
 * q-mp-633 — Close `feature-flags.ts` residual branch gaps (tests-only).
 *
 * Live tip re-measure (`cursor/mp-tip-post1023` @ `fb0d0ec5`):
 * - 100% lines / 71.42% branches; uncovered branch sites: lines 24, 26
 *   (SSR falsy arms of `typeof window !== 'undefined'` default params).
 *
 * Existing suites (`mp3d-feature-flags`, `mutation-ui-feature-flags`,
 * `q-mp-455-…`) cover the window-present arms and product flag precedence.
 * Leave `#925`/`q-mp-455` residuals with contained — that ticket owns
 * soft-fail characterization, not these SSR default-param branches.
 *
 * No `src/` edits. No default flag value flips. No network.
 */
import { describe, expect, it } from 'vitest';

import {
  BOARD_3D_STORAGE_KEY,
  isBoard3dEnabled,
} from '../../src/core/feature-flags';

function memoryStorage(initial: Record<string, string> = {}): Storage {
  const data = { ...initial };
  return {
    get length() {
      return Object.keys(data).length;
    },
    clear() {
      for (const k of Object.keys(data)) delete data[k];
    },
    getItem(key: string) {
      return Object.prototype.hasOwnProperty.call(data, key)
        ? data[key]!
        : null;
    },
    key(index: number) {
      return Object.keys(data)[index] ?? null;
    },
    removeItem(key: string) {
      delete data[key];
    },
    setItem(key: string, value: string) {
      data[key] = String(value);
    },
  };
}

describe('q-mp-633 feature-flags — SSR default-param branches', () => {
  it('omitted search/hash defaults to empty strings when window is undefined', () => {
    const retained = globalThis.window;
    // eslint-disable-next-line @typescript-eslint/no-dynamic-delete -- SSR probe
    delete (globalThis as { window?: Window & typeof globalThis }).window;
    try {
      // `undefined` triggers default-param evaluation for search (L24) and
      // hash (L26); both take the `typeof window !== 'undefined' ? … : ''`
      // falsy arm. Explicit storage avoids getWebStorage side effects.
      expect(isBoard3dEnabled(undefined, memoryStorage(), undefined)).toBe(
        false
      );
      expect(
        isBoard3dEnabled(
          undefined,
          memoryStorage({ [BOARD_3D_STORAGE_KEY]: '1' }),
          undefined
        )
      ).toBe(true);
    } finally {
      (globalThis as { window: Window & typeof globalThis }).window = retained;
    }
  });

  it('no-arg call with window undefined stays OFF (all three defaults)', () => {
    const retained = globalThis.window;
    // eslint-disable-next-line @typescript-eslint/no-dynamic-delete -- SSR probe
    delete (globalThis as { window?: Window & typeof globalThis }).window;
    try {
      expect(() => isBoard3dEnabled()).not.toThrow();
      expect(isBoard3dEnabled()).toBe(false);
    } finally {
      (globalThis as { window: Window & typeof globalThis }).window = retained;
    }
  });
});
