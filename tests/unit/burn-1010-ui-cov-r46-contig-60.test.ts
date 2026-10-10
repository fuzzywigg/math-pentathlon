/**
 * q-mp-501 / UI coverage round 46 — contig-60 board-ui + controller residuals.
 * Characterization: DOM structure / roles / phase / state fields only.
 * No player-facing copy body asserts. No AI move-choice or timing asserts.
 * Stub AI / rules for controller wiring. Hex Hard 450ms untouched.
 * Zero src product edits. Skip ai.ts / rules.ts product paths.
 */
import { afterEach, describe, expect, it, vi } from 'vitest';
import { installDomHooks, mountRoot } from './helpers/dom';
import {
  createInitialState,
  type ContigState,
} from '../../src/games/contig-60/types';
import * as types from '../../src/games/contig-60/types';
import * as contigAi from '../../src/games/contig-60/ai';
import * as contigRules from '../../src/games/contig-60/rules';
import { tutorialManager } from '../../src/core/tutorial';

installDomHooks({
  fakeTimers: true,
  styleIds: ['contig-styles'],
});

afterEach(async () => {
  try {
    vi.clearAllTimers();
  } catch {
    // ignore
  }
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

function mountBoardStatus(): {
  board: HTMLElement;
  status: HTMLElement;
  app: HTMLElement;
} {
  const app = document.createElement('div');
  app.id = 'app';
  document.body.appendChild(app);
  const board = mountRoot();
  const status = mountRoot();
  return { board, status, app };
}

function filledBoardState(overrides: Partial<ContigState> = {}): ContigState {
  const base = createInitialState();
  for (const cell of base.cells.values()) {
    cell.owner = 'player1';
  }
  return {
    ...base,
    currentPlayer: 'player1',
    phase: 'calculating',
    currentDice: [1, 1, 1],
    winner: null,
    ...overrides,
    cells: overrides.cells ?? base.cells,
    grid: overrides.grid ?? base.grid,
  };
}

/** Keep a stable object identity so in-place mutation reaches module state. */
function sameRefPassToAi(s: ContigState): ContigState {
  s.phase = 'rolling';
  s.currentDice = null;
  s.currentPlayer = 'player2';
  s.consecutivePasses = {
    player1: s.consecutivePasses.player1 + 1,
    player2: s.consecutivePasses.player2,
  };
  return s;
}

function sameRefAiCalculating(s: ContigState): ContigState {
  s.phase = 'calculating';
  s.currentDice = [2, 3, 4];
  s.currentPlayer = 'player2';
  return s;
}

describe('q-mp-501 ui-cov-r46 contig controller status residuals', () => {
  it('gameOver banners for seats / draw / forged winner without copy pins', async () => {
    const { initGame, destroyGame } =
      await import('../../src/games/contig-60/game-controller');

    const cases: Array<Partial<ContigState>> = [
      { phase: 'gameOver', winner: 'player1', currentPlayer: 'player1' },
      { phase: 'gameOver', winner: 'player2', currentPlayer: 'player2' },
      { phase: 'gameOver', winner: 'draw', currentPlayer: 'player1' },
      // Exhaustiveness default arm (invalid runtime winner).
      {
        phase: 'gameOver',
        winner: 'forged' as ContigState['winner'],
        currentPlayer: 'player1',
      },
    ];

    for (const override of cases) {
      vi.restoreAllMocks();
      vi.spyOn(types, 'createInitialState').mockReturnValue({
        ...createInitialState(),
        ...override,
      });
      const { board, status } = mountBoardStatus();
      initGame(board, status);
      expect(status.querySelector('.contig-winner-banner')).toBeTruthy();
      expect(status.querySelector('.game-winner-banner')).toBeTruthy();
      expect(status.querySelector('.contig-status')).toBeNull();
      expect(board.querySelector('.contig-scores')).toBeTruthy();
      destroyGame();
    }
  });

  it('forged phase hits status default arm; placing keeps turn chrome', async () => {
    const { initGame, destroyGame } =
      await import('../../src/games/contig-60/game-controller');

    vi.spyOn(types, 'createInitialState').mockReturnValue({
      ...createInitialState(),
      phase: 'forged-phase' as ContigState['phase'],
      currentDice: null,
      winner: null,
    });
    const { board, status } = mountBoardStatus();
    initGame(board, status);
    // Turn chrome still mounts; forged phase is the status switch default.
    expect(status.querySelector('.contig-status')).toBeTruthy();
    expect(status.querySelector('.contig-winner-banner')).toBeNull();
    expect(board.querySelector('.contig-scores')).toBeTruthy();
    destroyGame();

    vi.restoreAllMocks();
    vi.spyOn(types, 'createInitialState').mockReturnValue({
      ...createInitialState(),
      phase: 'placing',
      currentDice: [2, 3, 4],
      winner: null,
    });
    const again = mountBoardStatus();
    initGame(again.board, again.status);
    expect(again.status.querySelector('.contig-status')).toBeTruthy();
    expect(again.status.querySelector('.status-ai-thinking')).toBeNull();
    expect(again.board.querySelector('.contig-roll-btn')).toBeNull();
    destroyGame();
  });
});

describe('q-mp-501 ui-cov-r46 contig controller AI schedule residuals', () => {
  it('makeAIMove gameOver + wrong-seat guards via in-place state poke', async () => {
    const { initGame, newGameVsAI, destroyGame } =
      await import('../../src/games/contig-60/game-controller');

    const shared = filledBoardState();
    vi.spyOn(types, 'createInitialState').mockReturnValue(shared);
    vi.spyOn(contigRules, 'passTurn').mockImplementation(sameRefPassToAi);
    vi.spyOn(contigRules, 'doRollDice').mockImplementation(
      sameRefAiCalculating
    );
    const aiSpy = vi.spyOn(contigAi, 'getAIPlacement').mockReturnValue({
      value: 6,
      expression: '2+4',
    });
    vi.spyOn(contigRules, 'placeChip').mockImplementation((s) => {
      s.phase = 'rolling';
      s.currentDice = null;
      s.currentPlayer = 'player1';
      return s;
    });

    const { board, status } = mountBoardStatus();
    initGame(board, status);
    newGameVsAI('easy');

    const passBtn = board.querySelector(
      '.contig-pass-btn'
    ) as HTMLButtonElement | null;
    expect(passBtn).toBeTruthy();
    passBtn!.click();

    // AI roll schedules makeAIMove (1000ms). Mutate the live state ref first.
    await vi.advanceTimersByTimeAsync(500);
    expect(status.querySelector('.status-ai-thinking')).toBeTruthy();
    aiSpy.mockClear();

    shared.phase = 'gameOver';
    shared.winner = 'draw';
    await vi.advanceTimersByTimeAsync(1000);
    expect(aiSpy).not.toHaveBeenCalled();
    expect(board.querySelector('.contig-scores')).toBeTruthy();

    // Second chain: wrong-seat guard (currentPlayer !== aiPlayer).
    destroyGame();
    aiSpy.mockClear();
    shared.phase = 'calculating';
    shared.currentDice = [1, 1, 1];
    shared.currentPlayer = 'player1';
    shared.winner = null;
    for (const cell of shared.cells.values()) {
      cell.owner = 'player1';
    }

    initGame(board, status);
    newGameVsAI('easy');
    (board.querySelector('.contig-pass-btn') as HTMLButtonElement).click();
    await vi.advanceTimersByTimeAsync(500);
    aiSpy.mockClear();
    shared.currentPlayer = 'player1';
    shared.phase = 'calculating';
    shared.currentDice = [2, 3, 4];
    await vi.advanceTimersByTimeAsync(1000);
    expect(aiSpy).not.toHaveBeenCalled();
    expect(board.querySelector('.contig-scores')).toBeTruthy();

    destroyGame();
  });

  it('tutorial exited path skips completed remount; completed still resets', async () => {
    const { initGame, startTutorial, isTutorialActive, destroyGame } =
      await import('../../src/games/contig-60/game-controller');

    const { board, status } = mountBoardStatus();
    initGame(board, status);
    startTutorial();
    expect(isTutorialActive()).toBe(true);
    expect(board.querySelector('.contig-board')).toBeTruthy();

    tutorialManager.exit();
    expect(isTutorialActive()).toBe(false);
    // Exited arm does not call newGameVsHuman — chrome still present.
    expect(board.querySelector('.contig-scores')).toBeTruthy();
    expect(board.querySelector('.contig-roll-btn')).toBeTruthy();

    startTutorial();
    expect(isTutorialActive()).toBe(true);
    tutorialManager.complete();
    expect(isTutorialActive()).toBe(false);
    // Completed arm remounts via newGameVsHuman — roll CTA present.
    expect(board.querySelector('.contig-roll-btn')).toBeTruthy();
    expect(board.querySelector('.contig-scores')).toBeTruthy();
    destroyGame();
  });
});

describe('q-mp-501 ui-cov-r46 contig board-ui allowInput + sync chrome', () => {
  it('AI-seat render suppresses expr chrome; bare root skips opponent chrome', async () => {
    const { initGame, newGameVsAI, newGameVsHuman, destroyGame } =
      await import('../../src/games/contig-60/game-controller');

    const shared = filledBoardState({
      currentPlayer: 'player2',
      phase: 'calculating',
      currentDice: [2, 3, 4],
    });
    vi.spyOn(types, 'createInitialState').mockReturnValue(shared);
    vi.spyOn(contigAi, 'getAIPlacement').mockReturnValue(null);
    vi.spyOn(contigRules, 'passTurn').mockImplementation((s) => {
      s.phase = 'rolling';
      s.currentDice = null;
      s.currentPlayer = 'player1';
      return s;
    });

    // No #app → syncOpponentChrome early return (structure only).
    const board = mountRoot();
    const status = mountRoot();
    initGame(board, status);
    newGameVsAI('medium');
    expect(board.querySelector('.contig-scores')).toBeTruthy();
    // Computer calculating: no human expression / pass chrome.
    expect(board.querySelector('.contig-expressions')).toBeNull();
    expect(board.querySelector('.contig-pass-btn')).toBeNull();
    expect(status.querySelector('.status-ai-thinking')).toBeTruthy();
    // Valid highlights suppressed via allowInput:false.
    expect(board.querySelector('.contig-cell-valid')).toBeNull();

    destroyGame();
    vi.restoreAllMocks();

    const withApp = mountBoardStatus();
    initGame(withApp.board, withApp.status);
    newGameVsAI('easy');
    expect(withApp.app.dataset.opponent).toBe('ai');
    expect(withApp.app.classList.contains('game-vs-ai')).toBe(true);
    newGameVsHuman();
    expect(withApp.app.dataset.opponent).toBeUndefined();
    expect(withApp.app.classList.contains('game-vs-ai')).toBe(false);
    expect(withApp.board.querySelector('.contig-roll-btn')).toBeTruthy();
    destroyGame();
  });
});
