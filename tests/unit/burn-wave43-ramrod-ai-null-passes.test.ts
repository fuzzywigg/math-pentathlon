/**
 * Wave 43 — no moves AI null / execute ≡ pass leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createRod, createBoxId, type RamrodState, type SumBox } from '../../src/games/ramrod/types';
import { passTurn, hasValidMoves } from '../../src/games/ramrod/rules';
import { getAIMove, executeAITurn } from '../../src/games/ramrod/ai';

describe('Wave 43 ramrod — AI null passes', () => {
  it('no moves → getAIMove null and executeAITurn ≡ passTurn', () => {
    const rod = createRod('big', 10);
    rod.owner = 'player1';
    const boxId = createBoxId(0, 0);
    const box: SumBox = {
      id: boxId,
      targetSum: 5,
      row: 0,
      col: 0,
      rods: [null, null],
      completedBy: null,
    };
    const state: RamrodState = {
      boxes: new Map([[boxId, box]]),
      rods: new Map([['big', rod]]),
      playerRods: { player1: ['big'], player2: [] },
      currentPlayer: 'player1',
      selectedRod: null,
      phase: 'selectingRod',
      scores: { player1: 0, player2: 0 },
      winner: null,
      moveHistory: [],
    };
    expect(hasValidMoves(state)).toBe(false);
    expect(getAIMove(state, 'player1', 'hard')).toBeNull();
    expect(executeAITurn(state, 'player1', 'hard')).toEqual(passTurn(state));
  });
});
