/**
 * Overnight TOKENMAXX — FIAR getNodesInDirection ghost/NS leftovers. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import {
  createFiarBoard,
  getNodesInDirection,
  getDirections,
} from '../../src/games/fiar/types';

describe('Overnight fiar — nodes in direction', () => {
  it('ghost start empty; right ray from 0-0 non-empty', () => {
    const board = createFiarBoard();
    expect(getNodesInDirection(board, 'nope', 80, 0)).toEqual([]);
    const dirs = getDirections();
    expect(dirs.some((d) => d.dx === 80 && d.dy === 0)).toBe(true);
    const right = getNodesInDirection(board, '0-0', 80, 0);
    expect(right.length).toBeGreaterThan(0);
    expect(right[0]).toBe('0-1');
  });
});
