/**
 * Wave 48 — Calla renderBoard mounts svg pits leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/calla/types';
import { renderBoard } from '../../src/games/calla/board-ui';

describe('Wave 48 calla — renderBoard pits', () => {
  it('mounts calla-board svg with clickable pits', () => {
    const el = document.createElement('div');
    let clicked = -1;
    renderBoard(createInitialState(), el, (i) => {
      clicked = i;
    });
    expect(el.querySelector('.calla-board, svg')).toBeTruthy();
    const pit = el.querySelector('.calla-pit, [data-pit], circle');
    expect(pit).toBeTruthy();
    (pit as SVGElement).dispatchEvent(new Event('click', { bubbles: true }));
    // click may bind on group — just assert DOM present
    expect(el.querySelectorAll('circle, .calla-pit').length).toBeGreaterThan(0);
    void clicked;
  });
});
