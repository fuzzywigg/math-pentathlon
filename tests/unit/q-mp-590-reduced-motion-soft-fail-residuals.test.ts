/**
 * q-mp-590 — Characterize `reduced-motion` soft-fail residuals (tests-only).
 *
 * Live tip re-measure (`cursor/mp-tip-post1012` @ tip HEAD):
 * - `src/ui/reduced-motion.ts` **123** LOC (matches backlog)
 * - Dedicated `*soft-fail*residuals*` files before this suite: **0**
 * - Prior suites: `reduced-motion`, `q-mp-278`, `mutation-ui`,
 *   `mutation-ui13`, hex/queens/kings touch + burn-1008 motion demos
 * - Soft-fail keep-sites: two `try`/`catch` arms around `matchMedia`
 *   (`prefersReducedMotion` → `false`; `bindReducedMotionPreference` →
 *   noop unsubscribe) plus environment early-returns when
 *   `window` / `document` / `matchMedia` are unavailable
 *
 * Ownership (leave alone; do not edit product / competing suites):
 * - Undrafted `q-mp-395` void clear — leave (**contained**); no void ceiling
 * - Tip `q-mp-278` / `#787` char — leave (**contained**); separate file
 * - Mutation `q-mp-587` may share host this wave — keep this suite on
 *   soft-fail / catch / environment early-return arms only (no mutation
 *   kill JSON / score pins)
 *
 * Constraints: tests only; no `src/` / AI / scoring / rules / legal-move /
 * copy / aria edits; Hex Hard 450ms untouched; no network; no ratchet JSON.
 */
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import {
  resetSettingsFlagsForTests,
  setUserReducedMotionFlag,
} from '../../src/core/settings-flags';
import {
  REDUCED_MOTION_ATTR,
  applyReducedMotionPreference,
  bindReducedMotionPreference,
  durationMsForMotion,
  prefersReducedMotion,
  scrollBehaviorForMotion,
} from '../../src/ui/reduced-motion';

const REDUCED_MOTION_SRC = readFileSync(
  join(
    dirname(fileURLToPath(import.meta.url)),
    '../../src/ui/reduced-motion.ts'
  ),
  'utf8'
);

const originalMatchMedia = window.matchMedia;

beforeEach(() => {
  document.documentElement.removeAttribute(REDUCED_MOTION_ATTR);
  resetSettingsFlagsForTests();
});

afterEach(() => {
  document.documentElement.removeAttribute(REDUCED_MOTION_ATTR);
  resetSettingsFlagsForTests();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
  Object.defineProperty(window, 'matchMedia', {
    configurable: true,
    writable: true,
    value: originalMatchMedia,
  });
});

// =============================================================================
// 1. Source soft-fail keep-sites
// =============================================================================

describe('q-mp-590 reduced-motion — source soft-fail keep-sites', () => {
  it('keeps prefersReducedMotion matchMedia try/catch soft-fail → false', () => {
    expect(REDUCED_MOTION_SRC).toMatch(
      /try\s*\{\s*return window\.matchMedia\(\s*'\(prefers-reduced-motion: reduce\)'\s*\)\.matches;\s*\}\s*catch\s*\{\s*return false;/
    );
  });

  it('keeps bindReducedMotionPreference matchMedia try/catch soft-fail → noop', () => {
    expect(REDUCED_MOTION_SRC).toMatch(
      /try\s*\{\s*mql = window\.matchMedia\(\s*'\(prefers-reduced-motion: reduce\)'\s*\);\s*\}\s*catch\s*\{\s*return \(\) => undefined;/
    );
  });

  it('keeps exactly two catch soft-fail arms (no rethrow / console)', () => {
    const catchBlocks = REDUCED_MOTION_SRC.match(/catch\s*\{[^}]*\}/g) ?? [];
    expect(catchBlocks).toHaveLength(2);
    for (const block of catchBlocks) {
      expect(block).not.toMatch(/throw\b/);
      expect(block).not.toMatch(/console\./);
    }
  });

  it('keeps environment soft early-returns for missing window/document/matchMedia', () => {
    expect(REDUCED_MOTION_SRC).toMatch(
      /typeof window === 'undefined'\s*\|\|\s*typeof window\.matchMedia !== 'function'/
    );
    expect(REDUCED_MOTION_SRC).toMatch(
      /if\s*\(\s*typeof document === 'undefined'\s*\)\s*\{\s*return;/
    );
    // Same typeof gate appears in prefers + bind (soft env fail → false / noop).
    const gateMatches =
      REDUCED_MOTION_SRC.match(
        /typeof window === 'undefined'\s*\|\|\s*typeof window\.matchMedia !== 'function'/g
      ) ?? [];
    expect(gateMatches.length).toBeGreaterThanOrEqual(2);
  });

  it('keeps attr marker + scroll/duration soft mappings', () => {
    expect(REDUCED_MOTION_SRC).toMatch(
      /export const REDUCED_MOTION_ATTR = 'data-reduced-motion'/
    );
    expect(REDUCED_MOTION_SRC).toMatch(
      /return prefersReducedMotion\(\)\s*\?\s*'auto'\s*:\s*'smooth'/
    );
    expect(REDUCED_MOTION_SRC).toMatch(
      /return prefersReducedMotion\(options\)\s*\?\s*reducedMs\s*:\s*fullMs/
    );
    expect(REDUCED_MOTION_SRC).toMatch(/reducedMs = 0/);
  });
});

// =============================================================================
// 2. matchMedia throw soft-fail residuals
// =============================================================================

describe('q-mp-590 reduced-motion — matchMedia throw soft-fail', () => {
  it('prefersReducedMotion returns false when matchMedia throws (user off)', () => {
    Object.defineProperty(window, 'matchMedia', {
      configurable: true,
      writable: true,
      value: () => {
        throw new Error('q-mp-590 mql boom prefers');
      },
    });
    expect(prefersReducedMotion({ userPrefersReducedMotion: false })).toBe(
      false
    );
  });

  it('userPref short-circuit skips matchMedia soft-fail path entirely', () => {
    const matchMedia = vi.fn(() => {
      throw new Error('q-mp-590 should not be called');
    });
    Object.defineProperty(window, 'matchMedia', {
      configurable: true,
      writable: true,
      value: matchMedia,
    });
    expect(
      prefersReducedMotion({
        userPrefersReducedMotion: true,
        osPrefersReducedMotion: false,
      })
    ).toBe(true);
    expect(matchMedia).not.toHaveBeenCalled();
  });

  it('bindReducedMotionPreference returns noop unsubscribe when matchMedia throws', () => {
    applyReducedMotionPreference({
      userPrefersReducedMotion: false,
      osPrefersReducedMotion: false,
    });
    expect(document.documentElement.hasAttribute(REDUCED_MOTION_ATTR)).toBe(
      false
    );

    Object.defineProperty(window, 'matchMedia', {
      configurable: true,
      writable: true,
      value: () => {
        throw new Error('q-mp-590 mql boom bind');
      },
    });
    const unbind = bindReducedMotionPreference();
    expect(typeof unbind).toBe('function');
    expect(() => unbind()).not.toThrow();
    // Soft-fail unsubscribe is a no-op — attribute stays at last apply.
    expect(document.documentElement.hasAttribute(REDUCED_MOTION_ATTR)).toBe(
      false
    );
  });
});

// =============================================================================
// 3. Missing matchMedia / document soft-fail residuals
// =============================================================================

describe('q-mp-590 reduced-motion — missing env soft-fail', () => {
  it('prefersReducedMotion returns false when matchMedia is not a function', () => {
    Object.defineProperty(window, 'matchMedia', {
      configurable: true,
      writable: true,
      value: undefined,
    });
    expect(prefersReducedMotion({ userPrefersReducedMotion: false })).toBe(
      false
    );
  });

  it('bindReducedMotionPreference returns noop when matchMedia is missing', () => {
    Object.defineProperty(window, 'matchMedia', {
      configurable: true,
      writable: true,
      value: undefined,
    });
    const unbind = bindReducedMotionPreference();
    expect(typeof unbind).toBe('function');
    expect(() => unbind()).not.toThrow();
  });

  it('applyReducedMotionPreference no-ops when document is undefined', () => {
    const original = globalThis.document;
    // @ts-expect-error intentional delete for SSR/no-document soft-fail
    delete globalThis.document;
    try {
      expect(() =>
        applyReducedMotionPreference({
          userPrefersReducedMotion: true,
          osPrefersReducedMotion: true,
        })
      ).not.toThrow();
    } finally {
      Object.defineProperty(globalThis, 'document', {
        configurable: true,
        writable: true,
        value: original,
      });
    }
  });
});

// =============================================================================
// 4. Soft mapping residuals (duration / scroll / attr wipe)
// =============================================================================

describe('q-mp-590 reduced-motion — soft mapping residuals', () => {
  it('durationMsForMotion soft-fails to reducedMs (default 0) when preferred', () => {
    expect(
      durationMsForMotion(320, undefined as unknown as number, {
        userPrefersReducedMotion: true,
        osPrefersReducedMotion: false,
      })
    ).toBe(0);
    expect(
      durationMsForMotion(320, 8, {
        userPrefersReducedMotion: true,
        osPrefersReducedMotion: false,
      })
    ).toBe(8);
    expect(
      durationMsForMotion(320, 8, {
        userPrefersReducedMotion: false,
        osPrefersReducedMotion: false,
      })
    ).toBe(320);
  });

  it('scrollBehaviorForMotion soft-maps auto under live user preference', () => {
    setUserReducedMotionFlag(false);
    Object.defineProperty(window, 'matchMedia', {
      configurable: true,
      writable: true,
      value: () =>
        ({
          matches: false,
          media: '(prefers-reduced-motion: reduce)',
          onchange: null,
          addListener: () => undefined,
          removeListener: () => undefined,
          addEventListener: () => undefined,
          removeEventListener: () => undefined,
          dispatchEvent: () => false,
        }) as MediaQueryList,
    });
    expect(scrollBehaviorForMotion()).toBe('smooth');

    setUserReducedMotionFlag(true);
    expect(scrollBehaviorForMotion()).toBe('auto');
  });

  it('apply soft-wipes html attr when preference flips off after OS throw path', () => {
    applyReducedMotionPreference({
      userPrefersReducedMotion: true,
      osPrefersReducedMotion: false,
    });
    expect(document.documentElement.getAttribute(REDUCED_MOTION_ATTR)).toBe(
      'true'
    );

    Object.defineProperty(window, 'matchMedia', {
      configurable: true,
      writable: true,
      value: () => {
        throw new Error('q-mp-590 mql boom wipe');
      },
    });
    // User off + OS option omitted → matchMedia throw soft-fails to false → wipe.
    applyReducedMotionPreference({ userPrefersReducedMotion: false });
    expect(document.documentElement.hasAttribute(REDUCED_MOTION_ATTR)).toBe(
      false
    );
  });
});
