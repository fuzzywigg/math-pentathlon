/**
 * Wave 45 TOKENMAXX — registry ids for leftover engines. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { GAMES } from '../../src/core/game-registry';

describe('Wave 45 handshake — registry ids', () => {
  it('slice games are registered', () => {
    const ids = GAMES.map((g) => g.id);
    for (const id of [
      'kings-quadraphages',
      'queens-guards',
      'remainder-islands',
      'par-55',
      'fraction-pinball',
      'kwatro-sinko',
    ]) {
      expect(ids).toContain(id);
    }
  });
});
