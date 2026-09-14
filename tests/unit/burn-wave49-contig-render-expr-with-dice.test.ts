/**
 * Wave 49 leftover after #221/#226/#227 — Contig expression options when dice set. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/contig-60/types';
import { renderExpressionSelector } from '../../src/games/contig-60/board-ui';

describe('Wave 49 contig — expr with dice', () => {
  it('lists options or pass chrome for a mid roll', () => {
    const state = {
      ...createInitialState(),
      currentDice: [2, 3, 4] as [number, number, number],
      phase: 'calculating' as const,
    };
    const el = renderExpressionSelector(state, () => undefined, () => undefined);
    expect(el.classList.contains('contig-expressions')).toBe(true);
    const options = el.querySelectorAll('.contig-expr-option');
    const pass = el.querySelector('.contig-pass-btn');
    expect(options.length > 0 || !!pass).toBe(true);
  });
});
