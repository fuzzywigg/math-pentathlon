/**
 * Wave 48 — Calla×Juggle×Ramrod isAITurn seat asymmetry handshake. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState as callaInit } from '../../src/games/calla/types';
import { createInitialState as juggleInit } from '../../src/games/juggle/rules';
import { createInitialState as ramrodInit } from '../../src/games/ramrod/rules';
import { isAITurn as callaAI } from '../../src/games/calla/ai';
import { isAITurn as juggleAI } from '../../src/games/juggle/ai';
import { isAITurn as ramrodAI } from '../../src/games/ramrod/ai';

describe('Wave 48 handshake — CJR AI seats', () => {
  it('p1 AI turn true; p2 false; HvH false across engines', () => {
    const c = callaInit();
    const j = juggleInit();
    const r = ramrodInit();
    expect(callaAI(c, 'player1', 'human-vs-ai')).toBe(true);
    expect(juggleAI(j, 'player1', 'human-vs-ai')).toBe(true);
    expect(ramrodAI(r, 'player1', 'human-vs-ai')).toBe(true);
    expect(callaAI(c, 'player2', 'human-vs-ai')).toBe(false);
    expect(juggleAI(j, 'player2', 'human-vs-ai')).toBe(false);
    expect(ramrodAI(r, 'player2', 'human-vs-ai')).toBe(false);
    expect(callaAI(c, 'player1', 'human-vs-human')).toBe(false);
  });
});
