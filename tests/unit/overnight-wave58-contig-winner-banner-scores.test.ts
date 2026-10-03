/**
 * Wave 58 Contig/SD residual — Contig winner banner score pair. Tests-only.
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

describe('Wave 58 contig — winner banner', () => {
  it('renders Blue wins with score pair + shared banner class', () => {
    const base = createInitialState();
    vi.spyOn(types, 'createInitialState').mockReturnValue({
      ...base,
      winner: 'player1',
      scores: { player1: 5, player2: 3 },
      phase: 'gameOver',
    });
    const board = document.createElement('div');
    const status = document.createElement('div');
    document.body.append(board, status);
    initGame(board, status);
    const banner = status.querySelector('.contig-winner-banner');
    expect(banner?.textContent).toMatch(/Blue wins! 5 - 3/);
    expect(banner?.classList.contains('game-winner-banner')).toBe(true);
  });
});
