/**
 * ON-20260928-W1-MP-FINISH item 2 — roving tabindex for FIAR and Queens & Guards.
 */
import { describe, it, expect, afterEach } from 'vitest';

import { collectGridCells } from '../../src/ui/board-a11y';

import { createInitialState as createFiar } from '../../src/games/fiar/types';
import { renderBoard as renderFiar } from '../../src/games/fiar/board-ui';

import { createInitialState as createQueens } from '../../src/games/queens-guards/types';
import { renderBoard as renderQueens } from '../../src/games/queens-guards/board-ui';

afterEach(() => {
  document.body.innerHTML = '';
});

function assertSingleRoving(root: ParentNode): void {
  const zeros = root.querySelectorAll('[role="gridcell"][tabindex="0"]');
  expect(zeros.length).toBe(1);
  const cells = root.querySelectorAll('[role="gridcell"][data-row][data-col]');
  expect(cells.length).toBeGreaterThan(1);
}

function assertArrowMoves(root: Element): void {
  const cells = collectGridCells(root);
  const keys = ['ArrowRight', 'ArrowDown', 'ArrowLeft', 'ArrowUp'] as const;
  let moved = false;
  for (const start of cells) {
    const el = start as SVGElement;
    el.focus();
    for (const key of keys) {
      el.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true }));
      const next = document.activeElement as Element;
      if (next && next !== el && next.getAttribute('role') === 'gridcell') {
        expect(next.getAttribute('tabindex')).toBe('0');
        expect(el.getAttribute('tabindex')).toBe('-1');
        moved = true;
        break;
      }
    }
    if (moved) break;
  }
  expect(moved).toBe(true);
}

describe('MP-FINISH item 2 — FIAR / Queens roving grid', () => {
  it('FIAR: exactly one tabindex=0 and arrow navigation', () => {
    const svg = renderFiar(createFiar(), () => undefined);
    document.body.appendChild(svg);
    expect(svg.getAttribute('role')).toBe('grid');
    expect(
      svg.querySelectorAll('[role="gridcell"][data-row][data-col]').length
    ).toBe(40);
    assertSingleRoving(svg);
    assertArrowMoves(svg);
  });

  it('Queens & Guards: exactly one tabindex=0 and arrow navigation', () => {
    const svg = renderQueens(createQueens(), () => undefined);
    document.body.appendChild(svg);
    expect(svg.getAttribute('role')).toBe('grid');
    assertSingleRoving(svg);
    assertArrowMoves(svg);
  });
});
