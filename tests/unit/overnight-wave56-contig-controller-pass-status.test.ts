/**
 * Overnight TOKENMAXX HEAVY leftovers after #256 — Contig controller pass status. Tests-only.
 */
import { describe, it, expect, afterEach, vi } from 'vitest';
import { initGame } from '../../src/games/contig-60/game-controller';
import * as rules from '../../src/games/contig-60/rules';

afterEach(() => {
  document.body.innerHTML = '';
  document.getElementById('contig-styles')?.remove();
  vi.restoreAllMocks();
});

describe('Wave 56 contig — controller pass status', () => {
  it('calculating with no moves shows must-pass leftover', () => {
    vi.spyOn(rules, 'hasValidMoves').mockReturnValue(false);
    vi.spyOn(Math, 'random').mockReturnValue(0.5);

    const board = document.createElement('div');
    const status = document.createElement('div');
    document.body.appendChild(board);
    document.body.appendChild(status);
    initGame(board, status);

    const roll = board.querySelector('.contig-roll-btn') as HTMLButtonElement;
    expect(roll).toBeTruthy();
    roll.click();
    expect(status.textContent).toMatch(/No valid moves - you must pass/);
  });
});
