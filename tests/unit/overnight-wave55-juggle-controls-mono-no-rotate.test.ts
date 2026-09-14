/**
 * Wave 55 leftover after #250 — Juggle mono controls omit rotate/flip buttons.
 * Distinct from wave48 placing hint. Tests-only.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';
import { createInitialState, selectDie } from '../../src/games/juggle/rules';
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

describe('Wave 55 juggle — mono controls no rotate', () => {
  it('placing monomino shows preview + hint without rotate/flip buttons', () => {
    stubCanvas();
    const placing = selectDie(
      {
        ...createInitialState(),
        phase: 'selectingShape',
        currentDice: [1, 1],
      },
      0
    );
    expect(placing.selectedShape?.canRotate).toBe(false);
    expect(placing.selectedShape?.canFlip).toBe(false);

    const el = renderShapeControls(placing, () => undefined, () => undefined);
    expect(el.querySelector('.juggle-current-shape')).toBeTruthy();
    expect(el.querySelectorAll('.juggle-control-btn').length).toBe(0);
    expect(el.querySelector('.juggle-hint')?.textContent).toMatch(/place the shape/i);
  });
});
