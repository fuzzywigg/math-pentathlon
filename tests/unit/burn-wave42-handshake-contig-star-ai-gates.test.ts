/**
 * Wave 42 — Handshake: Contig/Star Track AI turn gates agree on mode.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState as contigInit } from '../../src/games/contig-60/types';
import { isAITurn as contigAI } from '../../src/games/contig-60/ai';
import { createInitialState as starInit } from '../../src/games/star-track/types';
import { isAITurn as starAI } from '../../src/games/star-track/ai';

describe('Wave 42 handshake — Contig×Star AI gates', () => {
  it('human-vs-human false; matching seat true for both', () => {
    const c = contigInit();
    const s = starInit();
    expect(contigAI(c, 'player1', 'human-vs-human')).toBe(false);
    expect(starAI(s, 'player1', 'human-vs-human')).toBe(false);
    expect(contigAI(c, 'player1', 'human-vs-ai')).toBe(true);
    expect(starAI(s, 'player1', 'human-vs-ai')).toBe(true);
  });
});
