/**
 * Wave 49 — Star-track drawChains button + callback. Tests-only.
 */
import { describe, it, expect, vi } from 'vitest';
import { createInitialState } from '../../src/games/star-track/types';
import { renderBoard } from '../../src/games/star-track/board-ui';

describe('Wave 49 star-track — draw button', () => {
  it('fires onDrawChains', () => {
    const cb = vi.fn();
    const box = document.createElement('div');
    renderBoard(createInitialState(), box, cb);
    const btn = box.querySelector('.star-track-draw-btn');
    expect(btn).toBeTruthy();
    (btn as HTMLButtonElement).click();
    expect(cb).toHaveBeenCalledTimes(1);
  });
});
