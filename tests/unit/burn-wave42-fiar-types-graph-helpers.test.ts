/**
 * Wave 42 — FIAR types graph helpers (directions / connected / opponent). Tests-only.
 */
import { describe, it, expect } from 'vitest';
import {
  createInitialState,
  createFiarBoard,
  getOpponent,
  areConnected,
  getConnectedNodes,
  getNodesInDirection,
  getDirections,
  CONFIG,
  countConfirmedEdges,
} from '../../src/games/fiar/types';

describe('Wave 42 fiar — types graph helpers', () => {
  it('CONFIG chips and win length stable', () => {
    expect(CONFIG.CHIPS_PER_PLAYER).toBe(7);
    expect(CONFIG.WIN_LENGTH).toBe(4);
  });

  it('board is verified 40-space with 116 edges; directions cover 8 rays', () => {
    const board = createFiarBoard();
    expect(board.nodes.size).toBe(40);
    expect(board.edges.length).toBe(countConfirmedEdges());
    expect(board.layoutVerified).toBe(true);
    expect(getDirections()).toHaveLength(8);
  });

  it('areConnected symmetric for horizontal neighbors', () => {
    const board = createFiarBoard();
    expect(areConnected(board, 'c1r2', 'c2r2')).toBe(true);
    expect(areConnected(board, 'c2r2', 'c1r2')).toBe(true);
    expect(areConnected(board, 'c1r2', 'c3r2')).toBe(false);
    // Yellow gap: left and right of center are not connected
    expect(areConnected(board, 'c3r3', 'c5r3')).toBe(false);
  });

  it('getConnectedNodes mid has multiple; getNodesInDirection east stops at yellow', () => {
    const board = createFiarBoard();
    const mid = getConnectedNodes(board, 'c3r2');
    expect(mid.length).toBeGreaterThanOrEqual(4);
    const spacing = 80;
    const east = getNodesInDirection(board, 'c0r3', spacing, 0);
    expect(east[0]).toBe('c1r3');
    expect(east).toContain('c3r3');
    expect(east).not.toContain('c5r3');
  });

  it('opponent flip + initial state defaults', () => {
    expect(getOpponent('player1')).toBe('player2');
    expect(getOpponent('player2')).toBe('player1');
    const s = createInitialState();
    expect(s.phase).toBe('placement');
    expect(s.winner).toBeNull();
    expect(s.moveHistory).toEqual([]);
  });
});
