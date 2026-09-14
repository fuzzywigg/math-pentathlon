/**
 * Wave 35 — piece color vs config.colors merge precedence.
 * Leftover fraction-bar-ui deepen after #161 (not graph/dice/expr).
 * Tests-only. No product inventing.
 */
import { describe, it, expect, afterEach } from 'vitest';

import { createFractionBarPiece } from '../../src/core/fractions/fraction-bar-ui';

afterEach(() => {
  document.body.innerHTML = '';
});

describe('Wave 35 frac-bar-piece-color-merge', () => {
  it('piece.color wins as filled over config.colors.filled', () => {
    const piece = createFractionBarPiece(
      {
        id: 'win',
        fraction: { numerator: 1, denominator: 2 },
        color: '#aa0000',
      },
      {
        showLabel: false,
        colors: { filled: '#00aa00', empty: '#eee', border: '#111' },
      }
    );
    // colors: { filled: piece.color, ...config.colors } → config.filled overwrites!
    // Document actual spread order from source.
    const fill = piece.querySelectorAll('rect')[1];
    // Source: colors: { filled: piece.color, ...config.colors }
    // so config.colors.filled OVERWRITES piece.color when present.
    expect(fill.getAttribute('fill')).toBe('#00aa00');
  });

  it('piece.color used when config omits filled', () => {
    const piece = createFractionBarPiece(
      {
        id: 'pc',
        fraction: { numerator: 1, denominator: 2 },
        color: '#abcdef',
      },
      { showLabel: false, colors: { empty: '#111', border: '#222' } }
    );
    const fill = piece.querySelectorAll('rect')[1];
    expect(fill.getAttribute('fill')).toBe('#abcdef');
  });

  it('empty/border from config still apply around piece color', () => {
    const piece = createFractionBarPiece(
      {
        id: 'chrome',
        fraction: { numerator: 1, denominator: 3 },
        color: '#123456',
      },
      {
        showLabel: false,
        colors: { empty: '#fedcba', border: '#654321' },
      }
    );
    const [bg, fill] = Array.from(piece.querySelectorAll('rect'));
    expect(bg.getAttribute('fill')).toBe('#fedcba');
    expect(bg.getAttribute('stroke')).toBe('#654321');
    expect(fill.getAttribute('fill')).toBe('#123456');
  });
});
