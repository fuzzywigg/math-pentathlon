/**
 * Wave 43 — ramrod/stars wrong-seat AI null handshake. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState as ramrodInit } from '../../src/games/ramrod/rules';
import { createInitialState as starsInit } from '../../src/games/stars-bars/rules';
import { getAIMove as ramrodAI } from '../../src/games/ramrod/ai';
import { getAIMove as starsAI } from '../../src/games/stars-bars/ai';

describe('Wave 43 handshake — ramrod stars AI null', () => {
  it('wrong seat → both getAIMove null', () => {
    expect(ramrodAI(ramrodInit(), 'player2', 'hard')).toBeNull();
    expect(starsAI(starsInit(), 'player2', 'hard')).toBeNull();
  });
});
