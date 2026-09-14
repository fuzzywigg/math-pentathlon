/**
 * Wave 49 leftover after #221/#226/#227 — Handshake Blue/Red names cross engines. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { getPlayerName as kwaName } from '../../src/games/kwatro-sinko/board-ui';
import { getPlayerName as parName } from '../../src/games/par-55/board-ui';
import { getPlayerName as qgName } from '../../src/games/queens-guards/board-ui';
import { getPlayerName as contigName } from '../../src/games/contig-60/board-ui';
import { getPlayerName as fiarName } from '../../src/games/fiar/board-ui';
import { getPlayerName as starsName } from '../../src/games/stars-bars/board-ui';
import { getPlayerName as sdName } from '../../src/games/sum-dominoes/board-ui';

describe('Wave 49 handshake — Blue/Red cross', () => {
  it('all engines share Blue/Red seat labels', () => {
    for (const gn of [kwaName, parName, qgName, contigName, fiarName, starsName, sdName]) {
      expect(gn('player1')).toBe('Blue');
      expect(gn('player2')).toBe('Red');
    }
  });
});
