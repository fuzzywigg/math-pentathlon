/**
 * Wave 42 — FIAR createFiarBoard 5x5 nodes, H/V/diag edges, CONFIG. Tests-only.
 */
import { describe, it, expect } from 'vitest';

import {
  createFiarBoard,
  createInitialState,
  CONFIG,
  areConnected,
} from '../../src/games/fiar/types';

describe('Wave 42 fiar — board create invariants', () => {
  it('board has exactly 25 nodes on a 5x5 grid', () => {
    const board = createFiarBoard();
    expect(board.nodes.size).toBe(25);
    for (let r = 0; r < 5; r++) {
      for (let c = 0; c < 5; c++) {
        const id = `${r}-${c}`;
        expect(board.nodes.has(id)).toBe(true);
        expect(board.nodes.get(id)?.chip).toBeNull();
        expect(board.nodes.get(id)?.id).toBe(id);
      }
    }
  });

  it('edges include horizontal, vertical, and both diagonals', () => {
    const board = createFiarBoard();
    expect(areConnected(board, '1-1', '1-2')).toBe(true); // H
    expect(areConnected(board, '1-1', '2-1')).toBe(true); // V
    expect(areConnected(board, '1-1', '2-2')).toBe(true); // down-right
    expect(areConnected(board, '1-1', '2-0')).toBe(true); // down-left
    expect(board.edges.length).toBeGreaterThan(40);
  });

  it('CONFIG chips and win length match engine contract', () => {
    expect(CONFIG.CHIPS_PER_PLAYER).toBe(4);
    expect(CONFIG.WIN_LENGTH).toBe(4);
    expect(CONFIG.NODE_RADIUS).toBeGreaterThan(0);
  });

  it('createInitialState starts placement with empty chips and player1 seat', () => {
    const state = createInitialState();
    expect(state.phase).toBe('placement');
    expect(state.currentPlayer).toBe('player1');
    expect(state.chipsPlaced).toEqual({ player1: 0, player2: 0 });
    expect(state.winner).toBeNull();
    expect(state.selectedNode).toBeNull();
    expect(state.moveHistory).toEqual([]);
    expect(state.board.nodes.size).toBe(25);
  });
});
