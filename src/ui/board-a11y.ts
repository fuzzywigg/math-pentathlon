/**
 * Thin shared board a11y helpers.
 * Wave 1: focusable cells, Enter/Space, label parts, focus restore, live status.
 * Wave 2: ARIA grid + one roving tabindex + arrow navigation.
 * Wave 3: SVG click-board focusables (same attrs as HTML cells).
 */

/** HTML or SVG node that can take tabindex / role / focus. */
export type BoardFocusable = HTMLElement | SVGElement;

function isBoardFocusable(el: EventTarget | null): el is BoardFocusable {
  return el instanceof HTMLElement || el instanceof SVGElement;
}

function focusBoardEl(el: Element): void {
  if (isBoardFocusable(el)) el.focus();
}

export interface CellLabelParts {
  /** Coordinate or cell identity, e.g. "E2" or "12". */
  coord: string;
  /** Seat / owner name for screen readers (Blue, Red, Player 1, AI, …). */
  owner?: string;
  /** Piece or content name (King, Quadraphage, prime, …). */
  piece?: string;
  /** Empty cell (mutually preferred over owner/piece when true). */
  empty?: boolean;
  /** Announce as a legal move destination (color is not enough). */
  validMove?: boolean;
  /** Announce as a legal placement target. */
  validPlacement?: boolean;
  /** Extra label segments (e.g. "prime"). */
  extras?: string[];
}

/** Build a comma-separated aria-label: coord · owner/piece|empty · valid move/placement. */
export function buildCellAriaLabel(parts: CellLabelParts): string {
  const segments: string[] = [parts.coord];

  if (parts.empty) {
    segments.push('empty');
  } else {
    const mid = [parts.owner, parts.piece].filter(Boolean).join(' ');
    if (mid) segments.push(mid);
  }

  if (parts.extras) {
    for (const extra of parts.extras) {
      if (extra) segments.push(extra);
    }
  }

  if (parts.validMove) segments.push('valid move');
  if (parts.validPlacement) segments.push('valid placement');

  return segments.join(', ');
}

/** Apply Kings-style focusable cell attrs (Wave 1 button pattern). */
export function makeCellFocusable(cell: HTMLElement, ariaLabel: string): void {
  cell.setAttribute('role', 'button');
  cell.setAttribute('tabindex', '0');
  cell.setAttribute('aria-label', ariaLabel);
}

/**
 * Same attrs as makeCellFocusable for SVG (or any Element) click targets.
 * Pair with bindCellActivateKeys for Enter/Space.
 */
export function makeSvgFocusable(el: Element, ariaLabel: string): void {
  el.setAttribute('role', 'button');
  el.setAttribute('tabindex', '0');
  el.setAttribute('aria-label', ariaLabel);
}

/** Mark a board root as an ARIA grid (Wave 2). */
export function markBoardAsGrid(boardEl: Element): void {
  boardEl.setAttribute('role', 'grid');
}

/**
 * Apply gridcell role + label. Tabindex defaults to -1; call applyRovingTabindex
 * (or restoreGridFocus) after all cells exist so exactly one is 0.
 */
export function makeGridCell(cell: Element, ariaLabel: string): void {
  cell.setAttribute('role', 'gridcell');
  cell.setAttribute('tabindex', '-1');
  cell.setAttribute('aria-label', ariaLabel);
}

/**
 * One tab stop among gridcells: preferred coords get tabindex=0, else the first cell.
 * Returns the tabbable cell, or null if there are no cells.
 */
export function applyRovingTabindex(
  cells: Element[],
  preferred?: FocusedCellCoords | null
): Element | null {
  if (cells.length === 0) return null;

  let active: Element | null = null;
  if (preferred) {
    active =
      cells.find(
        (c) =>
          c.getAttribute('data-row') === preferred.row &&
          c.getAttribute('data-col') === preferred.col
      ) ?? null;
  }
  if (!active) active = cells[0];

  for (const cell of cells) {
    cell.setAttribute('tabindex', cell === active ? '0' : '-1');
  }
  return active;
}

/** Collect gridcells that carry data-row / data-col. */
export function collectGridCells(root: Element): Element[] {
  return Array.from(
    root.querySelectorAll('[role="gridcell"][data-row][data-col]')
  );
}

/**
 * Find the next gridcell in a cardinal direction, stepping over holes
 * (e.g. Sum Dominoes cells covered by placed dominoes).
 */
export function findGridNeighbor(
  cells: Element[],
  row: number,
  col: number,
  dRow: number,
  dCol: number
): Element | null {
  if (cells.length === 0) return null;

  const byCoord = new Map(
    cells.map(
      (c) =>
        [
          `${c.getAttribute('data-row')},${c.getAttribute('data-col')}`,
          c,
        ] as const
    )
  );

  let minR = Infinity;
  let maxR = -Infinity;
  let minC = Infinity;
  let maxC = -Infinity;
  for (const c of cells) {
    const r = Number(c.getAttribute('data-row'));
    const colN = Number(c.getAttribute('data-col'));
    if (!Number.isFinite(r) || !Number.isFinite(colN)) continue;
    minR = Math.min(minR, r);
    maxR = Math.max(maxR, r);
    minC = Math.min(minC, colN);
    maxC = Math.max(maxC, colN);
  }

  let r = row + dRow;
  let c = col + dCol;
  while (r >= minR && r <= maxR && c >= minC && c <= maxC) {
    const found = byCoord.get(`${r},${c}`);
    if (found) return found;
    r += dRow;
    c += dCol;
  }
  return null;
}

/**
 * Arrow-key roving among [data-row][data-col] gridcells inside boardEl.
 * Does not handle Enter/Space — use bindBoardCellKeys / bindCellActivateKeys.
 */
const ARROW_DELTA: Record<string, { dRow: number; dCol: number }> = {
  ArrowUp: { dRow: -1, dCol: 0 },
  ArrowDown: { dRow: 1, dCol: 0 },
  ArrowLeft: { dRow: 0, dCol: -1 },
  ArrowRight: { dRow: 0, dCol: 1 },
};

export function bindGridNavigation(boardEl: Element): void {
  boardEl.addEventListener('keydown', (e) => {
    const ke = e as KeyboardEvent;
    const delta = ARROW_DELTA[ke.key];
    if (!delta) return;

    const target = ke.target;
    if (!isBoardFocusable(target)) return;
    if (target.getAttribute('role') !== 'gridcell') return;
    if (!boardEl.contains(target)) return;

    const row = Number(target.getAttribute('data-row'));
    const col = Number(target.getAttribute('data-col'));
    if (!Number.isFinite(row) || !Number.isFinite(col)) return;

    const cells = collectGridCells(boardEl);
    const next = findGridNeighbor(cells, row, col, delta.dRow, delta.dCol);
    if (!next) return;

    ke.preventDefault();
    applyRovingTabindex(cells, {
      row: next.getAttribute('data-row')!,
      col: next.getAttribute('data-col')!,
    });
    focusBoardEl(next);
  });
}

/**
 * After a board rebuild: set roving tabindex, then restore focus when we had one.
 * When focus is null, still leaves exactly one tabindex=0 without stealing focus.
 */
export function restoreGridFocus(
  container: Element,
  focus: FocusedCellCoords | null
): void {
  const cells = collectGridCells(container);
  const active = applyRovingTabindex(cells, focus);
  if (focus && active) {
    focusBoardEl(active);
  }
}

/** Enter/Space activation on a single cell (Contig / SD / Prime / SVG pattern). */
export function bindCellActivateKeys(
  cell: Element,
  onActivate: () => void
): void {
  cell.addEventListener('keydown', (e) => {
    const ke = e as KeyboardEvent;
    if (ke.key === 'Enter' || ke.key === ' ') {
      ke.preventDefault();
      onActivate();
    }
  });
}

/**
 * Enter/Space via event delegation on a board root (Kings pattern).
 * `isCell` should return true only for the focused cell element itself.
 */
export function bindBoardCellKeys(
  boardEl: Element,
  isCell: (el: BoardFocusable) => boolean,
  onActivate: (cell: BoardFocusable) => void
): void {
  boardEl.addEventListener('keydown', (e) => {
    const ke = e as KeyboardEvent;
    if (ke.key !== 'Enter' && ke.key !== ' ') return;
    const target = ke.target;
    if (!isBoardFocusable(target) || !isCell(target)) return;
    ke.preventDefault();
    onActivate(target);
  });
}

export interface FocusedCellCoords {
  row: string;
  col: string;
}

/** Snapshot focused `[data-row][data-col]` inside a container before innerHTML rebuild. */
export function captureFocusedCell(
  container: Element
): FocusedCellCoords | null {
  const active = document.activeElement;
  if (!isBoardFocusable(active)) return null;
  if (!container.contains(active)) return null;
  const row = active.getAttribute('data-row');
  const col = active.getAttribute('data-col');
  if (row == null || col == null) return null;
  return { row, col };
}

/** Restore focus to the same `[data-row][data-col]` after a rebuild. */
export function restoreFocusedCell(
  container: Element,
  focus: FocusedCellCoords | null
): void {
  if (!focus) return;
  const cell = container.querySelector(
    `[data-row="${focus.row}"][data-col="${focus.col}"]`
  );
  if (cell) focusBoardEl(cell);
}

/** Mark a status root as a polite live region. */
export function markStatusLive(el: HTMLElement): void {
  el.setAttribute('role', 'status');
  el.setAttribute('aria-live', 'polite');
}
