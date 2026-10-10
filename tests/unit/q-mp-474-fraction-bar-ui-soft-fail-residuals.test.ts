/**
 * q-mp-474 — Characterize `fraction-bar-ui` soft-fail residuals (tests-only).
 *
 * Live tip re-measure @ `cursor/mp-tip-post914` (`753052a6`):
 *   `fraction-bar-ui.ts` **562** LOC / **2** dedicated `*fraction-bar*` files
 *     (burn-wave21 + mutation-ui9) before this suite; many `*frac-bar*` leftovers
 *     already exist but no soft-fail residual ticket owns the host.
 *   Coverage (frac-bar + engine r11/r14 suites): stmts/lines/funcs **100%**,
 *     branches **99.1%** (111/112) — sole miss is interactive mouseenter
 *     `if (seg)` at L407 (documented unreachable since r11).
 *
 * Ownership (leave alone; do not edit product / competing suites):
 *   `#874` / engine-coverage-round-11 — `??` color fallbacks + L407 doc
 *   `#911` / `#935` engine r14/r15 — carry-forward L407 doc only
 *   `#714` / q-mp-184 — nullish product clear (src); leave open **contained**
 *   `#814` / mutation-ui9 — DEFAULT height / bg inset geometry
 *
 * This suite owns soft-fail residual contracts still thin after those:
 *   source keep-sites, interactive `colors: undefined` wipe, piece filled wipe,
 *   inject soft-skip when id is claimed, `interactive` config soft no-op,
 *   negative-numerator fill clamp, and L407 unreachable residual pin.
 *
 * Constraints: tests only; no src / AI / scoring / rules / copy-body asserts;
 * Hex Hard stays 450ms; no network.
 */
import { afterEach, describe, expect, it, vi } from 'vitest';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { createFraction } from '../../src/core/fractions/arithmetic';
import {
  createFractionBarPiece,
  createInteractiveFractionBar,
  getFractionColor,
  injectFractionBarStyles,
  renderFractionBar,
  renderFractionComparison,
  renderHorizontalBar,
} from '../../src/core/fractions/fraction-bar-ui';
import type { FractionBarConfig } from '../../src/core/fractions/types';

const FRACTION_BAR_UI_SRC = readFileSync(
  join(
    dirname(fileURLToPath(import.meta.url)),
    '../../src/core/fractions/fraction-bar-ui.ts'
  ),
  'utf8'
);

/** Colors object with explicit undefined keys so deep-merge overwrites defaults. */
const UNDEFINED_COLORS = {
  filled: undefined,
  empty: undefined,
  border: undefined,
} as unknown as FractionBarConfig['colors'];

afterEach(() => {
  document.body.innerHTML = '';
  document
    .querySelectorAll('#fraction-bar-styles')
    .forEach((el) => el.remove());
  vi.restoreAllMocks();
});

// =============================================================================
// 1. Source soft-fail keep-sites
// =============================================================================

describe('q-mp-474 fraction-bar-ui — source soft-fail keep-sites', () => {
  it('keeps catalog color miss fallback to #607d8b', () => {
    expect(FRACTION_BAR_UI_SRC).toMatch(
      /FRACTION_COLORS\[denominator\]\s*\?\?\s*'#607d8b'/
    );
  });

  it('keeps empty/border/filled ?? soft-fail arms on SVG renderers', () => {
    expect(FRACTION_BAR_UI_SRC).toMatch(/colors\.empty\s*\?\?\s*'#e0e0e0'/);
    expect(FRACTION_BAR_UI_SRC).toMatch(/colors\.border\s*\?\?\s*'#333'/);
    expect(FRACTION_BAR_UI_SRC).toMatch(
      /colors\.filled\s*\?\?\s*getFractionColor\(denominator\)/
    );
  });

  it('keeps interactive optional-chain color soft-fail + style default', () => {
    expect(FRACTION_BAR_UI_SRC).toMatch(
      /colors\?\.filled\s*\?\?\s*getFractionColor\(denominator\)/
    );
    expect(FRACTION_BAR_UI_SRC).toMatch(/colors\?\.empty\s*\?\?\s*'#e0e0e0'/);
    expect(FRACTION_BAR_UI_SRC).toMatch(/colors\?\.border\s*\?\?\s*'#333'/);
    expect(FRACTION_BAR_UI_SRC).toMatch(/config\.style\s*\?\?\s*'horizontal'/);
  });

  it('keeps dataTransfer optional soft-set and inject id soft-skip', () => {
    expect(FRACTION_BAR_UI_SRC).toMatch(
      /e\.dataTransfer\?\.setData\('text\/plain',\s*piece\.id\)/
    );
    expect(FRACTION_BAR_UI_SRC).toMatch(
      /if\s*\(\s*!document\.getElementById\(styleId\)\s*\)/
    );
  });

  it('documents unreachable interactive mouseenter segments[j] hole (L407)', () => {
    // segments is densely pushed 0..denominator-1; `if (seg)` false arm never
    // fires without mutating the closed-over array (no public hook). Soft-fail
    // residual characterization owns the doc pin for this host.
    expect(FRACTION_BAR_UI_SRC).toMatch(/const seg = segments\[j\];/);
    expect(FRACTION_BAR_UI_SRC).toMatch(/if \(seg\) \{\s*seg\.style\.opacity/);
    expect(true).toBe(true);
  });
});

// =============================================================================
// 2. Interactive — colors: undefined wipe (optional-chain soft-fail)
// =============================================================================

describe('q-mp-474 fraction-bar-ui — interactive colors undefined wipe', () => {
  it('explicit colors: undefined still builds segments and soft-falls border', () => {
    // Shallow merge `{ ...DEFAULT_CONFIG, ...config }` lets `colors: undefined`
    // wipe the default palette — `colors?.border ?? '#333'` soft-fails.
    const changes: number[] = [];
    const el = createInteractiveFractionBar(
      createFraction(2, 5),
      5,
      (f) => changes.push(f.numerator),
      { colors: undefined, width: 150, height: 28 }
    );
    document.body.appendChild(el);
    const segs = [...el.querySelectorAll('.fraction-segment')];
    expect(segs).toHaveLength(5);
    expect(el.classList.contains('interactive-fraction-bar')).toBe(true);
    expect(el.style.border).toMatch(/rgb\(51,\s*51,\s*51\)|#333/);
    segs[0]?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(changes).toEqual([1]);
  });

  it('UNDEFINED_COLORS on interactive hits the same optional-chain ?? arms', () => {
    const el = createInteractiveFractionBar(createFraction(1, 3), 3, () => {}, {
      colors: UNDEFINED_COLORS,
      width: 90,
      height: 24,
    });
    expect(el.querySelectorAll('.fraction-segment')).toHaveLength(3);
    expect(el.style.border).toMatch(/rgb\(51,\s*51,\s*51\)|#333/);
  });

  it('config.interactive true/false is a soft no-op (factory always interactive)', () => {
    // DEFAULT_CONFIG.interactive is never read by createInteractiveFractionBar;
    // class name is hard-coded. Soft residual: flag does not change chrome.
    const off = createInteractiveFractionBar(
      createFraction(1, 2),
      2,
      () => {},
      { interactive: false }
    );
    const on = createInteractiveFractionBar(createFraction(1, 2), 2, () => {}, {
      interactive: true,
    });
    expect(off.className).toBe('interactive-fraction-bar');
    expect(on.className).toBe('interactive-fraction-bar');
    expect(off.querySelectorAll('.fraction-segment')).toHaveLength(2);
    expect(on.querySelectorAll('.fraction-segment')).toHaveLength(2);
  });
});

// =============================================================================
// 3. Piece — filled wipe soft-fail + dataTransfer residual
// =============================================================================

describe('q-mp-474 fraction-bar-ui — piece filled wipe + drag soft-fail', () => {
  it('config.colors.filled undefined wipes piece.color → palette fallback', () => {
    // createFractionBarPiece merges `{ filled: piece.color, ...config.colors }`;
    // an explicit undefined filled key soft-fails render into getFractionColor.
    const piece = createFractionBarPiece(
      {
        id: 'wipe-filled',
        fraction: createFraction(1, 4),
        color: '#ff00aa',
      },
      {
        showLabel: false,
        style: 'horizontal',
        colors: UNDEFINED_COLORS,
      }
    );
    const rects = [...piece.querySelectorAll('rect')];
    expect(rects.length).toBeGreaterThanOrEqual(2);
    expect(rects[0]?.getAttribute('fill')).toBe('#e0e0e0');
    expect(rects[0]?.getAttribute('stroke')).toBe('#333');
    expect(rects[1]?.getAttribute('fill')).toBe(getFractionColor(4));
    expect(rects[1]?.getAttribute('fill')).not.toBe('#ff00aa');
  });

  it('dragstart soft-succeeds when dataTransfer is absent (no throw)', () => {
    const piece = createFractionBarPiece({
      id: 'no-dt',
      fraction: createFraction(1, 2),
      color: '#2196f3',
    });
    // Omit dataTransfer entirely (not null) — `?.setData` soft no-op.
    const start = new Event('dragstart', { bubbles: true }) as DragEvent;
    expect(() => piece.dispatchEvent(start)).not.toThrow();
    expect(piece.style.opacity).toBe('0.5');
    piece.dispatchEvent(new Event('dragend'));
    expect(piece.style.opacity).toBe('1');
  });
});

// =============================================================================
// 4. injectFractionBarStyles — claimed-id soft-skip
// =============================================================================

describe('q-mp-474 fraction-bar-ui — inject claimed-id soft-skip', () => {
  it('skips inject when #fraction-bar-styles already exists (non-style host)', () => {
    const claim = document.createElement('div');
    claim.id = 'fraction-bar-styles';
    document.head.appendChild(claim);

    injectFractionBarStyles();

    // Soft-fail: early return leaves the claimed node; no extra <style> added.
    expect(document.querySelectorAll('#fraction-bar-styles')).toHaveLength(1);
    expect(document.querySelector('style#fraction-bar-styles')).toBeNull();
    expect(claim.tagName.toLowerCase()).toBe('div');
    expect(claim.textContent).toBe('');
  });

  it('injects a real style tag when the id is free, then soft-skips repeats', () => {
    injectFractionBarStyles();
    const first = document.getElementById('fraction-bar-styles');
    expect(first?.tagName.toLowerCase()).toBe('style');
    expect((first?.textContent ?? '').length).toBeGreaterThan(0);
    expect(first?.textContent).toContain('.fraction-bar');

    injectFractionBarStyles();
    expect(document.querySelectorAll('#fraction-bar-styles')).toHaveLength(1);
    expect(document.getElementById('fraction-bar-styles')).toBe(first);
  });
});

// =============================================================================
// 5. Render soft-clamps + style default residual
// =============================================================================

describe('q-mp-474 fraction-bar-ui — fill clamp + style soft-default', () => {
  it('signed input soft-ignores isNegative — fill uses abs simplified numerator', () => {
    // simplify() returns positive numerator + isNegative; renderers destructure
    // only numerator/denominator, so sign is a soft no-op for fill geometry.
    const negRaw = renderHorizontalBar(
      { numerator: -3, denominator: 4 },
      { showLabel: false, colors: UNDEFINED_COLORS, width: 100, height: 20 }
    );
    const pos = renderHorizontalBar(
      { numerator: 3, denominator: 4 },
      { showLabel: false, colors: UNDEFINED_COLORS, width: 100, height: 20 }
    );
    const flagged = renderHorizontalBar(
      { numerator: 3, denominator: 4, isNegative: true },
      { showLabel: false, colors: UNDEFINED_COLORS, width: 100, height: 20 }
    );
    const fillWidth = (svg: SVGSVGElement) =>
      [...svg.querySelectorAll('rect')][1]?.getAttribute('width');
    expect(fillWidth(negRaw)).toBe(fillWidth(pos));
    expect(fillWidth(flagged)).toBe(fillWidth(pos));
    expect(Number(fillWidth(pos))).toBeGreaterThan(0);

    // Zero numerator still soft-clamps to no fill rect (fillRatio > 0 false).
    const zero = renderHorizontalBar(
      { numerator: 0, denominator: 4 },
      { showLabel: false, colors: UNDEFINED_COLORS, width: 100, height: 20 }
    );
    expect(zero.querySelectorAll('rect')).toHaveLength(1);
    expect(zero.querySelector('rect')?.getAttribute('fill')).toBe('#e0e0e0');
  });

  it('explicit style: undefined soft-defaults to horizontal', () => {
    const svg = renderFractionBar(createFraction(1, 3), {
      style: undefined,
      showLabel: false,
      colors: UNDEFINED_COLORS,
    });
    expect(svg.classList.contains('fraction-bar-horizontal')).toBe(true);
    expect(svg.classList.contains('fraction-bar-vertical')).toBe(false);
  });

  it('comparison soft-equals after different representations (structural)', () => {
    // Operator chrome only — no player-facing copy pin on fraction labels.
    const wrap = renderFractionComparison(
      createFraction(1, 2),
      createFraction(2, 4),
      { showLabel: false, colors: UNDEFINED_COLORS }
    );
    expect(wrap.classList.contains('fraction-comparison')).toBe(true);
    expect(wrap.querySelector('.operator')?.textContent).toBe('=');
    expect(wrap.querySelectorAll('svg.fraction-bar')).toHaveLength(2);
  });
});
