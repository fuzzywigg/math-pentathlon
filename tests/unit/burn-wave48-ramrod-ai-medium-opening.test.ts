/**
 * Wave 48 — Ramrod medium AI opening move legal (no hard loops). Tests-only.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';
import { createInitialState } from '../../src/games/ramrod/rules';
import { getAIMove, isAITurn } from '../../src/games/ramrod/ai';

afterEach(() => vi.restoreAllMocks());

describe('Wave 48 ramrod — AI medium opening', () => {
  it('returns rod/box/slot from opening hand', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    const s = createInitialState();
    const move = getAIMove(s, 'player1', 'medium');
    expect(move).not.toBeNull();
    expect(s.playerRods.player1).toContain(move!.rodId);
    expect(move!.boxId).toMatch(/^box-/);
    expect([0, 1]).toContain(move!.slot);
    expect(isAITurn(s, 'player1', 'human-vs-ai')).toBe(true);
  });
});
