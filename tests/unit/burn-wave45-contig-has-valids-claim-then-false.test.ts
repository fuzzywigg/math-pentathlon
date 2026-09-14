/**
 * Wave 45 — Contig hasValidMoves true then false after claiming all dice results
 * Distinct leftover vs #204 rules / #207 fab-sum-core / #208 overnight core.
 * Tests-only.
 */

import { describe, it, expect } from 'vitest';
import { ContigState, createInitialState, getValidPlacements } from '../../src/games/contig-60/types';
import { hasValidMoves } from '../../src/games/contig-60/rules';

describe('Wave 45 Contig — hasValidMoves claim ladder', () => {
  it('flips false after all dice results are claimed', () => {
    const dice: [number, number, number] = [1, 1, 1];
    let state: ContigState = {
      ...createInitialState(),
      phase: 'calculating',
      currentDice: dice,
    };
    expect(hasValidMoves(state)).toBe(true);
    const targets = getValidPlacements(state, dice).map((p) => p.result);
    const cells = new Map(state.cells);
    for (const v of targets) cells.set(v, { ...cells.get(v)!, owner: 'player1' });
    state = { ...state, cells };
    expect(hasValidMoves(state)).toBe(false);
  });
});
