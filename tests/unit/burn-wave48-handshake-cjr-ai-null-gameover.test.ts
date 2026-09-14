/**
 * Wave 48 — CJR AI null on gameOver handshake. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState as callaInit } from '../../src/games/calla/types';
import { createInitialState as juggleInit } from '../../src/games/juggle/rules';
import { createInitialState as ramrodInit } from '../../src/games/ramrod/rules';
import { getAIMove as callaMove } from '../../src/games/calla/ai';
import { getAIDieChoice } from '../../src/games/juggle/ai';
import { getAIMove as ramrodMove } from '../../src/games/ramrod/ai';

describe('Wave 48 handshake — CJR gameOver AI null', () => {
  it('AI helpers null when phase gameOver', () => {
    const c = { ...callaInit(), phase: 'gameOver' as const, winner: 'player1' as const };
    const j = { ...juggleInit(), phase: 'gameOver' as const, winner: 'player1' as const };
    const r = { ...ramrodInit(), phase: 'gameOver' as const, winner: 'player1' as const };
    expect(callaMove(c, 'player1', 'easy')).toBeNull();
    expect(getAIDieChoice(j, 'player1', 'easy')).toBeNull();
    expect(ramrodMove(r, 'player1', 'easy')).toBeNull();
  });
});
