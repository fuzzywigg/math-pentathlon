/**
 * Wave 43 — Juggle placeShape history chosenDie always die0 leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { SIMPLE_SHAPES } from '../../src/core/polyomino/types';
import {
  createInitialState,
  selectDie,
  placeShape,
} from '../../src/games/juggle/rules';

const monomino = SIMPLE_SHAPES.find((s) => s.id === 'monomino')!;

describe('Wave 43 juggle — chosenDie history quirk', () => {
  it('records currentDice[0] even when die index 1 auto-places monomino', () => {
    const selecting = {
      ...createInitialState(),
      phase: 'selectingShape' as const,
      currentDice: [4, 1] as [number, number],
    };
    const placing = selectDie(selecting, 1);
    expect(placing.phase).toBe('placing');
    expect(placing.selectedShape?.id).toBe(monomino.id);
    const next = placeShape(placing, { row: 0, col: 0 });
    expect(next.moveHistory).toHaveLength(1);
    expect(next.moveHistory[0].chosenDie).toBe(4);
    expect(next.moveHistory[0].shapeId).toBe('monomino');
  });
});
