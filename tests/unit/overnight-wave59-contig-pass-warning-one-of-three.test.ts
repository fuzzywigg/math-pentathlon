/**
 * Wave 59 Contig/SD residual — Contig (1/3 passes) warning. Tests-only.
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

describe('Wave 59 contig — 1/3 passes', () => {
  it('appends (1/3 passes) when consecutivePasses is 1', () => {
    const base = createInitialState();
    vi.spyOn(types, 'createInitialState').mockReturnValue({
      ...base,
      consecutivePasses: { player1: 1, player2: 0 },
      phase: 'rolling',
    });
    const board = document.createElement('div');
    const status = document.createElement('div');
    document.body.append(board, status);
    initGame(board, status);
    expect(status.textContent).toContain('(1/3 passes)');
  });
});
