/**
 * Wave 45 — Handshake Pent/Kwatro openings leftovers. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState as pentInit } from '../../src/games/pent-em-in/types';
import { createInitialState as kwaInit } from '../../src/games/kwatro-sinko/rules';

describe('Wave 45 handshake — pent/kwatro openings', () => {
  it('select phases differ; both p1 to move', () => {
    const pent = pentInit();
    const kwa = kwaInit();
    expect(pent.phase).toBe('selectPiece');
    expect(kwa.phase).toBe('selectingChip');
    expect(pent.currentPlayer).toBe('player1');
    expect(kwa.currentPlayer).toBe('player1');
  });
});
