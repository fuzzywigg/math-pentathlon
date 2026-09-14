/**
 * Wave 42 — Kwatro-Sinko board opening invariants (nodes). Tests-only.
 */
import { describe, it, expect } from 'vitest';

import { createInitialState } from '../../src/games/kwatro-sinko/rules';

describe('Wave 42 kwatro-sinko — opening board nodes', () => {
  it('createInitialState exposes exactly 25 nodes in a 5x5 grid', () => {
    const { nodes } = createInitialState();
    expect(nodes.size).toBe(25);
    for (let row = 0; row < 5; row++) {
      for (let col = 0; col < 5; col++) {
        expect(nodes.has(`n${row}-${col}`)).toBe(true);
      }
    }
  });

  it('top and bottom rows are numbered start rows; middle rows are not', () => {
    const { nodes } = createInitialState();
    for (let col = 0; col < 5; col++) {
      expect(nodes.get(`n0-${col}`)?.isNumbered).toBe(true);
      expect(nodes.get(`n4-${col}`)?.isNumbered).toBe(true);
    }
    for (let row = 1; row <= 3; row++) {
      for (let col = 0; col < 5; col++) {
        expect(nodes.get(`n${row}-${col}`)?.isNumbered).toBe(false);
      }
    }
  });

  it('every node carries layout coordinates', () => {
    const { nodes } = createInitialState();
    for (const node of nodes.values()) {
      expect(typeof node.x).toBe('number');
      expect(typeof node.y).toBe('number');
      expect(node.x).toBeGreaterThan(0);
      expect(node.y).toBeGreaterThan(0);
    }
  });

  it('opening phase is selectingChip with no winner yet', () => {
    const state = createInitialState();
    expect(state.phase).toBe('selectingChip');
    expect(state.winner).toBeNull();
    expect(state.winningAlignment).toBeNull();
    expect(state.moveHistory).toEqual([]);
  });
});
