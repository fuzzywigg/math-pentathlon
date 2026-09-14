/**
 * Wave 56 leftover after #256 — Juggle rotate/flip control buttons for flippable.
 * Distinct from wave55 mono omit-buttons leftover. Tests-only.
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

describe('Wave 56 juggle — controls rotate flip buttons', () => {
  it('shows Rotate and Flip for a flippable rotatable tetromino', () => {
    stubCanvas();
    const shape =
      SHAPE_POOLS.tetromino.find((s) => s.canFlip && s.canRotate) ??
      SHAPE_POOLS.pentomino.find((s) => s.canFlip && s.canRotate)!;
    expect(shape.canFlip).toBe(true);
    expect(shape.canRotate).toBe(true);

    const onRotate = vi.fn();
    const onFlip = vi.fn();
    const el = renderShapeControls(
      {
        ...createInitialState(),
        phase: 'placing',
        selectedShape: shape,
        selectedCategory: 'tetromino',
        currentDice: [4, 4],
      },
      onRotate,
      onFlip
    );
    const btns = [...el.querySelectorAll('.juggle-control-btn')].map(
      (b) => b.textContent
    );
    expect(btns.some((t) => t?.includes('Rotate'))).toBe(true);
    expect(btns.some((t) => t?.includes('Flip'))).toBe(true);
    (el.querySelectorAll('.juggle-control-btn')[0] as HTMLElement).click();
    (el.querySelectorAll('.juggle-control-btn')[1] as HTMLElement).click();
    expect(onRotate).toHaveBeenCalledTimes(1);
    expect(onFlip).toHaveBeenCalledTimes(1);
    expect(el.querySelector('.juggle-hint')?.textContent).toBe(
      'Click on your board to place the shape'
    );
  });
});
