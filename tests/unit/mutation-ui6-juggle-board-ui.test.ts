/**
 * q-mp-231 mutation audit UI wave 6 — kill survivors in games/juggle/board-ui.
 * Structural / flag pins only — no player-facing copy asserts.
 */
import { afterEach, describe, expect, it } from 'vitest';

import {
  renderBoard,
  syncJuggleBoardCells,
} from '../../src/games/juggle/board-ui';
import {
  createInitialState,
  placeShape,
  selectDie,
} from '../../src/games/juggle/rules';
import { CONFIG } from '../../src/games/juggle/types';
import type { Board } from '../../src/core/polyomino/placement';

afterEach(() => {
  document.body.innerHTML = '';
});

function placingMonoAt(row: number, col: number) {
  const placing = selectDie(
    {
      ...createInitialState(),
      phase: 'selectingShape',
      currentDice: [1, 1],
    },
    0
  );
  return {
    ...placing,
    phase: 'placing' as const,
    hoverPosition: { row, col },
  };
}

describe('mutation-ui6 juggle board-ui', () => {
  it('sync builds cell map when cache missing (kills getCellMap !map)', () => {
    // Survivor: L46 UnaryNot remove ! — without cache, mutant returns undefined.
    const state = createInitialState();
    const el = renderBoard(
      state.boards.player1,
      'player1',
      true,
      state,
      () => undefined,
      () => undefined,
      () => undefined
    );
    const grid = el.querySelector('.juggle-grid') as HTMLElement & {
      __juggleCells?: Map<string, HTMLElement>;
    };
    delete grid.__juggleCells;
    expect(() =>
      syncJuggleBoardCells(el, state.boards.player1, 'player1', true, state)
    ).not.toThrow();
    expect(grid.__juggleCells?.size).toBe(CONFIG.GRID_SIZE * CONFIG.GRID_SIZE);
  });

  it('sync marks sparse undefined cells unoccupied (kills ?? false → true)', () => {
    // Survivor: L120 BooleanLiteral false → true on `?? false`.
    const state = createInitialState();
    const el = renderBoard(
      state.boards.player1,
      'player1',
      true,
      state,
      () => undefined,
      () => undefined,
      () => undefined
    );
    const sparse: Board = {
      rows: CONFIG.GRID_SIZE,
      cols: CONFIG.GRID_SIZE,
      cells: Array.from({ length: CONFIG.GRID_SIZE }, () => []),
      placements: [],
    };
    syncJuggleBoardCells(el, sparse, 'player1', true, state);
    const occupied = el.querySelectorAll('.juggle-cell.occupied-player1');
    expect(occupied.length).toBe(0);
  });

  it('sync coord aria uses A1 for (0,0) (kills 65+col / row+1 arithmetic)', () => {
    // Survivors: L132 ± / +→− on String.fromCharCode(65 + col) and row + 1.
    const state = createInitialState();
    const el = renderBoard(
      state.boards.player1,
      'player1',
      true,
      state,
      () => undefined,
      () => undefined,
      () => undefined
    );
    syncJuggleBoardCells(el, state.boards.player1, 'player1', true, {
      ...state,
      phase: 'placing',
    });
    const cell = el.querySelector(
      '.juggle-cell[data-row="0"][data-col="0"]'
    ) as HTMLElement;
    const label = cell.getAttribute('aria-label') ?? '';
    expect(label.startsWith('A1')).toBe(true);
    const corner = el.querySelector(
      `.juggle-cell[data-row="${CONFIG.GRID_SIZE - 1}"][data-col="${CONFIG.GRID_SIZE - 1}"]`
    ) as HTMLElement;
    // I9 for 9×9 (col 8 → I, row 8 → 9)
    expect((corner.getAttribute('aria-label') ?? '').startsWith('I9')).toBe(
      true
    );
  });

  it('sync canPlace requires allowInput and placing phase (kills && → ||)', () => {
    // Survivors: L134 Logical allowInput && isCurrentPlayer flips.
    const state = placingMonoAt(1, 1);
    const el = renderBoard(
      state.boards.player1,
      'player1',
      true,
      state,
      () => undefined,
      () => undefined,
      () => undefined,
      { allowInput: false }
    );
    syncJuggleBoardCells(el, state.boards.player1, 'player1', true, state, {
      allowInput: false,
    });
    const cell = el.querySelector(
      '.juggle-cell[data-row="1"][data-col="1"]'
    ) as HTMLElement;
    expect(cell.style.cursor).not.toBe('pointer');
    expect(cell.getAttribute('aria-label') ?? '').not.toMatch(
      /valid placement/
    );
  });

  it('sync previewValid defaults false without hover (documents L75)', () => {
    // L75 false→true is equivalent when previewSet is empty — pin no preview class.
    const state = { ...createInitialState(), hoverPosition: null };
    const el = renderBoard(
      state.boards.player1,
      'player1',
      true,
      state,
      () => undefined,
      () => undefined,
      () => undefined
    );
    syncJuggleBoardCells(el, state.boards.player1, 'player1', true, state);
    expect(el.querySelectorAll('.preview-valid, .preview-invalid').length).toBe(
      0
    );
  });

  it('sync loops stay within GRID_SIZE (documents < → <= fence)', () => {
    // L112/L113 < → <= : extra index has no cell in map; count stays GRID².
    const state = createInitialState();
    const el = renderBoard(
      state.boards.player1,
      'player1',
      true,
      state,
      () => undefined,
      () => undefined,
      () => undefined
    );
    syncJuggleBoardCells(el, state.boards.player1, 'player1', true, state);
    expect(el.querySelectorAll('.juggle-cell').length).toBe(
      CONFIG.GRID_SIZE * CONFIG.GRID_SIZE
    );
  });

  it('occupied cell after placeShape keeps occupied class through sync', () => {
    let s = selectDie(
      {
        ...createInitialState(),
        phase: 'selectingShape',
        currentDice: [1, 1],
      },
      0
    );
    s = placeShape(s, { row: 0, col: 2 });
    const el = renderBoard(
      s.boards.player1,
      'player1',
      true,
      { ...s, phase: 'placing', hoverPosition: null },
      () => undefined,
      () => undefined,
      () => undefined
    );
    syncJuggleBoardCells(el, s.boards.player1, 'player1', true, {
      ...s,
      phase: 'placing',
      hoverPosition: null,
    });
    const cell = el.querySelector(
      '.juggle-cell[data-row="0"][data-col="2"]'
    ) as HTMLElement;
    expect(cell.classList.contains('occupied-player1')).toBe(true);
    expect(cell.style.cursor).not.toBe('pointer');
  });
});
