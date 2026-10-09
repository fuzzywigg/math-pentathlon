/**
 * q-mp-248 / UI coverage round 11 — contig-60 board-ui + controller residuals.
 * Characterization: DOM structure / roles / phase / state fields only.
 * No player-facing copy body asserts. No AI move-choice or timing asserts.
 */
import { afterEach, describe, expect, it, vi } from 'vitest';
import { installDomHooks, mountRoot } from './helpers/dom';
import {
  createInitialState,
  type ContigState,
} from '../../src/games/contig-60/types';
import * as types from '../../src/games/contig-60/types';
import {
  renderBoard,
  syncContigBoard,
  renderExpressionSelector,
} from '../../src/games/contig-60/board-ui';
import * as contigAi from '../../src/games/contig-60/ai';
import * as contigRules from '../../src/games/contig-60/rules';

installDomHooks({
  fakeTimers: true,
  styleIds: ['contig-styles'],
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

afterEach(async () => {
  vi.restoreAllMocks();
  try {
    const mod = await import('../../src/games/contig-60/game-controller');
    mod.destroyGame?.();
  } catch {
    // ignore
  }
  const { tutorialManager } = await import('../../src/core/tutorial');
  if (tutorialManager.getIsActive()) {
    tutorialManager.exit();
  }
});

describe('q-mp-248 ui-cov-r11 contig board-ui residuals', () => {
  it('syncContigBoard rebuilds cell map + owners / valid / points chrome', () => {
    const onClick = vi.fn();
    let state = withDice(createInitialState(), [2, 2, 2]);
    const board = renderBoard(state, onClick);
    document.body.appendChild(board);

    const mapped = board as HTMLElement & {
      __contigCells?: Map<number, HTMLElement>;
    };
    expect(mapped.__contigCells?.size).toBe(60);
    delete mapped.__contigCells;

    const first = board.querySelector('.contig-cell') as HTMLElement;
    const firstValue = Number(first.dataset.value);
    const owned = state.cells.get(firstValue);
    if (owned) {
      owned.owner = 'player1';
    }
    const neighbor = [...state.cells.values()].find(
      (c) => c.value !== firstValue && c.owner === null
    );
    if (neighbor) {
      neighbor.owner = 'player2';
    }

    syncContigBoard(board, state, onClick);
    expect(mapped.__contigCells?.size).toBe(60);
    expect(board.querySelector('.contig-cell-p1')).toBeTruthy();
    expect(board.querySelector('.contig-cell-p2')).toBeTruthy();

    // Fresh open board: valid cells may expose data-points when adjacency scores.
    state = withDice(createInitialState(), [1, 2, 3]);
    const open = renderBoard(state, onClick);
    document.body.appendChild(open);
    const p1Cell = [...state.cells.values()][0];
    if (p1Cell) {
      p1Cell.owner = 'player1';
    }
    syncContigBoard(open, state, onClick);
    expect(
      open.querySelector('.contig-cell-valid, .contig-cell-p1')
    ).toBeTruthy();
  });

  it('delegated click/keydown guards: non-cell, non-pointer, bad value, wrong key', () => {
    const onClick = vi.fn();
    const state = withDice(createInitialState(), [1, 2, 3]);
    const board = renderBoard(state, onClick);
    document.body.appendChild(board);

    // Click outside a cell — early return.
    board.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(onClick).not.toHaveBeenCalled();

    const inert = board.querySelector(
      '.contig-cell:not(.contig-cell-valid)'
    ) as HTMLElement | null;
    expect(inert).toBeTruthy();
    inert!.style.cursor = '';
    inert!.click();
    expect(onClick).not.toHaveBeenCalled();

    // Non-finite dataset value with pointer cursor still no-ops.
    inert!.style.cursor = 'pointer';
    inert!.dataset.value = 'NaN';
    inert!.click();
    expect(onClick).not.toHaveBeenCalled();

    // Wrong key on a valid cell — ignore.
    const valid = board.querySelector(
      '.contig-cell-valid'
    ) as HTMLElement | null;
    expect(valid).toBeTruthy();
    valid!.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Escape', bubbles: true })
    );
    expect(onClick).not.toHaveBeenCalled();

    // keydown target that is not a .contig-cell
    board.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Enter', bubbles: true })
    );
    expect(onClick).not.toHaveBeenCalled();

    // Non-pointer valid-looking cell via keydown.
    inert!.dataset.value = '12';
    inert!.classList.add('contig-cell');
    inert!.style.cursor = '';
    inert!.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Enter', bubbles: true })
    );
    expect(onClick).not.toHaveBeenCalled();

    // Space on pointer cell with non-finite value.
    inert!.style.cursor = 'pointer';
    inert!.dataset.value = 'not-a-number';
    inert!.dispatchEvent(
      new KeyboardEvent('keydown', { key: ' ', bubbles: true })
    );
    expect(onClick).not.toHaveBeenCalled();
  });

  it('expression selector formula chrome uses ×/÷ markers when present', () => {
    const state = withDice(createInitialState(), [2, 3, 4]);
    const sel = renderExpressionSelector(state, vi.fn(), vi.fn());
    const formulas = [...sel.querySelectorAll('.expr-formula')].map(
      (el) => el.textContent ?? ''
    );
    expect(formulas.length).toBeGreaterThan(0);
    // At least one option should expose operator chrome (structure / glyphs only).
    expect(formulas.some((t) => /[×÷+\-]/.test(t))).toBe(true);
  });
});

describe('q-mp-248 ui-cov-r11 contig controller residuals', () => {
  it('draw banner chrome + placing status branch (structure only)', async () => {
    const { initGame, destroyGame } =
      await import('../../src/games/contig-60/game-controller');
    const board = mountRoot();
    const status = mountRoot();

    const base = createInitialState();
    const createSpy = vi.spyOn(types, 'createInitialState');
    createSpy.mockReturnValue({
      ...base,
      winner: 'draw',
      phase: 'gameOver',
      scores: { player1: 3, player2: 3 },
      currentDice: null,
    });

    initGame(board, status);
    expect(status.querySelector('.contig-winner-banner')).toBeTruthy();
    expect(status.querySelector('.game-winner-banner')).toBeTruthy();
    destroyGame();
    expect(board.innerHTML).toBe('');
    expect(status.innerHTML).toBe('');

    createSpy.mockReturnValue({
      ...createInitialState(),
      phase: 'placing',
      currentPlayer: 'player1',
      currentDice: [1, 2, 3],
      winner: null,
    });
    initGame(board, status);
    expect(status.querySelector('.contig-status.player1')).toBeTruthy();
    expect(status.querySelector('.status-ai-thinking')).toBeNull();
    destroyGame();
  });

  it('tutorial roll refresh + vsAI AI-pass schedule without choice asserts', async () => {
    const {
      initGame,
      newGameVsAI,
      newGameVsHuman,
      startTutorial,
      isTutorialActive,
      setAIDifficulty,
      destroyGame,
    } = await import('../../src/games/contig-60/game-controller');
    const { tutorialManager } = await import('../../src/core/tutorial');

    const app = document.createElement('div');
    app.id = 'app';
    document.body.appendChild(app);
    const board = mountRoot();
    const status = mountRoot();

    initGame(board, status);
    newGameVsHuman();
    startTutorial();
    expect(isTutorialActive()).toBe(true);

    // Roll while tutorial active — hits handleAction + refreshHighlight arms.
    const roll = board.querySelector(
      '.contig-roll-btn'
    ) as HTMLButtonElement | null;
    expect(roll).toBeTruthy();
    roll!.click();
    expect(
      board.querySelector(
        '.contig-dice-display, .contig-cell-valid, .contig-pass-btn'
      )
    ).toBeTruthy();
    tutorialManager.exit();
    expect(isTutorialActive()).toBe(false);

    // vsAI: seed AI calculating with no placements → makeAIMove pass path.
    setAIDifficulty('easy');
    const filled = createInitialState();
    for (const cell of filled.cells.values()) {
      cell.owner = 'player1';
    }
    vi.spyOn(types, 'createInitialState').mockReturnValue({
      ...filled,
      currentPlayer: 'player2',
      phase: 'calculating',
      currentDice: [1, 1, 1],
      winner: null,
    });
    vi.spyOn(contigAi, 'getAIPlacement').mockReturnValue(null);

    newGameVsAI('easy');
    expect(status.querySelector('.status-ai-thinking')).toBeTruthy();
    expect(board.querySelector('.contig-expr-option')).toBeNull();
    expect(board.querySelector('.contig-cell-valid')).toBeNull();

    // Human cannot arm roll while AI seat owns calculating chrome.
    const disabledRoll = board.querySelector(
      '.contig-roll-btn'
    ) as HTMLButtonElement | null;
    // Dice are showing (calculating), not a roll CTA.
    expect(disabledRoll).toBeNull();

    // Trigger AI move via a human place → AI schedule chain, but board is full
    // so start from rolling AI seat and force roll+move via spies.
    vi.mocked(types.createInitialState).mockReturnValue({
      ...filled,
      currentPlayer: 'player2',
      phase: 'rolling',
      currentDice: null,
      winner: null,
    });
    vi.spyOn(contigRules, 'doRollDice').mockImplementation((s) => ({
      ...s,
      phase: 'calculating' as const,
      currentDice: [1, 1, 1] as [number, number, number],
      currentPlayer: 'player2' as const,
    }));
    vi.spyOn(contigRules, 'passTurn').mockImplementation((s) => ({
      ...s,
      phase: 'rolling' as const,
      currentDice: null,
      currentPlayer: 'player1' as const,
      consecutivePasses: {
        ...s.consecutivePasses,
        player2: s.consecutivePasses.player2 + 1,
      },
    }));

    newGameVsAI('easy');
    // AI seat rolling — roll disabled for human; schedule is not auto-started
    // until after a human move. Seed AI calculating again and flush via
    // human-path schedule by mocking a prior human place: use roll with fromAI
    // by advancing after we manually invoke through a human calculating pass
    // that hands the seat to AI.
    vi.mocked(types.createInitialState).mockReturnValue({
      ...createInitialState(),
      currentPlayer: 'player1',
      phase: 'calculating',
      currentDice: [6, 6, 6],
      cells: filled.cells,
      grid: filled.grid,
      winner: null,
    });
    // No valid placements → pass chrome for human → schedules AI roll.
    vi.mocked(contigRules.doRollDice).mockRestore();
    vi.spyOn(contigRules, 'doRollDice').mockImplementation((s) => ({
      ...s,
      phase: 'calculating' as const,
      currentDice: [2, 3, 4] as [number, number, number],
      currentPlayer: 'player2' as const,
    }));
    vi.mocked(contigRules.passTurn).mockImplementation((s) => ({
      ...s,
      phase: 'rolling' as const,
      currentDice: null,
      currentPlayer: 'player2' as const,
      consecutivePasses: {
        player1: s.consecutivePasses.player1 + 1,
        player2: s.consecutivePasses.player2,
      },
    }));

    newGameVsAI('easy');
    const passBtn = board.querySelector(
      '.contig-pass-btn'
    ) as HTMLButtonElement | null;
    expect(passBtn).toBeTruthy();
    passBtn!.click();

    // AI roll (500ms) then makeAIMove (1000ms) — stub placement null → pass.
    await vi.advanceTimersByTimeAsync(2000);
    expect(board.querySelector('.contig-scores')).toBeTruthy();
    // Structure only — do not assert AI placement choice or delay values.
    expect(contigAi.getAIPlacement).toHaveBeenCalled();

    destroyGame();
  });

  it('expression select + cell click advance; wrong-phase roll no-ops', async () => {
    const { initGame, newGameVsHuman, destroyGame } =
      await import('../../src/games/contig-60/game-controller');

    const board = mountRoot();
    const status = mountRoot();
    initGame(board, status);
    newGameVsHuman();

    let n = 0;
    vi.spyOn(Math, 'random').mockImplementation(() => {
      const vals = [0.0, 0.16, 0.33];
      const v = vals[n % 3]!;
      n += 1;
      return v;
    });

    (board.querySelector('.contig-roll-btn') as HTMLButtonElement).click();
    expect(board.querySelector('.contig-dice-display')).toBeTruthy();

    // Expression option path (handleSelectPlacement).
    const opt = board.querySelector(
      '.contig-expr-option'
    ) as HTMLButtonElement | null;
    if (opt) {
      opt.click();
      expect(board.querySelector('.contig-roll-btn')).toBeTruthy();
    } else {
      const valid = board.querySelector(
        '.contig-cell-valid'
      ) as HTMLElement | null;
      valid?.click();
      expect(
        board.querySelector('.contig-roll-btn, .contig-scores')
      ).toBeTruthy();
    }

    // After place, phase is rolling for opponent — another roll click is fine.
    // Seed calculating without dice via mock to exercise cell-click guard.
    destroyGame();
    vi.spyOn(types, 'createInitialState').mockReturnValue({
      ...createInitialState(),
      phase: 'calculating',
      currentDice: null,
      currentPlayer: 'player1',
    });
    initGame(board, status);
    const anyCell = board.querySelector('.contig-cell') as HTMLElement | null;
    anyCell?.click();
    // Still calculating / no dice — scores chrome remains; no throw.
    expect(board.querySelector('.contig-scores')).toBeTruthy();
    destroyGame();
  });

  it('vsAI human place schedules AI chain; destroy cancels timers', async () => {
    const { initGame, newGameVsAI, destroyGame } =
      await import('../../src/games/contig-60/game-controller');
    const app = document.createElement('div');
    app.id = 'app';
    document.body.appendChild(app);
    const board = mountRoot();
    const status = mountRoot();

    initGame(board, status);
    newGameVsAI('medium');
    expect(
      app.dataset.opponent === 'ai' || app.classList.contains('game-vs-ai')
    ).toBe(true);

    let n = 0;
    vi.spyOn(Math, 'random').mockImplementation(() => {
      const vals = [0.05, 0.2, 0.4];
      return vals[n++ % 3]!;
    });

    (board.querySelector('.contig-roll-btn') as HTMLButtonElement).click();
    const valid = board.querySelector(
      '.contig-cell-valid'
    ) as HTMLElement | null;
    if (valid) {
      valid.click();
    } else {
      (
        board.querySelector('.contig-pass-btn') as HTMLButtonElement | null
      )?.click();
    }

    // Pending AI timers — destroy must invalidate generation (no throw on flush).
    destroyGame();
    await vi.advanceTimersByTimeAsync(3000);
    expect(board.innerHTML).toBe('');
  });

  it('makeAIMove same-seat continue via placeChip stub (no choice asserts)', async () => {
    const { initGame, newGameVsAI, destroyGame } =
      await import('../../src/games/contig-60/game-controller');
    const app = document.createElement('div');
    app.id = 'app';
    document.body.appendChild(app);
    const board = mountRoot();
    const status = mountRoot();

    const filled = createInitialState();
    for (const cell of filled.cells.values()) {
      cell.owner = 'player1';
    }

    vi.spyOn(types, 'createInitialState').mockReturnValue({
      ...createInitialState(),
      currentPlayer: 'player1',
      phase: 'calculating',
      currentDice: [6, 6, 6],
      cells: filled.cells,
      grid: filled.grid,
      winner: null,
    });
    vi.spyOn(contigRules, 'passTurn').mockImplementation((s) => ({
      ...s,
      phase: 'rolling' as const,
      currentDice: null,
      currentPlayer: 'player2' as const,
      consecutivePasses: {
        player1: s.consecutivePasses.player1 + 1,
        player2: s.consecutivePasses.player2,
      },
    }));
    vi.spyOn(contigRules, 'doRollDice').mockImplementation((s) => ({
      ...s,
      phase: 'calculating' as const,
      currentDice: [2, 3, 4] as [number, number, number],
      currentPlayer: 'player2' as const,
    }));
    vi.spyOn(contigAi, 'getAIPlacement').mockReturnValue({
      value: 6,
      expression: '2+4',
    });
    // placeChip keeps AI seat so makeAIMove schedules another AI roll.
    vi.spyOn(contigRules, 'placeChip').mockImplementation((s) => ({
      ...s,
      phase: 'rolling' as const,
      currentDice: null,
      currentPlayer: 'player2' as const,
      scores: {
        ...s.scores,
        player2: s.scores.player2 + 1,
      },
    }));

    initGame(board, status);
    newGameVsAI('easy');
    const passBtn = board.querySelector(
      '.contig-pass-btn'
    ) as HTMLButtonElement | null;
    expect(passBtn).toBeTruthy();
    passBtn!.click();
    await vi.advanceTimersByTimeAsync(2500);
    expect(board.querySelector('.contig-scores')).toBeTruthy();
    expect(contigRules.placeChip).toHaveBeenCalled();
    destroyGame();
  });
});
