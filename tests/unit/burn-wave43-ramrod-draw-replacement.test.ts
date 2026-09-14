/**
 * Wave 43 — draw replacement keeps hand size leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import {
  createInitialState,
  selectRod,
  placeRod,
  getValidPlacements,
} from '../../src/games/ramrod/rules';
import { CONFIG } from '../../src/games/ramrod/types';

describe('Wave 43 ramrod — draw replacement', () => {
  it('after place, hand size stays STARTING while pool remains', () => {
    let s = createInitialState();
    const rodId = s.playerRods.player1[0];
    s = selectRod(s, rodId);
    const placements = getValidPlacements(s, rodId);
    expect(placements.length).toBeGreaterThan(0);
    const next = placeRod(s, placements[0].boxId, placements[0].slot);
    if (next.phase !== 'gameOver') {
      expect(next.playerRods.player1.length).toBe(CONFIG.STARTING_RODS_PER_PLAYER);
    }
  });
});
