/**
 * Wave 53 leftover after #235 — Fab history entry player class. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/fab-a-diffy/rules';
import { renderMoveHistory, getPlayerName } from '../../src/games/fab-a-diffy/board-ui';
import { getOperationSymbol } from '../../src/games/fab-a-diffy/rules';

describe('Wave 53 fab — history entry', () => {
  it('renders player1 history move with number and op symbol', () => {
    const s = createInitialState();
    const [b1, b2] = [...s.fractionBars.keys()];
    const [a1] = [...s.answerBars.keys()];
    const op = 'add' as const;
    const el = renderMoveHistory({
      ...s,
      moveHistory: [
        { player: 'player1', bar1Id: b1, bar2Id: b2, operation: op, resultId: a1, moveNumber: 1 },
      ],
    });
    const move = el.querySelector('.fab-history-move.fab-history-player1');
    expect(move).toBeTruthy();
    expect(move?.querySelector('.fab-move-num')?.textContent).toBe('1.');
    expect(move?.querySelector('.fab-move-expr')?.textContent).toContain(getOperationSymbol(op));
    expect(getPlayerName('player1')).toBe('Blue');
  });
});
