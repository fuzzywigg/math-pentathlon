import { describe, it, expect } from 'vitest';
import {
  CONFIG,
  createFiarBoard,
  createInitialState,
  getOpponent,
  areConnected,
  getConnectedNodes,
  getNodesInDirection,
  getDirections,
} from '../../src/games/fiar/types';

describe('FIAR – types helpers', () => {
  it('createFiarBoard builds a 5x5 node grid with edges', () => {
    const board = createFiarBoard();
    expect(board.nodes.size).toBe(25);
    expect(board.edges.length).toBeGreaterThan(0);
    expect(board.nodes.has('0-0')).toBe(true);
    expect(board.nodes.has('4-4')).toBe(true);
  });

  it('createInitialState starts in placement with zero chips', () => {
    const state = createInitialState();
    expect(state.phase).toBe('placement');
    expect(state.currentPlayer).toBe('player1');
    expect(state.chipsPlaced).toEqual({ player1: 0, player2: 0 });
    expect(state.winner).toBeNull();
    expect(CONFIG.CHIPS_PER_PLAYER).toBe(4);
    expect(CONFIG.WIN_LENGTH).toBe(4);
    expect(getOpponent('player1')).toBe('player2');
  });

  it('areConnected is true for neighbors and false for distant nodes', () => {
    const board = createFiarBoard();
    expect(areConnected(board, '0-0', '0-1')).toBe(true);
    expect(areConnected(board, '0-1', '0-0')).toBe(true);
    expect(areConnected(board, '0-0', '1-0')).toBe(true);
    expect(areConnected(board, '0-0', '1-1')).toBe(true);
    expect(areConnected(board, '0-0', '4-4')).toBe(false);
  });

  it('getConnectedNodes returns unique neighbors', () => {
    const board = createFiarBoard();
    const neighbors = getConnectedNodes(board, '2-2');
    expect(neighbors.length).toBeGreaterThan(3);
    expect(new Set(neighbors).size).toBe(neighbors.length);
    expect(neighbors).toContain('2-3');
    expect(neighbors).toContain('2-1');
  });

  it('getDirections returns 8 cardinal/diagonal steps', () => {
    const dirs = getDirections();
    expect(dirs).toHaveLength(8);
    expect(dirs.some((d) => d.dx === 80 && d.dy === 0)).toBe(true);
    expect(dirs.some((d) => d.dx === 0 && d.dy === 80)).toBe(true);
  });

  it('getNodesInDirection walks a connected horizontal line', () => {
    const board = createFiarBoard();
    const right = getNodesInDirection(board, '2-0', 80, 0);
    expect(right).toEqual(['2-1', '2-2', '2-3', '2-4']);
    const left = getNodesInDirection(board, '2-4', -80, 0);
    expect(left).toEqual(['2-3', '2-2', '2-1', '2-0']);
  });
});
