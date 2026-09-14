/**
 * Wave 56 leftover after #256 — Juggle shape selector header exact.
 * Distinct from wave52 /tromino/i. Tests-only.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';
import { createInitialState } from '../../src/games/juggle/rules';
import { renderShapeSelector } from '../../src/games/juggle/board-ui';

afterEach(() => vi.restoreAllMocks());

function stubCanvas(): void {
  vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue({
    fillRect: () => undefined,
    strokeRect: () => undefined,
    fillStyle: '',
    strokeStyle: '',
  } as unknown as CanvasRenderingContext2D);
}

describe('Wave 56 juggle — shape header tromino', () => {
  it('renders exact "Choose a tromino:" header', () => {
    stubCanvas();
    const state = {
      ...createInitialState(),
      phase: 'selectingShape' as const,
      currentDice: [3, 1] as [number, number],
      selectedCategory: 'tromino' as const,
    };
    const el = renderShapeSelector(state, () => undefined);
    expect(el.querySelector('.juggle-shape-header')?.textContent).toBe(
      'Choose a tromino:'
    );
  });
});
