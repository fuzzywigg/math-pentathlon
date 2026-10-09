/**
 * q-mp-251 mutation audit UI wave 7 — kill survivors in games/contig-60/board-ui.
 * Structural / flag / aria pins only — no player-facing copy asserts.
 */
import { afterEach, describe, expect, it } from 'vitest';

import {
  renderBoard,
  syncContigBoard,
} from '../../src/games/contig-60/board-ui';
import { calculatePoints } from '../../src/games/contig-60/rules';
import {
  BOARD_NUMBERS,
  CONFIG,
  createInitialState,
  getAdjacentPositions,
  getValidPlacements,
  type ContigState,
} from '../../src/games/contig-60/types';

afterEach(() => {
  document.body.innerHTML = '';
});

function withDice(
  state: ContigState,
  dice: [number, number, number]
): ContigState {
  return {
    ...state,
    currentDice: dice,
    phase: 'calculating',
  };
}

/** Find a dice triple where `targetValue` is a valid placement result. */
function diceForTarget(
  state: ContigState,
  targetValue: number
): [number, number, number] | null {
  for (let a = 1; a <= 6; a++) {
    for (let b = 1; b <= 6; b++) {
      for (let c = 1; c <= 6; c++) {
        const dice: [number, number, number] = [a, b, c];
        const hit = getValidPlacements(state, dice).some(
          (p) => p.result === targetValue
        );
        if (hit) return dice;
      }
    }
  }
  return null;
}

describe('mutation-ui7 contig board-ui', () => {
  it('sync rebuilds cell map when cache missing (kills getContigCellMap !map)', () => {
    // Survivor: L52 UnaryNot remove ! — without cache, mutant returns empty Map.
    const state = withDice(createInitialState(), [1, 2, 3]);
    const el = renderBoard(state, () => undefined);
    const boxed = el as HTMLElement & {
      __contigCells?: Map<number, HTMLElement>;
    };
    delete boxed.__contigCells;
    syncContigBoard(el, state, () => undefined);
    expect(boxed.__contigCells?.size).toBe(CONFIG.GRID_ROWS * CONFIG.GRID_COLS);
    // Sync must still paint owners after rebuild.
    const v = Number(
      (el.querySelector('.contig-cell') as HTMLElement).dataset.value
    );
    const cell = state.cells.get(v);
    if (cell) cell.owner = 'player1';
    syncContigBoard(el, state, () => undefined);
    expect(el.querySelectorAll('.contig-cell-p1').length).toBe(1);
  });

  it('sync valid class requires phase calculating (kills phase === → !==)', () => {
    // Survivor: L86 Equality phase === 'calculating' → !==.
    const base = createInitialState();
    const seed = BOARD_NUMBERS[0]![0]!;
    const cells = new Map(base.cells);
    cells.set(seed, { ...cells.get(seed)!, owner: 'player1' });
    const adj = getAdjacentPositions(0, 0)[0]!;
    const target = BOARD_NUMBERS[adj.row]![adj.col]!;
    let state: ContigState = { ...base, cells };
    const dice = diceForTarget(state, target);
    expect(dice).not.toBeNull();
    state = withDice(state, dice!);
    const el = renderBoard(
      { ...createInitialState(), phase: 'rolling', currentDice: null },
      () => undefined
    );
    syncContigBoard(el, state, () => undefined);
    const valid = el.querySelector(
      `.contig-cell-valid[data-value="${target}"]`
    );
    expect(valid).toBeTruthy();
    expect((valid as HTMLElement).style.cursor).toBe('pointer');

    syncContigBoard(el, { ...state, phase: 'rolling' }, () => undefined);
    expect(
      el.querySelector(`.contig-cell-valid[data-value="${target}"]`)
    ).toBeNull();
  });

  it('sync paints exactly one p2 owner cell (kills player2 === → !== invert)', () => {
    // Survivor: L93 Equality — invert makes empty cells receive contig-cell-p2.
    const state = createInitialState();
    const p2Value = BOARD_NUMBERS[0]![1]!;
    const cell = state.cells.get(p2Value);
    if (cell) cell.owner = 'player2';
    const el = renderBoard(createInitialState(), () => undefined);
    syncContigBoard(el, state, () => undefined);
    const p2 = el.querySelectorAll('.contig-cell-p2');
    expect(p2.length).toBe(1);
    expect((p2[0] as HTMLElement).dataset.value).toBe(String(p2Value));
    expect(el.querySelectorAll('.contig-cell-p1').length).toBe(0);
  });

  it('sync stamps data-points only when points > 0 (kills > → >= and 0 → 1)', () => {
    // Survivors: L98 `points > 0` → `>=` and `0 → 1`.
    // Isolated target with zero adjacent owners → points 0 → no data-points.
    const base = createInitialState();
    // Corner cell 1 has few neighbors; leave all unowned → points 0 for any empty.
    const zeroTarget = BOARD_NUMBERS[0]![0]!;
    expect(calculatePoints(base, zeroTarget)).toBe(0);
    const dice0 = diceForTarget(base, zeroTarget);
    expect(dice0).not.toBeNull();
    const zeroState = withDice(base, dice0!);
    const el0 = renderBoard(createInitialState(), () => undefined);
    syncContigBoard(el0, zeroState, () => undefined);
    const zeroCell = el0.querySelector(
      `.contig-cell-valid[data-value="${zeroTarget}"]`
    ) as HTMLElement | null;
    expect(zeroCell).toBeTruthy();
    expect(zeroCell?.dataset.points).toBeUndefined();

    // One adjacent owner → points === 1 → data-points="+1" (fails if threshold is > 1).
    const cells = new Map(base.cells);
    const neighbor = getAdjacentPositions(0, 0)[0]!;
    const seedVal = BOARD_NUMBERS[neighbor.row]![neighbor.col]!;
    cells.set(seedVal, { ...cells.get(seedVal)!, owner: 'player1' });
    const oneStateBase = { ...base, cells };
    expect(calculatePoints(oneStateBase, zeroTarget)).toBe(1);
    const dice1 = diceForTarget(oneStateBase, zeroTarget);
    expect(dice1).not.toBeNull();
    const el1 = renderBoard(createInitialState(), () => undefined);
    syncContigBoard(el1, withDice(oneStateBase, dice1!), () => undefined);
    const oneCell = el1.querySelector(
      `.contig-cell-valid[data-value="${zeroTarget}"]`
    ) as HTMLElement | null;
    expect(oneCell?.dataset.points).toBe('+1');
  });

  it('sync aria empty vs owner tokens (kills !owner and ownerLabel !== undefined)', () => {
    // Survivors: L108 UnaryNot on empty; L109 ownerLabel !== → === skips owner segment.
    const state = createInitialState();
    const owned = BOARD_NUMBERS[0]![0]!;
    const empty = BOARD_NUMBERS[0]![1]!;
    const cell = state.cells.get(owned);
    if (cell) cell.owner = 'player1';
    const el = renderBoard(createInitialState(), () => undefined);
    syncContigBoard(el, state, () => undefined);

    const ownedEl = el.querySelector(
      `.contig-cell[data-value="${owned}"]`
    ) as HTMLElement;
    const emptyEl = el.querySelector(
      `.contig-cell[data-value="${empty}"]`
    ) as HTMLElement;
    const ownedLabel = ownedEl.getAttribute('aria-label') ?? '';
    const emptyLabel = emptyEl.getAttribute('aria-label') ?? '';
    expect(emptyLabel.includes('empty')).toBe(true);
    expect(ownedLabel.includes('empty')).toBe(false);
    // Seat label for 2P human is "Blue" (structural token, not tutorial copy).
    expect(ownedLabel.includes('Blue')).toBe(true);
  });

  it('renderBoard grid is exact CONFIG rows×cols (documents < → <= fence)', () => {
    // Survivors: L142/L151 row/col `<` → `<=` — dense BOARD_NUMBERS makes extra
    // index `undefined` and `continue`, so cell count stays 60 (equivalent).
    const el = renderBoard(createInitialState(), () => undefined);
    expect(el.querySelectorAll('.contig-row').length).toBe(CONFIG.GRID_ROWS);
    expect(el.querySelectorAll('.contig-cell').length).toBe(
      CONFIG.GRID_ROWS * CONFIG.GRID_COLS
    );
  });
});
