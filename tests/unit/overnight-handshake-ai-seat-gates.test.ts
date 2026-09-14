/**
 * Overnight TOKENMAXX — AI seat gates across slice leftovers. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState as starsInit } from '../../src/games/stars-bars/rules';
import { isAITurn as starsAI } from '../../src/games/stars-bars/ai';
import { createInitialState as hagInit } from '../../src/games/hex-a-gone/types';
import { isAITurn as hagAI } from '../../src/games/hex-a-gone/ai';
import { createInitialState as callaInit } from '../../src/games/calla/types';
import { isAITurn as callaAI } from '../../src/games/calla/ai';
import { createInitialState as fracInit } from '../../src/games/frac-fact/types';
import { isAITurn as fracAI } from '../../src/games/frac-fact/ai';

describe('Overnight handshake — AI seat gates', () => {
  it('null seat false across engines', () => {
    expect(starsAI(starsInit(), null, 'human-vs-ai')).toBe(false);
    expect(hagAI(hagInit(), null, 'human-vs-ai')).toBe(false);
    expect(callaAI(callaInit(), null, 'human-vs-ai')).toBe(false);
    expect(fracAI(fracInit('easy'), null)).toBe(false);
  });
});
