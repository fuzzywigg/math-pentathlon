/**
 * Wave 46 — Handshake pent/kwatro select phase leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState as pentInit } from '../../src/games/pent-em-in/types';
import { selectPiece } from '../../src/games/pent-em-in/rules';
import { createInitialState as kwaInit, selectChip } from '../../src/games/kwatro-sinko/rules';

describe('Wave 46 handshake — select phases', () => {
  it('select advances both into placement/dest phases', () => {
    expect(selectPiece(pentInit(), 'U').phase).toBe('placePiece');
    expect(selectChip(kwaInit(), 'p1-3').phase).toBe('selectingDest');
  });
});
