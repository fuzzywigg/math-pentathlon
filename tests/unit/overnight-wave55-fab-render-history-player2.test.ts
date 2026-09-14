/**
 * Wave 55 leftover after #249/#250 — Fab history player2 row leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/fab-a-diffy/rules';
import { renderMoveHistory } from '../../src/games/fab-a-diffy/board-ui';

describe('Wave 55 fab — history player2', () => {
  it('renders player2 class and dotted move number', () => {
    const s = createInitialState();
    const [b1, b2] = [...s.fractionBars.keys()];
    const [a1] = [...s.answerBars.keys()];
    const el = renderMoveHistory({
      ...s,
      moveHistory: [
        {
          player: 'player2',
          bar1Id: b1,
          bar2Id: b2,
          operation: 'subtract',
          resultId: a1,
          moveNumber: 7,
        },
      ],
    });
    const move = el.querySelector('.fab-history-move.fab-history-player2');
    expect(move).toBeTruthy();
    expect(move?.querySelector('.fab-move-num')?.textContent).toBe('7.');
  });
});
