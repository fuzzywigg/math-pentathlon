/**
 * Wave 43 — juggle/hag isAITurn handshake leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState as juggleInit } from '../../src/games/juggle/rules';
import { createInitialState as hagInit } from '../../src/games/hex-a-gone/types';
import { isAITurn as juggleIsAI } from '../../src/games/juggle/ai';
import { isAITurn as hagIsAI } from '../../src/games/hex-a-gone/ai';

describe('Wave 43 handshake — juggle hag isAITurn', () => {
  it('hvh false; hvai matching seat true', () => {
    const j = juggleInit();
    const h = hagInit();
    expect(juggleIsAI(j, 'player1', 'human-vs-human')).toBe(false);
    expect(hagIsAI(h, 'player1', 'human-vs-human')).toBe(false);
    expect(juggleIsAI(j, 'player1', 'human-vs-ai')).toBe(true);
    expect(hagIsAI(h, 'player1', 'human-vs-ai')).toBe(true);
    expect(juggleIsAI(j, 'player2', 'human-vs-ai')).toBe(false);
  });
});
