/**
 * Wave 62 leftover after #293 — Juggle Choose a shape status exact seat.
 * Tightens wave58 soft /Choose a shape/. Tests-only.
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { initGame } from '../../src/games/juggle/game-controller';

afterEach(() => vi.restoreAllMocks());

describe('Wave 62 juggle — status choose-shape exact seat', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    document.getElementById('juggle-styles')?.remove();
    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue({
      fillRect: () => undefined,
      strokeRect: () => undefined,
      fillStyle: '',
      strokeStyle: '',
    } as unknown as CanvasRenderingContext2D);
    let n = 0;
    vi.spyOn(Math, 'random').mockImplementation(() => {
      const seq = [2 / 6, 3 / 6]; // 3,4 tromino/tetromino
      return seq[n++ % 2]!;
    });
  });

  it('after selecting tromino die shows exact Choose a shape', () => {
    const board = document.createElement('div');
    const status = document.createElement('div');
    document.body.append(board, status);
    initGame(board, status);
    (board.querySelector('.juggle-roll-btn') as HTMLButtonElement).click();
    const trominoDie = [
      ...board.querySelectorAll('.juggle-die-container'),
    ].find((c) => c.textContent?.includes('Tromino'))
      ?.querySelector('.juggle-die') as HTMLElement;
    expect(trominoDie).toBeTruthy();
    trominoDie.click();
    expect(status.querySelector('.juggle-status')?.textContent?.trim()).toBe(
      "🔵 Blue's turn - Choose a shape"
    );
  });
});
