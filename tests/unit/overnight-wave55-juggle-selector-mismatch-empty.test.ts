/**
 * Wave 55 leftover after #250 — Juggle selector empty when category misses dice.
 * Distinct from wave48 empty without category. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/juggle/rules';
import { renderShapeSelector } from '../../src/games/juggle/board-ui';

describe('Wave 55 juggle — selector mismatch empty', () => {
  it('returns chrome-only container when selectedCategory is not on the dice', () => {
    const el = renderShapeSelector(
      {
        ...createInitialState(),
        phase: 'selectingShape',
        currentDice: [1, 2],
        selectedCategory: 'pentomino',
      },
      () => undefined
    );
    expect(el.className).toBe('juggle-shape-selector');
    expect(el.querySelector('.juggle-shape-header')).toBeNull();
    expect(el.querySelectorAll('.juggle-shape-option').length).toBe(0);
  });
});
