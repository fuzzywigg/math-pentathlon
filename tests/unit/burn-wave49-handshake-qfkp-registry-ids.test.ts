/**
 * Wave 49 — Handshake registry ids for queens/fiar/kwatro/par55. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { GAMES } from '../../src/core/game-registry';

describe('Wave 49 handshake — registry ids', () => {
  it('registers four leftover board-ui engines', () => {
    const ids = GAMES.map((g) => g.id);
    for (const id of ['queens-guards', 'fiar', 'kwatro-sinko', 'par-55']) {
      expect(ids).toContain(id);
    }
  });
});
