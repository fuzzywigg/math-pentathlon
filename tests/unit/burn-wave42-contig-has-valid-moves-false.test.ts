/**
 * Wave 42 — Contig hasValidMoves false when all results owned.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';
import {
  ContigState,
  createInitialState,
  getValidPlacements,
} from '../../src/games/contig-60/types';
import { hasValidMoves } from '../../src/games/contig-60/rules';

describe('Wave 42 Contig — hasValidMoves false', () => {
  it('false when every reachable result is owned', () => {
    const dice: [number, number, number] = [1, 1, 2];
    const probe: ContigState = {
      ...createInitialState(),
      phase: 'calculating',
      currentDice: dice,
    };
    const results = getValidPlacements(probe, dice).map((p) => p.result);
    const cells = new Map(probe.cells);
    for (const v of results) {
      cells.set(v, { ...cells.get(v)!, owner: 'player2' });
    }
    const state = { ...probe, cells };
    expect(hasValidMoves(state)).toBe(false);
  });
});
