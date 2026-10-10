/**
 * q-mp-397 / UI coverage round 27 — contig-60 board-ui + controller residuals.
 * Characterization: DOM structure / roles / phase / state fields only.
 * No player-facing copy body asserts. No AI move-choice or timing asserts.
 * Hex Hard 450ms untouched. Skip ai.ts / rules.ts product paths.
 */
import { afterEach, describe, expect, it, vi } from 'vitest';
import { installDomHooks, mountRoot } from './helpers/dom';
import {
  BOARD_NUMBERS,
  createInitialState,
  type ContigState,
} from '../../src/games/contig-60/types';
import * as types from '../../src/games/contig-60/types';
import { renderBoard } from '../../src/games/contig-60/board-ui';
import * as contigAi from '../../src/games/contig-60/ai';
import * as contigRules from '../../src/games/contig-60/rules';
import { tutorialManager } from '../../src/core/tutorial';

installDomHooks({
  fakeTimers: true,
  styleIds: ['contig-styles'],
});

afterEach(async () => {
  vi.restoreAllMocks();
  try {
    const mod = await import('../../src/games/contig-60/game-controller');
    mod.destroyGame?.();
  } catch {
    // ignore
  }
  if (tutorialManager.getIsActive()) {
    tutorialManager.exit();
  }
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

describe('q-mp-397 ui-cov-r27 contig board-ui residuals', () => {
  it('renderBoard skips undefined BOARD_NUMBERS rows/cells and paints the rest', () => {
    const onClick = vi.fn();
    const state = withDice(createInitialState(), [1, 2, 3]);

    const savedRow = BOARD_NUMBERS[1];
    const savedCell = BOARD_NUMBERS[0]![5];
    // Defensive continue arms (dense CONFIG grid still has typed holes in tests).
    (BOARD_NUMBERS as (number[] | undefined)[])[1] = undefined;
    (BOARD_NUMBERS[0] as (number | undefined)[])[5] = undefined;

    try {
      const board = renderBoard(state, onClick);
      document.body.appendChild(board);

      expect(
        board.querySelector('.contig-cell[data-row="0"][data-col="0"]')
      ).toBeTruthy();
      expect(
        board.querySelector('.contig-cell[data-row="0"][data-col="5"]')
      ).toBeNull();
      expect(board.querySelector('.contig-cell[data-row="1"]')).toBeNull();
      // Remaining dense rows still render.
      expect(
        board.querySelector('.contig-cell[data-row="2"][data-col="0"]')
      ).toBeTruthy();
      expect(board.querySelectorAll('.contig-cell').length).toBe(60 - 10 - 1);
    } finally {
      (BOARD_NUMBERS as (number[] | undefined)[])[1] = savedRow;
      (BOARD_NUMBERS[0] as (number | undefined)[])[5] = savedCell;
    }
  });
});

describe('q-mp-397 ui-cov-r27 contig controller residuals', () => {
  it('post-destroy newGame / updateUI early-return; double destroy is safe', async () => {
    const { initGame, newGameVsHuman, destroyGame } =
      await import('../../src/games/contig-60/game-controller');

    const board = mountRoot();
    const status = mountRoot();
    initGame(board, status);
    expect(board.querySelector('.contig-scores')).toBeTruthy();

    destroyGame();
    expect(board.innerHTML).toBe('');
    expect(status.innerHTML).toBe('');

    // Containers null → updateUI returns without painting.
    expect(() => newGameVsHuman()).not.toThrow();
    expect(board.innerHTML).toBe('');
    expect(status.innerHTML).toBe('');

    expect(() => destroyGame()).not.toThrow();
  });

  it('AI-seat disabled roll click + wrong-phase fromAI roll are no-ops', async () => {
    const { initGame, newGameVsAI, destroyGame } =
      await import('../../src/games/contig-60/game-controller');

    const app = document.createElement('div');
    app.id = 'app';
    document.body.appendChild(app);
    const board = mountRoot();
    const status = mountRoot();

    // AI owns rolling seat → roll CTA present but disabled for humans.
    vi.spyOn(types, 'createInitialState').mockReturnValue({
      ...createInitialState(),
      currentPlayer: 'player2',
      phase: 'rolling',
      currentDice: null,
      winner: null,
    });
    const rollSpy = vi.spyOn(contigRules, 'doRollDice');

    initGame(board, status);
    newGameVsAI('easy');

    const rollBtn = board.querySelector(
      '.contig-roll-btn'
    ) as HTMLButtonElement | null;
    expect(rollBtn).toBeTruthy();
    expect(rollBtn!.disabled).toBe(true);
    // Programmatic re-enable still hits the AI-seat fromAI!==true guard.
    rollBtn!.disabled = false;
    rollBtn!.click();
    expect(rollSpy).not.toHaveBeenCalled();
    expect(board.querySelector('.contig-dice-display')).toBeNull();

    // Human pass → schedules AI roll; stub doRollDice to stay rolling so
    // makeAIMove hits the non-calculating early return (structure only).
    const filled = createInitialState();
    for (const cell of filled.cells.values()) {
      cell.owner = 'player1';
    }
    vi.mocked(types.createInitialState).mockReturnValue({
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
    rollSpy.mockImplementation((s) => ({
      ...s,
      // Stay on rolling with AI seat → makeAIMove non-calculating guard.
      phase: 'rolling' as const,
      currentDice: null,
      currentPlayer: 'player2' as const,
    }));
    vi.spyOn(contigAi, 'getAIPlacement');

    newGameVsAI('easy');
    const passBtn = board.querySelector(
      '.contig-pass-btn'
    ) as HTMLButtonElement | null;
    expect(passBtn).toBeTruthy();
    passBtn!.click();
    await vi.advanceTimersByTimeAsync(2000);
    expect(contigAi.getAIPlacement).not.toHaveBeenCalled();
    expect(board.querySelector('.contig-scores')).toBeTruthy();

    destroyGame();
  });

  it('stale expr/pass/cell handlers guard wrong-phase + AI seat', async () => {
    const { initGame, newGameVsAI, destroyGame } =
      await import('../../src/games/contig-60/game-controller');

    const app = document.createElement('div');
    app.id = 'app';
    document.body.appendChild(app);
    const board = mountRoot();
    const status = mountRoot();

    initGame(board, status);
    newGameVsAI('easy');

    let n = 0;
    vi.spyOn(Math, 'random').mockImplementation(() => {
      const vals = [0.0, 0.16, 0.33];
      return vals[n++ % 3]!;
    });

    (board.querySelector('.contig-roll-btn') as HTMLButtonElement).click();
    const opt = board.querySelector(
      '.contig-expr-option'
    ) as HTMLButtonElement | null;
    const valid = board.querySelector(
      '.contig-cell-valid'
    ) as HTMLElement | null;
    expect(opt || valid).toBeTruthy();

    // Keep detached references, then place so phase leaves calculating.
    const placeSpy = vi.spyOn(contigRules, 'placeChip');
    if (opt) {
      opt.click();
    } else {
      valid!.click();
    }
    expect(placeSpy).toHaveBeenCalled();

    // Stale handlers after phase advanced — wrong-phase early returns.
    const callsAfterPlace = placeSpy.mock.calls.length;
    opt?.click();
    valid?.click();
    expect(placeSpy.mock.calls.length).toBe(callsAfterPlace);

    // Drive AI calculating via human pass on a filled board, keep stale pass.
    const filled = createInitialState();
    for (const cell of filled.cells.values()) {
      cell.owner = 'player1';
    }
    vi.spyOn(types, 'createInitialState').mockReturnValue({
      ...createInitialState(),
      currentPlayer: 'player1',
      phase: 'calculating',
      currentDice: [1, 1, 1],
      cells: filled.cells,
      grid: filled.grid,
      winner: null,
    });
    const passTurnSpy = vi
      .spyOn(contigRules, 'passTurn')
      .mockImplementation((s) => ({
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
    // AI placement null → pass → hand seat to human (324 arm: no continue).
    vi.spyOn(contigAi, 'getAIPlacement').mockReturnValue(null);
    passTurnSpy.mockImplementation((s) => {
      if (s.currentPlayer === 'player2') {
        return {
          ...s,
          phase: 'rolling' as const,
          currentDice: null,
          currentPlayer: 'player1' as const,
          consecutivePasses: {
            player1: s.consecutivePasses.player1,
            player2: s.consecutivePasses.player2 + 1,
          },
        };
      }
      return {
        ...s,
        phase: 'rolling' as const,
        currentDice: null,
        currentPlayer: 'player2' as const,
        consecutivePasses: {
          player1: s.consecutivePasses.player1 + 1,
          player2: s.consecutivePasses.player2,
        },
      };
    });

    newGameVsAI('easy');
    const humanPass = board.querySelector(
      '.contig-pass-btn'
    ) as HTMLButtonElement | null;
    expect(humanPass).toBeTruthy();
    humanPass!.click();
    await vi.advanceTimersByTimeAsync(2000);
    expect(contigAi.getAIPlacement).toHaveBeenCalled();
    // Human seat again — scores chrome present (structure only).
    expect(board.querySelector('.contig-scores')).toBeTruthy();
    expect(board.querySelector('.contig-roll-btn')).toBeTruthy();

    // Stale pass after phase left calculating.
    const passesBefore = passTurnSpy.mock.calls.length;
    humanPass!.click();
    expect(passTurnSpy.mock.calls.length).toBe(passesBefore);

    destroyGame();
  });

  it('forged pointer cell with non-placement value is a cell-click no-op', async () => {
    const { initGame, newGameVsHuman, destroyGame } =
      await import('../../src/games/contig-60/game-controller');

    const board = mountRoot();
    const status = mountRoot();
    initGame(board, status);
    newGameVsHuman();

    let n = 0;
    vi.spyOn(Math, 'random').mockImplementation(() => {
      const vals = [0.05, 0.2, 0.4];
      return vals[n++ % 3]!;
    });
    const placeSpy = vi.spyOn(contigRules, 'placeChip');

    (board.querySelector('.contig-roll-btn') as HTMLButtonElement).click();
    const inert = board.querySelector(
      '.contig-cell:not(.contig-cell-valid)'
    ) as HTMLElement | null;
    expect(inert).toBeTruthy();
    inert!.style.cursor = 'pointer';
    inert!.click();
    expect(placeSpy).not.toHaveBeenCalled();
    // Dice / scores chrome remain; phase still calculating.
    expect(board.querySelector('.contig-dice-display')).toBeTruthy();
    expect(board.querySelector('.contig-scores')).toBeTruthy();

    destroyGame();
  });

  it('AI place→human handoff; placeChip-stay-calculating hits wrong-phase fromAI roll', async () => {
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
      currentDice: [1, 1, 1],
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
    // First AI place hands seat to human (no continue).
    const placeSpy = vi
      .spyOn(contigRules, 'placeChip')
      .mockImplementationOnce((s) => ({
        ...s,
        phase: 'rolling' as const,
        currentDice: null,
        currentPlayer: 'player1' as const,
        scores: {
          ...s.scores,
          player2: s.scores.player2 + 1,
        },
      }));

    initGame(board, status);
    newGameVsAI('easy');
    (
      board.querySelector('.contig-pass-btn') as HTMLButtonElement
    ).click();
    await vi.advanceTimersByTimeAsync(2000);
    expect(placeSpy).toHaveBeenCalled();
    expect(board.querySelector('.contig-roll-btn')).toBeTruthy();
    expect(status.querySelector('.status-ai-thinking')).toBeNull();

    // Second chain: AI placeChip leaves calculating so scheduled fromAI roll
    // hits handleRollDice wrong-phase guard (structure only).
    destroyGame();
    placeSpy.mockReset();
    placeSpy.mockImplementation((s) => ({
      ...s,
      phase: 'calculating' as const,
      currentDice: [2, 3, 4] as [number, number, number],
      currentPlayer: 'player2' as const,
      scores: {
        ...s.scores,
        player2: s.scores.player2 + 1,
      },
    }));
    const rollSpy = vi.mocked(contigRules.doRollDice);
    const rollsBefore = rollSpy.mock.calls.length;

    initGame(board, status);
    newGameVsAI('easy');
    (
      board.querySelector('.contig-pass-btn') as HTMLButtonElement
    ).click();
    await vi.advanceTimersByTimeAsync(2500);
    expect(placeSpy).toHaveBeenCalled();
    // fromAI roll no-ops on non-rolling phase — no extra doRollDice.
    expect(rollSpy.mock.calls.length).toBe(rollsBefore + 1);
    expect(board.querySelector('.contig-scores')).toBeTruthy();

    destroyGame();
  });

  it('stale pass during AI calculating seat is ignored', async () => {
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
      currentDice: [1, 1, 1],
      cells: filled.cells,
      grid: filled.grid,
      winner: null,
    });
    const passSpy = vi
      .spyOn(contigRules, 'passTurn')
      .mockImplementation((s) => ({
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
    // Stall AI placement so the seat stays calculating.
    vi.spyOn(contigAi, 'getAIPlacement').mockReturnValue({
      value: 6,
      expression: '2+4',
    });
    vi.spyOn(contigRules, 'placeChip').mockImplementation((s) => ({
      ...s,
      phase: 'rolling' as const,
      currentDice: null,
      currentPlayer: 'player1' as const,
    }));

    initGame(board, status);
    newGameVsAI('easy');
    const humanPass = board.querySelector(
      '.contig-pass-btn'
    ) as HTMLButtonElement;
    expect(humanPass).toBeTruthy();
    humanPass.click();
    await vi.advanceTimersByTimeAsync(500); // AI roll → calculating
    expect(status.querySelector('.status-ai-thinking')).toBeTruthy();

    const passesAtAiSeat = passSpy.mock.calls.length;
    humanPass.click(); // stale pass on AI seat → handlePass AI guard
    expect(passSpy.mock.calls.length).toBe(passesAtAiSeat);

    destroyGame();
    await vi.advanceTimersByTimeAsync(2000);
  });

  it('stale expr option on AI calculating seat is ignored', async () => {
    const { initGame, newGameVsAI, destroyGame } =
      await import('../../src/games/contig-60/game-controller');

    const app = document.createElement('div');
    app.id = 'app';
    document.body.appendChild(app);
    const board = mountRoot();
    const status = mountRoot();

    initGame(board, status);
    newGameVsAI('medium');

    let n = 0;
    vi.spyOn(Math, 'random').mockImplementation(() => {
      const vals = [0.0, 0.16, 0.33];
      return vals[n++ % 3]!;
    });

    (board.querySelector('.contig-roll-btn') as HTMLButtonElement).click();
    const opt = board.querySelector(
      '.contig-expr-option'
    ) as HTMLButtonElement | null;
    const valid = board.querySelector(
      '.contig-cell-valid'
    ) as HTMLElement | null;

    // Force handoff to AI without consuming the stale node references.
    vi.spyOn(contigRules, 'placeChip').mockImplementation((s) => ({
      ...s,
      phase: 'rolling' as const,
      currentDice: null,
      currentPlayer: 'player2' as const,
    }));
    vi.spyOn(contigRules, 'doRollDice').mockImplementation((s) => ({
      ...s,
      phase: 'calculating' as const,
      currentDice: [2, 3, 4] as [number, number, number],
      currentPlayer: 'player2' as const,
    }));
    // Stall AI so the seat stays calculating while we poke stale handlers.
    vi.spyOn(contigAi, 'getAIPlacement').mockReturnValue({
      value: 6,
      expression: '2+4',
    });
    const placeCalls = vi.mocked(contigRules.placeChip).mock.calls.length;

    if (opt) {
      opt.click();
    } else if (valid) {
      valid.click();
    }
    await vi.advanceTimersByTimeAsync(500); // AI roll → calculating
    // AI thinking chrome; human expr chrome suppressed.
    expect(status.querySelector('.status-ai-thinking')).toBeTruthy();
    expect(board.querySelector('.contig-expr-option')).toBeNull();

    // Stale human option / cell during AI seat — select/cell AI guards.
    const before = vi.mocked(contigRules.placeChip).mock.calls.length;
    opt?.click();
    valid?.click();
    expect(vi.mocked(contigRules.placeChip).mock.calls.length).toBe(before);
    expect(before).toBeGreaterThan(placeCalls);

    destroyGame();
    await vi.advanceTimersByTimeAsync(2000);
  });
});
