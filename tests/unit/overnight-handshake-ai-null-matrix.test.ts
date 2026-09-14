/**
 * Overnight TOKENMAXX HEAVY — handshake AI null matrix leftovers after #202.
 * Tests-only. Distinct from demos (#202) and wave43/44 Contig/SD/Star/Fab drafts.
 * No product inventing.
 */

import { describe, it, expect } from 'vitest';
import { createInitialState as createPar } from '../../src/games/par-55/rules';
import { getAIMove as parAI } from '../../src/games/par-55/ai';
import { createInitialState as createPrime } from '../../src/games/prime-gold/rules';
import { getAIPlacement } from '../../src/games/prime-gold/ai';
import { createInitialState as createPent } from '../../src/games/pent-em-in/types';
import { getAIMove as pentAI } from '../../src/games/pent-em-in/ai';
import { createInitialState as createQueens } from '../../src/games/queens-guards/types';
import { getAIMove as queensAI } from '../../src/games/queens-guards/ai';
import { createInitialState as createFrac } from '../../src/games/frac-fact/types';
import { getAIAnswer } from '../../src/games/frac-fact/ai';

describe('Overnight handshake — AI null matrix', () => {
  it('wrong-seat AI calls are null across leftover engines', () => {
    expect(parAI(createPar(), 'player2', 'hard')).toBeNull();
    expect(getAIPlacement(createPrime(), 'player1', 'hard')).toBeNull(); // rolling
    expect(pentAI(createPent(), 'player2', 'hard')).toBeNull();
    expect(queensAI(createQueens(), 'player2', 'hard')).toBeNull();
    expect(getAIAnswer(createFrac(), 'player1', 'hard')).toBeNull(); // no problem
  });
});
