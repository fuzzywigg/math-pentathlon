/**
 * Wave 43 — Handshake calla×ramrod×stars AI opening moves. Tests-only.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';

import { createInitialState as callaInit } from '../../src/games/calla/types';
import { getAIMove as callaAI } from '../../src/games/calla/ai';
import { createInitialState as ramrodInit } from '../../src/games/ramrod/rules';
import { getAIMove as ramrodAI } from '../../src/games/ramrod/ai';
import { createInitialState as starsInit } from '../../src/games/stars-bars/rules';
import { getAIMove as starsAI } from '../../src/games/stars-bars/ai';

afterEach(() => vi.restoreAllMocks());

describe('Wave 43 handshake — calla×ramrod×stars AI', () => {
  it('each leftover engine returns a non-null opening AI move', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    expect(callaAI(callaInit(), 'player1', 'medium')).not.toBeNull();
    expect(ramrodAI(ramrodInit(), 'player1', 'medium')).not.toBeNull();
    expect(starsAI(starsInit(), 'player1', 'medium')).not.toBeNull();
  });
});
