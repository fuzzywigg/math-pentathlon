import { describe, it, expect } from 'vitest';
import {
  CONFIG,
  cellKey,
  parseKey,
  cellsInRing,
  normalizePosition,
  getAdjacent,
  isMoveValid,
  createBoard,
  createInitialState,
  getOpponent,
} from '../../src/games/queens-guards/types';

describe('Queens & Guards – types helpers', () => {
  it('cellsInRing matches hex ring geometry', () => {
    expect(cellsInRing(0)).toBe(1);
    expect(cellsInRing(1)).toBe(6);
    expect(cellsInRing(2)).toBe(12);
    expect(cellsInRing(5)).toBe(30);
  });

  it('cellKey / parseKey round-trip', () => {
    expect(cellKey(3, 5)).toBe('3-5');
    expect(parseKey('3-5')).toEqual({ ring: 3, position: 5 });
    expect(parseKey(cellKey(0, 0))).toEqual({ ring: 0, position: 0 });
  });

  it('normalizePosition wraps within a ring', () => {
    expect(normalizePosition(0, 99)).toBe(0);
    expect(normalizePosition(2, -1)).toBe(11);
    expect(normalizePosition(2, 12)).toBe(0);
    expect(normalizePosition(2, 5)).toBe(5);
  });

  it('getAdjacent from center reaches all ring-1 cells', () => {
    const adj = getAdjacent({ ring: 0, position: 0 });
    expect(adj).toHaveLength(6);
    expect(adj.every((c) => c.ring === 1)).toBe(true);
    expect(new Set(adj.map((c) => c.position)).size).toBe(6);
  });

  it('getAdjacent same-ring neighbors wrap', () => {
    const adj = getAdjacent({ ring: 2, position: 0 });
    const sameRing = adj.filter((c) => c.ring === 2).map((c) => c.position);
    expect(sameRing).toContain(1);
    expect(sameRing).toContain(11);
  });

  it('isMoveValid allows sideways and inward only', () => {
    expect(
      isMoveValid({ ring: 3, position: 0 }, { ring: 3, position: 1 })
    ).toBe(true);
    expect(
      isMoveValid({ ring: 3, position: 0 }, { ring: 2, position: 0 })
    ).toBe(true);
    expect(
      isMoveValid({ ring: 2, position: 0 }, { ring: 3, position: 0 })
    ).toBe(false);
  });

  it('createBoard size equals sum of rings; queens sit on outer ring', () => {
    const board = createBoard();
    let expected = 0;
    for (let r = 0; r < CONFIG.NUM_RINGS; r++) expected += cellsInRing(r);
    expect(board.size).toBe(expected);

    const p1Queen = board.get(cellKey(5, 7));
    const p2Queen = board.get(cellKey(5, 22));
    expect(p1Queen?.piece?.type).toBe('queen');
    expect(p1Queen?.piece?.player).toBe('player1');
    expect(p2Queen?.piece?.type).toBe('queen');
    expect(p2Queen?.piece?.player).toBe('player2');
  });

  it('createInitialState starts on player1 with empty history', () => {
    const state = createInitialState();
    expect(state.currentPlayer).toBe('player1');
    expect(state.selectedPiece).toBeNull();
    expect(state.winner).toBeNull();
    expect(state.moveHistory).toHaveLength(0);
    expect(getOpponent('player1')).toBe('player2');
    expect(getOpponent('player2')).toBe('player1');
  });
});
