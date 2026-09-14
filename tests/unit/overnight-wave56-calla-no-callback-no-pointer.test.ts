/**
 * Wave 56 leftover after #256 — Calla valid pits omit pointer without callback.
 * Shared board-a11y omit-callback pattern; not hex #256. Tests-only.
 */
import { describe, it, expect, vi } from 'vitest';
import { createInitialState } from '../../src/games/calla/types';
import { renderBoard } from '../../src/games/calla/board-ui';

describe('Wave 56 calla — no callback no pointer', () => {
  it('opening valid pits stay non-pointer when onPitClick omitted', () => {
    const el = document.createElement('div');
    renderBoard(createInitialState(), el);
    const valid = el.querySelector(
      '.calla-pit-valid[data-side="player1"]'
    ) as SVGElement;
    expect(valid).toBeTruthy();
    expect(valid.style.cursor).not.toBe('pointer');
    const spy = vi.fn();
    valid.addEventListener('click', spy);
    valid.dispatchEvent(new Event('click', { bubbles: true }));
    // No activate handler from renderBoard; listener only sees our spy once.
    expect(spy).toHaveBeenCalledTimes(1);
  });
});
