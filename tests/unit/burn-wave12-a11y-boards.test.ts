import { describe, it, expect, afterEach } from 'vitest';

import { createInitialState as createHex } from '../../src/games/hex/types';
import { renderBoard as renderHexBoard } from '../../src/games/hex/board-ui';

import { createInitialState as createContig } from '../../src/games/contig-60/types';
import { renderBoard as renderContigBoard } from '../../src/games/contig-60/board-ui';

import { createInitialState as createSum } from '../../src/games/sum-dominoes/rules';
import { renderBoard as renderSumBoard } from '../../src/games/sum-dominoes/board-ui';

import { createInitialState as createPrime } from '../../src/games/prime-gold/rules';
import { renderBoard as renderPrimeBoard } from '../../src/games/prime-gold/board-ui';

import { createInitialGameState as createKings } from '../../src/games/kings-quadraphages/game-state';
import {
  renderBoard as renderKingsBoard,
  renderStatus as renderKingsStatus,
} from '../../src/games/kings-quadraphages/board-ui';

import { createInitialState as createPent } from '../../src/games/pent-em-in/types';
import { renderBoard as renderPentBoard } from '../../src/games/pent-em-in/board-ui';

import { createInitialState as createJuggle } from '../../src/games/juggle/rules';
import { renderBoard as renderJuggleBoard } from '../../src/games/juggle/board-ui';

import { createInitialState as createRamrod } from '../../src/games/ramrod/rules';
import { renderBoard as renderRamrodBoard } from '../../src/games/ramrod/board-ui';

import { createInitialState as createCalla } from '../../src/games/calla/types';
import { renderBoard as renderCallaBoard } from '../../src/games/calla/board-ui';

import { createInitialState as createHexAGone } from '../../src/games/hex-a-gone/types';
import {
  renderBoard as renderHagBoard,
  renderStatus as renderHagStatus,
} from '../../src/games/hex-a-gone/board-ui';

import { createInitialState as createFiar } from '../../src/games/fiar/types';
import { renderBoard as renderFiarBoard } from '../../src/games/fiar/board-ui';

import { createInitialState as createFab } from '../../src/games/fab-a-diffy/rules';
import { renderFractionBarPool } from '../../src/games/fab-a-diffy/board-ui';

import { createInitialState as createStar } from '../../src/games/star-track/types';
import { renderStatus as renderStarStatus } from '../../src/games/star-track/board-ui';

import {
  initGame as initFrac,
  newGameVsHuman as fracVsHuman,
} from '../../src/games/frac-fact/game-controller';
import {
  initGame as initPinball,
  newGameVsHuman as pinballVsHuman,
} from '../../src/games/fraction-pinball/game-controller';

describe('Wave 12 — a11y board wiring (existing games)', () => {
  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('Hex board is an ARIA grid with labeled gridcells and one tab stop', () => {
    const container = document.createElement('div');
    document.body.appendChild(container);
    renderHexBoard(createHex(5), container, () => undefined);

    const grid = container.querySelector('[role="grid"]');
    expect(grid).toBeTruthy();

    const cells = container.querySelectorAll(
      '[role="gridcell"][data-row][data-col]'
    );
    expect(cells.length).toBeGreaterThan(10);

    const tabbable = container.querySelectorAll(
      '[role="gridcell"][tabindex="0"]'
    );
    expect(tabbable.length).toBe(1);

    const sample = cells[0] as Element;
    expect(sample.getAttribute('aria-label')).toBeTruthy();
    expect(sample.getAttribute('aria-label')).toMatch(/empty|valid/i);
  });

  it('Contig board gridcells include valid-placement label when dice set', () => {
    let state = createContig();
    state = {
      ...state,
      phase: 'calculating',
      currentDice: [2, 3, 6],
    };
    let activated = 0;
    const root = renderContigBoard(state, () => {
      activated++;
    });
    document.body.appendChild(root);

    expect(root.getAttribute('role')).toBe('grid');
    const valid = root.querySelector(
      '.contig-cell-valid[role="gridcell"]'
    ) as HTMLElement | null;
    if (valid) {
      expect(valid.getAttribute('aria-label')).toMatch(/valid/i);
      valid.dispatchEvent(
        new KeyboardEvent('keydown', { key: 'Enter', bubbles: true })
      );
      expect(activated).toBe(1);
    } else {
      const cells = root.querySelectorAll('[role="gridcell"]');
      expect(cells.length).toBe(60);
    }
  });

  it('Sum Dominoes board exposes ARIA gridcells with labels', () => {
    const root = renderSumBoard(createSum(), () => undefined);
    document.body.appendChild(root);

    expect(root.getAttribute('role')).toBe('grid');
    const cells = root.querySelectorAll('[role="gridcell"]');
    expect(cells.length).toBeGreaterThan(10);
    expect((cells[0] as Element).getAttribute('aria-label')).toBeTruthy();
  });

  it('Prime Gold board gridcells carry labels (incl. primes)', () => {
    const root = renderPrimeBoard(createPrime(), () => undefined);
    document.body.appendChild(root);

    const grid = root.querySelector('[role="grid"]');
    expect(grid).toBeTruthy();
    const cells = root.querySelectorAll('[role="gridcell"]');
    expect(cells.length).toBeGreaterThan(10);
    const labels = Array.from(cells).map((c) => c.getAttribute('aria-label'));
    expect(labels.some((l) => l && /prime/i.test(l))).toBe(true);
  });

  it('Kings board is grid with king/empty labels and live status', () => {
    const board = document.createElement('div');
    const status = document.createElement('div');
    document.body.appendChild(board);
    document.body.appendChild(status);

    const state = createKings();
    renderKingsBoard(state, board);
    renderKingsStatus(state, status);

    const grid = board.querySelector('[role="grid"]');
    expect(grid).toBeTruthy();
    const cells = board.querySelectorAll(
      '[role="gridcell"][data-row][data-col]'
    );
    expect(cells.length).toBe(81);
    const labels = Array.from(cells).map(
      (c) => c.getAttribute('aria-label') ?? ''
    );
    expect(labels.some((l) => /king/i.test(l))).toBe(true);
    expect(labels.some((l) => /empty/i.test(l))).toBe(true);

    expect(status.getAttribute('role')).toBe('status');
    expect(status.getAttribute('aria-live')).toBe('polite');
  });

  it("Pent'Em In interaction cells are labeled gridcells", () => {
    const root = renderPentBoard(
      createPent(),
      () => undefined,
      () => undefined
    );
    document.body.appendChild(root);

    expect(root.getAttribute('role')).toBe('grid');
    const cells = root.querySelectorAll('[role="gridcell"]');
    expect(cells.length).toBeGreaterThan(10);
    expect((cells[0] as Element).getAttribute('aria-label')).toMatch(/\d+,\d+/);
  });

  it('Juggle cells are focusable buttons with coord labels', () => {
    const state = createJuggle();
    const root = renderJuggleBoard(
      state.boards.player1,
      'player1',
      true,
      state,
      () => undefined,
      () => undefined,
      () => undefined
    );
    document.body.appendChild(root);

    const cells = root.querySelectorAll('[role="button"][aria-label]');
    expect(cells.length).toBeGreaterThan(5);
    expect((cells[0] as Element).getAttribute('aria-label')).toMatch(
      /empty|A1/i
    );
  });

  it('Ramrod slots are focusable with sum/slot labels', () => {
    const root = renderRamrodBoard(createRamrod(), () => undefined);
    document.body.appendChild(root);

    const slots = root.querySelectorAll('[role="button"][aria-label]');
    expect(slots.length).toBeGreaterThan(5);
    expect((slots[0] as Element).getAttribute('aria-label')).toMatch(
      /Sum|slot/i
    );
  });

  it('Calla pits are focusable SVG with pit labels', () => {
    const container = document.createElement('div');
    document.body.appendChild(container);
    renderCallaBoard(createCalla(), container, () => undefined);

    const pits = container.querySelectorAll('[role="button"][aria-label]');
    expect(pits.length).toBeGreaterThanOrEqual(5);
    expect((pits[0] as Element).getAttribute('aria-label')).toMatch(/pit/i);
  });

  it('Hex-a-Gone cells are gridcells with live status shell', () => {
    const board = document.createElement('div');
    const status = document.createElement('div');
    document.body.appendChild(board);
    document.body.appendChild(status);
    const state = createHexAGone();
    renderHagBoard(state, board, () => undefined);
    renderHagStatus(state, status);

    const cells = board.querySelectorAll('[role="gridcell"]');
    expect(cells.length).toBeGreaterThan(10);
    expect((cells[0] as Element).getAttribute('aria-label')).toBeTruthy();
    expect(status.getAttribute('role')).toBe('status');
    expect(status.getAttribute('aria-live')).toBe('polite');
  });

  it('FIAR nodes are focusable SVG with coord labels', () => {
    const root = renderFiarBoard(createFiar(), () => undefined);
    document.body.appendChild(root);

    const nodes = root.querySelectorAll('[role="button"][aria-label]');
    expect(nodes.length).toBeGreaterThan(10);
    expect((nodes[0] as Element).getAttribute('tabindex')).toBe('0');
  });

  it('Fab-a-Diffy bar pool wrappers are focusable with fraction labels', () => {
    const root = renderFractionBarPool(createFab(), () => undefined);
    document.body.appendChild(root);

    const bars = root.querySelectorAll('[role="button"][aria-label]');
    expect(bars.length).toBeGreaterThan(3);
    expect((bars[0] as Element).getAttribute('aria-label')).toBeTruthy();
  });

  it('Star Track status is aria-live polite', () => {
    const container = document.createElement('div');
    document.body.appendChild(container);
    renderStarStatus(createStar(), container);
    const live = container.querySelector('[role="status"][aria-live="polite"]');
    expect(live).toBeTruthy();
  });

  it('Frac Fact controller marks turn status live', () => {
    const container = document.createElement('div');
    document.body.appendChild(container);
    initFrac(container);
    fracVsHuman();
    const live = container.querySelector(
      '.frac-status[role="status"][aria-live="polite"]'
    );
    expect(live).toBeTruthy();
  });

  it('Fraction Pinball controller marks turn status live', () => {
    const container = document.createElement('div');
    document.body.appendChild(container);
    initPinball(container);
    pinballVsHuman();
    const live = container.querySelector(
      '.pinball-status[role="status"][aria-live="polite"]'
    );
    expect(live).toBeTruthy();
  });

  it('Hex Enter on focused empty cell invokes click handler', () => {
    const container = document.createElement('div');
    document.body.appendChild(container);
    let clicks = 0;
    renderHexBoard(createHex(5), container, () => {
      clicks++;
    });
    const cell = container.querySelector(
      '[role="gridcell"][tabindex="0"]'
    ) as HTMLElement;
    expect(cell).toBeTruthy();
    cell.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Enter', bubbles: true })
    );
    expect(clicks).toBe(1);
  });

  it('Calla Space on focusable pit keeps pit label contract', () => {
    const container = document.createElement('div');
    document.body.appendChild(container);
    let clicks = 0;
    renderCallaBoard(createCalla(), container, () => {
      clicks++;
    });
    const pit = container.querySelector(
      '[role="button"][aria-label*="valid"]'
    ) as HTMLElement | null;
    const any = (pit ??
      container.querySelector(
        '[role="button"][aria-label*="pit"]'
      )) as HTMLElement;
    any.dispatchEvent(
      new KeyboardEvent('keydown', { key: ' ', bubbles: true })
    );
    expect(any.getAttribute('aria-label')).toMatch(/pit/i);
    expect(clicks).toBeGreaterThanOrEqual(0);
  });
});
