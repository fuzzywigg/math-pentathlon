/**
 * Wave 59 Contig/SD residual — Contig pass elim via controller. Tests-only.
 */
import { describe, it, expect, afterEach, vi } from 'vitest';
import { createInitialState, CONFIG } from '../../src/games/contig-60/types';
import * as types from '../../src/games/contig-60/types';
import { initGame } from '../../src/games/contig-60/game-controller';

afterEach(() => {
  document.body.innerHTML = '';
  document.getElementById('contig-styles')?.remove();
  vi.restoreAllMocks();
});

describe('Wave 59 contig — pass elim controller', () => {
  it('Pass Turn at max-1 consecutive passes yields Red winner', () => {
    const base = createInitialState();
    const cells = new Map(base.cells);
    for (const [id, cell] of cells) {
      cells.set(id, { ...cell, owner: 'player2' });
    }
    vi.spyOn(types, 'createInitialState').mockReturnValue({
      ...base,
      cells,
      phase: 'calculating',
      currentDice: [1, 1, 1],
      consecutivePasses: {
        player1: CONFIG.MAX_CONSECUTIVE_PASSES - 1,
        player2: 0,
      },
    });
    const board = document.createElement('div');
    const status = document.createElement('div');
    document.body.append(board, status);
    initGame(board, status);
    (board.querySelector('.contig-pass-btn') as HTMLButtonElement).click();
    expect(status.querySelector('.contig-winner-banner')?.textContent).toMatch(
      /Red wins/
    );
  });
});
