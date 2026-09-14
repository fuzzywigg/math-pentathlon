/**
 * Wave 42 — FIAR types getOpponent / graph direction helpers. Tests-only.
 */
import { describe, it, expect } from 'vitest';

import {
  getOpponent,
  getConnectedNodes,
  getDirections,
  getNodesInDirection,
  createFiarBoard,
} from '../../src/games/fiar/types';

describe('Wave 42 fiar — types graph helpers', () => {
  it('getOpponent swaps seats both ways', () => {
    expect(getOpponent('player1')).toBe('player2');
    expect(getOpponent('player2')).toBe('player1');
  });

  it('getConnectedNodes includes horizontal and vertical neighbors', () => {
    const board = createFiarBoard();
    const center = getConnectedNodes(board, '2-2');
    expect(center).toEqual(
      expect.arrayContaining(['2-1', '2-3', '1-2', '3-2'])
    );
    expect(getConnectedNodes(board, 'ghost')).toEqual([]);
  });

  it('getDirections returns 8 unit vectors; getNodesInDirection walks a row', () => {
    const dirs = getDirections();
    expect(dirs).toHaveLength(8);
    const board = createFiarBoard();
    const right = dirs.find((d) => d.dx > 0 && d.dy === 0)!;
    const along = getNodesInDirection(board, '2-0', right.dx, right.dy);
    expect(along).toEqual(['2-1', '2-2', '2-3', '2-4']);
  });
});
