/**
 * Wave 59 Contig/SD residual — Contig Red turn status copy. Tests-only.
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

describe('Wave 59 contig — Red turn status', () => {
  it('shows Red turn + player2 status class', () => {
    const base = createInitialState();
    vi.spyOn(types, 'createInitialState').mockReturnValue({
      ...base,
      currentPlayer: 'player2',
      phase: 'rolling',
    });
    const board = document.createElement('div');
    const status = document.createElement('div');
    document.body.append(board, status);
    initGame(board, status);
    expect(status.textContent).toMatch(/Red's turn/);
    expect(status.querySelector('.contig-status.player2')).toBeTruthy();
  });
});
