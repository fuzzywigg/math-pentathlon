/**
 * Wave 48 — Juggle placing controls gate via mono (no canvas preview). Tests-only.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';
import { createInitialState, selectDie } from '../../src/games/juggle/rules';
import { renderShapeControls } from '../../src/games/juggle/board-ui';

afterEach(() => vi.restoreAllMocks());

describe('Wave 48 juggle — shape controls buttons', () => {
  it('placing mono exposes control container and placement hint without throwing', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    // Avoid canvas-backed tetromino previews in jsdom — gate on mono auto-place path.
    const placing = selectDie(
      {
        ...createInitialState(),
        phase: 'selectingShape' as const,
        currentDice: [1, 1] as [number, number],
      },
      0
    );
    expect(placing.phase).toBe('placing');
    expect(placing.selectedShape).toBeTruthy();

    // Stub canvas context so preview paint is a no-op in jsdom.
    const proto = HTMLCanvasElement.prototype as unknown as {
      getContext: (typeof HTMLCanvasElement.prototype)['getContext'];
    };
    vi.spyOn(proto, 'getContext').mockReturnValue({
      fillRect: () => undefined,
      strokeRect: () => undefined,
      fillStyle: '',
      strokeStyle: '',
    } as unknown as CanvasRenderingContext2D);

    const onRotate = vi.fn();
    const onFlip = vi.fn();
    const el = renderShapeControls(placing, onRotate, onFlip);
    expect(el.querySelector('.juggle-current-shape')).toBeTruthy();
    expect(el.querySelector('.juggle-hint')?.textContent).toMatch(/place/i);
  });
});
