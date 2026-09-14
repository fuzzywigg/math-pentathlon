/**
 * Overnight HEAVY after #214/#215 — cross-engine AI null seat handshake. Tests-only.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';
import { createInitialState as callaInit } from '../../src/games/calla/types';
import { getAIMove as callaAI } from '../../src/games/calla/ai';
import { createInitialState as juggleInit } from '../../src/games/juggle/rules';
import { getAIDieChoice } from '../../src/games/juggle/ai';
import { createInitialState as hexInit } from '../../src/games/hex-a-gone/types';
import { getAISelection } from '../../src/games/hex-a-gone/ai';
import { createInitialState as ramInit } from '../../src/games/ramrod/rules';
import { getAIMove as ramAI } from '../../src/games/ramrod/ai';
import { createInitialState as starsInit } from '../../src/games/stars-bars/rules';
import { getAIMove as starsAI } from '../../src/games/stars-bars/ai';
import { createInitialState as sumInit } from '../../src/games/sum-dominoes/rules';
import { getAIMove as sumAI } from '../../src/games/sum-dominoes/ai';

afterEach(() => vi.restoreAllMocks());

describe('Overnight handshake — AI wrong-seat/phase nulls', () => {
  it('wrong seat or wrong phase yields null across the six leftover engines', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.99);
    expect(callaAI(callaInit(), 'player2', 'hard')).toBeNull();
    expect(getAIDieChoice(juggleInit(), 'player1', 'hard')).toBeNull(); // rolling
    expect(getAISelection(hexInit(), 'player2', 'hard')).toBeNull();
    expect(ramAI(ramInit(), 'player2', 'hard')).toBeNull();
    expect(starsAI(starsInit(), 'player2', 'hard')).toBeNull();
    expect(sumAI(sumInit(), 'player1', 'hard')).toBeNull(); // no dice yet
  }, 15_000);
});
