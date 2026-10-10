/**
 * q-mp-634 — Close `fraction-bar-ui` residual gaps (tests-only).
 *
 * Live tip re-measure (`cursor/mp-tip-post1023` @ `166d132d`):
 *   `src/core/fractions/fraction-bar-ui.ts` **562** LOC
 *   Under verification glob `tests/unit/*fraction-bar*` (3 files before this):
 *     **91.92%** lines (148/161) / **82.14%** branches (92/112)
 *   Uncovered clusters under that glob: horizontal `labelPosition: 'inside'`
 *     (L127/137–138); vertical `showLabel`+`right` (L232/241–242); circle
 *     full-fill `fillRatio >= 1` (L304/310); interactive mouseenter/leave
 *     (L405–408, L414). Plus soft-fail `??` / dead-label arms on vertical
 *     and circle that only `*frac-bar*` overnight suites hit outside the glob.
 *
 * Ownership (leave open; do not edit product / competing suites):
 *   `#946` / q-mp-474 — soft-fail characterization (already tip-folded via
 *     post914; stale draft remains **contained**)
 *   `#874` / engine-coverage-round-11 — color `??` leftovers outside this
 *     verification glob — leave **contained**
 *   `#814` / mutation-ui9 — DEFAULT height / bg inset — leave **contained**
 *
 * Constraints (binding screen): tests only; ZERO `src/` edits; pin CURRENT
 * UI chrome behavior only — no arithmetic/scoring asserts, no AI move-choice
 * / timing, no player-facing copy / aria / label text pins; no ratchet JSON;
 * Hex Hard 450ms untouched; no network.
 */
import { afterEach, describe, expect, it, vi } from 'vitest';

import { createFraction } from '../../src/core/fractions/arithmetic';
import {
  createInteractiveFractionBar,
  getFractionColor,
  renderCircleBar,
  renderFractionBar,
  renderHorizontalBar,
  renderVerticalBar,
} from '../../src/core/fractions/fraction-bar-ui';
import type { FractionBarConfig } from '../../src/core/fractions/types';

/** Colors object with explicit undefined keys so deep-merge overwrites defaults. */
const UNDEFINED_COLORS = {
  filled: undefined,
  empty: undefined,
  border: undefined,
} as unknown as FractionBarConfig['colors'];

afterEach(() => {
  document.body.innerHTML = '';
  vi.restoreAllMocks();
});

// =============================================================================
// 1. Horizontal — inside label + dead labelPosition residual
// =============================================================================

describe('q-mp-634 fraction-bar-ui — horizontal labelPosition residuals', () => {
  it('labelPosition inside appends a centered text node inside the bar', () => {
    // L125–138: showLabel + inside creates the in-bar <text> (not below bump).
    const svg = renderHorizontalBar(createFraction(1, 2), {
      showLabel: true,
      labelPosition: 'inside',
      width: 100,
      height: 40,
      colors: UNDEFINED_COLORS,
    });
    // No +25 height bump when label is inside (below-only).
    expect(svg.getAttribute('height')).toBe('40');
    const text = svg.querySelector('text');
    expect(text).toBeTruthy();
    expect(text?.getAttribute('text-anchor')).toBe('middle');
    expect(text?.getAttribute('dominant-baseline')).toBe('central');
    expect(text?.getAttribute('x')).toBe('50');
    expect(text?.getAttribute('y')).toBe('20');
    // Structure only — no fraction-label string pin.
    expect((text?.textContent ?? '').length).toBeGreaterThan(0);
  });

  it('labelPosition right with showLabel is a soft no-op (no text, no height bump)', () => {
    // L139 else-if false: neither inside nor below → no label chrome.
    const svg = renderHorizontalBar(createFraction(1, 3), {
      showLabel: true,
      labelPosition: 'right',
      width: 90,
      height: 30,
    });
    expect(svg.getAttribute('height')).toBe('30');
    expect(svg.querySelector('text')).toBeNull();
  });
});

// =============================================================================
// 2. Vertical — right label + color soft-falls + edge geometry
// =============================================================================

describe('q-mp-634 fraction-bar-ui — vertical residual branches', () => {
  it('showLabel + labelPosition right widens svg and places a text node', () => {
    // L231–242: vertical right label (+40 width) — chrome geometry only.
    const svg = renderVerticalBar(createFraction(2, 5), {
      showLabel: true,
      labelPosition: 'right',
      width: 40,
      height: 100,
      colors: UNDEFINED_COLORS,
    });
    expect(svg.classList.contains('fraction-bar-vertical')).toBe(true);
    expect(svg.getAttribute('width')).toBe('80');
    expect(svg.getAttribute('height')).toBe('100');
    const text = svg.querySelector('text');
    expect(text).toBeTruthy();
    expect(text?.getAttribute('text-anchor')).toBe('start');
    expect(text?.getAttribute('x')).toBe('45');
    expect((text?.textContent ?? '').length).toBeGreaterThan(0);
  });

  it('vertical UNDEFINED_COLORS hits empty/border/filled soft-fail arms', () => {
    const svg = renderVerticalBar(createFraction(1, 4), {
      showLabel: false,
      width: 28,
      height: 80,
      colors: UNDEFINED_COLORS,
    });
    const rects = [...svg.querySelectorAll('rect')];
    expect(rects.length).toBeGreaterThanOrEqual(2);
    expect(rects[0]?.getAttribute('fill')).toBe('#e0e0e0');
    expect(rects[0]?.getAttribute('stroke')).toBe('#333');
    expect(rects[1]?.getAttribute('fill')).toBe(getFractionColor(4));
  });

  it('vertical zero numerator skips fill; den=1 skips division lines', () => {
    // L199 false (fillRatio > 0); L214 false (denominator > 1).
    const zero = renderVerticalBar(createFraction(0, 1), {
      showLabel: false,
      width: 24,
      height: 60,
      colors: UNDEFINED_COLORS,
    });
    expect(zero.querySelectorAll('rect')).toHaveLength(1);
    expect(zero.querySelectorAll('line')).toHaveLength(0);
  });

  it('vertical showLabel with non-right position omits text and width bump', () => {
    // L231 false: showLabel true but labelPosition below → no right chrome.
    const svg = renderVerticalBar(createFraction(1, 2), {
      showLabel: true,
      labelPosition: 'below',
      width: 30,
      height: 70,
    });
    expect(svg.getAttribute('width')).toBe('30');
    expect(svg.querySelector('text')).toBeNull();
  });
});

// =============================================================================
// 3. Circle — full-fill arm + color soft-falls + edge geometry
// =============================================================================

describe('q-mp-634 fraction-bar-ui — circle residual branches', () => {
  it('improper fraction takes the full-fill circle arm (fillRatio >= 1)', () => {
    // L303–310: fillRatio >= 1 appends a filled <circle>, not a pie <path>.
    const svg = renderCircleBar(createFraction(5, 2), {
      showLabel: false,
      width: 80,
      height: 80,
      colors: UNDEFINED_COLORS,
    });
    expect(svg.classList.contains('fraction-bar-circle')).toBe(true);
    expect(svg.querySelector('path')).toBeNull();
    const circles = [...svg.querySelectorAll('circle')];
    expect(circles.length).toBeGreaterThanOrEqual(2);
    expect(circles[1]?.getAttribute('fill')).toBe(getFractionColor(2));
  });

  it('exact-unity fraction also takes the full-fill circle arm', () => {
    const svg = renderCircleBar(createFraction(4, 4), {
      showLabel: false,
      width: 64,
      height: 64,
      colors: { filled: '#112233', empty: '#eeeeee', border: '#444444' },
    });
    expect(svg.querySelector('path')).toBeNull();
    const fill = [...svg.querySelectorAll('circle')][1];
    expect(fill?.getAttribute('fill')).toBe('#112233');
  });

  it('circle UNDEFINED_COLORS hits empty/border soft-fail on bg + pie slice', () => {
    // Partial fill so pie path arm runs with soft-fail palette.
    const svg = renderCircleBar(createFraction(1, 3), {
      showLabel: false,
      width: 70,
      height: 70,
      colors: UNDEFINED_COLORS,
    });
    const bg = svg.querySelector('circle');
    expect(bg?.getAttribute('fill')).toBe('#e0e0e0');
    expect(bg?.getAttribute('stroke')).toBe('#333');
    const path = svg.querySelector('path');
    expect(path).toBeTruthy();
    expect(path?.getAttribute('fill')).toBe(getFractionColor(3));
  });

  it('circle den=1 skips division lines; showLabel non-below omits text', () => {
    const svg = renderCircleBar(createFraction(0, 1), {
      showLabel: true,
      labelPosition: 'inside',
      width: 50,
      height: 50,
      colors: UNDEFINED_COLORS,
    });
    expect(svg.querySelectorAll('line')).toHaveLength(0);
    expect(svg.querySelector('text')).toBeNull();
    // Zero fill: only the background circle.
    expect(svg.querySelectorAll('circle')).toHaveLength(1);
    expect(svg.querySelector('path')).toBeNull();
  });
});

// =============================================================================
// 4. Interactive — mouseenter / mouseleave residual (L405–408, L414)
// =============================================================================

describe('q-mp-634 fraction-bar-ui — interactive hover residual branches', () => {
  it('mouseenter highlights prefix segments to opacity 0.8', () => {
    // L403–409: hover walks 0..i and sets opacity when segments[j] is present.
    // L407 false arm remains unreachable without mutating the closed-over
    // array (owned/documented by tip-folded soft-fail q-mp-474 / #946).
    const bar = createInteractiveFractionBar(
      createFraction(1, 5),
      5,
      () => {},
      {
        width: 150,
        height: 28,
        colors: UNDEFINED_COLORS,
      }
    );
    document.body.appendChild(bar);
    const segments = [
      ...bar.querySelectorAll('.fraction-segment'),
    ] as HTMLElement[];
    expect(segments).toHaveLength(5);

    segments[2].dispatchEvent(new Event('mouseenter'));
    expect(segments[0].style.opacity).toBe('0.8');
    expect(segments[1].style.opacity).toBe('0.8');
    expect(segments[2].style.opacity).toBe('0.8');
    expect(segments[3].style.opacity).toBe('');
    expect(segments[4].style.opacity).toBe('');
  });

  it('mouseleave restores every segment opacity to 1', () => {
    // L413–414: leave forEach resets opacity.
    const bar = createInteractiveFractionBar(createFraction(0, 4), 4, () => {});
    const segments = [
      ...bar.querySelectorAll('.fraction-segment'),
    ] as HTMLElement[];
    segments[1].dispatchEvent(new Event('mouseenter'));
    expect(segments[0].style.opacity).toBe('0.8');
    expect(segments[1].style.opacity).toBe('0.8');

    segments[1].dispatchEvent(new Event('mouseleave'));
    for (const s of segments) {
      expect(s.style.opacity).toBe('1');
    }
  });

  it('hover then click still fires onChange with clicked numerator', () => {
    // UI chrome only — onChange payload shape already covered elsewhere;
    // re-hit click after hover so hover handlers do not break the click arm.
    const seen: number[] = [];
    const bar = createInteractiveFractionBar(
      createFraction(0, 3),
      3,
      (f) => seen.push(f.numerator),
      { width: 90, height: 24 }
    );
    const segments = [
      ...bar.querySelectorAll('.fraction-segment'),
    ] as HTMLElement[];
    segments[1].dispatchEvent(new Event('mouseenter'));
    segments[1].click();
    segments[1].dispatchEvent(new Event('mouseleave'));
    expect(seen).toEqual([2]);
    expect(segments[1].style.opacity).toBe('1');
  });
});

// =============================================================================
// 5. Dispatch keep — style residual still routes under this glob
// =============================================================================

describe('q-mp-634 fraction-bar-ui — style dispatch residual keep', () => {
  it('renderFractionBar vertical/circle still dispatch after residual suites', () => {
    const v = renderFractionBar(createFraction(1, 2), {
      style: 'vertical',
      showLabel: true,
      labelPosition: 'right',
      colors: UNDEFINED_COLORS,
    });
    expect(v.classList.contains('fraction-bar-vertical')).toBe(true);
    expect(v.querySelector('text')).toBeTruthy();

    const c = renderFractionBar(createFraction(3, 2), {
      style: 'circle',
      showLabel: false,
      colors: UNDEFINED_COLORS,
    });
    expect(c.classList.contains('fraction-bar-circle')).toBe(true);
    expect(c.querySelector('path')).toBeNull();
    expect(c.querySelectorAll('circle').length).toBeGreaterThanOrEqual(2);
  });
});
