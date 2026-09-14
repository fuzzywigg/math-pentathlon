/**
 * Wave 51 leftover after #233 — Par55 history entry points. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/par-55/rules';
import { renderMoveHistory } from '../../src/games/par-55/board-ui';

describe('Wave 51 par55 — history points', () => {
  it('formats Blue entry with (+points)', () => {
    const base = createInitialState();
    const block = base.hands.player1[0];
    const state = {
      ...base,
      moveHistory: [
        {
          moveNumber: 1,
          player: 'player1' as const,
          block,
          baseId: 'b0',
          pointsScored: 5,
        },
      ],
    };
    const el = renderMoveHistory(state);
    expect(el.querySelector('.par55-history-move.player1')?.textContent).toMatch(
      /1\.\s*Blue: .* \(\+5\)/
    );
  });
});
