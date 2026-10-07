/**
 * Queens & Guards — AI worker null + stalemate settle + input lock.
 * Mirrors FIAR sync-fallback polish so Red cannot soft-lock the board.
 */
import { describe, it, expect, afterEach, vi } from 'vitest';
import {
  cellKey,
  createInitialState,
  parseKey,
} from '../../src/games/queens-guards/types';
import { getValidMoves } from '../../src/games/queens-guards/rules';
import * as aiClient from '../../src/games/queens-guards/ai-client';
import * as ai from '../../src/games/queens-guards/ai';
import {
  initGame,
  newGameVsAI,
  getGameState,
  destroyGame,
} from '../../src/games/queens-guards/game-controller';
import {
  injectQGStyles,
  renderBoard,
} from '../../src/games/queens-guards/board-ui';

afterEach(() => {
  destroyGame();
  document.body.innerHTML = '';
  document.getElementById('qg-styles')?.remove();
  vi.useRealTimers();
  vi.restoreAllMocks();
});

function mountPair(): { board: HTMLElement; status: HTMLElement } {
  const board = document.createElement('div');
  board.className = 'qg-board-container';
  const status = document.createElement('div');
  document.body.append(board, status);
  return { board, status };
}

/** Find a legal Blue move and play it through the DOM so AI is scheduled. */
function playOneHumanMove(board: HTMLElement): void {
  const live = getGameState();
  expect(live.currentPlayer).toBe('player1');

  for (const [key, cell] of live.cells) {
    if (cell.piece?.player !== 'player1') continue;
    const from = parseKey(key);
    const moves = getValidMoves(live, from);
    if (!moves[0]) continue;

    const fromEl = board.querySelector(`g[data-cell-key="${key}"]`);
    expect(fromEl).toBeTruthy();
    fromEl!.dispatchEvent(new MouseEvent('click', { bubbles: true }));

    const to = moves[0];
    const toEl = board.querySelector(
      `g[data-cell-key="${cellKey(to.ring, to.position)}"]`
    );
    expect(toEl).toBeTruthy();
    toEl!.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    return;
  }
  throw new Error('No legal human opening move found');
}

describe('Queens & Guards AI soft-lock recovery', () => {
  it('falls back to sync getAIMove when the worker returns null', async () => {
    vi.useFakeTimers();
    injectQGStyles();
    const { board, status } = mountPair();
    initGame(board, status);
    newGameVsAI('easy');

    const syncMove: ai.AIMove = {
      from: { ring: 5, position: 0 },
      to: { ring: 4, position: 0 },
    };
    vi.spyOn(aiClient, 'getAIMoveAsync').mockResolvedValue(null);
    const sync = vi.spyOn(ai, 'getAIMove').mockReturnValue(syncMove);
    vi.spyOn(ai, 'applyAIMove').mockImplementation((state) => ({
      ...state,
      currentPlayer: 'player1',
      selectedPiece: null,
      moveHistory: [
        ...state.moveHistory,
        {
          player: 'player2',
          from: syncMove.from,
          to: syncMove.to,
          captured: null,
        },
      ],
    }));

    playOneHumanMove(board);
    expect(getGameState().currentPlayer).toBe('player2');

    await vi.advanceTimersByTimeAsync(600);
    await Promise.resolve();
    await Promise.resolve();

    expect(aiClient.getAIMoveAsync).toHaveBeenCalled();
    expect(sync).toHaveBeenCalled();
    expect(getGameState().currentPlayer).toBe('player1');
    expect(status.querySelector('.status-ai-thinking')).toBeFalsy();
  });

  it('settles stalemate into state.winner when AI has no moves', async () => {
    vi.useFakeTimers();
    injectQGStyles();
    const { board, status } = mountPair();
    initGame(board, status);
    newGameVsAI('easy');

    vi.spyOn(aiClient, 'getAIMoveAsync').mockResolvedValue(null);
    vi.spyOn(ai, 'getAIMove').mockReturnValue(null);

    playOneHumanMove(board);
    expect(getGameState().currentPlayer).toBe('player2');

    // Strip Red pieces before the AI timer fires → stalemate settle.
    const s = getGameState();
    for (const [key, cell] of s.cells) {
      if (cell.piece?.player === 'player2') {
        s.cells.set(key, { ...cell, piece: null });
      }
    }

    await vi.advanceTimersByTimeAsync(600);
    await Promise.resolve();
    await Promise.resolve();

    expect(getGameState().winner).toBe('player1');
    expect(status.querySelector('.qg-winner-banner')?.textContent).toMatch(
      /cannot move/i
    );
    expect(status.querySelector('.status-ai-thinking')).toBeFalsy();
  });

  it('renderBoard without handler suppresses clicks and valid targets', () => {
    const state = {
      ...createInitialState(),
      selectedPiece: cellKey(5, 1),
    };
    const svg = renderBoard(state, undefined);
    const first = svg.querySelector('g[data-cell-key]') as SVGGElement | null;
    expect(first).toBeTruthy();
    expect(first!.style.cursor).toBe('default');
    first!.dispatchEvent(new MouseEvent('click', { bubbles: true }));
  });

  it('injectQGStyles includes reduced-motion kill for qg-glow', () => {
    injectQGStyles();
    const css = document.getElementById('qg-styles')?.textContent ?? '';
    expect(css).toContain('prefers-reduced-motion');
    expect(css).toContain('.qg-winner-banner');
    expect(css).toMatch(/animation:\s*none/);
  });
});
