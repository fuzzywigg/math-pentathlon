/**
 * Wave 42 — FIAR board node count / edge presence. Tests-only.
 */
import { describe, it, expect } from 'vitest';

import {
  createInitialState,
  createFiarBoard,
  CONFIG,
} from '../../src/games/fiar/types';

describe('Wave 42 fiar — board node count', () => {
  it('createFiarBoard yields 25 nodes with row-col ids', () => {
    const board = createFiarBoard();
    expect(board.nodes.size).toBe(25);
    for (let row = 0; row < 5; row++) {
      for (let col = 0; col < 5; col++) {
        expect(board.nodes.has(`${row}-${col}`)).toBe(true);
      }
    }
  });

  it('initial state board matches CONFIG chip/win fences and has edges', () => {
    const state = createInitialState();
    expect(state.board.nodes.size).toBe(25);
    expect(state.board.edges.length).toBeGreaterThan(0);
    expect(CONFIG.CHIPS_PER_PLAYER).toBe(4);
    expect(CONFIG.WIN_LENGTH).toBe(4);
    // Horizontal edge 0-0 → 0-1 must exist
    expect(
      state.board.edges.some(
        (e) =>
          (e.from === '0-0' && e.to === '0-1') ||
          (e.from === '0-1' && e.to === '0-0')
      )
    ).toBe(true);
  });

  it('every node starts with null chip', () => {
    const board = createFiarBoard();
    for (const node of board.nodes.values()) {
      expect(node.chip).toBeNull();
    }
  });
});
