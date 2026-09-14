/**
 * Wave 43 — both hands empty score settle leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createRod, createBoxId, type RamrodState, type SumBox } from '../../src/games/ramrod/types';
import { placeRod } from '../../src/games/ramrod/rules';

function settleState(scores: { player1: number; player2: number }) {
  const rodA = createRod('ra', 2);
  const rodB = createRod('rb', 3);
  rodA.owner = 'player1';
  rodB.owner = 'player1';
  const boxId = createBoxId(0, 0);
  const box: SumBox = {
    id: boxId,
    targetSum: 5,
    row: 0,
    col: 0,
    rods: [rodA, null],
    completedBy: null,
  };
  rodA.position = { boxId, slot: 0 };
  return {
    boxes: new Map([[boxId, box]]),
    rods: new Map([
      ['ra', rodA],
      ['rb', rodB],
    ]),
    playerRods: { player1: ['rb'], player2: [] },
    currentPlayer: 'player1' as const,
    selectedRod: 'rb',
    phase: 'placingRod' as const,
    scores,
    winner: null,
    moveHistory: [],
  } satisfies RamrodState;
}

describe('Wave 43 ramrod — both hands empty settle', () => {
  it('higher score wins when both hands empty after place', () => {
    const next = placeRod(settleState({ player1: 10, player2: 3 }), createBoxId(0, 0), 1);
    expect(next.phase).toBe('gameOver');
    expect(next.winner).toBe('player1');
  });

  it('equal scores → winner null when both empty', () => {
    // After place, P1 gets +5 → need pre-scores such that final equal
    // P1 starts 3, P2 8; capture +5 → P1=8 P2=8
    const next = placeRod(settleState({ player1: 3, player2: 8 }), createBoxId(0, 0), 1);
    expect(next.phase).toBe('gameOver');
    expect(next.winner).toBeNull();
  });
});
