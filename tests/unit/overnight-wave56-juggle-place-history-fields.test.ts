/**
 * Wave 56 leftover after #256 — Juggle placeShape chosenDie/dice + seat flip.
 * Complements wave48 shapeId/position fields with die + handoff leftovers. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import {
  createInitialState,
  selectDie,
  placeShape,
} from '../../src/games/juggle/rules';

describe('Wave 56 juggle — place history fields', () => {
  it('records chosenDie/shapeId/position and flips seat after place', () => {
    const placing = selectDie(
      {
        ...createInitialState(),
        phase: 'selectingShape',
        currentDice: [1, 2],
      },
      0
    );
    const next = placeShape(placing, { row: 4, col: 4 });
    expect(next.moveHistory).toHaveLength(1);
    const move = next.moveHistory[0];
    expect(move.player).toBe('player1');
    expect(move.chosenDie).toBe(1);
    expect(move.dice).toEqual([1, 2]);
    expect(move.shapeId).toBeTruthy();
    expect(move.position).toEqual({ row: 4, col: 4 });
    expect(move.rotation).toBe(0);
    expect(move.flipped).toBe(false);
    expect(move.moveNumber).toBe(1);
    expect(next.currentPlayer).toBe('player2');
    expect(next.phase).toBe('rolling');
    expect(next.currentDice).toBeNull();
  });
});
