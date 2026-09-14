/**
 * Wave 48 — Ramrod getAIMove null when no valids. Tests-only.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';
import { createInitialState } from '../../src/games/ramrod/rules';
import { getAIMove } from '../../src/games/ramrod/ai';

afterEach(() => vi.restoreAllMocks());

describe('Wave 48 ramrod — null no valids', () => {
  it('empty hand returns null', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    const s = createInitialState();
    expect(getAIMove({ ...s, playerRods: { ...s.playerRods, player1: [] } }, 'player1')).toBeNull();
  });
});
