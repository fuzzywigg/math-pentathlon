/**
 * Wave 49 — Handshake queens/fiar/kwatro/par55 UI names. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { getPlayerName as qName } from '../../src/games/queens-guards/board-ui';
import { getPlayerName as fName } from '../../src/games/fiar/board-ui';
import { getPlayerName as kName } from '../../src/games/kwatro-sinko/board-ui';
import { getPlayerName as pName } from '../../src/games/par-55/board-ui';

describe('Wave 49 handshake — ui names cross', () => {
  it('Blue/Red consistent across four engines', () => {
    for (const fn of [qName, fName, kName, pName]) {
      expect(fn('player1')).toBe('Blue');
      expect(fn('player2')).toBe('Red');
    }
  });
});
