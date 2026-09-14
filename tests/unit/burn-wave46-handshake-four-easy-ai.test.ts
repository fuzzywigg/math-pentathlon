/**
 * Wave 46 — Handshake four-engine easy AI opening leftover. Tests-only.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';
import { createInitialState as parInit } from '../../src/games/par-55/rules';
import { getAIMove as parAI } from '../../src/games/par-55/ai';
import { createInitialState as primeInit, rollDice } from '../../src/games/prime-gold/rules';
import { getAIPlacement as primeAI } from '../../src/games/prime-gold/ai';
import { createInitialState as pentInit } from '../../src/games/pent-em-in/types';
import { getAIMove as pentAI } from '../../src/games/pent-em-in/ai';
import { createInitialState as kwaInit } from '../../src/games/kwatro-sinko/rules';
import { getAIMove as kwaAI } from '../../src/games/kwatro-sinko/ai';

describe('Wave 46 handshake — four easy AI', () => {
  afterEach(() => vi.restoreAllMocks());

  it('easy returns non-null for all four at opening', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.99);
    expect(parAI(parInit(), 'player1', 'easy')).not.toBeNull();
    expect(primeAI(rollDice(primeInit()), 'player1', 'easy')).not.toBeNull();
    expect(pentAI(pentInit(), 'player1', 'easy')).not.toBeNull();
    expect(kwaAI(kwaInit(), 'player1', 'easy')).not.toBeNull();
  }, 20_000);
});
