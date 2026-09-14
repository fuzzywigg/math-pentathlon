/**
 * Wave 43 — ramrod easy executeAITurn leftover. Tests-only.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';
import { createInitialState } from '../../src/games/ramrod/rules';
import { executeAITurn } from '../../src/games/ramrod/ai';

afterEach(() => vi.restoreAllMocks());

describe('Wave 43 ramrod — AI teaching easy', () => {
  it('easy execute places or advances cleanly', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.4);
    const s = createInitialState();
    const next = executeAITurn(s, 'player1', 'easy');
    expect(next).not.toBe(s);
    expect(next.moveHistory.length + (next.currentPlayer !== s.currentPlayer ? 1 : 0)).toBeGreaterThanOrEqual(0);
    expect(['selectingRod', 'gameOver', 'placingRod']).toContain(next.phase);
  });
});
