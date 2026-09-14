/**
 * Wave 58 Contig/SD residual — Contig newGameVsHuman resets scores. Tests-only.
 */
import { describe, it, expect, afterEach, vi } from 'vitest';
import { createInitialState } from '../../src/games/contig-60/types';
import * as types from '../../src/games/contig-60/types';
import {
  initGame,
  newGameVsHuman,
} from '../../src/games/contig-60/game-controller';

afterEach(() => {
  document.body.innerHTML = '';
  document.getElementById('contig-styles')?.remove();
  vi.restoreAllMocks();
});

describe('Wave 58 contig — newGameVsHuman reset', () => {
  it('clears winner banner back to rolling status', () => {
    const fresh = createInitialState();
    const over = {
      ...createInitialState(),
      winner: 'player1' as const,
      scores: { player1: 8, player2: 1 },
      phase: 'gameOver' as const,
    };
    vi.spyOn(types, 'createInitialState')
      .mockReturnValueOnce(over)
      .mockReturnValue(fresh);
    const board = document.createElement('div');
    const status = document.createElement('div');
    document.body.append(board, status);
    initGame(board, status);
    expect(status.querySelector('.contig-winner-banner')).toBeTruthy();
    newGameVsHuman();
    expect(status.querySelector('.contig-winner-banner')).toBeNull();
    expect(status.textContent).toContain('Roll the dice');
  });
});
