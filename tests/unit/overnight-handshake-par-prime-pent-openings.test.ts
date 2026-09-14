/**
 * Overnight TOKENMAXX HEAVY — handshake par/prime/pent openings leftovers after #202.
 * Tests-only. Distinct from demos (#202) and wave43/44 Contig/SD/Star/Fab drafts.
 * No product inventing.
 */

import { describe, it, expect } from 'vitest';
import { createInitialState as createPar } from '../../src/games/par-55/rules';
import { createInitialState as createPrime } from '../../src/games/prime-gold/rules';
import { createInitialState as createPent } from '../../src/games/pent-em-in/types';
import { createInitialState as createQueens } from '../../src/games/queens-guards/types';
import { createInitialState as createFrac } from '../../src/games/frac-fact/types';

describe('Overnight handshake — leftover engine openings', () => {
  it('five leftover engines open with distinct phases', () => {
    expect(createPar().phase).toBe('selectingBlock');
    expect(createPrime().phase).toBe('rolling');
    expect(createPent().phase).toBe('selectPiece');
    expect(createQueens().winner).toBeNull();
    expect(createFrac().phase).toBe('playing');
  });
});
