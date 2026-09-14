/**
 * Wave 56 leftover after #256 — Juggle controller Choose a shape status.
 * Complements mono auto-place path with multi-shape die=3. Tests-only.
 */
import { describe, it, expect, afterEach, vi } from 'vitest';
import {
  initGame,
  newGameVsHuman,
} from '../../src/games/juggle/game-controller';

function stubCanvas(): void {
  vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue({
    fillRect: () => undefined,
    strokeRect: () => undefined,
    fillStyle: '',
    strokeStyle: '',
  } as unknown as CanvasRenderingContext2D);
}

afterEach(() => {
  document.body.innerHTML = '';
  vi.restoreAllMocks();
});

describe('Wave 56 juggle — controller choose-shape status', () => {
  it('shows Choose a shape after selecting a multi-shape die', () => {
    stubCanvas();
    // Math.random()*6+1 → floor(0.4*6)+1 = 3 (tromino pool)
    vi.spyOn(Math, 'random').mockReturnValue(0.4);
    const board = document.createElement('div');
    const status = document.createElement('div');
    document.body.append(board, status);
    initGame(board, status);
    newGameVsHuman();

    board.querySelector('.juggle-roll-btn')?.dispatchEvent(
      new MouseEvent('click', { bubbles: true })
    );
    (board.querySelectorAll('.juggle-die.selectable')[0] as HTMLElement).click();
    expect(status.querySelector('.juggle-status')?.textContent).toMatch(
      /Choose a shape/
    );
    expect(board.querySelector('.juggle-shape-header')?.textContent).toMatch(
      /Choose a tromino:/i
    );
  });
});
