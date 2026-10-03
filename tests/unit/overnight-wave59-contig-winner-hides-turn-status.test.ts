/**
 * Wave 59 Contig/SD residual — Contig winner hides turn status. Tests-only.
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

describe('Wave 59 contig — winner hides turn status', () => {
  it('banner present and .contig-status absent', () => {
    const base = createInitialState();
    vi.spyOn(types, 'createInitialState').mockReturnValue({
      ...base,
      winner: 'player1',
      scores: { player1: 4, player2: 1 },
      phase: 'gameOver',
    });
    const board = document.createElement('div');
    const status = document.createElement('div');
    document.body.append(board, status);
    initGame(board, status);
    expect(status.querySelector('.contig-winner-banner')).toBeTruthy();
    expect(status.querySelector('.contig-status')).toBeNull();
  });
});
