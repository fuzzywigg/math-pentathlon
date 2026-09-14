/**
 * Wave 43 TOKENMAXX — registry ids for fab/sd/contig/star leftovers. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { GAMES } from '../../src/core/game-registry';

describe('Wave 43 handshake — registry ids', () => {
  it('slice games are registered', () => {
    const ids = GAMES.map((g) => g.id);
    for (const id of ['fab-a-diffy', 'sum-dominoes', 'contig-60', 'star-track']) {
      expect(ids).toContain(id);
    }
  });
});
