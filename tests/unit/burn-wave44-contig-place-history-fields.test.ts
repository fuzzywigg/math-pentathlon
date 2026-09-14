/**
 * Wave 44 — Contig placeChip history field leftovers.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/contig-60/types';
import { placeChip } from '../../src/games/contig-60/rules';

describe('Wave 44 Contig — place history fields', () => {
  it('records dice expression result and moveNumber', () => {
    const next = placeChip(
      {
        ...createInitialState(),
        phase: 'calculating',
        currentDice: [2, 3, 4],
      },
      24,
      '2*3*4'
    );
    const move = next.moveHistory[0];
    expect(move.dice).toEqual([2, 3, 4]);
    expect(move.expression).toBe('2*3*4');
    expect(move.result).toBe(24);
    expect(move.moveNumber).toBe(1);
    expect(move.player).toBe('player1');
  });
});
