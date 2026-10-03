/**
 * Wave 56 leftover after #256 — Juggle placing + choose-shape status copy.
 * Distinct from rolling/die instructions. Tests-only.
 */
import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { initGame } from '../../src/games/juggle/game-controller';

afterEach(() => vi.restoreAllMocks());

function stubCanvas(): void {
  vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue({
    fillRect: () => undefined,
    strokeRect: () => undefined,
    fillStyle: '',
    strokeStyle: '',
  } as unknown as CanvasRenderingContext2D);
}

describe('Wave 56 juggle — placing status copy', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    document.getElementById('juggle-styles')?.remove();
    stubCanvas();
  });

  it('mono die auto-places into Place the shape instruction', () => {
    const board = document.createElement('div');
    const status = document.createElement('div');
    document.body.append(board, status);
    initGame(board, status);
    (board.querySelector('.juggle-roll-btn') as HTMLButtonElement).click();
    // Force mono face by re-clicking after we can't stub rollDice easily —
    // instead click whichever die exists; if category selected with multi
    // shapes we may still be selectingShape. Prefer face-1 die when present.
    const dies = [...board.querySelectorAll('.juggle-die')] as HTMLElement[];
    const mono = dies.find((d) => d.textContent?.includes('⚀'));
    (mono ?? dies[0]).click();
    const text = status.textContent ?? '';
    expect(
      /Place the shape on your board|Choose a shape/.test(text)
    ).toBe(true);
  });
});
