/**
 * ON-20260928-W1-MP-FINISH item 1 — roving tabindex for Juggle, Ramrod, Fab-a-Diffy.
 */
import { describe, it, expect, afterEach } from 'vitest';

import { collectGridCells } from '../../src/ui/board-a11y';

import { createInitialState as createJuggle } from '../../src/games/juggle/rules';
import { renderBoard as renderJuggle } from '../../src/games/juggle/board-ui';

import { createInitialState as createRamrod } from '../../src/games/ramrod/rules';
import { renderBoard as renderRamrod } from '../../src/games/ramrod/board-ui';

import { createInitialState as createFab } from '../../src/games/fab-a-diffy/rules';
import {
  renderFractionBarPool,
  renderAnswerBoard,
} from '../../src/games/fab-a-diffy/board-ui';

afterEach(() => {
  document.body.innerHTML = '';
});

function assertSingleRoving(root: ParentNode): void {
  const zeros = root.querySelectorAll('[role="gridcell"][tabindex="0"]');
  expect(zeros.length).toBe(1);
  const cells = root.querySelectorAll('[role="gridcell"][data-row][data-col]');
  expect(cells.length).toBeGreaterThan(1);
  expect(
    root.querySelectorAll('[role="gridcell"][tabindex="-1"]').length
  ).toBe(cells.length - 1);
}

function assertArrowMoves(root: Element): void {
  const cells = collectGridCells(root);
  const keys = ['ArrowRight', 'ArrowDown', 'ArrowLeft', 'ArrowUp'] as const;
  let moved = false;
  for (const start of cells) {
    const el = start as HTMLElement;
    el.focus();
    for (const key of keys) {
      el.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true }));
      const next = document.activeElement as HTMLElement;
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

describe('MP-FINISH item 1 — Juggle / Ramrod / Fab roving grid', () => {
  it('Juggle board: exactly one tabindex=0 and arrow navigation', () => {
    const state = createJuggle();
    const board = renderJuggle(
      state.boards.player1,
      'player1',
      true,
      state,
      () => undefined,
      () => undefined,
      () => undefined
    );
    document.body.appendChild(board);
    const grid = board.querySelector('.juggle-grid')!;
    expect(grid.getAttribute('role')).toBe('grid');
    expect(
      board.querySelectorAll('[role="gridcell"][data-row][data-col]').length
    ).toBe(81);
    assertSingleRoving(grid);
    assertArrowMoves(grid);
  });

  it('Ramrod board: exactly one tabindex=0 and arrow navigation', () => {
    const board = renderRamrod(createRamrod(), () => undefined);
    document.body.appendChild(board);
    expect(board.getAttribute('role')).toBe('grid');
    assertSingleRoving(board);
    assertArrowMoves(board);
  });

  it('Fab fraction pool: exactly one tabindex=0 and arrow navigation', () => {
    const pool = renderFractionBarPool(createFab(), () => undefined);
    document.body.appendChild(pool);
    const grid = pool.querySelector('.fab-bar-grid')!;
    expect(grid.getAttribute('role')).toBe('grid');
    assertSingleRoving(grid);
    assertArrowMoves(grid);
  });

  it('Fab answer board: exactly one tabindex=0 and arrow navigation', () => {
    const answers = renderAnswerBoard(createFab(), () => undefined);
    document.body.appendChild(answers);
    const grid = answers.querySelector('.fab-answer-grid')!;
    expect(grid.getAttribute('role')).toBe('grid');
    assertSingleRoving(grid);
    assertArrowMoves(grid);
  });
});
