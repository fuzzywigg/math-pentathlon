/**
 * Wave 56 leftover after #256 — Juggle controller status phase instructions.
 * Exact leftovers beyond burn-wave27 fuzzy /die|shape|Roll/ match. Tests-only.
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

describe('Wave 56 juggle — controller status phases', () => {
  it('opens on Roll the dice then advances die/shape/place instructions', () => {
    stubCanvas();
    vi.spyOn(Math, 'random').mockReturnValue(0); // die faces → 1
    const board = document.createElement('div');
    const status = document.createElement('div');
    document.body.append(board, status);
    initGame(board, status);
    newGameVsHuman();

    expect(status.getAttribute('aria-live')).toBe('polite');
    expect(status.querySelector('.juggle-status')?.textContent).toMatch(
      /Blue's turn/
    );
    expect(status.querySelector('.juggle-status')?.textContent).toMatch(
      /Roll the dice/
    );

    board.querySelector('.juggle-roll-btn')?.dispatchEvent(
      new MouseEvent('click', { bubbles: true })
    );
    expect(status.querySelector('.juggle-status')?.textContent).toMatch(
      /Click a die to choose shape category/
    );

    (board.querySelectorAll('.juggle-die.selectable')[0] as HTMLElement).click();
    // die=1 auto-selects monomino → placing
    expect(status.querySelector('.juggle-status')?.textContent).toMatch(
      /Place the shape on your board/
    );
  });
});
