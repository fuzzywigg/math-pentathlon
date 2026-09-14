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
} from '../../src/games/fiar/types';

describe('Wave 42 fiar — types graph helpers', () => {
  it('CONFIG chips and win length stable', () => {
    expect(CONFIG.CHIPS_PER_PLAYER).toBe(4);
    expect(CONFIG.WIN_LENGTH).toBe(4);
  });

  it('board is 5x5 with edges; directions cover 8 rays', () => {
    const board = createFiarBoard();
    expect(board.nodes.size).toBe(25);
    expect(board.edges.length).toBeGreaterThan(40);
    expect(getDirections()).toHaveLength(8);
  });

  it('areConnected symmetric for horizontal neighbors', () => {
    const board = createFiarBoard();
    expect(areConnected(board, '0-0', '0-1')).toBe(true);
    expect(areConnected(board, '0-1', '0-0')).toBe(true);
    expect(areConnected(board, '0-0', '0-2')).toBe(false);
  });

  it('getConnectedNodes center has multiple; getNodesInDirection east uses pixel spacing', () => {
    const board = createFiarBoard();
    const mid = getConnectedNodes(board, '2-2');
    expect(mid.length).toBeGreaterThanOrEqual(4);
    const spacing = 80;
    const east = getNodesInDirection(board, '2-0', spacing, 0);
    expect(east[0]).toBe('2-1');
    expect(east).toContain('2-4');
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
