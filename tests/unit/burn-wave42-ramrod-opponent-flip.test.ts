/**
 * Wave 42 leftovers D — ramrod opponent flip. Tests-only. No product inventing.
 */
import { describe, it, expect } from 'vitest';
import { getOpponent } from '../../src/games/ramrod/types';

describe('Wave 42 ramrod — opponent flip', () => {
  it('getOpponent flips seats', () => {
    expect(getOpponent('player1')).toBe('player2');
    expect(getOpponent('player2')).toBe('player1');
    expect(getOpponent(getOpponent('player1'))).toBe('player1');
  });
});
