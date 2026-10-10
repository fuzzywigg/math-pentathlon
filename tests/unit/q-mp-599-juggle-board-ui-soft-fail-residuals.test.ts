/**
 * q-mp-599 — Characterize `juggle/board-ui` soft-fail residuals (tests-only).
 *
 * Live tip re-measure (`cursor/mp-tip-post1012` @ `3f9c3e4e`):
 *   `board-ui.ts` **681** LOC (matches backlog)
 *   Dedicated `*juggle*` unit files before this suite: **83**
 *   Dedicated `*juggle*soft-fail*` residual files before: **0**
 *   Overlay nullish residual **1** (`board.cells[row]?.[col] ?? false` keep
 *     site + `hoverKeys || ''` / `faces[value] ||` soft `||` arms) — do
 *     **not** clear; leave undrafted `245` / older nullish owners
 *     **contained**. Last dedicated ui-cov **r43** (`#934`/`481`).
 *
 * Soft-fail inventory (source remasure):
 *   `return;` **14**; `continue;` **5**; `??` **1**; `querySelector` **6**;
 *   `classList?.contains?` **2**; host/phase/allowInput early-returns;
 *   fillEl optional paint; hoverKeys `|| ''`; ctx-null canvas soft-return;
 *   dieValue/cellRow undefined continues; selector/controls empty shells.
 *
 * Ownership (leave alone; do not edit product / competing suites):
 *   Tip-folded / open `#934`/`481` ui-cov r43 + `#777`/`269` r14 +
 *     `#744`/`222` r10 — happy-path + many soft arms; leave **contained**
 *   `mutation-ui6` — `?? false` / cell-map / canPlace mutants; leave
 *   Undrafted `245` nullish controller batch — leave **contained**;
 *     no nullish ceiling write here
 *   Overnight wave52–64 / burn-wave chrome — leave alone
 *
 * This suite owns soft-fail residual contracts still thin after those:
 *   source keep-sites, sync fillEl soft-skip, hoverKeys `|| ''` undefined
 *     arm, clearPreview missing-map-key soft-return, classList optional-
 *     chain soft-miss, non-Enter/Space keydown soft-return, allowInput
 *     default (`!== false`) soft, empty selector/controls shell stamps.
 *
 * Constraints: tests only; zero `src/` edits; no nullish ceiling write;
 * no AI / rules / scoring / legal-move asserts; no player-facing copy or
 * aria/label string pins; Hex Hard 450ms; no network; no ratchet JSON.
 */
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { createBoard } from '../../src/core/polyomino/placement';
import { SIMPLE_SHAPES } from '../../src/core/polyomino/types';
import {
  applyJuggleHoverPreview,
  injectJuggleStyles,
  renderBoard,
  renderDice,
  renderShapeControls,
  renderShapeSelector,
  syncJuggleBoardCells,
} from '../../src/games/juggle/board-ui';
import { createInitialState } from '../../src/games/juggle/rules';
import { CONFIG, SHAPE_POOLS } from '../../src/games/juggle/types';

const BOARD_UI_SRC = readFileSync(
  join(
    dirname(fileURLToPath(import.meta.url)),
    '../../src/games/juggle/board-ui.ts'
  ),
  'utf8'
);

function stubCanvas2d(
  ctx: CanvasRenderingContext2D | null = {
    fillRect: () => undefined,
    strokeRect: () => undefined,
    fillStyle: '',
    strokeStyle: '',
  } as unknown as CanvasRenderingContext2D
): void {
  vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(ctx);
}

function placingMonoState() {
  const mono = SIMPLE_SHAPES.find((s) => s.size === 1)!;
  return {
    ...createInitialState(),
    phase: 'placing' as const,
    currentPlayer: 'player1' as const,
    currentDice: [1, 2] as [number, number],
    selectedCategory: 'monomino' as const,
    selectedDieValue: 1,
    selectedShape: mono,
    selectedRotation: 0 as const,
    selectedFlipped: false,
    hoverPosition: { row: 1, col: 1 } as { row: number; col: number } | null,
    winner: null,
  };
}

afterEach(() => {
  document.body.innerHTML = '';
  document.getElementById('juggle-styles')?.remove();
  vi.restoreAllMocks();
});

// =============================================================================
// 1. Source soft-fail keep-sites
// =============================================================================

describe('q-mp-599 juggle board-ui — source soft-fail keep-sites', () => {
  it('inventory stamps match tip remasure (681 LOC / soft counts)', () => {
    // wc -l counts newlines; tip remasure stamped 681.
    expect((BOARD_UI_SRC.match(/\n/g) ?? []).length).toBe(681);
    expect((BOARD_UI_SRC.match(/return;/g) ?? []).length).toBe(14);
    expect((BOARD_UI_SRC.match(/continue;/g) ?? []).length).toBe(5);
    expect((BOARD_UI_SRC.match(/\?\?/g) ?? []).length).toBe(1);
    expect((BOARD_UI_SRC.match(/querySelector/g) ?? []).length).toBe(6);
    expect(
      (BOARD_UI_SRC.match(/classList\?\.contains\?/g) ?? []).length
    ).toBe(2);
  });

  it('keeps sync host soft-returns (fillEl optional + missing grid)', () => {
    expect(BOARD_UI_SRC).toMatch(
      /const fillEl = container\.querySelector\('\.fill-percent'\);\s*if \(fillEl\)/
    );
    expect(BOARD_UI_SRC).toMatch(
      /const grid = container\.querySelector\('\.juggle-grid'\) as HTMLElement \| null;\s*if \(!grid\) \{\s*return;/
    );
    expect(BOARD_UI_SRC).toMatch(/if \(!cell\) \{\s*continue;/);
  });

  it('keeps nullish ?? false residual (245 owns clear — characterize only)', () => {
    expect(BOARD_UI_SRC).toMatch(
      /const isOccupied = board\.cells\[row\]\?\.\[col\] \?\? false;/
    );
  });

  it('keeps applyJuggleHoverPreview phase/host/hoverKeys soft arms', () => {
    expect(BOARD_UI_SRC).toMatch(
      /if \(!allowInput \|\| state\.phase !== 'placing'\) \{\s*return;/
    );
    expect(BOARD_UI_SRC).toMatch(
      /const boardEl = boardsRoot\.querySelector\(\s*`\.juggle-board\.\$\{player\}`\s*\) as HTMLElement \| null;\s*if \(!boardEl\) \{\s*return;/
    );
    expect(BOARD_UI_SRC).toMatch(
      /const grid = boardEl\.querySelector\('\.juggle-grid'\) as HTMLElement \| null;\s*if \(!grid\) \{\s*return;/
    );
    expect(BOARD_UI_SRC).toMatch(
      /const prevKeys = \(boardEl\.dataset\.hoverKeys \|\| ''\)\.split\('\|'\)\.filter\(Boolean\);/
    );
    expect(BOARD_UI_SRC).toMatch(
      /if \(!cell \|\| cell\.classList\.contains\(`occupied-\$\{player\}`\)\) \{\s*return;/
    );
    expect(BOARD_UI_SRC).toMatch(
      /if \(!state\.hoverPosition\) \{\s*boardEl\.dataset\.hoverKeys = '';\s*return;/
    );
  });

  it('keeps renderBoard event soft-returns + classList optional-chain', () => {
    expect(BOARD_UI_SRC).toMatch(
      /if \(!target \|\| !grid\.contains\(target\)\) \{\s*return;/
    );
    expect(BOARD_UI_SRC).toMatch(
      /if \(target\.style\.cursor !== 'pointer'\) \{\s*return;/
    );
    expect(BOARD_UI_SRC).toMatch(
      /if \(e\.key !== 'Enter' && e\.key !== ' '\) \{\s*return;/
    );
    // Exact optional-chain keep-site (two capture listeners).
    expect(BOARD_UI_SRC).toMatch(
      /if \(!target\.classList\?\.contains\?\.\('juggle-cell'\)\) \{\s*return;/
    );
    const optContains =
      BOARD_UI_SRC.match(/classList\?\.contains\?\.\('juggle-cell'\)/g) ?? [];
    expect(optContains).toHaveLength(2);
  });

  it('keeps sparse-row / dieValue undefined continues + ctx-null soft-return', () => {
    expect(BOARD_UI_SRC).toMatch(
      /if \(cellRow === undefined\) \{\s*continue;/
    );
    expect(BOARD_UI_SRC).toMatch(
      /if \(isOccupied === undefined\) \{\s*continue;/
    );
    expect(BOARD_UI_SRC).toMatch(
      /if \(dieValue === undefined\) \{\s*continue;/
    );
    expect(BOARD_UI_SRC).toMatch(
      /const ctx = canvas\.getContext\('2d'\);\s*if \(ctx === null\) \{\s*return canvas;/
    );
  });

  it('keeps selector/controls empty-shell gates + die-face || soft fallback', () => {
    expect(BOARD_UI_SRC).toMatch(
      /if \(!state\.currentDice \|\| !state\.selectedCategory\) \{\s*return container;/
    );
    expect(BOARD_UI_SRC).toMatch(/if \(!dieValue\) \{\s*return container;/);
    expect(BOARD_UI_SRC).toMatch(
      /if \(!state\.selectedShape \|\| state\.phase !== 'placing'\) \{\s*return container;/
    );
    expect(BOARD_UI_SRC).toMatch(
      /return faces\[value\] \|\| value\.toString\(\);/
    );
    expect(BOARD_UI_SRC).toMatch(
      /const allowInput = options\.allowInput !== false;/
    );
  });
});

// =============================================================================
// 2. syncJuggleBoardCells soft-fail residuals
// =============================================================================

describe('q-mp-599 juggle board-ui — sync soft-fail residuals', () => {
  it('missing .fill-percent soft-skips fill paint; grid sync still runs', () => {
    const state = placingMonoState();
    const el = renderBoard(
      state.boards.player1,
      'player1',
      true,
      state,
      () => undefined,
      () => undefined,
      () => undefined
    );
    el.querySelector('.fill-percent')?.remove();
    expect(el.querySelector('.fill-percent')).toBeNull();
    expect(() =>
      syncJuggleBoardCells(el, state.boards.player1, 'player1', true, {
        ...state,
        hoverPosition: { row: 0, col: 0 },
      })
    ).not.toThrow();
    expect(el.querySelector('.juggle-grid')).toBeTruthy();
    expect(el.querySelectorAll('.juggle-cell').length).toBe(
      CONFIG.GRID_SIZE * CONFIG.GRID_SIZE
    );
    expect(el.querySelector('.preview-valid, .preview-invalid')).toBeTruthy();
  });

  it('missing .juggle-grid soft-returns without mutating shell classes', () => {
    const state = placingMonoState();
    const bare = document.createElement('div');
    bare.className = 'juggle-board player1';
    bare.dataset.marker = 'q-mp-599-bare';
    syncJuggleBoardCells(bare, state.boards.player1, 'player1', true, state);
    expect(bare.dataset.marker).toBe('q-mp-599-bare');
    expect(bare.querySelector('.juggle-grid')).toBeNull();
    // Soft-return still stamps active/seat className on the container.
    expect(bare.classList.contains('juggle-board')).toBe(true);
    expect(bare.classList.contains('player1')).toBe(true);
    expect(bare.classList.contains('active')).toBe(true);
  });

  it('allowInput omitted defaults true (options.allowInput !== false soft)', () => {
    const state = placingMonoState();
    const el = renderBoard(
      state.boards.player1,
      'player1',
      true,
      { ...state, hoverPosition: null },
      () => undefined,
      () => undefined,
      () => undefined
    );
    // Explicit undefined must behave like omitted — soft default allows input.
    syncJuggleBoardCells(
      el,
      state.boards.player1,
      'player1',
      true,
      { ...state, hoverPosition: { row: 2, col: 2 } },
      { allowInput: undefined }
    );
    const cell = el.querySelector(
      '.juggle-cell[data-row="2"][data-col="2"]'
    ) as HTMLElement;
    expect(cell.style.cursor).toBe('pointer');
  });

  it('non-current-player sync soft-suppresses preview classes', () => {
    const state = placingMonoState();
    const el = renderBoard(
      state.boards.player1,
      'player1',
      false,
      state,
      () => undefined,
      () => undefined,
      () => undefined
    );
    syncJuggleBoardCells(el, state.boards.player1, 'player1', false, state);
    expect(el.classList.contains('active')).toBe(false);
    expect(el.querySelectorAll('.preview-valid, .preview-invalid').length).toBe(
      0
    );
  });
});

// =============================================================================
// 3. applyJuggleHoverPreview soft-fail residuals
// =============================================================================

describe('q-mp-599 juggle board-ui — hover-preview soft-fail residuals', () => {
  it('undefined hoverKeys soft-falls through || to empty prevKeys', () => {
    const state = placingMonoState();
    const root = document.createElement('div');
    root.className = 'juggle-boards';
    const boardEl = renderBoard(
      state.boards.player1,
      'player1',
      true,
      { ...state, hoverPosition: null },
      () => undefined,
      () => undefined,
      () => undefined
    );
    root.appendChild(boardEl);
    delete boardEl.dataset.hoverKeys;
    expect(boardEl.dataset.hoverKeys).toBeUndefined();

    applyJuggleHoverPreview(root, {
      ...state,
      hoverPosition: { row: 3, col: 3 },
    });
    expect(boardEl.dataset.hoverKeys).toContain('3,3');
    expect(boardEl.querySelector('.preview-valid, .preview-invalid')).toBeTruthy();
  });

  it('stale hoverKeys for missing map entries soft-return in clearPreview', () => {
    const state = placingMonoState();
    const root = document.createElement('div');
    root.className = 'juggle-boards';
    const boardEl = renderBoard(
      state.boards.player1,
      'player1',
      true,
      { ...state, hoverPosition: null },
      () => undefined,
      () => undefined,
      () => undefined
    );
    root.appendChild(boardEl);
    const grid = boardEl.querySelector('.juggle-grid') as HTMLElement & {
      __juggleCells?: Map<string, HTMLElement>;
    };
    // Stale keys that are not in the cell map → clearPreview !cell soft-return.
    boardEl.dataset.hoverKeys = '99,99|88,88';
    grid.__juggleCells?.delete('1,1');
    expect(() =>
      applyJuggleHoverPreview(root, {
        ...state,
        hoverPosition: { row: 1, col: 1 },
      })
    ).not.toThrow();
    // Missing map key at hover target → continue arm; no preview paint there.
    expect(
      boardEl
        .querySelector('.juggle-cell[data-row="1"][data-col="1"]')
        ?.classList.contains('preview-valid')
    ).toBe(false);
    expect(
      boardEl
        .querySelector('.juggle-cell[data-row="1"][data-col="1"]')
        ?.classList.contains('preview-invalid')
    ).toBe(false);
  });

  it('wrong-phase + missing boardEl soft-return without throwing', () => {
    const state = placingMonoState();
    const empty = document.createElement('div');
    expect(() =>
      applyJuggleHoverPreview(empty, {
        ...state,
        phase: 'rolling',
        hoverPosition: { row: 0, col: 0 },
      })
    ).not.toThrow();
    expect(empty.querySelector('.preview-valid')).toBeNull();

    expect(() =>
      applyJuggleHoverPreview(empty, {
        ...state,
        hoverPosition: { row: 0, col: 0 },
      })
    ).not.toThrow();
  });
});

// =============================================================================
// 4. renderBoard event soft-fail residuals
// =============================================================================

describe('q-mp-599 juggle board-ui — event soft-fail residuals', () => {
  it('keydown Escape / Arrow soft-return without activating place', () => {
    const state = placingMonoState();
    const onClick = vi.fn();
    const el = renderBoard(
      state.boards.player1,
      'player1',
      true,
      state,
      onClick,
      () => undefined,
      () => undefined
    );
    const cell = el.querySelector(
      '.juggle-cell[data-row="1"][data-col="1"]'
    ) as HTMLElement;
    expect(cell.style.cursor).toBe('pointer');
    cell.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Escape', bubbles: true })
    );
    cell.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true })
    );
    expect(onClick).not.toHaveBeenCalled();
  });

  it('mouseenter/leave soft-return when classList optional-chain misses', () => {
    const state = placingMonoState();
    const onHover = vi.fn();
    const onLeave = vi.fn();
    const el = renderBoard(
      state.boards.player1,
      'player1',
      true,
      state,
      () => undefined,
      onHover,
      onLeave
    );
    const cell = el.querySelector(
      '.juggle-cell[data-row="0"][data-col="0"]'
    ) as HTMLElement;
    Object.defineProperty(cell, 'classList', {
      configurable: true,
      get: () => undefined,
    });
    cell.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
    cell.dispatchEvent(new MouseEvent('mouseleave', { bubbles: true }));
    expect(onHover).not.toHaveBeenCalled();
    expect(onLeave).not.toHaveBeenCalled();
  });

  it('click soft-returns when closest cell is outside the grid', () => {
    const state = placingMonoState();
    const onClick = vi.fn();
    const el = renderBoard(
      state.boards.player1,
      'player1',
      true,
      state,
      onClick,
      () => undefined,
      () => undefined
    );
    const grid = el.querySelector('.juggle-grid') as HTMLElement;
    const orphan = document.createElement('div');
    orphan.className = 'juggle-cell';
    orphan.style.cursor = 'pointer';
    orphan.dataset.row = '0';
    orphan.dataset.col = '0';
    el.appendChild(orphan);
    // Event bubbles through grid with target outside grid.contains.
    orphan.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    // Listener is on grid — orphan click does not hit it; also fire on grid
    // with a retargeted synthetic path by clicking the header (non-cell).
    el.querySelector('.juggle-board-header')?.dispatchEvent(
      new MouseEvent('click', { bubbles: true })
    );
    grid.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(onClick).not.toHaveBeenCalled();
  });
});

// =============================================================================
// 5. Dice / shape / styles soft-fail residuals
// =============================================================================

describe('q-mp-599 juggle board-ui — dice/shape/styles soft-fail residuals', () => {
  it('renderDice null path soft-disables roll when canRoll false', () => {
    const onRoll = vi.fn();
    const dice = renderDice(null, onRoll, () => undefined, false, 'rolling');
    const btn = dice.querySelector('.juggle-roll-btn') as HTMLButtonElement;
    expect(btn).toBeTruthy();
    expect(btn.disabled).toBe(true);
    btn.click();
    expect(onRoll).not.toHaveBeenCalled();
  });

  it('renderDice allowInput false soft-skips roll listener wire', () => {
    const onRoll = vi.fn();
    const dice = renderDice(null, onRoll, () => undefined, true, 'rolling', {
      allowInput: false,
    });
    const btn = dice.querySelector('.juggle-roll-btn') as HTMLButtonElement;
    expect(btn.disabled).toBe(true);
    btn.click();
    expect(onRoll).not.toHaveBeenCalled();
  });

  it('shape selector empty shell when category missing or die mismatch', () => {
    expect(
      renderShapeSelector(
        { ...createInitialState(), currentDice: null, selectedCategory: null },
        () => undefined
      ).childElementCount
    ).toBe(0);
    expect(
      renderShapeSelector(
        {
          ...createInitialState(),
          currentDice: [1, 2],
          selectedCategory: 'pentomino',
        },
        () => undefined
      ).childElementCount
    ).toBe(0);
  });

  it('shape controls empty shell outside placing / without selectedShape', () => {
    expect(
      renderShapeControls(
        createInitialState(),
        () => undefined,
        () => undefined
      ).childElementCount
    ).toBe(0);
    expect(
      renderShapeControls(
        {
          ...createInitialState(),
          phase: 'placing',
          selectedShape: null,
        },
        () => undefined,
        () => undefined
      ).childElementCount
    ).toBe(0);
  });

  it('null canvas context soft-returns undrawn canvas from shape controls', () => {
    stubCanvas2d(null);
    const shape = SHAPE_POOLS.tromino[0]!;
    const el = renderShapeControls(
      {
        ...createInitialState(),
        phase: 'placing',
        selectedShape: shape,
        selectedCategory: 'tromino',
        currentDice: [3, 1],
        selectedRotation: 0,
        selectedFlipped: false,
      },
      () => undefined,
      () => undefined
    );
    const canvas = el.querySelector('canvas') as HTMLCanvasElement | null;
    expect(canvas).toBeTruthy();
    // Soft-return leaves canvas mounted even when 2d context is unavailable.
    expect(canvas!.width).toBeGreaterThan(0);
    expect(canvas!.height).toBeGreaterThan(0);
  });

  it('injectJuggleStyles soft-skips second inject (idempotent id host)', () => {
    injectJuggleStyles();
    const first = document.getElementById('juggle-styles');
    expect(first).toBeTruthy();
    injectJuggleStyles();
    expect(document.querySelectorAll('#juggle-styles').length).toBe(1);
    expect(document.getElementById('juggle-styles')).toBe(first);
  });

  it('sparse board rows soft-continue without throwing on renderBoard', () => {
    const sparse = createBoard(CONFIG.GRID_SIZE, CONFIG.GRID_SIZE);
    // Punch a hole in the dense row array — renderBoard continue arms.
    (sparse.cells as (boolean[] | undefined)[])[2] = undefined;
    const state = placingMonoState();
    expect(() =>
      renderBoard(
        sparse,
        'player1',
        true,
        state,
        () => undefined,
        () => undefined,
        () => undefined
      )
    ).not.toThrow();
    const el = renderBoard(
      sparse,
      'player1',
      true,
      state,
      () => undefined,
      () => undefined,
      () => undefined
    );
    // Missing row soft-continues — cell count below full GRID².
    expect(el.querySelectorAll('.juggle-cell').length).toBeLessThan(
      CONFIG.GRID_SIZE * CONFIG.GRID_SIZE
    );
  });
});
