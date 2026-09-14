/**
 * Wave 42 leftovers B — Fab medium/hard getAIMove returns complete move shape.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';

import { getAIMove, executeAITurn } from '../../src/games/fab-a-diffy/ai';
import {
  createInitialState,
  hasAnyValidMove,
} from '../../src/games/fab-a-diffy/rules';

describe('Wave 42 fab — AI difficulty move shape', () => {
  it('medium and hard return bar/op/answer ids when moves exist', () => {
    const state = createInitialState();
    expect(hasAnyValidMove(state)).toBe(true);
    for (const diff of ['medium', 'hard'] as const) {
      const move = getAIMove(state, 'player1', diff);
      expect(move).not.toBeNull();
      expect(move!.bar1Id).toBeTruthy();
      expect(move!.bar2Id).toBeTruthy();
      expect(move!.bar1Id).not.toBe(move!.bar2Id);
      expect(['add', 'subtract', 'multiply', 'divide']).toContain(
        move!.operation
      );
      expect(state.answerBars.has(move!.answerId)).toBe(true);
    }
  });

  it('executeAITurn hard advances problemsCompleted-equivalent claim count', () => {
    const before = createInitialState();
    const after = executeAITurn(before, 'player1', 'hard');
    const claimedBefore = [...before.answerBars.values()].filter(
      (a) => a.claimedBy
    ).length;
    const claimedAfter = [...after.answerBars.values()].filter(
      (a) => a.claimedBy
    ).length;
    expect(claimedAfter).toBe(claimedBefore + 1);
  });
});
