/**
 * Wave 42 — FIAR getSelectableNodes placement empty; movement own-with-moves. Tests-only.
 */
import { describe, it, expect } from 'vitest';

import {
  getSelectableNodes,
  getValidMoves,
  placeChip,
} from '../../src/games/fiar/rules';
import { createInitialState, CONFIG } from '../../src/games/fiar/types';

describe('Wave 42 fiar — selectable ownership', () => {
  it('placement: getSelectableNodes is empty', () => {
    expect(getSelectableNodes(createInitialState())).toEqual([]);
    const mid = placeChip(createInitialState(), '1-1');
    expect(getSelectableNodes(mid)).toEqual([]);
  });

  it('movement: every selectable id is currentPlayer with nonempty moves', () => {
    let state = createInitialState();
    const ids = [...state.board.nodes.keys()];
    for (let i = 0; i < CONFIG.CHIPS_PER_PLAYER * 2; i++) {
      state = placeChip(state, ids[i]);
    }
    const selectable = getSelectableNodes(state);
    expect(selectable.length).toBeGreaterThan(0);
    for (const id of selectable) {
      expect(state.board.nodes.get(id)?.chip).toBe(state.currentPlayer);
      expect(getValidMoves(state, id).length).toBeGreaterThan(0);
    }
  });

  it('gameOver phase yields no selectable nodes', () => {
    const over = {
      ...createInitialState(),
      phase: 'gameOver' as const,
      winner: 'player1' as const,
    };
    expect(getSelectableNodes(over)).toEqual([]);
  });
});
