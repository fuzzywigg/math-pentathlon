/**
 * Wave 48 — Ramrod executeAITurn passes when no valids. Tests-only.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';
import { createInitialState } from '../../src/games/ramrod/rules';
import { executeAITurn } from '../../src/games/ramrod/ai';

afterEach(() => vi.restoreAllMocks());

describe('Wave 48 ramrod — execute pass empty hand', () => {
  it('empty hand triggers passTurn seat flip', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    const s = createInitialState();
    const empty = {
      ...s,
      playerRods: { ...s.playerRods, player1: [] as string[] },
    };
    const next = executeAITurn(empty, 'player1', 'hard');
    expect(next.currentPlayer).toBe('player2');
    expect(next.selectedRod).toBeNull();
  });
});
