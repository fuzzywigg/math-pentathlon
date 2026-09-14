/**
 * Wave 43 — Hex-a-Gone executeAITurn select→place seat flip. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/hex-a-gone/types';
import { executeAITurn, isAITurn } from '../../src/games/hex-a-gone/ai';

describe('Wave 43 hex-a-gone — AI execute seat flip', () => {
  it('easy AI completes a turn and flips to player2', () => {
    const state = createInitialState();
    expect(isAITurn(state, 'player1', 'human-vs-ai')).toBe(true);
    const next = executeAITurn(state, 'player1', 'easy');
    expect(next.currentPlayer).toBe('player2');
    expect(next.phase).toBe('selectBlocks');
    expect(next.placedBlocks.length).toBeGreaterThan(0);
    expect(next.moveHistory.length).toBe(1);
  });
});
