/**
 * Wave 43 — TARGET_SCORE win leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createRod, createBoxId, CONFIG, type RamrodState, type SumBox } from '../../src/games/ramrod/types';
import { placeRod } from '../../src/games/ramrod/rules';

describe('Wave 43 ramrod — target score win', () => {
  it('completing box that pushes score ≥ TARGET_SCORE ends game', () => {
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
      rods: [rodA, null],
      completedBy: null,
    };
    rodA.position = { boxId, slot: 0 };
    const state = {
      boxes: new Map([[boxId, box]]),
      rods: new Map([
        ['ra', rodA],
        ['rb', rodB],
      ]),
      playerRods: { player1: ['rb'], player2: [] },
      currentPlayer: 'player1' as const,
      selectedRod: 'rb',
      phase: 'placingRod' as const,
      scores: { player1: CONFIG.TARGET_SCORE - 7, player2: 0 },
      winner: null,
      moveHistory: [],
    } satisfies RamrodState;
    const next = placeRod(state, boxId, 1);
    expect(next.phase).toBe('gameOver');
    expect(next.winner).toBe('player1');
    expect(next.scores.player1).toBeGreaterThanOrEqual(CONFIG.TARGET_SCORE);
  });
});
