/**
 * q-mp-676 — Close `board-a11y` residual branches (tests-only).
 *
 * Live tip re-measure (`cursor/mp-tip-post1059`):
 *   related `*board-a11y*` suites (pre):
 *     **96.33%** lines (210/218) / **88.34%** branches (144/163)
 *   After this suite (same glob):
 *     **98.62%** lines (215/218) / **95.7%** branches (156/163)
 *   Residual stmts L194/259/270 — defensive `!first` / `!top` / `!el`
 *     guards (Map lists + parent-walk chain never empty); equivalent skips.
 *
 * Ownership: leave `#986`/`522` soft-fail + tip `#916`/`424` nnnull +
 * undrafted `#1009`/`565` nullish with **contained** (this ticket is branch
 * coverage, not soft-fail inventory). Zero `src/` edits; structure/roles
 * presence only — never aria/label/copy text pins; no AI / rules / scoring;
 * Hex Hard 450ms untouched; no network; no ratchet JSON.
 */
import { afterEach, describe, expect, it, vi } from 'vitest';

import {
  applyRovingTabindex,
  bindBoardCellKeys,
  bindCellActivateKeys,
  bindGridNavigation,
  buildCellAriaLabel,
  collectGridCells,
  ensureAriaGridRows,
  findGridNeighbor,
  labelBoardFromGameTitle,
  makeGridCell,
  markBoardAsGrid,
  type BoardFocusable,
} from '../../src/ui/board-a11y';

afterEach(() => {
  document.body.innerHTML = '';
  vi.restoreAllMocks();
});

function makeCell(row: number, col: number): HTMLElement {
  const cell = document.createElement('div');
  cell.dataset.row = String(row);
  cell.dataset.col = String(col);
  makeGridCell(cell, `${row},${col}`);
  return cell;
}

function captureKeydownHandler(board: Element): (e: KeyboardEvent) => void {
  let handler: ((e: Event) => void) | undefined;
  const spy = vi
    .spyOn(board, 'addEventListener')
    .mockImplementation((type, fn, options) => {
      if (type === 'keydown' && typeof fn === 'function') {
        handler = fn as (e: Event) => void;
      }
      EventTarget.prototype.addEventListener.call(board, type, fn, options);
    });
  bindGridNavigation(board);
  spy.mockRestore();
  if (!handler) {
    throw new Error('expected keydown handler');
  }
  return handler as (e: KeyboardEvent) => void;
}

// =============================================================================
// 1. labelBoardFromGameTitle success (structure: id wiring only)
// =============================================================================

describe('q-mp-676 board-a11y — labelBoardFromGameTitle success', () => {
  it('wires aria-labelledby to #game-title id when board is unnamed', () => {
    const title = document.createElement('h1');
    title.id = 'game-title';
    document.body.appendChild(title);
    const board = document.createElement('div');
    document.body.appendChild(board);

    labelBoardFromGameTitle(board);

    expect(board.hasAttribute('aria-labelledby')).toBe(true);
    expect(board.getAttribute('aria-labelledby')).toBe(title.id);
    // Presence only — do not pin title textContent / aria-label strings.
    expect(board.hasAttribute('aria-label')).toBe(false);
  });

  it('markBoardAsGrid also names the board from #game-title id', () => {
    const title = document.createElement('h1');
    title.id = 'game-title';
    document.body.appendChild(title);
    const board = document.createElement('div');
    document.body.appendChild(board);

    markBoardAsGrid(board);

    expect(board.getAttribute('role')).toBe('grid');
    expect(board.getAttribute('aria-labelledby')).toBe('game-title');
  });
});

// =============================================================================
// 2. ensureAriaGridRows residual role / grouping arms
// =============================================================================

describe('q-mp-676 board-a11y — ensureAriaGridRows residual arms', () => {
  it('groups orphan gridcell without data-row under the "_" row key', () => {
    const board = document.createElement('div');
    markBoardAsGrid(board);
    const orphan = document.createElement('div');
    // No data-row → `?? '_'` arm; keep data-col so it is still a gridcell.
    orphan.setAttribute('data-col', '0');
    makeGridCell(orphan, 'orphan');
    board.appendChild(orphan);
    document.body.appendChild(board);

    ensureAriaGridRows(board);

    const rows = board.querySelectorAll(':scope > [role="row"]');
    expect(rows).toHaveLength(1);
    expect(rows[0]?.contains(orphan)).toBe(true);
    expect(orphan.getAttribute('role')).toBe('gridcell');
  });

  it('leaves preexisting role=rowgroup child that already hosts rows', () => {
    const board = document.createElement('div');
    markBoardAsGrid(board);
    const group = document.createElement('div');
    group.setAttribute('role', 'rowgroup');
    const row = document.createElement('div');
    row.setAttribute('role', 'row');
    row.appendChild(makeCell(0, 0));
    group.appendChild(row);
    board.appendChild(group);
    document.body.appendChild(board);

    ensureAriaGridRows(board);

    expect(group.getAttribute('role')).toBe('rowgroup');
    expect(board.querySelectorAll('[role="row"]')).toHaveLength(1);
  });

  it('leaves preexisting role=row child that already hosts gridcells', () => {
    const board = document.createElement('div');
    markBoardAsGrid(board);
    const row = document.createElement('div');
    row.setAttribute('role', 'row');
    row.appendChild(makeCell(0, 0));
    board.appendChild(row);
    document.body.appendChild(board);

    ensureAriaGridRows(board);

    expect(row.getAttribute('role')).toBe('row');
    expect(board.querySelectorAll(':scope > [role="row"]')).toHaveLength(1);
  });

  it('rewrites nested mid role=rowgroup to presentation in ancestor walk', () => {
    const board = document.createElement('div');
    markBoardAsGrid(board);
    const outer = document.createElement('div');
    const mid = document.createElement('div');
    mid.setAttribute('role', 'rowgroup');
    const nest = document.createElement('div');
    board.appendChild(outer);
    outer.appendChild(mid);
    mid.appendChild(nest);
    nest.append(makeCell(0, 0), makeCell(0, 1));
    document.body.appendChild(board);

    ensureAriaGridRows(board);

    expect(nest.getAttribute('role')).toBe('row');
    expect(outer.getAttribute('role')).toBe('rowgroup');
    expect(mid.getAttribute('role')).toBe('presentation');
  });

  it('promotes nest with role=none (foreign-role allowlist)', () => {
    const board = document.createElement('div');
    markBoardAsGrid(board);
    const nest = document.createElement('div');
    nest.setAttribute('role', 'none');
    board.appendChild(nest);
    nest.append(makeCell(0, 0), makeCell(0, 1));
    document.body.appendChild(board);

    ensureAriaGridRows(board);

    expect(nest.getAttribute('role')).toBe('row');
    expect(board.querySelectorAll('.aria-grid-row')).toHaveLength(0);
  });

  it('does not overwrite chrome that already has a non-empty role', () => {
    const board = document.createElement('div');
    markBoardAsGrid(board);
    const chrome = document.createElement('div');
    chrome.setAttribute('role', 'img');
    board.appendChild(chrome);
    const row = document.createElement('div');
    row.setAttribute('role', 'row');
    row.appendChild(makeCell(0, 0));
    board.appendChild(row);
    document.body.appendChild(board);

    ensureAriaGridRows(board);

    expect(chrome.getAttribute('role')).toBe('img');
    expect(row.getAttribute('role')).toBe('row');
  });
});

// =============================================================================
// 3. roving / neighbor residual arms
// =============================================================================

describe('q-mp-676 board-a11y — roving + neighbor residual arms', () => {
  it('preferred miss falls back to first cell (find ?? null)', () => {
    const cells = [makeCell(0, 0), makeCell(0, 1)];
    const active = applyRovingTabindex(cells, { row: '9', col: '9' });
    expect(active).toBe(cells[0]);
    expect(cells.map((c) => c.getAttribute('tabindex'))).toEqual(['0', '-1']);
  });

  it('cells[0] ?? null arm when index 0 is temporarily nullish', () => {
    const only = makeCell(0, 0);
    let index0Reads = 0;
    const cells = new Proxy([only], {
      get(target, prop, receiver) {
        if (prop === '0' || prop === 0) {
          index0Reads += 1;
          // First read is `cells[0] ?? null`; later for-of reads see the cell.
          if (index0Reads === 1) {
            return undefined;
          }
          return only;
        }
        return Reflect.get(target, prop, receiver);
      },
    });

    const active = applyRovingTabindex(cells as Element[]);
    expect(active).toBeNull();
    expect(only.getAttribute('tabindex')).toBe('-1');
    expect(index0Reads).toBeGreaterThanOrEqual(1);
  });

  it('findGridNeighbor skips non-finite coords when computing bounds', () => {
    const okA = makeCell(0, 0);
    const okB = makeCell(0, 2);
    const broken = document.createElement('div');
    broken.setAttribute('data-row', 'NaN');
    broken.setAttribute('data-col', 'x');
    makeGridCell(broken, 'broken');

    const next = findGridNeighbor([okA, broken, okB], 0, 0, 0, 1);
    expect(next).toBe(okB);
  });
});

// =============================================================================
// 4. bindGridNavigation nextRow/nextCol null soft-return
// =============================================================================

describe('q-mp-676 board-a11y — bindGridNavigation attr null arm', () => {
  it('soft-returns when neighbor data-row/col attrs read as null', () => {
    const board = document.createElement('div');
    markBoardAsGrid(board);
    const a = makeCell(0, 0);
    const b = makeCell(0, 1);
    board.append(a, b);
    document.body.appendChild(board);
    applyRovingTabindex(collectGridCells(board));
    const onKey = captureKeydownHandler(board);
    a.focus();

    // findGridNeighbor reads data-row/col 4× on `b` (map + bounds).
    // Subsequent reads are the post-find nextRow/nextCol null arm (L426).
    let rowColReads = 0;
    const spy = vi.spyOn(b, 'getAttribute').mockImplementation((name) => {
      if (name === 'data-row' || name === 'data-col') {
        rowColReads += 1;
        if (rowColReads > 4) {
          return null;
        }
      }
      return Element.prototype.getAttribute.call(b, name);
    });

    const prevented = vi.fn();
    onKey({
      key: 'ArrowRight',
      target: a,
      preventDefault: prevented,
    } as unknown as KeyboardEvent);

    spy.mockRestore();
    expect(rowColReads).toBeGreaterThan(4);
    expect(prevented).not.toHaveBeenCalled();
    expect(a.getAttribute('tabindex')).toBe('0');
    expect(document.activeElement).toBe(a);
  });
});

describe('q-mp-676 board-a11y — ensureRowgroupAncestors contains miss', () => {
  it('soft-returns ancestor walk when grid.contains(from) is false', () => {
    const board = document.createElement('div');
    markBoardAsGrid(board);
    const outer = document.createElement('div');
    const mid = document.createElement('div');
    const nest = document.createElement('div');
    board.appendChild(outer);
    outer.appendChild(mid);
    mid.appendChild(nest);
    nest.append(makeCell(0, 0), makeCell(0, 1));
    document.body.appendChild(board);

    const containsSpy = vi.spyOn(board, 'contains').mockReturnValue(false);
    ensureAriaGridRows(board);
    containsSpy.mockRestore();

    // Promote still marks nest as row. Ancestor walk soft-returns on contains
    // miss, so mid is never rewritten to presentation. (Direct grid child
    // `outer` may still become rowgroup via the decorative children pass.)
    expect(nest.getAttribute('role')).toBe('row');
    expect(mid.getAttribute('role')).not.toBe('presentation');
    expect(mid.hasAttribute('role')).toBe(false);
  });
});

// =============================================================================
// 6. Documented defensive residuals (not observable via public API)
// =============================================================================

describe('q-mp-676 board-a11y — documented defensive residuals', () => {
  it.skip('equivalent: rowCells[0] empty — Map lists never stored empty (L194)', () => {
    // Reason: byRow lists are created only when a cell is pushed.
  });

  it.skip('equivalent: chain[top]/chain[i] undefined — length guards (L259/L270)', () => {
    // Reason: chain built from parent walk; indexed only when length > 0 / i < length-1.
  });
});

// =============================================================================
// 5. activate key `code === 'Space'` + empty extras skip
// =============================================================================

describe('q-mp-676 board-a11y — activate + label builder residual arms', () => {
  it('bindCellActivateKeys fires when only KeyboardEvent.code is Space', () => {
    const cell = document.createElement('div');
    document.body.appendChild(cell);
    const onActivate = vi.fn();
    bindCellActivateKeys(cell, onActivate);

    const ke = new KeyboardEvent('keydown', {
      key: 'Unidentified',
      code: 'Space',
      bubbles: true,
      cancelable: true,
    });
    cell.dispatchEvent(ke);

    expect(onActivate).toHaveBeenCalledTimes(1);
    expect(ke.defaultPrevented).toBe(true);
  });

  it('buildCellAriaLabel skips empty extras and empty mid without throwing', () => {
    const coordOnly = buildCellAriaLabel({ coord: 'T0' });
    const withEmptyExtra = buildCellAriaLabel({
      coord: 'T0',
      extras: ['', 'tag'],
    });
    // Structural: empty extra must not grow the segment count vs a single tag.
    const withTagOnly = buildCellAriaLabel({ coord: 'T0', extras: ['tag'] });
    expect(typeof coordOnly).toBe('string');
    expect(withEmptyExtra.split(', ').length).toBe(
      withTagOnly.split(', ').length
    );
    expect(withEmptyExtra.split(', ').length).toBeGreaterThan(
      coordOnly.split(', ').length
    );
  });

  it('bindBoardCellKeys soft-returns on non-activate keys', () => {
    const board = document.createElement('div');
    const cell = document.createElement('div');
    cell.className = 'cell';
    cell.tabIndex = 0;
    board.appendChild(cell);
    document.body.appendChild(board);
    const onActivate = vi.fn();
    bindBoardCellKeys(
      board,
      (el: BoardFocusable) => el.classList.contains('cell'),
      onActivate
    );

    cell.focus();
    const escape = new KeyboardEvent('keydown', {
      key: 'Escape',
      bubbles: true,
      cancelable: true,
    });
    cell.dispatchEvent(escape);

    expect(onActivate).not.toHaveBeenCalled();
    expect(escape.defaultPrevented).toBe(false);
  });
});
