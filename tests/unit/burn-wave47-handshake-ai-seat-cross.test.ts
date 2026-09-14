/**
 * Wave 47 leftover after #214/#215 — AI seat cross for six leftovers.
 * Tests-only. No product inventing.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState as stars } from '../../src/games/stars-bars/rules';
import { isAITurn as starsAI } from '../../src/games/stars-bars/ai';
import { createInitialState as sum } from '../../src/games/sum-dominoes/rules';
import { isAITurn as sumAI } from '../../src/games/sum-dominoes/ai';
import { createInitialState as track } from '../../src/games/star-track/types';
import { isAITurn as trackAI } from '../../src/games/star-track/ai';
import { createInitialState as hexagone } from '../../src/games/hex-a-gone/types';
import { isAITurn as hexAI } from '../../src/games/hex-a-gone/ai';
import { createInitialState as par } from '../../src/games/par-55/rules';
import { isAITurn as parAI } from '../../src/games/par-55/ai';
import { createInitialState as kwatro } from '../../src/games/kwatro-sinko/rules';
import { isAITurn as kwatroAI } from '../../src/games/kwatro-sinko/ai';

describe('Wave 47 handshake — AI seat cross', () => {
  it('human-vs-ai marks player1; human-vs-human never', () => {
    expect(starsAI(stars(), 'player1', 'human-vs-ai')).toBe(true);
    expect(starsAI(stars(), 'player1', 'human-vs-human')).toBe(false);
    expect(sumAI(sum(), 'player1')).toBe(true);
    expect(sumAI(sum(), 'player2')).toBe(false);
    expect(trackAI(track(), 'player1', 'human-vs-ai')).toBe(true);
    expect(hexAI(hexagone(), 'player1', 'human-vs-ai')).toBe(true);
    expect(parAI(par(), 'player1', 'human-vs-ai')).toBe(true);
    expect(kwatroAI(kwatro(), 'player1', 'human-vs-ai')).toBe(true);
    expect(kwatroAI(kwatro(), 'player2', 'human-vs-ai')).toBe(false);
  });
});
