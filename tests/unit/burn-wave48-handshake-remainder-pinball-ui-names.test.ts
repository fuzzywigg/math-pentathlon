/**
 * Wave 48 — Handshake remainder/pinball UI names. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { getPlayerName as remName } from '../../src/games/remainder-islands/board-ui';
import { getPlayerName as pinName } from '../../src/games/fraction-pinball/board-ui';
import { getPlayerName as jugName } from '../../src/games/juggle/board-ui';
import { getPlayerName as ramName } from '../../src/games/ramrod/board-ui';

describe('Wave 48 handshake — ui names cross', () => {
  it('Blue/Red consistent across four engines', () => {
    for (const fn of [remName, pinName, jugName, ramName]) {
      expect(fn('player1')).toBe('Blue');
      expect(fn('player2')).toBe('Red');
    }
  });
});
