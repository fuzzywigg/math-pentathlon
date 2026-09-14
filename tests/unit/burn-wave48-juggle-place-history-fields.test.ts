/**
 * Wave 48 — Juggle placeShape history fields leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState, selectDie, placeShape } from '../../src/games/juggle/rules';

describe('Wave 48 juggle — place history fields', () => {
  it('records shapeId position rotation flipped moveNumber', () => {
    const selecting = {
      ...createInitialState(),
      phase: 'selectingShape' as const,
      currentDice: [1, 2] as [number, number],
    };
    const placing = selectDie(selecting, 0);
    const next = placeShape(placing, { row: 0, col: 0 });
    expect(next.moveHistory).toHaveLength(1);
    const m = next.moveHistory[0];
    expect(m.shapeId).toBeTruthy();
    expect(m.position).toEqual({ row: 0, col: 0 });
    expect(m.rotation).toBe(0);
    expect(m.flipped).toBe(false);
    expect(m.moveNumber).toBe(1);
    expect(m.player).toBe('player1');
  });
});
