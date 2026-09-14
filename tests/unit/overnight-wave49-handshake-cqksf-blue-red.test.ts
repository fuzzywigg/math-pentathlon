/**
 * Wave 49 — Contig/Queens/Sum/FIAR Blue/Red handshake leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { getPlayerName as contigName } from '../../src/games/contig-60/board-ui';
import { getPlayerName as queensName } from '../../src/games/queens-guards/board-ui';
import { getPlayerName as sumName } from '../../src/games/sum-dominoes/board-ui';
import { getPlayerName as fiarName } from '../../src/games/fiar/board-ui';

describe('Wave 49 handshake — Blue/Red cross', () => {
  it('four leftover engines agree on Blue/Red seat names', () => {
    for (const fn of [contigName, queensName, sumName, fiarName]) {
      expect(fn('player1')).toBe('Blue');
      expect(fn('player2')).toBe('Red');
    }
  });
});
