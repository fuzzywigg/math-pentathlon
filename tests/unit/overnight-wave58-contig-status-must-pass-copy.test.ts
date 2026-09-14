/**
 * Wave 58 Contig/SD residual — Contig must-pass status copy. Tests-only.
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

describe('Wave 58 contig — must-pass status', () => {
  it('calculating with no valids shows must-pass instruction', () => {
    const jammed = createInitialState();
    const cells = new Map(jammed.cells);
    for (const [id, cell] of cells) {
      cells.set(id, { ...cell, owner: 'player2' });
    }
    vi.spyOn(types, 'createInitialState').mockReturnValue({
      ...jammed,
      cells,
      phase: 'calculating',
      currentDice: [1, 1, 1],
    });
    const board = document.createElement('div');
    const status = document.createElement('div');
    document.body.append(board, status);
    initGame(board, status);
    expect(status.textContent).toContain('No valid moves - you must pass');
  });
});
