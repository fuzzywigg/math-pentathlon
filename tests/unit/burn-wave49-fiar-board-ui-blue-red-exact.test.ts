/**
 * Wave 49 — FIAR getPlayerName exact Blue/Red (render-depth companion). Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { getPlayerName } from '../../src/games/fiar/board-ui';

describe('Wave 49 fiar — board-ui Blue/Red exact', () => {
  it('maps seats to Blue and Red', () => {
    expect(getPlayerName('player1')).toBe('Blue');
    expect(getPlayerName('player2')).toBe('Red');
  });
});
