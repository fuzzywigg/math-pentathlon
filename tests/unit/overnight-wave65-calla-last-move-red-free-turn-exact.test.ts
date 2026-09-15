/**
 * Wave 65 leftover after tip/#315 — Calla getLastMoveInfo Red free-turn exact.
 * Wave41 soft /Free turn/; lock full Red distributed… Free turn! string. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState, type CallaGameState } from '../../src/games/calla/types';
import { makeMove, getLastMoveInfo } from '../../src/games/calla/rules';

describe('Wave 65 calla — last-move red free-turn exact', () => {
  it('P2 pit 2 is exact Red distributed 3 cubes Free turn!', () => {
    const state: CallaGameState = {
      ...createInitialState(),
      currentPlayer: 'player2',
      player2Pits: [0, 0, 3, 0, 0],
      player1Pits: [1, 1, 1, 1, 1],
    };
    const next = makeMove(state, 2);
    expect(next.moveHistory.at(-1)?.gotFreeTurn).toBe(true);
    expect(getLastMoveInfo(next)).toBe(
      'Red distributed 3 cubes Free turn!'
    );
  });
});
