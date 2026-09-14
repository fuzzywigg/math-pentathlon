/**
 * Wave 35 — COMMON_FRACTIONS × interactive + piece + comparison handshake.
 * Leftover fraction-bar-ui deepen after #161 (not graph/dice/expr).
 * Tests-only. No product inventing.
 */
import { describe, it, expect, afterEach, vi } from 'vitest';

import {
  createInteractiveFractionBar,
  createFractionBarPiece,
  renderFractionComparison,
  injectFractionBarStyles,
} from '../../src/core/fractions/fraction-bar-ui';
import { COMMON_FRACTIONS, FRACTION_COLORS } from '../../src/core/fractions/types';

afterEach(() => {
  document.body.innerHTML = '';
  document
    .querySelectorAll('#fraction-bar-styles')
    .forEach((el) => el.remove());
  vi.restoreAllMocks();
});

describe('Wave 35 frac-bar-handshake-common', () => {
  it('builds interactive bars for each COMMON_FRACTIONS denom', () => {
    const denoms = [...new Set(COMMON_FRACTIONS.map((f) => f.denominator))];
    for (const d of denoms) {
      const bar = createInteractiveFractionBar(
        { numerator: 1, denominator: d },
        d,
        () => {}
      );
      expect(bar.querySelectorAll('.fraction-segment')).toHaveLength(d);
    }
  });

  it('pieces for COMMON_FRACTIONS carry matching data-fraction', () => {
    for (const frac of COMMON_FRACTIONS.slice(0, 12)) {
      const color = FRACTION_COLORS[frac.denominator] ?? '#607d8b';
      const piece = createFractionBarPiece({
        id: `id-${frac.numerator}-${frac.denominator}`,
        fraction: frac,
        color,
      });
      expect(piece.getAttribute('data-fraction')).toBe(
        `${frac.numerator}/${frac.denominator}`
      );
    }
  });

  it('adjacent COMMON pairs compare without throw and inject styles', () => {
    injectFractionBarStyles();
    for (let i = 0; i < COMMON_FRACTIONS.length - 1; i++) {
      const el = renderFractionComparison(
        COMMON_FRACTIONS[i],
        COMMON_FRACTIONS[i + 1],
        { showLabel: false }
      );
      expect(['<', '=', '>']).toContain(
        el.querySelector('.operator')?.textContent
      );
    }
    expect(document.getElementById('fraction-bar-styles')).toBeTruthy();
  });
});

