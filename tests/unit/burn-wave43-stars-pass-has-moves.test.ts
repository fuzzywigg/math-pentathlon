/**
 * Wave 43 — Stars hasValidMoves empty hand + pass. Tests-only.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';

import {
  createInitialState,
  hasValidMoves,
  passTurn,
  getValidPlacements,
  selectCard,
  placeCard,
} from '../../src/games/stars-bars/rules';

afterEach(() => vi.restoreAllMocks());

describe('Wave 43 stars-bars — pass has moves', () => {
  it('empty hand → hasValidMoves false', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    const s = createInitialState();
    const empty = {
      ...s,
      playerHands: { ...s.playerHands, player1: [] },
    };
    expect(hasValidMoves(empty)).toBe(false);
  });

  it('after first place, non-adjacent cells drop from valids', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    let s = createInitialState();
    const c = s.playerHands.player1[0];
    s = placeCard(selectCard(s, c.id), 0, 0);
    const valids = getValidPlacements(s);
    expect(valids.length).toBeLessThan(25);
    expect(valids.every((p) => !(p.row === 4 && p.col === 4))).toBe(true);
    const flipped = passTurn(s);
    expect(flipped.currentPlayer).toBe('player1');
  });
});
