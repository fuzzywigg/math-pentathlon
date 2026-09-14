/**
 * Wave 42 — FIAR applyAIMove malformed place/move returns identity. Tests-only.
 */
import { describe, it, expect } from 'vitest';

import { applyAIMove } from '../../src/games/fiar/ai';
import { placeChip, getValidMoves } from '../../src/games/fiar/rules';
import { createInitialState, CONFIG } from '../../src/games/fiar/types';

function toMovement() {
  let state = createInitialState();
  const ids = [...state.board.nodes.keys()];
  for (let i = 0; i < CONFIG.CHIPS_PER_PLAYER * 2; i++) {
    state = placeChip(state, ids[i]);
  }
  return state;
}

describe('Wave 42 fiar — applyAIMove malformed', () => {
  it('place without nodeId → identity', () => {
    const state = createInitialState();
    expect(applyAIMove(state, { type: 'place' })).toBe(state);
  });

  it('place with empty string nodeId → identity via canPlace reject', () => {
    const state = createInitialState();
    const next = applyAIMove(state, { type: 'place', nodeId: '' });
    expect(next).toBe(state);
  });

  it('move without from/to → identity', () => {
    const state = toMovement();
    expect(applyAIMove(state, { type: 'move' })).toBe(state);
    expect(applyAIMove(state, { type: 'move', from: '0-0' })).toBe(state);
    expect(applyAIMove(state, { type: 'move', to: '0-1' })).toBe(state);
  });

  it('well-formed move applies; malformed sibling stays identity', () => {
    const state = toMovement();
    let from = '';
    let to = '';
    for (const [id, node] of state.board.nodes) {
      if (node.chip !== state.currentPlayer) continue;
      const moves = getValidMoves(state, id);
      if (moves.length > 0) {
        from = id;
        to = moves[0];
        break;
      }
    }
    const good = applyAIMove(state, { type: 'move', from, to });
    expect(good).not.toBe(state);
    expect(good.board.nodes.get(to)?.chip).toBe(state.currentPlayer);
    expect(applyAIMove(state, { type: 'move', from, to: undefined })).toBe(
      state
    );
  });
});
