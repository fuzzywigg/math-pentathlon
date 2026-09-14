/**
 * Overnight HEAVY — executeAITurn roll+place happy for hard AI.
 * Distinct leftover vs wave42 execute-turn smoke. Tests-only.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';
import { executeAITurn } from '../../src/games/prime-gold/ai';
import { createInitialState } from '../../src/games/prime-gold/rules';

afterEach(() => vi.restoreAllMocks());

describe('Overnight prime — execute place happy', () => {
  it('from rolling, hard AI places and leaves fewer chips', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    const open = createInitialState();
    const next = executeAITurn(open, 'player1', 'hard');
    expect(next.playerChips.player1).toBe(open.playerChips.player1 - 1);
    expect(next.moveHistory.length).toBeGreaterThan(0);
  });
});
