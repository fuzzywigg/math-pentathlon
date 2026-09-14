/**
 * Wave 44 overnight HEAVY — Fab renderScores / renderMoveHistory smoke.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/fab-a-diffy/rules';
import { renderScores, renderMoveHistory } from '../../src/games/fab-a-diffy/board-ui';

describe('Wave 44 fab board-ui — scores/history', () => {
  it('renders scores and empty history', () => {
    const s = createInitialState();
    const scores = renderScores(s);
    expect(scores.textContent).toMatch(/Blue|Red|0/);
    const hist = renderMoveHistory(s);
    expect(hist).toBeTruthy();
  });

  it('history lists a synthetic move', () => {
    const s = createInitialState();
    const [b1, b2] = [...s.fractionBars.keys()];
    const [a1] = [...s.answerBars.keys()];
    const withMove = {
      ...s,
      moveHistory: [
        {
          player: 'player1' as const,
          bar1Id: b1,
          bar2Id: b2,
          operation: 'add' as const,
          resultId: a1,
          moveNumber: 1,
        },
      ],
    };
    const hist = renderMoveHistory(withMove);
    expect(hist.textContent).toMatch(/=|Blue|1/);
  });
});
