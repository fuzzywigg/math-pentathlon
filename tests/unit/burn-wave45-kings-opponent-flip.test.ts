/**
 * Wave 45 TOKENMAXX — Kings getOpponent leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { getOpponent } from '../../src/games/kings-quadraphages/rules';

describe('Wave 45 kings — opponent flip', () => {
  it('player1 ↔ player2', () => {
    expect(getOpponent('player1')).toBe('player2');
    expect(getOpponent('player2')).toBe('player1');
  });
});
