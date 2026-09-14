/**
 * Wave 45 — Contig AI easy teaching with single legal option
 * Distinct leftover vs #204 rules / #207 fab-sum-core / #208 overnight core.
 * Tests-only.
 */

import { describe, it, expect, vi, afterEach } from 'vitest';
import { ContigState, createInitialState } from '../../src/games/contig-60/types';
import { getAIPlacement } from '../../src/games/contig-60/ai';
import { getAllPossibleResults } from '../../src/games/contig-60/types';

afterEach(() => vi.restoreAllMocks());

function claimAllExcept(keep: number[]): ContigState {
  const base = createInitialState();
  const cells = new Map(base.cells);
  for (const [value, cell] of cells) {
    if (!keep.includes(value)) cells.set(value, { ...cell, owner: 'player2' });
  }
  return { ...base, cells };
}

describe('Wave 45 Contig AI — easy single option', () => {
  it('easy returns the only legal placement even when teaching random fires', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.1); // would pick suboptimal if multi
    const dice: [number, number, number] = [2, 3, 4];
    const possible = getAllPossibleResults(dice).map((r) => r.result);
    // Keep only one board result free
    const keep = [possible.find((v) => createInitialState().cells.has(v))!];
    const state: ContigState = {
      ...claimAllExcept(keep),
      phase: 'calculating',
      currentDice: dice,
      currentPlayer: 'player1',
    };
    const move = getAIPlacement(state, 'player1', 'easy');
    expect(move).not.toBeNull();
    expect(move!.value).toBe(keep[0]);
  });
});
