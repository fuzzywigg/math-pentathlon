/**
 * Wave 59 Contig/SD residual — Contig nonzero score chrome. Tests-only.
 */
import { describe, it, expect, afterEach, vi } from 'vitest';
import { createInitialState } from '../../src/games/contig-60/types';
import * as types from '../../src/games/contig-60/types';
import { initGame } from '../../src/games/contig-60/game-controller';

afterEach(() => {
  document.body.innerHTML = '';
  document.getElementById('contig-styles')?.remove();
  vi.restoreAllMocks();
});

describe('Wave 59 contig — nonzero scores', () => {
  it('renders Blue 7 and Red 4 pts', () => {
    const base = createInitialState();
    vi.spyOn(types, 'createInitialState').mockReturnValue({
      ...base,
      scores: { player1: 7, player2: 4 },
    });
    const board = document.createElement('div');
    const status = document.createElement('div');
    document.body.append(board, status);
    initGame(board, status);
    expect(board.querySelector('.contig-score-p1')?.textContent).toMatch(
      /Blue:.*7.*pts/
    );
    expect(board.querySelector('.contig-score-p2')?.textContent).toMatch(
      /Red:.*4.*pts/
    );
  });
});
