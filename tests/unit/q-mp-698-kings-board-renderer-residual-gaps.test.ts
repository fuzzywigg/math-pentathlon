/**
 * q-mp-698 — Close `kings-quadraphages/board-renderer` residual gaps (tests-only).
 *
 * Live tip re-measure (`cursor/mp-tip-post1059` @ `ac5577f6`): with related
 * `tests/unit/*kings*` suites plus tip-carried board-renderer importers
 * (`burn-wave14-state-phase`, `burn-1008-ui-cov-r4-controllers-shell`) under
 * `--coverage.include=src/games/kings-quadraphages/board-renderer.ts`,
 * **91.66%** lines (44/48) / **80.0%** branches (16/20).
 * Uncovered continue arms: sparse-row / hole-cell in `renderBoard` (~L127/L132)
 * and `updateBoard` (~L153/L158).
 *
 * HOLD-CHECK (Grok Bot): board renderer is player-facing UI chrome — pin
 * CURRENT structural mount behavior only. No glyph / CSS / copy / aria /
 * label / message-body text pins. No legal-move, scoring, or AI asserts.
 * Zero `src/` edits. Serialize lightly with `#1092`/`666` (`board.ts` only;
 * this ticket owns `board-renderer.ts`).
 */
import { afterEach, describe, expect, it, vi } from 'vitest';

import {
  BOARD_SIZE,
  createInitialBoard,
  type Board,
  type Cell,
} from '../../src/games/kings-quadraphages/board';
import {
  renderBoard,
  updateBoard,
} from '../../src/games/kings-quadraphages/board-renderer';

afterEach(() => {
  document.head
    .querySelectorAll('style[data-board-styles]')
    .forEach((n) => n.remove());
  document.body.innerHTML = '';
  vi.restoreAllMocks();
});

function cellCoords(root: ParentNode): Array<{ row: string; col: string }> {
  return Array.from(root.querySelectorAll<HTMLElement>('.cell')).map((el) => ({
    row: el.dataset.row ?? '',
    col: el.dataset.col ?? '',
  }));
}

describe('q-mp-698 kings/board-renderer — sparse-row + hole-cell residuals', () => {
  it('renderBoard skips undefined row and undefined cell (L127/L132)', () => {
    const board = createInitialBoard() as Board;
    delete board[0];
    const shortRow = board[1] as Cell[];
    shortRow.length = 0;

    const onClick = vi.fn();
    const el = renderBoard(board, { onCellClick: onClick });
    document.body.appendChild(el);

    // Dense 9×9 minus one missing row (9) minus one emptied row (9) → 63 cells.
    expect(el.classList.contains('game-board')).toBe(true);
    expect(el.querySelectorAll('.cell')).toHaveLength(
      BOARD_SIZE * BOARD_SIZE - BOARD_SIZE - BOARD_SIZE
    );
    const coords = cellCoords(el);
    expect(coords.some((c) => c.row === '0')).toBe(false);
    expect(coords.some((c) => c.row === '1')).toBe(false);
    expect(coords.some((c) => c.row === '2' && c.col === '0')).toBe(true);

    const first = el.querySelector('.cell') as HTMLElement;
    first.click();
    expect(onClick).toHaveBeenCalledTimes(1);
    expect(onClick.mock.calls[0]?.[0]).toEqual({
      row: Number(first.dataset.row),
      col: Number(first.dataset.col),
    });
  });

  it('renderBoard reuses existing style[data-board-styles] tag (L117 false arm)', () => {
    const first = renderBoard(createInitialBoard());
    document.body.appendChild(first);
    expect(document.querySelectorAll('style[data-board-styles]')).toHaveLength(
      1
    );

    const second = renderBoard(createInitialBoard());
    document.body.appendChild(second);
    // Structural: second mount does not inject another style element.
    expect(document.querySelectorAll('style[data-board-styles]')).toHaveLength(
      1
    );
    expect(second.querySelectorAll('.cell')).toHaveLength(
      BOARD_SIZE * BOARD_SIZE
    );
  });

  it('updateBoard skips undefined row and undefined cell (L153/L158)', () => {
    const host = document.createElement('div');
    document.body.appendChild(host);

    const dense = createInitialBoard();
    updateBoard(host, dense);
    expect(host.querySelectorAll('.cell')).toHaveLength(
      BOARD_SIZE * BOARD_SIZE
    );

    const sparse = createInitialBoard() as Board;
    delete sparse[4];
    const holeRow = sparse[5] as Cell[];
    // Leave row present but punch a single hole so the cell===undefined arm runs
    // while neighboring columns still mount.
    delete (holeRow as Cell[])[3];

    const onClick = vi.fn();
    updateBoard(host, sparse, { onCellClick: onClick });

    // Missing full row 4 (−9) + one hole in row 5 (−1) → 71 cells.
    expect(host.querySelectorAll('.cell')).toHaveLength(
      BOARD_SIZE * BOARD_SIZE - BOARD_SIZE - 1
    );
    const coords = cellCoords(host);
    expect(coords.some((c) => c.row === '4')).toBe(false);
    expect(coords.some((c) => c.row === '5' && c.col === '3')).toBe(false);
    expect(coords.some((c) => c.row === '5' && c.col === '2')).toBe(true);
    expect(coords.some((c) => c.row === '5' && c.col === '4')).toBe(true);

    const clicked = host.querySelector(
      '.cell[data-row="5"][data-col="2"]'
    ) as HTMLElement;
    clicked.click();
    expect(onClick).toHaveBeenCalledTimes(1);
    expect(onClick.mock.calls[0]?.[0]).toEqual({ row: 5, col: 2 });
  });
});
