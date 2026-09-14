/**
 * Wave 57 leftover after #267 — Contig calculating status when moves exist. Tests-only.
 */
import { describe, it, expect, afterEach, vi } from 'vitest';
import { initGame } from '../../src/games/contig-60/game-controller';

afterEach(() => {
  document.body.innerHTML = '';
  document.getElementById('contig-styles')?.remove();
  vi.restoreAllMocks();
});

describe('Wave 57 contig — status calculating copy', () => {
  it('after roll with moves shows choose-number instruction', () => {
    // Force dice 1,2,3 so many expressions exist on opening board
    let n = 0;
    vi.spyOn(Math, 'random').mockImplementation(() => {
      const vals = [0.0, 0.16, 0.33]; // ~1,2,3
      const v = vals[n % 3]!;
      n += 1;
      return v;
    });
    const board = document.createElement('div');
    const status = document.createElement('div');
    document.body.append(board, status);
    initGame(board, status);
    (board.querySelector('.contig-roll-btn') as HTMLButtonElement).click();
    const text = status.querySelector('.contig-status')?.textContent ?? '';
    expect(text).toContain('Choose a number to place your chip');
  });
});
