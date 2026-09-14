/**
 * Wave 49 — Par55 history seat class leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/par-55/rules';
import { renderMoveHistory } from '../../src/games/par-55/board-ui';
import type { Par55Move } from '../../src/games/par-55/types';

describe('Wave 49 par55 — history seat class', () => {
  it('applies player1/player2 class on rows', () => {
    const base = createInitialState();
    const block = base.hands.player1[0]!;
    const moves: Par55Move[] = [
      { player: 'player1', block, baseId: 'x', pointsScored: 1, matchDetails: [], moveNumber: 1 },
      { player: 'player2', block, baseId: 'y', pointsScored: 2, matchDetails: [], moveNumber: 2 },
    ];
    const el = renderMoveHistory({ ...base, moveHistory: moves });
    expect(el.querySelector('.par55-history-move.player1')).toBeTruthy();
    expect(el.querySelector('.par55-history-move.player2')).toBeTruthy();
  });
});
