/**
 * Wave 48 handshake — AI seat gates across three leftover engines. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState as callaInit } from '../../src/games/calla/types';
import { createInitialState as ramrodInit } from '../../src/games/ramrod/rules';
import { createInitialState as juggleInit } from '../../src/games/juggle/rules';
import { isAITurn as callaAI } from '../../src/games/calla/ai';
import { isAITurn as ramrodAI } from '../../src/games/ramrod/ai';
import { isAITurn as juggleAI } from '../../src/games/juggle/ai';

describe('Wave 48 handshake — AI seat gates', () => {
  it('hvAI true only for current seat; hvH false', () => {
    expect(callaAI(callaInit(), 'player1', 'human-vs-ai')).toBe(true);
    expect(callaAI(callaInit(), 'player1', 'human-vs-human')).toBe(false);
    expect(ramrodAI(ramrodInit(), 'player1', 'human-vs-ai')).toBe(true);
    expect(ramrodAI(ramrodInit(), 'player2', 'human-vs-ai')).toBe(false);
    expect(juggleAI(juggleInit(), 'player1', 'human-vs-ai')).toBe(true);
    expect(juggleAI(juggleInit(), null, 'human-vs-ai')).toBe(false);
  });
});
