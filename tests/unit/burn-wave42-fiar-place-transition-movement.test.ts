/**
 * Wave 42 — FIAR placeChip exhaust → movement; reject occupied/OOB. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { placeChip, canPlaceChip } from '../../src/games/fiar/rules';
import { createInitialState } from '../../src/games/fiar/types';

describe('Wave 42 fiar — place transition', () => {
  it('eight places flip to movement with alternating seats', () => {
    let s = createInitialState();
    const order = ['0-0', '0-1', '1-0', '1-1', '2-0', '2-1', '3-0', '3-1'];
    for (let i = 0; i < order.length; i++) {
      expect(canPlaceChip(s, order[i])).toBe(true);
      s = placeChip(s, order[i]);
      if (i < 7) expect(s.phase).toBe('placement');
    }
    expect(s.phase).toBe('movement');
    expect(s.moveHistory).toHaveLength(8);
    expect(s.chipsPlaced).toEqual({ player1: 4, player2: 4 });
  });

  it('occupied and missing node reject identity', () => {
    let s = createInitialState();
    s = placeChip(s, '2-2');
    expect(placeChip(s, '2-2')).toBe(s);
    expect(canPlaceChip(s, '2-2')).toBe(false);
    expect(placeChip(s, '99-99')).toBe(s);
    expect(canPlaceChip(s, 'nope')).toBe(false);
  });

  it('chips exhausted mid-placement rejects further place for that player', () => {
    let s = createInitialState();
    // force player1 chips full while still placement via override
    s = {
      ...s,
      chipsPlaced: { player1: 4, player2: 0 },
      currentPlayer: 'player1',
    };
    expect(canPlaceChip(s, '4-4')).toBe(false);
    expect(placeChip(s, '4-4')).toBe(s);
  });
});
