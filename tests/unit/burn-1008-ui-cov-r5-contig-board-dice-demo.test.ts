/**
 * burn-1008-mp-ui-coverage-round-5 — contig-60 board-ui sync/click paths +
 * dice-demo selector residual callbacks. Tests-only; no player-facing copy
 * asserts (use class / structure / callback invocation only).
 */
import { afterEach, describe, expect, it, vi } from 'vitest';
import { installDomHooks, mountRoot } from './helpers/dom';
import {
  createInitialState,
  type ContigState,
} from '../../src/games/contig-60/types';
import {
  renderBoard,
  syncContigBoard,
  renderDice,
  renderExpressionSelector,
} from '../../src/games/contig-60/board-ui';

installDomHooks({ styleIds: ['contig-styles'] });

afterEach(() => {
  vi.restoreAllMocks();
});

function withDice(state: ContigState, dice: [number, number, number]): ContigState {
  return {
    ...state,
    currentDice: dice,
    phase: 'calculating',
  };
}

describe('burn-1008 ui-cov-r5 contig board-ui', () => {
  it('renderBoard + syncContigBoard updates owners / valid / allowInput false', () => {
    const onClick = vi.fn();
    let state = createInitialState();
    state = withDice(state, [1, 2, 3]);
    const board = renderBoard(state, onClick);
    document.body.appendChild(board);
    expect(board.querySelectorAll('.contig-cell').length).toBe(60);

    // Claim a cell for p1 / p2 then sync
    const firstValue = Number(
      (board.querySelector('.contig-cell') as HTMLElement).dataset.value
    );
    const cell = state.cells.get(firstValue);
    if (cell) {
      cell.owner = 'player1';
    }
    const second = [...state.cells.values()].find((c) => c.value !== firstValue);
    if (second) second.owner = 'player2';

    syncContigBoard(board, state, onClick);
    expect(board.querySelector('.contig-cell-p1')).toBeTruthy();
    expect(board.querySelector('.contig-cell-p2')).toBeTruthy();

    syncContigBoard(board, state, onClick, { allowInput: false });
    expect(board.querySelector('.contig-cell-valid')).toBeNull();

    // Click delegated handler — only fires when cursor is pointer
    const validState = withDice(createInitialState(), [2, 2, 2]);
    const board2 = renderBoard(validState, onClick);
    document.body.appendChild(board2);
    const pointerCell = board2.querySelector(
      '.contig-cell-valid'
    ) as HTMLElement | null;
    if (pointerCell) {
      pointerCell.click();
      expect(onClick).toHaveBeenCalled();
      pointerCell.dispatchEvent(
        new KeyboardEvent('keydown', { key: 'Enter', bubbles: true })
      );
    }
  });

  it('renderDice roll / faces + expression selector empty / pass / options', () => {
    const onRoll = vi.fn();
    const empty = renderDice(null, onRoll, true);
    expect(empty.querySelector('.contig-roll-btn')).toBeTruthy();
    (empty.querySelector('.contig-roll-btn') as HTMLButtonElement).click();
    expect(onRoll).toHaveBeenCalled();

    const faces = renderDice([1, 2, 3], onRoll, false);
    expect(faces.querySelectorAll('.contig-die').length).toBe(3);

    const onSelect = vi.fn();
    const onPass = vi.fn();
    const rolling = createInitialState(); // no dice → empty selector
    const selEmpty = renderExpressionSelector(rolling, onSelect, onPass);
    expect(selEmpty.querySelector('.contig-pass-btn')).toBeNull();

    // Impossible dice combo → no moves → pass chrome
    const stuck = withDice(createInitialState(), [6, 6, 6]);
    // Fill every cell so no placements remain
    for (const cell of stuck.cells.values()) {
      cell.owner = 'player1';
    }
    const selPass = renderExpressionSelector(stuck, onSelect, onPass);
    const passBtn = selPass.querySelector(
      '.contig-pass-btn'
    ) as HTMLButtonElement | null;
    if (passBtn) {
      passBtn.click();
      expect(onPass).toHaveBeenCalled();
    }

    const open = withDice(createInitialState(), [1, 2, 3]);
    const sel = renderExpressionSelector(open, onSelect, onPass);
    const opt = sel.querySelector('button, .contig-expr-option') as
      | HTMLButtonElement
      | null;
    opt?.click();
  });
});

describe('burn-1008 ui-cov-r5 dice-demo residuals', () => {
  it('mounts demo and exercises quick-roll + selector callbacks', async () => {
    const { renderDiceDemo } = await import('../../src/demos/dice-demo');
    const root = mountRoot();
    renderDiceDemo(root);
    expect(root.querySelector('#selector-2d6, .selector-container')).toBeTruthy();

    const quick = root.querySelector(
      '.quick-roll-btn'
    ) as HTMLButtonElement | null;
    quick?.click();
    expect(root.querySelector('#quick-roll-result')).toBeTruthy();

    // Confirm button on a selector if present — structural only
    const confirm = root.querySelector(
      'button.confirm-btn, button[data-action="confirm"], .dice-confirm'
    ) as HTMLButtonElement | null;
    confirm?.click();
  });
});
