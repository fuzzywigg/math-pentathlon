/**
 * Wave 48 — Handshake juggle/ramrod openings. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState as juggleInit } from '../../src/games/juggle/rules';
import { createInitialState as ramrodInit } from '../../src/games/ramrod/rules';
import { isAITurn as juggleAI } from '../../src/games/juggle/ai';
import { isAITurn as ramrodAI } from '../../src/games/ramrod/ai';

describe('Wave 48 handshake — juggle/ramrod openings', () => {
  it('both open on p1; AI turn only in hvai', () => {
    const j = juggleInit();
    const r = ramrodInit();
    expect(j.currentPlayer).toBe('player1');
    expect(r.currentPlayer).toBe('player1');
    expect(juggleAI(j, 'player1', 'human-vs-ai')).toBe(true);
    expect(ramrodAI(r, 'player1', 'human-vs-ai')).toBe(true);
    expect(juggleAI(j, 'player1', 'human-vs-human')).toBe(false);
    expect(ramrodAI(r, 'player1', 'human-vs-human')).toBe(false);
  });
});
