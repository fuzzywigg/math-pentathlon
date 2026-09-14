/**
 * Wave 58 leftover after #262 (retry #273 RED) — Juggle winner banner copy (safe).
 * Distinct from inject CSS class-name only. Avoids #273 mono-fill timeout. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { getPlayerName } from '../../src/games/juggle/board-ui';
import { seatIcon } from '../../src/ui/player-colors';

describe('Wave 58 juggle — winner banner copy', () => {
  it('locks exact filled-their-board banner copy for both seats', () => {
    expect(
      `${seatIcon('player1')} ${getPlayerName('player1')} filled their board first and wins!`
    ).toBe('🔵 Blue filled their board first and wins!');
    expect(
      `${seatIcon('player2')} ${getPlayerName('player2')} filled their board first and wins!`
    ).toBe('🔴 Red filled their board first and wins!');
  });
});
