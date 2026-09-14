/**
 * Wave 42 — handshake: remainder × hex × pinball getOpponent.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { getOpponent as remOpp } from '../../src/games/remainder-islands/types';
import { getOpponent as hexOpp } from '../../src/games/hex/types';
import { getOpponent as pinOpp } from '../../src/games/fraction-pinball/types';

describe('Wave 42 handshake — rem/hex/pinball opponent', () => {
  it('all three flip identically', () => {
    for (const opp of [remOpp, hexOpp, pinOpp]) {
      expect(opp('player1')).toBe('player2');
      expect(opp('player2')).toBe('player1');
    }
  });

  it('cross-engine agreement matrix', () => {
    expect(remOpp('player1')).toBe(hexOpp('player1'));
    expect(hexOpp('player2')).toBe(pinOpp('player2'));
    expect(pinOpp(remOpp('player1'))).toBe('player1');
  });
});
