/**
 * Wave 42 — FIAR placeChip exhaust → movement; reject occupied/OOB. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { placeChip, canPlaceChip } from '../../src/games/fiar/rules';
import { createInitialState, CONFIG } from '../../src/games/fiar/types';
import {
  placeToMovement,
  SAFE_PLACEMENT_TO_MOVEMENT,
} from './fiar-test-helpers';

describe('Wave 42 fiar — place transition', () => {
  it('fourteen places flip to movement with alternating seats', () => {
    const s = placeToMovement();
    expect(s.phase).toBe('movement');
    expect(s.moveHistory).toHaveLength(SAFE_PLACEMENT_TO_MOVEMENT.length);
    expect(s.chipsPlaced).toEqual({
      player1: CONFIG.CHIPS_PER_PLAYER,
      player2: CONFIG.CHIPS_PER_PLAYER,
    });
  });

  it('occupied and missing node reject identity', () => {
    let s = createInitialState();
    s = placeChip(s, 'c3r3');
    expect(placeChip(s, 'c3r3')).toBe(s);
    expect(canPlaceChip(s, 'c3r3')).toBe(false);
    expect(placeChip(s, '99-99')).toBe(s);
    expect(canPlaceChip(s, 'nope')).toBe(false);
  });

  it('chips exhausted mid-placement rejects further place for that player', () => {
    let s = createInitialState();
    s = {
      ...s,
      chipsPlaced: { player1: CONFIG.CHIPS_PER_PLAYER, player2: 0 },
      chipInventory: {
        player1: { plain: 0, marked: 0 },
        player2: { plain: 5, marked: 2 },
      },
      currentPlayer: 'player1',
    };
    expect(canPlaceChip(s, 'c6r5')).toBe(false);
    expect(placeChip(s, 'c6r5')).toBe(s);
  });
});
