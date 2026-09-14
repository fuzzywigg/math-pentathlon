/**
 * Wave 56 leftover after #256 — Juggle rotate/flip control chrome.
 * Distinct from wave55 mono zero-button case. Tests-only.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';
import { createInitialState } from '../../src/games/juggle/rules';
import { SHAPE_POOLS } from '../../src/games/juggle/types';
import { renderShapeControls } from '../../src/games/juggle/board-ui';

afterEach(() => vi.restoreAllMocks());

function stubCanvas(): void {
  vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue({
    fillRect: () => undefined,
    strokeRect: () => undefined,
    fillStyle: '',
    strokeStyle: '',
  } as unknown as CanvasRenderingContext2D);
}

describe('Wave 56 juggle — rotate flip controls', () => {
  it('shows Rotate and Flip for a rotatable flippable tromino', () => {
    stubCanvas();
    const shape = SHAPE_POOLS.tromino.find((s) => s.canRotate && s.canFlip);
    expect(shape).toBeTruthy();
    const onRotate = vi.fn();
    const onFlip = vi.fn();
    const el = renderShapeControls(
      {
        ...createInitialState(),
        phase: 'placing',
        selectedShape: shape!,
        selectedCategory: 'tromino',
        currentDice: [3, 1],
      },
      onRotate,
      onFlip
    );
    const texts = [...el.querySelectorAll('.juggle-control-btn')].map(
      (b) => b.textContent
    );
    expect(texts).toContain('↻ Rotate');
    expect(texts).toContain('↔ Flip');
    (
      [...el.querySelectorAll('.juggle-control-btn')].find(
        (b) => b.textContent === '↻ Rotate'
      ) as HTMLButtonElement
    ).click();
    (
      [...el.querySelectorAll('.juggle-control-btn')].find(
        (b) => b.textContent === '↔ Flip'
      ) as HTMLButtonElement
    ).click();
    expect(onRotate).toHaveBeenCalledTimes(1);
    expect(onFlip).toHaveBeenCalledTimes(1);
  });
});
