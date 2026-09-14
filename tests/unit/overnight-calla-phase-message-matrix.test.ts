/**
 * Overnight HEAVY after #214/#215 — Calla phase/last-move leftovers. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/calla/types';
import { getPhaseMessage, getLastMoveInfo, makeMove } from '../../src/games/calla/rules';

describe('Overnight calla — phase/last-move', () => {
  it('opening Select; gameOver names winner/tie', () => {
    const s = createInitialState();
    expect(getPhaseMessage(s)).toMatch(/Select/i);
    expect(getPhaseMessage({ ...s, phase: 'animating' })).toMatch(/distribut/i);
    expect(getPhaseMessage({ ...s, phase: 'gameOver', winner: 'player1' })).toMatch(/wins/i);
    expect(getPhaseMessage({ ...s, phase: 'gameOver', winner: 'tie' })).toMatch(/tie/i);
  });

  it('last-move null then populated after sow', () => {
    const s = createInitialState();
    expect(getLastMoveInfo(s)).toBeNull();
    expect(getLastMoveInfo(makeMove(s, 0))).toBeTruthy();
  });
});
