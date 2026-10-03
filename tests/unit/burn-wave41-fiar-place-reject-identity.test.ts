/**
 * Wave 41 — FIAR canPlaceChip / placeChip reject identity matrix. Tests-only.
 */
import { describe, it, expect } from 'vitest';

import {
  canPlaceChip,
  placeChip,
} from '../../src/games/fiar/rules';
import {
  createInitialState,
  CONFIG,
} from '../../src/games/fiar/types';
import { placeToMovement } from './fiar-test-helpers';

describe('Wave 41 fiar — place reject identity', () => {
  it('unknown node and occupied node reject', () => {
    const state = createInitialState();
    expect(canPlaceChip(state, 'ghost-node')).toBe(false);
    expect(placeChip(state, 'ghost-node')).toBe(state);
    const id = [...state.board.nodes.keys()][0];
    const placed = placeChip(state, id);
    expect(canPlaceChip(placed, id)).toBe(false);
    expect(placeChip(placed, id)).toBe(placed);
  });

  it('movement / gameOver phase cannot place', () => {
    const movement = {
      ...createInitialState(),
      phase: 'movement' as const,
    };
    const id = [...movement.board.nodes.keys()][0];
    expect(canPlaceChip(movement, id)).toBe(false);
    expect(placeChip(movement, id)).toBe(movement);
    const over = { ...movement, phase: 'gameOver' as const };
    expect(placeChip(over, id)).toBe(over);
  });

  it('exhausted chips for current player reject', () => {
    const state = {
      ...createInitialState(),
      chipsPlaced: {
        player1: CONFIG.CHIPS_PER_PLAYER,
        player2: 0,
      },
      chipInventory: {
        player1: { plain: 0, marked: 0 },
        player2: { plain: 5, marked: 2 },
      },
    };
    const id = [...state.board.nodes.keys()][0];
    expect(canPlaceChip(state, id)).toBe(false);
    expect(placeChip(state, id)).toBe(state);
  });

  it('full placement cycle flips phase to movement', () => {
    const state = placeToMovement();
    expect(state.phase).toBe('movement');
    expect(state.chipsPlaced.player1).toBe(CONFIG.CHIPS_PER_PLAYER);
    expect(state.chipsPlaced.player2).toBe(CONFIG.CHIPS_PER_PLAYER);
  });
});
