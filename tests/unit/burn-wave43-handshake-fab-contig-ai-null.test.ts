/**
 * Wave 43 TOKENMAXX — Fab AI null × Contig hasValidMoves handshake. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState as fabInit } from '../../src/games/fab-a-diffy/rules';
import { getAIMove } from '../../src/games/fab-a-diffy/ai';
import { hasValidMoves } from '../../src/games/contig-60/rules';
import { createInitialState as contigInit } from '../../src/games/contig-60/types';

describe('Wave 43 handshake — fab AI × contig moves', () => {
  it('wrong-seat fab AI null pairs with contig no-dice false', () => {
    expect(getAIMove(fabInit(), 'player2')).toBeNull();
    expect(hasValidMoves(contigInit())).toBe(false);
  });
});
