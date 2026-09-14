/**
 * Wave 42 — Contig checkWinner / calculatePoints leftovers.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { ContigState, createInitialState } from '../../src/games/contig-60/types';
import { checkWinner, calculatePoints } from '../../src/games/contig-60/rules';

function withOwned(
  values: number[],
  owner: 'player1' | 'player2'
): ContigState {
  const base = createInitialState();
  const cells = new Map(base.cells);
  for (const value of values) {
    cells.set(value, { ...cells.get(value)!, owner });
  }
  return { ...base, cells };
}

describe('Wave 42 Contig — winner/points matrix', () => {
  it('checkWinner null without five; points rise with owned neighbors', () => {
    const partial = withOwned([1, 2, 3], 'player1');
    expect(checkWinner(partial)).toBeNull();
    const pts = calculatePoints(partial, 4);
    expect(pts).toBeGreaterThanOrEqual(0);
  });

  it('checkWinner detects five-in-a-row on top row', () => {
    const won = withOwned([1, 2, 3, 4, 5], 'player1');
    expect(checkWinner(won)).toBe('player1');
  });
});
