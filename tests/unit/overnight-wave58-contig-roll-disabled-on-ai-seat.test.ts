/**
 * Wave 58 Contig/SD residual — Contig roll disabled on AI seat. Tests-only.
 */
import { describe, it, expect, afterEach, vi } from 'vitest';
import { createInitialState } from '../../src/games/contig-60/types';
import * as types from '../../src/games/contig-60/types';
import { initGame, newGameVsAI } from '../../src/games/contig-60/game-controller';

afterEach(() => {
  document.body.innerHTML = '';
  document.getElementById('contig-styles')?.remove();
  vi.restoreAllMocks();
});

describe('Wave 58 contig — AI seat roll gate', () => {
  it('disables roll when currentPlayer is AI seat', () => {
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
    newGameVsAI('easy');
    const btn = board.querySelector('.contig-roll-btn') as HTMLButtonElement;
    expect(btn.disabled).toBe(true);
  });
});
