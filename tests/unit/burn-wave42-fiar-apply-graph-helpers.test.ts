/**
 * Wave 42 leftovers B — FIAR applyAIMove + board graph helpers.
 * Beyond wave41 place/move reject. Tests-only.
 */
import { describe, it, expect } from 'vitest';

import {
  createInitialState,
  createFiarBoard,
  getConnectedNodes,
  getNodesInDirection,
  getDirections,
  areConnected,
} from '../../src/games/fiar/types';
import { placeChip } from '../../src/games/fiar/rules';
import { applyAIMove, getAIMove, type AIMove } from '../../src/games/fiar/ai';

describe('Wave 42 fiar — applyAIMove / graph', () => {
  it('applyAIMove place advances chips; malformed is identity', () => {
    const state = createInitialState();
    const placed = applyAIMove(state, { type: 'place', nodeId: '2-2' });
    expect(placed).not.toBe(state);
    expect(placed.chipsPlaced.player1).toBe(1);
    expect(placed.board.nodes.get('2-2')?.chip).toBe('player1');

    const noopMissing: AIMove = { type: 'place' };
    expect(applyAIMove(state, noopMissing)).toBe(state);
    const noopMove: AIMove = { type: 'move', from: '0-0' };
    expect(applyAIMove(state, noopMove)).toBe(state);
  });

  it('getAIMove place returns place type on opening', () => {
    const state = createInitialState();
    const move = getAIMove(state, 'player1', 'easy');
    expect(move).not.toBeNull();
    expect(move!.type).toBe('place');
    expect(move!.nodeId).toBeTruthy();
    const next = applyAIMove(state, move!);
    expect(next.chipsPlaced.player1).toBe(1);
  });

  it('graph helpers: corner degree, unknown empty, directions length 8', () => {
    const board = createFiarBoard();
    expect(board.nodes.size).toBe(25);
    const corner = getConnectedNodes(board, '0-0');
    expect(corner.length).toBeGreaterThanOrEqual(2);
    expect(corner.length).toBeLessThanOrEqual(3);
    const center = getConnectedNodes(board, '2-2');
    expect(center.length).toBeGreaterThan(corner.length);
    expect(getConnectedNodes(board, 'missing')).toEqual([]);
    expect(areConnected(board, '0-0', '0-1')).toBe(true);
    expect(areConnected(board, '0-0', '4-4')).toBe(false);

    const dirs = getDirections();
    expect(dirs).toHaveLength(8);
    const right = getNodesInDirection(board, '2-0', 80, 0);
    expect(right.length).toBeGreaterThanOrEqual(1);
    expect(getNodesInDirection(board, 'nope', 80, 0)).toEqual([]);
  });

  it('applyAIMove move path after full placement phase seed', () => {
    let state = createInitialState();
    // Place 4 each to enter movement (CONFIG.CHIPS_PER_PLAYER = 4)
    const order = [
      '0-0',
      '0-1',
      '0-2',
      '0-3',
      '1-0',
      '1-1',
      '1-2',
      '1-3',
    ];
    for (const id of order) {
      state = placeChip(state, id);
    }
    expect(state.phase).toBe('movement');
    const ai = getAIMove(state, state.currentPlayer, 'easy');
    if (ai && ai.type === 'move' && ai.from && ai.to) {
      const next = applyAIMove(state, ai);
      expect(next.moveHistory.length).toBeGreaterThan(state.moveHistory.length);
    }
  });
});
