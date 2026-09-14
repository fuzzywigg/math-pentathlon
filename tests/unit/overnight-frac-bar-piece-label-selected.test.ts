/**
 * Overnight TOKENMAXX HEAVY — createFractionBarPiece ignores label; selected CSS unused.
 * After #214/#215. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import {
  createFractionBarPiece,
  getFractionBarStyles,
} from '../../src/core/fractions/fraction-bar-ui';

describe('Overnight frac-bar — piece label ignored + selected CSS', () => {
  it('piece.label is not rendered into DOM', () => {
    const el = createFractionBarPiece({
      id: 'p1',
      fraction: { numerator: 1, denominator: 2 },
      color: '#2196f3',
      label: 'HALF',
    });
    expect(el.textContent).not.toContain('HALF');
    expect(el.getAttribute('data-piece-id')).toBe('p1');
    expect(el.getAttribute('data-fraction')).toBe('1/2');
    expect(el.classList.contains('selected')).toBe(false);
  });

  it('styles declare .selected but factory never applies it', () => {
    const css = getFractionBarStyles();
    expect(css).toContain('.fraction-bar-piece.selected');
    const el = createFractionBarPiece({
      id: 'p2',
      fraction: { numerator: 3, denominator: 4 },
      color: '#e91e63',
    });
    expect(el.className).toBe('fraction-bar-piece');
  });
});
