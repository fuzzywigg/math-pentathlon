/**
 * q-mp-371 / UI coverage round 25 — hex board-ui + controller residuals.
 * Characterization: DOM structure / roles / phase / state fields only.
 * No player-facing copy body asserts. No AI move-choice or timing asserts.
 * Hex Hard 450ms untouched. Skip ai*.ts / rules.ts product paths.
 */
import { afterEach, describe, expect, it, vi } from 'vitest';
import { installDomHooks, mountRoot } from './helpers/dom';
import {
  createInitialState,
  type HexGameState,
} from '../../src/games/hex/types';
import { formatPosition, renderBoard, renderStatus } from '../../src/games/hex/board-ui';
import * as hexAiClient from '../../src/games/hex/ai-client';
import { owlSystem } from '../../src/core/owl';
import {
  applyGameModeChrome,
  clearGameModeChrome,
} from '../../src/ui/player-colors';

installDomHooks({ fakeTimers: true });

afterEach(async () => {
  vi.restoreAllMocks();
  try {
    const mod = await import('../../src/games/hex/game-controller');
    mod.destroyGame?.();
  } catch {
    // ignore
  }
});

function clickCell(board: HTMLElement, row: number, col: number): void {
  const cell = board.querySelector(
    `.hex-cell-group[data-row="${row}"][data-col="${col}"]`
  );
  expect(cell).toBeTruthy();
  cell!.dispatchEvent(new MouseEvent('click', { bubbles: true }));
}

/** Drive P1 vertical win on DEFAULT 11×11 via HvH clicks (structure only). */
async function playP1VerticalWin(
  board: HTMLElement,
  getGameState: () => HexGameState
): Promise<void> {
  // P1 takes column 0 top→bottom; P2 fills column 10 so the path stays open.
  for (let row = 0; row < 11; row++) {
    clickCell(board, row, 0); // P1
    if (getGameState().winner) break;
    clickCell(board, row, 10); // P2 filler
  }
  expect(getGameState().winner).toBe('player1');
}

describe('q-mp-371 ui-cov-r25 hex board-ui residuals', () => {
  it('skips undefined board rows/cells and still paints remaining groups', () => {
    const state = createInitialState(3);
    // Punch holes: missing row + missing cell → continue arms.
    (state.board as (typeof state.board)[number][])[1] = undefined as unknown as (
      typeof state.board
    )[number];
    state.board[0] = [null, undefined as unknown as null, null];

    const el = document.createElement('div');
    expect(() => renderBoard(state, el)).not.toThrow();
    // Row 0 col 0 and col 2 still render; row 1 skipped entirely.
    expect(
      el.querySelector('.hex-cell-group[data-row="0"][data-col="0"]')
    ).toBeTruthy();
    expect(
      el.querySelector('.hex-cell-group[data-row="0"][data-col="2"]')
    ).toBeTruthy();
    expect(el.querySelector('.hex-cell-group[data-row="1"]')).toBeNull();
    expect(formatPosition({ row: 0, col: 2 })).toBe('C1');
  });

  it('winner status chrome covers HvH + HvA arms without copy body asserts', () => {
    const box = document.createElement('div');
    const p1Win = { ...createInitialState(3), winner: 'player1' as const };
    const p2Win = { ...createInitialState(3), winner: 'player2' as const };

    renderStatus(p1Win, box, 'human-vs-human');
    expect(box.querySelector('.status-winner')).toBeTruthy();
    expect(box.querySelector('.status-mode')).toBeNull();

    renderStatus(p2Win, box, 'human-vs-human');
    expect(box.querySelector('.status-winner')).toBeTruthy();

    renderStatus(p1Win, box, 'human-vs-ai');
    expect(box.querySelector('.status-mode')).toBeTruthy();
    expect(box.querySelector('.status-winner')).toBeTruthy();

    renderStatus(p2Win, box, 'human-vs-ai');
    expect(box.querySelector('.status-mode')).toBeTruthy();
    expect(box.querySelector('.status-winner')).toBeTruthy();

    renderStatus(createInitialState(3), box, 'human-vs-ai', true);
    expect(box.querySelector('.status-ai-thinking')).toBeTruthy();
  });

  it('aiSeat player1 blocks placement chrome on that seat turn', () => {
    const app = document.createElement('div');
    app.id = 'app';
    document.body.appendChild(app);
    applyGameModeChrome(app, 'human-vs-ai', 'player1');

    const state = createInitialState(5);
    expect(state.currentPlayer).toBe('player1');
    const el = document.createElement('div');
    renderBoard(state, el, () => undefined);
    const empty = el.querySelector(
      '.hex-cell-group[data-row="0"][data-col="0"]'
    ) as SVGGElement | null;
    expect(empty?.style.cursor).not.toBe('pointer');
    expect(empty?.getAttribute('aria-label') ?? '').not.toMatch(
      /valid placement/
    );

    clearGameModeChrome(app);
  });
});

describe('q-mp-371 ui-cov-r25 hex controller residuals', () => {
  it('guards clicks while thinking / after winner / on computer seat', async () => {
    // No #app → chrome unset → board still wires clicks during AI seat,
    // which is how the controller's own guards become reachable.
    const getBest = vi
      .spyOn(hexAiClient, 'getBestMoveAsync')
      .mockResolvedValue(null);

    const {
      initGame,
      newGameVsAI,
      getGameState,
      destroyGame,
    } = await import('../../src/games/hex/game-controller');

    const board = mountRoot();
    const status = mountRoot();
    initGame(board, status);
    newGameVsAI('easy');

    clickCell(board, 0, 0);
    expect(getGameState().moveHistory.length).toBe(1);

    // While AI paint-delay pending, isAIThinking blocks further clicks.
    const mid = getGameState().moveHistory.length;
    clickCell(board, 1, 0);
    expect(getGameState().moveHistory.length).toBe(mid);

    // Flush timer; mocked null move → still player2, thinking cleared.
    await vi.advanceTimersByTimeAsync(500);
    await Promise.resolve();
    await Promise.resolve();
    expect(getBest).toHaveBeenCalled();
    expect(getGameState().currentPlayer).toBe('player2');
    expect(getGameState().winner).toBeNull();

    // Computer-seat guard: human-vs-ai + currentPlayer player2 → ignore.
    const beforeSeatGuard = getGameState().moveHistory.length;
    clickCell(board, 2, 0);
    expect(getGameState().moveHistory.length).toBe(beforeSeatGuard);

    // Winner guard: mutate live state without re-render, then click wired cell.
    getGameState().winner = 'player1';
    const beforeWinnerGuard = getGameState().moveHistory.length;
    clickCell(board, 3, 0);
    expect(getGameState().moveHistory.length).toBe(beforeWinnerGuard);

    destroyGame();
  });

  it('human vertical win notifies owl once; HvH reset keeps mode', async () => {
    const owlEnd = vi.spyOn(owlSystem, 'onGameEnd');
    const {
      initGame,
      newGameVsHuman,
      getGameState,
      resetGame,
      destroyGame,
    } = await import('../../src/games/hex/game-controller');

    const app = document.createElement('div');
    app.id = 'app';
    document.body.appendChild(app);
    const board = document.createElement('div');
    const status = document.createElement('div');
    app.appendChild(board);
    app.appendChild(status);

    initGame(board, status);
    newGameVsHuman();
    await playP1VerticalWin(board, getGameState);
    expect(owlEnd).toHaveBeenCalledWith(
      'hex',
      expect.objectContaining({ winner: 'player1' })
    );
    expect(status.querySelector('.status-winner')).toBeTruthy();

    // Second click after win is a no-op via missing placement wiring.
    const hist = getGameState().moveHistory.length;
    const anyCell = board.querySelector('.hex-cell-group');
    anyCell?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(getGameState().moveHistory.length).toBe(hist);

    resetGame();
    expect(getGameState().winner).toBeNull();
    expect(getGameState().moveHistory.length).toBe(0);
    destroyGame();
  });

  it('AI null-reject + generation bump mid-flight + AI win owl path', async () => {
    let resolveBest!: (pos: { row: number; col: number } | null) => void;
    const pending = new Promise<{ row: number; col: number } | null>((r) => {
      resolveBest = r;
    });
    const getBest = vi.spyOn(hexAiClient, 'getBestMoveAsync');

    const {
      initGame,
      newGameVsAI,
      newGameVsHuman,
      getGameState,
      destroyGame,
    } = await import('../../src/games/hex/game-controller');

    const app = document.createElement('div');
    app.id = 'app';
    document.body.appendChild(app);
    const board = document.createElement('div');
    const status = document.createElement('div');
    app.appendChild(board);
    app.appendChild(status);

    initGame(board, status);

    // Catch arm: worker reject → aiMove null, no throw.
    getBest.mockRejectedValueOnce(new Error('worker down'));
    newGameVsAI('easy');
    clickCell(board, 5, 5);
    await vi.advanceTimersByTimeAsync(500);
    await Promise.resolve();
    await Promise.resolve();
    expect(getGameState().winner).toBeNull();

    // Generation bump: hold getBest open, then newGameVsHuman before resolve.
    getBest.mockImplementationOnce(() => pending);
    newGameVsAI('easy');
    clickCell(board, 0, 0);
    await vi.advanceTimersByTimeAsync(500);
    await Promise.resolve();
    // Bump generation while in-flight.
    newGameVsHuman();
    resolveBest({ row: 0, col: 1 });
    await Promise.resolve();
    await Promise.resolve();
    // Stale reply dropped — HvH fresh game has a single empty history.
    expect(getGameState().moveHistory.length).toBe(0);

    // AI win owl path: seed near-win for P2, mock AI finishing move.
    const owlEnd = vi.spyOn(owlSystem, 'onGameEnd');
    getBest.mockResolvedValueOnce({ row: 5, col: 10 });
    newGameVsAI('easy');
    // Pre-fill P2 left→right threat on row 5 cols 0..9; human places elsewhere.
    const live = getGameState();
    for (let col = 0; col < 10; col++) {
      live.board[5]![col] = 'player2';
    }
    live.moveHistory.push({
      player: 'player2',
      position: { row: 5, col: 0 },
      moveNumber: 1,
    });
    clickCell(board, 0, 0); // human → triggers AI
    await vi.advanceTimersByTimeAsync(500);
    await Promise.resolve();
    await Promise.resolve();
    expect(getGameState().winner).toBe('player2');
    expect(owlEnd).toHaveBeenCalledWith(
      'hex',
      expect.objectContaining({ winner: 'player2' })
    );
    expect(status.querySelector('.status-winner')).toBeTruthy();

    destroyGame();
  });

  it('tutorial exited path unsubscribes without completed restart', async () => {
    const { initGame, startTutorial, isTutorialActive, destroyGame } =
      await import('../../src/games/hex/game-controller');
    const { tutorialManager } = await import('../../src/core/tutorial');

    const board = mountRoot();
    const status = mountRoot();
    initGame(board, status);
    startTutorial();
    expect(isTutorialActive()).toBe(true);
    tutorialManager.exit();
    expect(isTutorialActive()).toBe(false);
    destroyGame();
  });
});
