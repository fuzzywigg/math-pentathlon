/**
 * Wave 43 TOKENMAXX — Contig full-board / last-cell settle leftovers. Tests-only.
 * Full-board score-tie without 5-in-a-row is awkward on 6×10 (diags); deepen
 * last-empty-cell place settle + unequal points when alignment is absent.
 */
import { describe, it, expect } from 'vitest';
import { placeChip, checkWinner } from '../../src/games/contig-60/rules';
import { createInitialState } from '../../src/games/contig-60/types';

describe('Wave 43 contig — fullboard points win', () => {
  it('unequal scores on sparse board stay null without alignment', () => {
    const state = createInitialState();
    const cells = new Map(state.cells);
    const ids = [...cells.keys()];
    cells.set(ids[0], { ...cells.get(ids[0])!, owner: 'player1' });
    cells.set(ids[10], { ...cells.get(ids[10])!, owner: 'player2' });
    expect(
      checkWinner({
        ...state,
        cells,
        scores: { player1: 10, player2: 3 },
      })
    ).toBeNull();
  });

  it('placeChip on last empty cell can settle via checkWinner', () => {
    const state = createInitialState();
    const cells = new Map(state.cells);
    for (const [v, c] of cells) {
      if (v === 1) continue;
      cells.set(v, { ...c, owner: 'player2' });
    }
    const almost = {
      ...state,
      cells,
      phase: 'calculating' as const,
      currentDice: [1, 1, 1] as [number, number, number],
      scores: { player1: 0, player2: 50 },
    };
    const next = placeChip(almost, 1, '1');
    // board full after place; p2 leads on points → gameOver p2
    // (may also hit alignment for p2; either way settles gameOver)
    expect(next.phase).toBe('gameOver');
    expect(next.winner).toBe('player2');
    expect(next.cells.get(1)?.owner).toBe('player1');
  });
});
