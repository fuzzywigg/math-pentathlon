/**
 * Wave 56 leftover after #256 — Juggle placing controls exact Rotate/Flip chrome.
 * Distinct from wave55 mono omit-buttons leftover. Tests-only.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';
import { createInitialState } from '../../src/games/juggle/rules';
import { PENTOMINOES } from '../../src/core/polyomino/types';
import { renderShapeControls } from '../../src/games/juggle/board-ui';

afterEach(() => vi.restoreAllMocks());

function stubCanvas(): void {
  const proto = HTMLCanvasElement.prototype as unknown as {
    getContext: (typeof HTMLCanvasElement.prototype)['getContext'];
  };
  vi.spyOn(proto, 'getContext').mockReturnValue({
    fillRect: () => undefined,
    strokeRect: () => undefined,
    fillStyle: '',
    strokeStyle: '',
  } as unknown as CanvasRenderingContext2D);
}

describe('Wave 56 juggle — rotate/flip control buttons', () => {
  it('placing F-pentomino exposes ↻ Rotate and ↔ Flip and wires clicks', () => {
    stubCanvas();
    const shape = PENTOMINOES.find((s) => s.canRotate && s.canFlip)!;
    expect(shape.id).toBe('F');

    const placing = {
      ...createInitialState(),
      phase: 'placing' as const,
      selectedShape: shape,
      selectedRotation: 0 as const,
      selectedFlipped: false,
    };

    const onRotate = vi.fn();
    const onFlip = vi.fn();
    const el = renderShapeControls(placing, onRotate, onFlip);
    const btns = [...el.querySelectorAll('.juggle-control-btn')];
    expect(btns.map((b) => b.textContent)).toEqual(['↻ Rotate', '↔ Flip']);

    (btns[0] as HTMLButtonElement).click();
    (btns[1] as HTMLButtonElement).click();
    expect(onRotate).toHaveBeenCalledTimes(1);
    expect(onFlip).toHaveBeenCalledTimes(1);
    expect(el.querySelector('.juggle-hint')?.textContent).toBe(
      'Click on your board to place the shape'
    );
  });
});
