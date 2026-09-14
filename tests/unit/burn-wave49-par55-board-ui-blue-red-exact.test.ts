/**
 * Wave 49 — Par55 getPlayerName exact Blue/Red leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { getPlayerName } from '../../src/games/par-55/board-ui';

describe('Wave 49 par55 — board-ui Blue/Red exact', () => {
  it('maps seats to Blue and Red', () => {
    expect(getPlayerName('player1')).toBe('Blue');
    expect(getPlayerName('player2')).toBe('Red');
  });
});
