/**
 * Overnight HEAVY after #214/#215 — seat name handshake leftovers. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { getPlayerName as juggleName } from '../../src/games/juggle/board-ui';
import { getPlayerName as ramName } from '../../src/games/ramrod/board-ui';
import { getPlayerName as starsName } from '../../src/games/stars-bars/board-ui';
import { getPlayerName as sumName } from '../../src/games/sum-dominoes/board-ui';

describe('Overnight handshake — UI seat names', () => {
  it('juggle/ramrod/stars/sum agree on distinct seat names', () => {
    for (const fn of [juggleName, ramName, starsName, sumName]) {
      expect(fn('player1')).toBeTruthy();
      expect(fn('player2')).toBeTruthy();
      expect(fn('player1')).not.toBe(fn('player2'));
    }
  });
});
