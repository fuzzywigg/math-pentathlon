/**
 * Wave 58 Contig/SD residual — Contig (N/3 passes) status warning. Tests-only.
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

describe('Wave 58 contig — pass warning', () => {
  it('appends (2/3 passes) when consecutivePasses > 0', () => {
    const base = createInitialState();
    vi.spyOn(types, 'createInitialState').mockReturnValue({
      ...base,
      consecutivePasses: { player1: 2, player2: 0 },
      phase: 'rolling',
    });
    const board = document.createElement('div');
    const status = document.createElement('div');
    document.body.append(board, status);
    initGame(board, status);
    // Source: ` (${passes}/${3} passes)` → "(2/3 passes)"
    expect(status.textContent).toContain('(2/3 passes)');
  });
});
