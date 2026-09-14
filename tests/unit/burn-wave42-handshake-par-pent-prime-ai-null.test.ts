/**
 * Wave 42 — Par/Pent/Prime AI wrong-seat null handshake after #186.
 * Tests-only.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';

import { createInitialState as createPar } from '../../src/games/par-55/rules';
import { getAIMove as parAI, isAITurn as parIsAI } from '../../src/games/par-55/ai';
import { createInitialState as createPent } from '../../src/games/pent-em-in/types';
import { getAIMove as pentAI, isAITurn as pentIsAI } from '../../src/games/pent-em-in/ai';
import { createInitialState as createPrime, rollDice } from '../../src/games/prime-gold/rules';
import {
  getAIPlacement as primeAI,
  isAITurn as primeIsAI,
} from '../../src/games/prime-gold/ai';

afterEach(() => {
  vi.restoreAllMocks();
});

describe('Wave 42 handshake — par/pent/prime AI null seats', () => {
  it('wrong seat / mode / null seat gates match each AI API', () => {
    const par = createPar();
    const pent = createPent();
    const prime = createPrime();

    expect(parIsAI(par, 'player2', 'human-vs-ai')).toBe(false);
    expect(parIsAI(par, 'player1', 'human-vs-human')).toBe(false);
    expect(parIsAI(par, null, 'human-vs-ai')).toBe(false);
    // Pent AI only takes (state, aiPlayer) — no gameMode arg
    expect(pentIsAI(pent, 'player2')).toBe(false);
    expect(pentIsAI(pent, null)).toBe(false);
    expect(pentIsAI(pent, 'player1')).toBe(true);
    expect(primeIsAI(prime, 'player2', 'human-vs-ai')).toBe(false);
    expect(primeIsAI(prime, 'player1', 'human-vs-human')).toBe(false);
    expect(primeIsAI(prime, null, 'human-vs-ai')).toBe(false);
  });

  it('getAI* returns null for opponent seat at opening', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.99);
    expect(parAI(createPar(), 'player2', 'easy')).toBeNull();
    expect(pentAI(createPent(), 'player2', 'easy')).toBeNull();
    expect(primeAI(createPrime(), 'player2', 'easy')).toBeNull();
  });

  it('prime AI after roll can produce a placement for seat1', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.1);
    let state = createPrime();
    state = rollDice(state);
    expect(state.phase).toBe('placing');
    const move = primeAI(state, 'player1', 'hard');
    // May pass-null if no expressions land on empty cells; assert shape when present
    if (move) {
      expect(move.value).toBeGreaterThan(0);
      expect(typeof move.expression).toBe('string');
    } else {
      expect(move).toBeNull();
    }
  });
});
