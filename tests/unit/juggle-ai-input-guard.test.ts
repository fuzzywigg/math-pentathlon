/**
 * Juggle — AI-seat input lock (UI/board only).
 * Human must not see selectable dice / shape / valid-placement chrome while Red thinks,
 * and taps during the think pause must not change state.
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { createInitialState, selectDie } from '../../src/games/juggle/rules';
import {
  injectJuggleStyles,
  renderBoard,
  renderDice,
  renderShapeControls,
  renderShapeSelector,
} from '../../src/games/juggle/board-ui';
import { SHAPE_POOLS } from '../../src/games/juggle/types';

function stubCanvas(): void {
  vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue({
    fillRect: () => undefined,
    strokeRect: () => undefined,
    fillStyle: '',
    strokeStyle: '',
  } as unknown as CanvasRenderingContext2D);
}

describe('Juggle AI-turn input guard', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    document.getElementById('juggle-styles')?.remove();
    stubCanvas();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    document.body.innerHTML = '';
    document.getElementById('juggle-styles')?.remove();
    vi.restoreAllMocks();
  });

  it('renderBoard with allowInput false skips pointer, preview, and valid aria', () => {
    const placing = selectDie(
      {
        ...createInitialState(),
        phase: 'selectingShape',
        currentDice: [1, 1],
      },
      0
    );
    const s = { ...placing, hoverPosition: { row: 2, col: 3 } };
    const onClick = vi.fn();
    const el = renderBoard(
      s.boards.player1,
      'player1',
      true,
      s,
      onClick,
      () => undefined,
      () => undefined,
      { allowInput: false }
    );

    expect(el.querySelectorAll('.preview-valid')).toHaveLength(0);
    expect(el.querySelector('[aria-label*="valid placement"]')).toBeNull();
    const cell = el.querySelector(
      '.juggle-cell[data-row="2"][data-col="3"]'
    ) as HTMLElement;
    expect(cell.style.cursor).not.toBe('pointer');
    cell.click();
    expect(onClick).not.toHaveBeenCalled();
  });

  it('renderDice with allowInput false does not mark dice selectable', () => {
    const onSelect = vi.fn();
    const el = renderDice(
      [3, 4],
      () => undefined,
      onSelect,
      false,
      'selectingShape',
      { allowInput: false }
    );
    expect(el.querySelectorAll('.juggle-die.selectable')).toHaveLength(0);
    expect(el.querySelector('[aria-disabled="true"]')).toBeTruthy();
    expect(
      [...el.querySelectorAll('[aria-label]')].every((n) =>
        (n.getAttribute('aria-label') ?? '').includes('not selectable')
      )
    ).toBe(true);
    expect(el.textContent).toMatch(/Computer is thinking/);
    el.querySelector('.juggle-die')?.dispatchEvent(
      new MouseEvent('click', { bubbles: true })
    );
    expect(onSelect).not.toHaveBeenCalled();
  });

  it('renderDice with allowInput false disables Roll on rolling phase', () => {
    const onRoll = vi.fn();
    const el = renderDice(null, onRoll, () => undefined, true, 'rolling', {
      allowInput: false,
    });
    const btn = el.querySelector('.juggle-roll-btn') as HTMLButtonElement;
    expect(btn.disabled).toBe(true);
    btn.click();
    expect(onRoll).not.toHaveBeenCalled();
  });

  it('renderShapeSelector with allowInput false marks options not selectable', () => {
    const onSelect = vi.fn();
    const el = renderShapeSelector(
      {
        ...createInitialState(),
        phase: 'selectingShape',
        currentDice: [2, 2],
        selectedCategory: 'domino',
      },
      onSelect,
      { allowInput: false }
    );
    expect(el.querySelectorAll('.juggle-shape-option.disabled').length).toBeGreaterThan(
      0
    );
    expect(el.querySelector('[aria-disabled="true"]')).toBeTruthy();
    expect(
      [...el.querySelectorAll('.juggle-shape-option')].every((n) =>
        (n.getAttribute('aria-label') ?? '').includes('not selectable')
      )
    ).toBe(true);
    expect(el.textContent).toMatch(/Computer is choosing/);
    (el.querySelector('.juggle-shape-option') as HTMLElement).click();
    expect(onSelect).not.toHaveBeenCalled();
  });

  it('renderShapeControls with allowInput false disables rotate/flip', () => {
    const shape = SHAPE_POOLS.tromino.find((s) => s.canRotate && s.canFlip)!;
    const onRotate = vi.fn();
    const onFlip = vi.fn();
    const el = renderShapeControls(
      {
        ...createInitialState(),
        phase: 'placing',
        selectedShape: shape,
        selectedCategory: 'tromino',
        currentDice: [3, 1],
      },
      onRotate,
      onFlip,
      { allowInput: false }
    );
    const buttons = [
      ...el.querySelectorAll('.juggle-control-btn'),
    ] as HTMLButtonElement[];
    expect(buttons.length).toBeGreaterThan(0);
    expect(buttons.every((b) => b.disabled)).toBe(true);
    expect(el.textContent).toMatch(/Computer is placing/);
    buttons.forEach((b) => b.click());
    expect(onRotate).not.toHaveBeenCalled();
    expect(onFlip).not.toHaveBeenCalled();
  });

  it('injector ships coarse-pointer 44px targets and reduced-motion overrides', () => {
    injectJuggleStyles();
    const css = document.getElementById('juggle-styles')?.textContent ?? '';
    expect(css).toMatch(/@media \(pointer:\s*coarse\)/);
    expect(css).toMatch(/min-height:\s*44px/);
    expect(css).toMatch(/@media \(prefers-reduced-motion:\s*reduce\)/);
    expect(css).toMatch(/\.juggle-die\.selectable:hover[\s\S]*transform:\s*none/);
    expect(css).toMatch(/\.juggle-winner-banner[\s\S]*animation:\s*none/);
  });

  it('blocks human chrome during AI think pause after Blue places', async () => {
    const {
      initGame,
      newGameVsAI,
      __getStateForTests,
    } = await import('../../src/games/juggle/game-controller');

    const board = document.createElement('div');
    const status = document.createElement('div');
    document.body.append(board, status);
    initGame(board, status);
    newGameVsAI('easy');

    // Force monomino pair so Blue auto-enters placing after picking a die
    vi.spyOn(Math, 'random').mockReturnValue(0);
    (board.querySelector('.juggle-roll-btn') as HTMLButtonElement).click();
    (board.querySelector('.juggle-die.selectable') as HTMLElement).click();
    expect(__getStateForTests().phase).toBe('placing');
    (
      board.querySelector(
        '.juggle-board.player1 .juggle-cell[data-row="0"][data-col="0"]'
      ) as HTMLElement
    ).click();

    expect(__getStateForTests().currentPlayer).toBe('player2');
    expect(__getStateForTests().phase).toBe('rolling');
    expect(status.querySelector('.juggle-status')?.textContent).toMatch(
      /Computer is thinking/
    );
    expect(status.querySelector('.status-ai-thinking')).toBeTruthy();
    expect(
      (board.querySelector('.juggle-roll-btn') as HTMLButtonElement).disabled
    ).toBe(true);
    expect(board.querySelectorAll('.juggle-die.selectable')).toHaveLength(0);
    expect(board.querySelector('[aria-label*="valid placement"]')).toBeNull();

    const beforeHistory = __getStateForTests().moveHistory.length;
    (board.querySelector('.juggle-roll-btn') as HTMLButtonElement).click();
    expect(__getStateForTests().currentPlayer).toBe('player2');
    expect(__getStateForTests().phase).toBe('rolling');
    expect(__getStateForTests().moveHistory).toHaveLength(beforeHistory);

    // AI roll (500) → makeAIMove die (500) → place (monomino auto-shape)
    await vi.advanceTimersByTimeAsync(500);
    expect(__getStateForTests().phase).toBe('selectingShape');
    expect(board.querySelectorAll('.juggle-die.selectable')).toHaveLength(0);
    expect(board.querySelector('[aria-disabled="true"]')).toBeTruthy();
    board
      .querySelector('.juggle-die')
      ?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(__getStateForTests().selectedCategory).toBeNull();

    await vi.advanceTimersByTimeAsync(500);
    await vi.advanceTimersByTimeAsync(300);

    const after = __getStateForTests();
    expect(after.currentPlayer).toBe('player1');
    expect(after.moveHistory.length).toBeGreaterThan(beforeHistory);
    expect(after.moveHistory[after.moveHistory.length - 1]?.player).toBe(
      'player2'
    );
  });
});
