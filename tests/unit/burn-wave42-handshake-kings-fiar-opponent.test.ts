/**
 * Wave 42 — handshake: kings × fiar getOpponent seat flip.
 * Tests-only. Registry-free pure engines.
 */
import { describe, it, expect } from 'vitest';
import { getOpponent as kingsOpp } from '../../src/games/kings-quadraphages/rules';
import { getOpponent as fiarOpp } from '../../src/games/fiar/types';

describe('Wave 42 handshake — kings × fiar opponent', () => {
  it('both engines flip player1↔player2 identically', () => {
    expect(kingsOpp('player1')).toBe(fiarOpp('player1'));
    expect(kingsOpp('player2')).toBe(fiarOpp('player2'));
    expect(kingsOpp('player1')).toBe('player2');
    expect(fiarOpp('player2')).toBe('player1');
  });

  it('double flip is identity for both', () => {
    expect(kingsOpp(kingsOpp('player1'))).toBe('player1');
    expect(fiarOpp(fiarOpp('player2'))).toBe('player2');
  });
});
