/**
 * Wave 42 — FIAR place all 8 chips then move once — phase/history. Tests-only.
 */
import { describe, it, expect } from 'vitest';

import {
  placeChip,
  moveChip,
  getValidMoves,
  getSelectableNodes,
} from '../../src/games/fiar/rules';
import { createInitialState, CONFIG } from '../../src/games/fiar/types';

describe('Wave 42 fiar — place then move history', () => {
  it('eight places flip phase to movement with history length 8', () => {
    let state = createInitialState();
    const ids = [...state.board.nodes.keys()];
    for (let i = 0; i < CONFIG.CHIPS_PER_PLAYER * 2; i++) {
      state = placeChip(state, ids[i]);
    }
    expect(state.phase).toBe('movement');
    expect(state.moveHistory).toHaveLength(8);
    expect(state.moveHistory.every((m) => m.type === 'place')).toBe(true);
    expect(state.chipsPlaced).toEqual({
      player1: CONFIG.CHIPS_PER_PLAYER,
      player2: CONFIG.CHIPS_PER_PLAYER,
    });
  });

  it('one legal move appends a move entry and keeps phase movement or gameOver', () => {
    let state = createInitialState();
    const ids = [...state.board.nodes.keys()];
    for (let i = 0; i < CONFIG.CHIPS_PER_PLAYER * 2; i++) {
      state = placeChip(state, ids[i]);
    }
    const from = getSelectableNodes(state)[0];
    const to = getValidMoves(state, from)[0];
    const next = moveChip(state, from, to);
    expect(next.moveHistory).toHaveLength(9);
    expect(next.moveHistory[8]).toMatchObject({
      type: 'move',
      fromNodeId: from,
      nodeId: to,
      moveNumber: 9,
    });
    expect(['movement', 'gameOver']).toContain(next.phase);
  });
});
