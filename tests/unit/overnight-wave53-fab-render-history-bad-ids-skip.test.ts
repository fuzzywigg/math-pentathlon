/**
 * Wave 53 leftover after #235 — Fab history bad ids skipped. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/fab-a-diffy/rules';
import { renderMoveHistory } from '../../src/games/fab-a-diffy/board-ui';

describe('Wave 53 fab — history bad ids', () => {
  it('skips moves with missing bar/answer ids', () => {
    const s = createInitialState();
    const el = renderMoveHistory({
      ...s,
      moveHistory: [
        {
          player: 'player1',
          bar1Id: 'missing-a',
          bar2Id: 'missing-b',
          operation: 'add',
          resultId: 'missing-ans',
          moveNumber: 1,
        },
      ],
    });
    expect(el.querySelectorAll('.fab-history-move').length).toBe(0);
  });
});
