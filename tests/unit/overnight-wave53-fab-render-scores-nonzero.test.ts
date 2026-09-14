/**
 * Wave 53 leftover after #235 — Fab nonzero scores. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/fab-a-diffy/rules';
import { renderScores } from '../../src/games/fab-a-diffy/board-ui';

describe('Wave 53 fab — scores nonzero', () => {
  it('renders nonzero score values on p1/p2 seats', () => {
    const state = { ...createInitialState(), scores: { player1: 3, player2: 5 } };
    const el = renderScores(state);
    expect(el.querySelector('.fab-score-p1 .fab-score-value')?.textContent).toBe('3');
    expect(el.querySelector('.fab-score-p2 .fab-score-value')?.textContent).toBe('5');
    expect(el.textContent).toMatch(/Blue/);
    expect(el.textContent).toMatch(/Red/);
  });
});
