/**
 * Wave 53 leftover after #235 — Fab history slice(-10). Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/fab-a-diffy/rules';
import { renderMoveHistory } from '../../src/games/fab-a-diffy/board-ui';

describe('Wave 53 fab — history slice ten', () => {
  it('keeps only last 10 history moves', () => {
    const s = createInitialState();
    const [b1, b2] = [...s.fractionBars.keys()];
    const [a1] = [...s.answerBars.keys()];
    const moveHistory = Array.from({ length: 11 }, (_, i) => ({
      player: (i % 2 === 0 ? 'player1' : 'player2') as const,
      bar1Id: b1,
      bar2Id: b2,
      operation: 'add' as const,
      resultId: a1,
      moveNumber: i + 1,
    }));
    const el = renderMoveHistory({ ...s, moveHistory });
    expect(el.querySelectorAll('.fab-history-move').length).toBe(10);
    expect(el.querySelector('.fab-move-num')?.textContent).toBe('2.');
  });
});
