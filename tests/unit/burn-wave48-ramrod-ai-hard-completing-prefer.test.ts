/**
 * Wave 48 — Ramrod hard prefers a legal move on opening. Tests-only.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';
import { createInitialState } from '../../src/games/ramrod/rules';
import { getAIMove } from '../../src/games/ramrod/ai';

afterEach(() => vi.restoreAllMocks());

describe('Wave 48 ramrod — hard opening move', () => {
  it('returns rod in hand and valid box/slot', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    const s = createInitialState();
    const move = getAIMove(s, 'player1', 'hard');
    expect(move).not.toBeNull();
    expect(s.playerRods.player1).toContain(move!.rodId);
    expect(move!.boxId).toMatch(/^box-/);
    expect([0, 1]).toContain(move!.slot);
  });
});
