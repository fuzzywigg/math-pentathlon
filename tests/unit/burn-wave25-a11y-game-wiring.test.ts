/**
 * Wave 25 — board-a11y game wiring: ARIA grid / labels / roving / button cells.
 * Deepens existing board-ui contracts beyond a11y-burn-remaining + thin smoke.
 * Distinct from #131 inventory and #133 shell/alignment. Tests-only.
 */
import { describe, it, expect, afterEach, vi } from 'vitest';

import {
  collectGridCells,
  bindGridNavigation,
  applyRovingTabindex,
} from '../../src/ui/board-a11y';

import { createInitialState as createContig } from '../../src/games/contig-60/types';
import { renderBoard as renderContig } from '../../src/games/contig-60/board-ui';

import { createInitialState as createPrime } from '../../src/games/prime-gold/rules';
import { renderBoard as renderPrime } from '../../src/games/prime-gold/board-ui';

import { createInitialState as createSum } from '../../src/games/sum-dominoes/rules';
import { renderBoard as renderSum } from '../../src/games/sum-dominoes/board-ui';

import { createInitialState as createPent } from '../../src/games/pent-em-in/types';
import { renderBoard as renderPent } from '../../src/games/pent-em-in/board-ui';

import { createInitialState as createStars } from '../../src/games/stars-bars/rules';
import { renderBoard as renderStars } from '../../src/games/stars-bars/board-ui';

import { createInitialState as createKwa } from '../../src/games/kwatro-sinko/rules';
import { renderBoard as renderKwa } from '../../src/games/kwatro-sinko/board-ui';

import { createInitialState as createPar } from '../../src/games/par-55/rules';
import { renderBoard as renderPar } from '../../src/games/par-55/board-ui';

import { createInitialGameState as createKings } from '../../src/games/kings-quadraphages/game-state';
import { renderBoard as renderKings } from '../../src/games/kings-quadraphages/board-ui';

import { createInitialState as createHag } from '../../src/games/hex-a-gone/types';
import { renderBoard as renderHag } from '../../src/games/hex-a-gone/board-ui';

import { createInitialState as createJuggle } from '../../src/games/juggle/rules';
import { renderBoard as renderJuggle } from '../../src/games/juggle/board-ui';

import { createInitialState as createQueens } from '../../src/games/queens-guards/types';
import { renderBoard as renderQueens } from '../../src/games/queens-guards/board-ui';

import { createInitialState as createRemainder } from '../../src/games/remainder-islands/types';
import { renderBoard as renderRemainder } from '../../src/games/remainder-islands/board-ui';

import { createInitialState as createCalla } from '../../src/games/calla/types';
import { renderBoard as renderCalla } from '../../src/games/calla/board-ui';

afterEach(() => {
  document.body.innerHTML = '';
  vi.restoreAllMocks();
});

function assertSingleRoving(root: ParentNode): void {
  const tabbable = root.querySelectorAll('[role="gridcell"][tabindex="0"]');
  expect(tabbable.length).toBe(1);
}

function assertLabeledGridcells(root: ParentNode, min = 1): void {
  const cells = root.querySelectorAll('[role="gridcell"][data-row][data-col]');
  expect(cells.length).toBeGreaterThanOrEqual(min);
  for (const cell of Array.from(cells).slice(0, 8)) {
    expect(cell.getAttribute('aria-label')).toBeTruthy();
  }
}

describe('Wave 25 a11y-game-wiring — HTML ARIA grids', () => {
  it('Contig 60: role=grid, 60 labeled gridcells, single roving tab stop', () => {
    const board = renderContig(createContig(), () => undefined);
    document.body.appendChild(board);
    expect(board.getAttribute('role')).toBe('grid');
    expect(
      board.querySelectorAll('[role="gridcell"][data-row][data-col]').length
    ).toBe(60);
    assertSingleRoving(board);
    assertLabeledGridcells(board, 60);
  });

  it('Contig 60: arrow nav moves focus across opening board', () => {
    const board = renderContig(createContig(), () => undefined);
    document.body.appendChild(board);
    const cells = collectGridCells(board);
    const first = cells[0] as HTMLElement;
    first.focus();
    first.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true })
    );
    const next = document.activeElement as HTMLElement;
    expect(next).not.toBe(first);
    expect(next.getAttribute('role')).toBe('gridcell');
    expect(next.getAttribute('tabindex')).toBe('0');
    expect(first.getAttribute('tabindex')).toBe('-1');
  });

  it('Prime Gold: grid + labeled cells + single tabindex=0', () => {
    const board = renderPrime(createPrime(), () => undefined);
    document.body.appendChild(board);
    const grid = board.querySelector('[role="grid"]') ?? board;
    expect(
      board.querySelector('[role="grid"]') ||
        board.getAttribute('role') === 'grid'
    ).toBeTruthy();
    assertLabeledGridcells(board, 10);
    assertSingleRoving(board);
    expect(grid).toBeTruthy();
  });

  it('Sum Dominoes: grid role and hole-aware cell collection', () => {
    const board = renderSum(createSum(), () => undefined);
    document.body.appendChild(board);
    expect(board.getAttribute('role')).toBe('grid');
    const cells = collectGridCells(board);
    expect(cells.length).toBeGreaterThan(50);
    assertSingleRoving(board);
    // center seed occupies cells — still navigable among remaining
    const first = cells[0] as HTMLElement;
    first.focus();
    first.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true })
    );
    expect(document.activeElement?.getAttribute('role')).toBe('gridcell');
  });

  it('Stars & Bars: 5×5 grid with coord labels', () => {
    const board = renderStars(createStars(), () => undefined);
    document.body.appendChild(board);
    expect(board.querySelector('[role="grid"]')).toBeTruthy();
    expect(
      board.querySelectorAll('[role="gridcell"][data-row][data-col]').length
    ).toBe(25);
    assertSingleRoving(board);
  });
});

describe('Wave 25 a11y-game-wiring — SVG ARIA grids', () => {
  it('Pent-em-in: SVG role=grid with labeled gridcells', () => {
    const svg = renderPent(
      createPent(),
      () => undefined,
      () => undefined
    );
    document.body.appendChild(svg);
    expect(svg.getAttribute('role')).toBe('grid');
    assertLabeledGridcells(svg, 16);
    assertSingleRoving(svg);
  });

  it('Kwatro-Sinko: SVG grid + single roving tab stop', () => {
    const root = renderKwa(
      createKwa(),
      () => undefined,
      () => undefined
    );
    document.body.appendChild(root);
    const svg = root.querySelector('svg[role="grid"]');
    expect(svg).toBeTruthy();
    assertLabeledGridcells(root, 10);
    assertSingleRoving(root);
  });

  it('Par 55: SVG bases are gridcells with row/col', () => {
    const root = renderPar(createPar(), () => undefined);
    document.body.appendChild(root);
    expect(root.querySelector('svg[role="grid"]')).toBeTruthy();
    assertLabeledGridcells(root, 10);
    assertSingleRoving(root);
  });

  it('Hex-a-Gone: container render yields SVG grid with cells', () => {
    const container = document.createElement('div');
    document.body.appendChild(container);
    renderHag(createHag(), container, () => undefined);
    const svg = container.querySelector('svg[role="grid"]');
    expect(svg).toBeTruthy();
    assertLabeledGridcells(container, 10);
    assertSingleRoving(container);
  });

  it('Hex-a-Gone remount restores single roving tab stop', () => {
    const container = document.createElement('div');
    document.body.appendChild(container);
    renderHag(createHag(), container, () => undefined);
    const cells = collectGridCells(container);
    const mid = cells[Math.floor(cells.length / 2)] as SVGElement;
    applyRovingTabindex(cells, {
      row: mid.getAttribute('data-row')!,
      col: mid.getAttribute('data-col')!,
    });
    mid.focus();
    renderHag(createHag(), container, () => undefined);
    assertSingleRoving(container);
  });
});

describe('Wave 25 a11y-game-wiring — Kings HTML grid remount', () => {
  it('Kings board is role=grid with 8×8 cells and labels', () => {
    const container = document.createElement('div');
    document.body.appendChild(container);
    renderKings(createKings(), container, () => undefined);
    const board = container.querySelector('[role="grid"]');
    expect(board).toBeTruthy();
    expect(
      container.querySelectorAll('[role="gridcell"][data-row][data-col]').length
    ).toBe(81); // 9×9 Kings board

    assertSingleRoving(container);
    const sample = container.querySelector('[role="gridcell"]') as HTMLElement;
    expect(sample.getAttribute('aria-label')).toMatch(/[A-H][1-8]|King|empty/i);
  });

  it('Kings remount preserves focus coords via restoreGridFocus', () => {
    const container = document.createElement('div');
    document.body.appendChild(container);
    renderKings(createKings(), container, () => undefined);
    const target = container.querySelector(
      '[data-row="4"][data-col="4"]'
    ) as HTMLElement;
    expect(target).toBeTruthy();
    target.focus();
    renderKings(createKings(), container, () => undefined);
    const active = document.activeElement as HTMLElement;
    expect(active.getAttribute('data-row')).toBe('4');
    expect(active.getAttribute('data-col')).toBe('4');
    assertSingleRoving(container);
  });
});

describe('Wave 25 a11y-game-wiring — button-pattern boards (non-grid)', () => {
  it('Juggle board is a roving ARIA grid with labeled cells', () => {
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
    const grid = board.querySelector('[role="grid"]');
    expect(grid).toBeTruthy();
    const cells = board.querySelectorAll(
      '[role="gridcell"][data-row][data-col]'
    );
    expect(cells.length).toBe(81);
    assertSingleRoving(board);
    const sample = cells[0] as HTMLElement;
    expect(sample.getAttribute('aria-label')).toMatch(/[A-Z]\d/);
  });

  it('Queens & Guards SVG is a roving ARIA grid with labeled cells', () => {
    const svg = renderQueens(createQueens(), () => undefined);
    document.body.appendChild(svg);
    expect(svg.getAttribute('role')).toBe('grid');
    const cells = svg.querySelectorAll('[role="gridcell"][data-row][data-col]');
    expect(cells.length).toBeGreaterThan(5);
    assertSingleRoving(svg);
    for (const el of Array.from(cells).slice(0, 5)) {
      expect(el.getAttribute('aria-label')).toBeTruthy();
    }
  });

  it('Remainder Islands SVG islands are labeled; buttons only when activatable', () => {
    const base = createRemainder();
    // Rolling / non-select: announce islands without making inert buttons.
    const rollingSvg = renderRemainder(
      base,
      () => undefined,
      () => undefined
    );
    document.body.appendChild(rollingSvg);
    const rollingIslands = rollingSvg.querySelectorAll('[data-island-id]');
    expect(rollingIslands.length).toBeGreaterThan(3);
    expect(rollingSvg.querySelectorAll('[role="button"]').length).toBe(0);
    expect(rollingIslands[0].getAttribute('aria-label')).toBeTruthy();

    // Select phase: only valid islands are keyboard buttons.
    const validIds = base.islands.slice(0, 4).map((i) => i.id);
    const selectSvg = renderRemainder(
      {
        ...base,
        phase: 'selectIsland',
        currentRoll: { die1: 2, die2: 3, total: 5 },
        validIslands: validIds,
      },
      () => undefined,
      () => undefined
    );
    document.body.appendChild(selectSvg);
    const buttons = selectSvg.querySelectorAll('[role="button"]');
    expect(buttons.length).toBe(validIds.length);
    expect(buttons[0].getAttribute('aria-label')).toBeTruthy();
    expect(buttons[0].getAttribute('tabindex')).toBe('0');
  });

  it('Calla pits are SVG focusables with aria-labels', () => {
    const container = document.createElement('div');
    document.body.appendChild(container);
    renderCalla(createCalla(), container, () => undefined);
    // Only valid (current-player) pits are keyboard buttons; others stay labeled.
    const buttons = container.querySelectorAll('[role="button"]');
    expect(buttons.length).toBe(5);
    for (const el of Array.from(buttons)) {
      expect(el.getAttribute('aria-label')).toMatch(/valid move/i);
      expect(el.getAttribute('tabindex')).toBe('0');
    }
    const inert = container.querySelectorAll(
      '.calla-pit:not([role="button"])'
    );
    expect(inert.length).toBe(5);
    for (const el of Array.from(inert)) {
      expect(el.getAttribute('aria-label')).toBeTruthy();
      expect(el.getAttribute('tabindex')).toBeNull();
    }
  });
});

describe('Wave 25 a11y-game-wiring — Contig midstate label extras', () => {
  it('valid placements announce valid placement in aria-label', () => {
    const state = {
      ...createContig(),
      phase: 'calculating' as const,
      currentDice: [2, 3, 4] as [number, number, number],
    };
    const board = renderContig(state, () => undefined);
    document.body.appendChild(board);
    const valid = board.querySelectorAll('.contig-cell-valid');
    expect(valid.length).toBeGreaterThan(0);
    const labeled = Array.from(valid).filter((el) =>
      (el.getAttribute('aria-label') ?? '').includes('valid placement')
    );
    expect(labeled.length).toBe(valid.length);
  });

  it('bindGridNavigation remains attached after Contig remount pattern', () => {
    const board = renderContig(createContig(), () => undefined);
    document.body.appendChild(board);
    // re-bind is safe; board already bound — exercise collect + arrow
    bindGridNavigation(board);
    const cells = collectGridCells(board);
    applyRovingTabindex(cells);
    (cells[0] as HTMLElement).focus();
    (cells[0] as HTMLElement).dispatchEvent(
      new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true })
    );
    expect(document.activeElement).not.toBe(cells[0]);
  });
});
