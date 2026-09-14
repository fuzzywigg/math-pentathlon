/**
 * Wave 43 — fill slot1 then slot0 completes leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createRod, createBoxId, type RamrodState, type SumBox } from '../../src/games/ramrod/types';
import { isValidPlacement, placeRod } from '../../src/games/ramrod/rules';

describe('Wave 43 ramrod — slot1 first complete', () => {
  it('slot1 then matching slot0 completes box', () => {
    const rodA = createRod('ra', 4);
    const rodB = createRod('rb', 3);
    rodA.owner = 'player1';
    rodB.owner = 'player1';
    const boxId = createBoxId(0, 0);
    const box: SumBox = {
      id: boxId,
      targetSum: 7,
      row: 0,
      col: 0,
      rods: [null, null],
      completedBy: null,
    };
    let state: RamrodState = {
      boxes: new Map([[boxId, box]]),
      rods: new Map([
        ['ra', rodA],
        ['rb', rodB],
      ]),
      playerRods: { player1: ['ra', 'rb'], player2: [] },
      currentPlayer: 'player1',
      selectedRod: 'ra',
      phase: 'placingRod',
      scores: { player1: 0, player2: 0 },
      winner: null,
      moveHistory: [],
    };
    expect(isValidPlacement(state, 'ra', boxId, 1)).toBe(true);
    state = placeRod(state, boxId, 1);
    expect(state.boxes.get(boxId)!.rods[1]?.id).toBe('ra');
    // switch back artificially for second place
    state = {
      ...state,
      currentPlayer: 'player1',
      selectedRod: 'rb',
      phase: 'placingRod',
      playerRods: { player1: ['rb'], player2: [] },
    };
    expect(isValidPlacement(state, 'rb', boxId, 0)).toBe(true);
    const done = placeRod(state, boxId, 0);
    expect(done.boxes.get(boxId)!.completedBy).toBe('player1');
    expect(done.scores.player1).toBe(7);
  });
});
