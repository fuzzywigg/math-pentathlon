/**
 * Wave 43 TOKENMAXX — four-engine leftover openings handshake. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState as fab } from '../../src/games/fab-a-diffy/rules';
import { createInitialState as sd } from '../../src/games/sum-dominoes/rules';
import { createInitialState as contig } from '../../src/games/contig-60/types';
import { createInitialState as star } from '../../src/games/star-track/types';

describe('Wave 43 handshake — leftover rules openings', () => {
  it('all four engines start on player1', () => {
    expect(fab().currentPlayer).toBe('player1');
    expect(sd().currentPlayer).toBe('player1');
    expect(contig().currentPlayer).toBe('player1');
    expect(star().currentPlayer).toBe('player1');
  });
});
