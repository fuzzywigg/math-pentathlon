/**
 * Wave 43 — placeBlock opponent-stuck win leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/hex-a-gone/types';
import {
  selectBlock,
  commitSelection,
  placeBlock,
} from '../../src/games/hex-a-gone/rules';

describe('Wave 43 hag — opponent stuck win', () => {
  it('after placing last empty cell, placer wins', () => {
    let s = createInitialState();
    // Fill all but one cell
    s = {
      ...s,
      board: s.board.map((c, i) =>
        i === 0 ? c : { ...c, filled: true, filledBy: 'player2' as const, blockId: i }
      ),
    };
    s = selectBlock(s, 'triangle');
    s = commitSelection(s);
    const empty = s.board.find((c) => !c.filled)!;
    const next = placeBlock(s, empty.q, empty.r);
    expect(next.phase).toBe('gameOver');
    expect(next.winner).toBe('player1');
  });
});
