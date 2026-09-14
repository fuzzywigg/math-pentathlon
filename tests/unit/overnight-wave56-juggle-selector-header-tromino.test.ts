/**
 * Wave 56 leftover after #256 — Juggle shape selector header Choose a {category}.
 * Distinct from wave52 option click leftover. Tests-only.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';
import { createInitialState } from '../../src/games/juggle/rules';
import { renderShapeSelector } from '../../src/games/juggle/board-ui';

afterEach(() => vi.restoreAllMocks());

describe('Wave 56 juggle — shape selector header', () => {
  it('headers Choose a tromino: and lists shape options', () => {
    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue({
      fillRect: () => undefined,
      strokeRect: () => undefined,
      fillStyle: '',
      strokeStyle: '',
    } as unknown as CanvasRenderingContext2D);

    const el = renderShapeSelector(
      {
        ...createInitialState(),
        phase: 'selectingShape',
        currentDice: [3, 5],
        selectedCategory: 'tromino',
      },
      () => undefined
    );
    expect(el.querySelector('.juggle-shape-header')?.textContent).toBe(
      'Choose a tromino:'
    );
    expect(el.querySelectorAll('.juggle-shape-option').length).toBeGreaterThan(0);
    expect(el.querySelector('.shape-name')).toBeTruthy();
  });
});
