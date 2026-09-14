/**
 * Wave 41 HEAVY — handshake: ramrod × prime-gold passTurn / hasValidMoves.
 * Tests-only.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';
import {
  createInitialState as ramrodInit,
  passTurn as ramrodPass,
  hasValidMoves as ramrodHasValidMoves,
} from '../../src/games/ramrod/rules';
import { getOpponent as ramrodOpponent } from '../../src/games/ramrod/types';
import {
  createInitialState as pgInit,
  rollDice as pgRoll,
  passTurn as pgPass,
  hasValidMoves as pgHasValidMoves,
  getValidPlacements as pgValids,
} from '../../src/games/prime-gold/rules';

afterEach(() => vi.restoreAllMocks());

describe('Wave 41 handshake — ramrod × prime-gold pass / valids', () => {
  it('openings: both player1; ramrod selectingRod; prime rolling', () => {
    const r = ramrodInit();
    const p = pgInit();
    expect(r.currentPlayer).toBe('player1');
    expect(p.currentPlayer).toBe('player1');
    expect(r.phase).toBe('selectingRod');
    expect(p.phase).toBe('rolling');
    expect(r.phase).not.toBe('gameOver');
    expect(p.phase).not.toBe('gameOver');
  });

  it('passTurn flips seat on both engines', () => {
    const rNext = ramrodPass(ramrodInit());
    const pNext = pgPass(pgInit());
    expect(rNext.currentPlayer).toBe('player2');
    expect(pNext.currentPlayer).toBe('player2');
    expect(rNext.phase).toBe('selectingRod');
    expect(pNext.phase).toBe('rolling');
    expect(ramrodOpponent(rNext.currentPlayer)).toBe('player1');
  });

  it('hasValidMoves: ramrod opening typically playable; prime needs placing', () => {
    const r = ramrodInit();
    const p = pgInit();
    expect(typeof ramrodHasValidMoves(r)).toBe('boolean');
    // Opening rods almost always have a placement; assert API returns boolean and
    // when true, pass still flips without requiring a place.
    if (ramrodHasValidMoves(r)) {
      expect(ramrodPass(r).currentPlayer).toBe('player2');
    }
    expect(pgHasValidMoves(p)).toBe(false); // rolling → no placements
  });

  it('after prime roll, hasValidMoves can be true while ramrod still selecting', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    const p = pgRoll(pgInit());
    const r = ramrodInit();
    expect(p.phase).toBe('placing');
    expect(pgValids(p).length).toBeGreaterThan(0);
    expect(pgHasValidMoves(p)).toBe(true);
    expect(r.phase).toBe('selectingRod');
    expect(r.currentPlayer).toBe(p.currentPlayer);
  });

  it('double pass restores player1 on both', () => {
    const r = ramrodPass(ramrodPass(ramrodInit()));
    const p = pgPass(pgPass(pgInit()));
    expect(r.currentPlayer).toBe('player1');
    expect(p.currentPlayer).toBe('player1');
  });
});
