/**
 * Wave 45 — Handshake four-engine AI wrong-seat null leftovers. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState as parInit } from '../../src/games/par-55/rules';
import { getAIMove as parAI } from '../../src/games/par-55/ai';
import { createInitialState as primeInit } from '../../src/games/prime-gold/rules';
import { getAIPlacement as primeAI } from '../../src/games/prime-gold/ai';
import { createInitialState as pentInit } from '../../src/games/pent-em-in/types';
import { getAIMove as pentAI } from '../../src/games/pent-em-in/ai';
import { createInitialState as kwaInit } from '../../src/games/kwatro-sinko/rules';
import { getAIMove as kwaAI } from '../../src/games/kwatro-sinko/ai';

describe('Wave 45 handshake — AI wrong-seat nulls', () => {
  it('all four engines null for player2 at opening', () => {
    expect(parAI(parInit(), 'player2', 'hard')).toBeNull();
    expect(primeAI(primeInit(), 'player2', 'hard')).toBeNull();
    expect(pentAI(pentInit(), 'player2', 'hard')).toBeNull();
    expect(kwaAI(kwaInit(), 'player2', 'hard')).toBeNull();
  });
});
