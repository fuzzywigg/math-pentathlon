/** Wave 42 — Par 55 place shrinks hand without refill. Tests-only. */
import { describe, it, expect } from 'vitest';

import {
  createInitialState,
  selectBlock,
  placeBlock,
  getValidPlacements,
} from '../../src/games/par-55/rules';
import { CONFIG } from '../../src/games/par-55/types';

describe('Wave 42 par55 — hand shrink no refill', () => {
  it('place removes exactly one block from current hand', () => {
    let state = createInitialState();
    expect(state.hands.player1).toHaveLength(CONFIG.HAND_SIZE);
    const blockId = state.hands.player1[0].id;
    state = selectBlock(state, blockId);
    const next = placeBlock(state, getValidPlacements(state)[0]);
    expect(next.hands.player1).toHaveLength(CONFIG.HAND_SIZE - 1);
    expect(next.hands.player1.find((b) => b.id === blockId)).toBeUndefined();
  });

  it('opponent hand length unchanged after place', () => {
    let state = createInitialState();
    const oppLen = state.hands.player2.length;
    state = selectBlock(state, state.hands.player1[0].id);
    const next = placeBlock(state, getValidPlacements(state)[0]);
    expect(next.hands.player2).toHaveLength(oppLen);
  });

  it('second place further shrinks without restoring prior size', () => {
    let state = createInitialState();
    state = selectBlock(state, state.hands.player1[0].id);
    state = placeBlock(state, getValidPlacements(state)[0]);
    expect(state.currentPlayer).toBe('player2');
    const before = state.hands.player2.length;
    state = selectBlock(state, state.hands.player2[0].id);
    state = placeBlock(state, getValidPlacements(state)[0]);
    expect(state.hands.player2).toHaveLength(before - 1);
    expect(state.hands.player1).toHaveLength(CONFIG.HAND_SIZE - 1);
  });

  it('placed block id appears on board base, not in either hand', () => {
    let state = createInitialState();
    const blockId = state.hands.player1[0].id;
    state = selectBlock(state, blockId);
    const baseId = getValidPlacements(state)[0];
    const next = placeBlock(state, baseId);
    expect(next.bases.get(baseId)?.block?.id).toBe(blockId);
    expect(next.hands.player1.some((b) => b.id === blockId)).toBe(false);
    expect(next.hands.player2.some((b) => b.id === blockId)).toBe(false);
  });
});
