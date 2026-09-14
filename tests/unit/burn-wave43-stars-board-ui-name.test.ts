/**
 * Wave 43 — stars getPlayerName leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { getPlayerName } from '../../src/games/stars-bars/board-ui';

describe('Wave 43 stars — board-ui names', () => {
  it('maps seats', () => {
    expect(getPlayerName('player1')).toBeTruthy();
    expect(getPlayerName('player2')).toBeTruthy();
  });
});
