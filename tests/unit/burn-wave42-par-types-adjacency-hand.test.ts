/**
 * Wave 42 — Par-55 board adjacency + hand deal invariants. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState, getValidPlacements } from '../../src/games/par-55/rules';
import {
  getOpponent,
  countMatchingAttributes,
  createBlockSet,
  CONFIG,
} from '../../src/games/par-55/types';

describe('Wave 42 par-55 — adjacency / hands', () => {
  it('opening hands sized; starter occupies one base', () => {
    const s = createInitialState();
    expect(s.hands.player1).toHaveLength(CONFIG.HAND_SIZE);
    expect(s.hands.player2).toHaveLength(CONFIG.HAND_SIZE);
    const occupied = [...s.bases.values()].filter((b) => b.block);
    expect(occupied).toHaveLength(1);
    expect(getValidPlacements(s).length).toBeGreaterThan(0);
  });

  it('every base lists only existing adjacents', () => {
    const s = createInitialState();
    for (const base of s.bases.values()) {
      for (const adj of base.adjacentBases) {
        expect(s.bases.has(adj)).toBe(true);
      }
      expect(base.adjacentBases.length).toBeGreaterThan(0);
      expect(base.adjacentBases.length).toBeLessThanOrEqual(6);
    }
  });

  it('block set + attribute match + opponent', () => {
    const blocks = createBlockSet();
    expect(blocks.length).toBeGreaterThan(CONFIG.HAND_SIZE * 2);
    const a = blocks[0];
    const same = countMatchingAttributes(a, { ...a, id: 'x' });
    expect(same.length).toBe(4);
    expect(getOpponent('player1')).toBe('player2');
  });
});
