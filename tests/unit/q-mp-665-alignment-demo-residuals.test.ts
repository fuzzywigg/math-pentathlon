/**
 * q-mp-665 — Close `alignment-demo` residual branches (tests-only).
 *
 * Live tip re-measure (`cursor/mp-tip-post1059` @ `be822e75`):
 *   under dedicated `*alignment-demo*` suite (`q-mp-604`):
 *     **99.08%** lines (217/219) / **90.27%** branches (65/72)
 *   Uncovered arms: sparse-row get/set (L44/L58); four winning-cell miss
 *   (L133); four status span miss (L144); hex blue/red winning-cell miss
 *   (L277/L291); hex status span miss (L310).
 *
 * Leave tip-folded `#1045`/`604` 0% raise with **contained** (this ticket
 * owns remaining branches only). Overnight `*align*` demos sit outside the
 * verification glob — leave alone.
 *
 * Constraints: tests only; ZERO `src/` edits; structural asserts only
 * (hosts present/absent, classList, counts, spy calls) — no player-facing
 * copy / aria / label string pins; no AI / rules / scoring; no ratchet JSON;
 * Hex Hard 450ms untouched; no network.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { renderAlignmentDemo } from '../../src/demos/alignment-demo';
import { mountRoot } from './helpers/dom';

type Board = unknown[][];

beforeEach(() => {
  document.body.innerHTML = '';
});

afterEach(() => {
  vi.restoreAllMocks();
  document.body.innerHTML = '';
});

function clickFourCol(root: HTMLElement, col: number): void {
  (
    root.querySelector(
      `#four-board [data-row][data-col="${col}"]`
    ) as HTMLElement
  ).click();
}

function clickHex(root: HTMLElement, row: number, col: number): void {
  (
    root.querySelector(
      `#hex-board [data-row="${row}"][data-col="${col}"]`
    ) as HTMLElement
  ).click();
}

/**
 * Capture boards from `createEmptyBoard` (`Array(rows).fill(null).map(...)`)
 * during the initial mount — four (6×7), hex (7×7), potential (5×5).
 */
function mountCapturingBoards(): { root: HTMLElement; boards: Board[] } {
  const boards: Board[] = [];
  const origMap = Array.prototype.map;
  const spy = vi.spyOn(Array.prototype, 'map').mockImplementation(function (
    this: unknown[],
    ...args: unknown[]
  ) {
    const result = origMap.apply(this, args as never) as unknown[];
    if (
      Array.isArray(this) &&
      this.length >= 5 &&
      this.every((cell) => cell === null) &&
      result.length === this.length &&
      result.every((row) => Array.isArray(row))
    ) {
      boards.push(result as Board);
    }
    return result;
  });

  const root = mountRoot();
  try {
    renderAlignmentDemo(root);
  } finally {
    spy.mockRestore();
  }
  return { root, boards };
}

function missDataRowQuery(host: HTMLElement): void {
  const orig = host.querySelector.bind(host);
  vi.spyOn(host, 'querySelector').mockImplementation((selectors: string) => {
    if (selectors.includes('data-row')) {
      return null;
    }
    return orig(selectors);
  });
}

describe('q-mp-665 alignment-demo — sparse-row get/set residuals', () => {
  it('drop on a deleted bottom row hits get/set undefined arms (L44/L58)', () => {
    const { root, boards } = mountCapturingBoards();
    expect(boards.length).toBeGreaterThanOrEqual(1);
    const four = boards[0];
    expect(four?.length).toBe(6);

    // Hole the drop target row so setBoardCell early-returns; render still
    // walks every row index and hits getBoardCell's undefined arm.
    delete four![5];
    expect(four![5]).toBeUndefined();

    const before = root.querySelectorAll(
      '#four-board .cell-x, #four-board .cell-o'
    ).length;
    clickFourCol(root, 0);
    expect(
      root.querySelectorAll('#four-board .cell-x, #four-board .cell-o').length
    ).toBe(before);
  });
});

describe('q-mp-665 alignment-demo — four-in-row query miss residuals', () => {
  it('skips winning-cell paint when board querySelector misses (L133)', () => {
    const root = mountRoot();
    renderAlignmentDemo(root);
    missDataRowQuery(root.querySelector('#four-board') as HTMLElement);

    for (let i = 0; i < 3; i++) {
      clickFourCol(root, 0);
      clickFourCol(root, 1);
    }
    clickFourCol(root, 0);

    expect(root.querySelector('#four-status .winner')).toBeTruthy();
    expect(root.querySelectorAll('#four-board .winning-cell')).toHaveLength(0);
  });

  it('skips player-class when status span query misses (L144)', () => {
    const root = mountRoot();
    renderAlignmentDemo(root);
    const statusEl = root.querySelector('#four-status') as HTMLElement;
    const spy = vi.spyOn(statusEl, 'querySelector').mockReturnValue(null);

    clickFourCol(root, 0);

    expect(root.querySelectorAll('#four-board .cell-x')).toHaveLength(1);
    expect(spy).toHaveBeenCalled();
    expect(statusEl.querySelector('span')).toBeNull();
  });
});

describe('q-mp-665 alignment-demo — hex query miss residuals', () => {
  it('skips Blue winning-cell paint when hex querySelector misses (L277)', () => {
    const root = mountRoot();
    renderAlignmentDemo(root);
    missDataRowQuery(root.querySelector('#hex-board') as HTMLElement);

    for (let row = 0; row < 6; row++) {
      clickHex(root, row, 3);
      clickHex(root, row, 6);
    }
    clickHex(root, 6, 3);

    expect(root.querySelector('#hex-status .winner')).toBeTruthy();
    expect(root.querySelectorAll('#hex-board .winning-cell')).toHaveLength(0);
  });

  it('skips Red winning-cell paint when hex querySelector misses (L291)', () => {
    const root = mountRoot();
    renderAlignmentDemo(root);
    missDataRowQuery(root.querySelector('#hex-board') as HTMLElement);

    const redTargets: Array<[number, number]> = [
      [3, 0],
      [3, 1],
      [3, 2],
      [3, 3],
      [3, 4],
      [3, 5],
      [3, 6],
    ];
    const blueParks: Array<[number, number]> = [
      [0, 0],
      [1, 0],
      [2, 0],
      [4, 0],
      [5, 0],
      [6, 0],
      [0, 1],
    ];
    for (let i = 0; i < redTargets.length; i++) {
      const blue = blueParks[i];
      const red = redTargets[i];
      if (blue === undefined || red === undefined) {
        throw new Error('expected park/target pair');
      }
      clickHex(root, blue[0], blue[1]);
      clickHex(root, red[0], red[1]);
    }

    expect(root.querySelector('#hex-status .winner')).toBeTruthy();
    expect(root.querySelectorAll('#hex-board .winning-cell')).toHaveLength(0);
  });

  it('skips hex player-class when status span query misses (L310)', () => {
    const root = mountRoot();
    renderAlignmentDemo(root);
    const statusEl = root.querySelector('#hex-status') as HTMLElement;
    const spy = vi.spyOn(statusEl, 'querySelector').mockReturnValue(null);

    clickHex(root, 2, 2);

    expect(root.querySelectorAll('#hex-board .cell-blue')).toHaveLength(1);
    expect(spy).toHaveBeenCalled();
    expect(statusEl.querySelector('span')).toBeNull();
  });
});
