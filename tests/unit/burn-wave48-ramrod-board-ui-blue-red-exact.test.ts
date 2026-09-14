/**
 * Wave 48 — Ramrod getPlayerName exact Blue/Red leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { getPlayerName } from '../../src/games/ramrod/board-ui';

describe('Wave 48 ramrod — board-ui Blue/Red exact', () => {
  it('maps seats to Blue and Red', () => {
    expect(getPlayerName('player1')).toBe('Blue');
    expect(getPlayerName('player2')).toBe('Red');
  });
});
