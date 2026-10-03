/**
 * Wave 58 Contig/SD residual — Contig Red winner banner. Tests-only.
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

describe('Wave 58 contig — Red winner banner', () => {
  it('renders Red wins score pair', () => {
    const base = createInitialState();
    vi.spyOn(types, 'createInitialState').mockReturnValue({
      ...base,
      winner: 'player2',
      scores: { player1: 2, player2: 9 },
      phase: 'gameOver',
    });
    const board = document.createElement('div');
    const status = document.createElement('div');
    document.body.append(board, status);
    initGame(board, status);
    expect(status.querySelector('.contig-winner-banner')?.textContent).toMatch(
      /Red wins! 9 - 2/
    );
  });
});
