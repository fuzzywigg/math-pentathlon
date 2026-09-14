/**
 * Overnight TOKENMAXX HEAVY leftovers after #256 — Contig controller winner banner. Tests-only.
 */
import { describe, it, expect, afterEach, vi } from 'vitest';
import * as types from '../../src/games/contig-60/types';
import { initGame } from '../../src/games/contig-60/game-controller';

afterEach(() => {
  document.body.innerHTML = '';
  document.getElementById('contig-styles')?.remove();
  vi.restoreAllMocks();
});

describe('Wave 56 contig — controller winner banner', () => {
  it('forged winner mounts Blue wins banner leftover', () => {
    const base = types.createInitialState();
    vi.spyOn(types, 'createInitialState').mockReturnValue({
      ...base,
      winner: 'player1',
      scores: { player1: 12, player2: 5 },
    });
    const board = document.createElement('div');
    const status = document.createElement('div');
    document.body.appendChild(board);
    document.body.appendChild(status);
    initGame(board, status);
    expect(status.querySelector('.contig-winner-banner')?.textContent).toMatch(/Blue wins!/);
    expect(status.querySelector('.contig-winner-banner')?.textContent).toMatch(/12 - 5/);
  });
});
