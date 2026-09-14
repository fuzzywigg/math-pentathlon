/**
 * Wave 44 — Contig getOpponent leftovers.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { getOpponent } from '../../src/games/contig-60/types';

describe('Wave 44 Contig — opponent flip', () => {
  it('flips seats both ways', () => {
    expect(getOpponent('player1')).toBe('player2');
    expect(getOpponent('player2')).toBe('player1');
  });
});
