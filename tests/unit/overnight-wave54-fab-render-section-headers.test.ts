/**
 * Wave 54 leftover after #240 — Fab pool / answer section headers. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/fab-a-diffy/rules';
import {
  renderFractionBarPool,
  renderAnswerBoard,
} from '../../src/games/fab-a-diffy/board-ui';

describe('Wave 54 fab — section headers', () => {
  it('pool says Fraction Bars; board says Answer Bars', () => {
    const s = createInitialState();
    const pool = renderFractionBarPool(s, () => undefined);
    const board = renderAnswerBoard(s, () => undefined);
    expect(pool.querySelector('.fab-section-header')?.textContent).toBe('Fraction Bars');
    expect(board.querySelector('.fab-section-header')?.textContent).toBe('Answer Bars');
  });
});
