/**
 * Wave 48 — Ramrod medium randomness band. Tests-only.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';
import { createInitialState } from '../../src/games/ramrod/rules';
import { getAIMove } from '../../src/games/ramrod/ai';

afterEach(() => vi.restoreAllMocks());

describe('Wave 48 ramrod — medium random', () => {
  it('medium with random in band still legal', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.1);
    const s = createInitialState();
    const move = getAIMove(s, 'player1', 'medium');
    expect(move).not.toBeNull();
    expect(s.playerRods.player1).toContain(move!.rodId);
  });
});
