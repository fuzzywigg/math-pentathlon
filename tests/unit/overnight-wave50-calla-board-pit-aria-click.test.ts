/**
 * Overnight HEAVY leftover — Calla pit aria labels, indices, click + Enter.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/calla/types';
import { renderBoard } from '../../src/games/calla/board-ui';

describe('Overnight wave50 calla — pit aria/click', () => {
  it('labels valid P1 pits and activates click plus Enter', () => {
    const el = document.createElement('div');
    const hits: number[] = [];
    renderBoard(createInitialState(), el, (i) => hits.push(i));

    const pits = el.querySelectorAll('.calla-pit[data-side="player1"]');
    expect(pits.length).toBe(5);
    pits.forEach((pit, i) => {
      expect(pit.getAttribute('data-pit-index')).toBe(String(i));
      expect(pit.getAttribute('role')).toBe('button');
      expect(pit.getAttribute('aria-label')).toMatch(/Blue pit/);
      expect(pit.getAttribute('aria-label')).toMatch(/3 cubes/);
      expect(pit.getAttribute('aria-label')).toMatch(/valid move/);
      expect(pit.classList.contains('calla-pit-valid')).toBe(true);
    });

    const p2 = el.querySelector('.calla-pit[data-side="player2"]');
    expect(p2?.classList.contains('calla-pit-valid')).toBe(false);
    expect(p2?.getAttribute('aria-label')).toMatch(/Red pit/);

    const pit0 = el.querySelector(
      '.calla-pit[data-side="player1"][data-pit-index="0"]'
    ) as SVGElement;
    pit0.dispatchEvent(new Event('click', { bubbles: true }));
    pit0.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    pit0.dispatchEvent(new KeyboardEvent('keydown', { key: ' ', bubbles: true }));
    expect(hits).toEqual([0, 0, 0]);
  });
});
