/**
 * Wave 48 — Calla×Juggle×Ramrod opening handshake leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState as callaInit } from '../../src/games/calla/types';
import { createInitialState as juggleInit } from '../../src/games/juggle/rules';
import { createInitialState as ramrodInit } from '../../src/games/ramrod/rules';

describe('Wave 48 handshake — CJR openings', () => {
  it('all three open on player1 with distinct phases', () => {
    const c = callaInit();
    const j = juggleInit();
    const r = ramrodInit();
    expect(c.currentPlayer).toBe('player1');
    expect(j.currentPlayer).toBe('player1');
    expect(r.currentPlayer).toBe('player1');
    expect(c.phase).toBe('selectPit');
    expect(j.phase).toBe('rolling');
    expect(r.phase).toBe('selectingRod');
  });
});
