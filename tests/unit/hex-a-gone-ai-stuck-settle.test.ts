/**
 * Hex-a-Gone — AI-seat soft-lock recovery after AI/speed landings.
 * Empty selection / no placement must pass or end so the human seat returns.
 */
import { describe, it, expect, afterEach, vi } from 'vitest';
import * as ai from '../../src/games/hex-a-gone/ai';
import {
  initGame,
  newGameVsAI,
  getGameState,
  destroyGame,
} from '../../src/games/hex-a-gone/game-controller';

afterEach(() => {
  destroyGame();
  document.body.innerHTML = '';
  vi.useRealTimers();
  vi.restoreAllMocks();
});

function mountPair(): { board: HTMLElement; status: HTMLElement } {
  const board = document.createElement('div');
  const status = document.createElement('div');
  document.body.append(board, status);
  return { board, status };
}

function playOneHumanTriangle(board: HTMLElement): void {
  (
    board.querySelector(
      '.hex-a-gone-block-btn[data-shape="triangle"]'
    ) as HTMLButtonElement
  ).click();
  (
    board.querySelector('.hex-a-gone-confirm-btn') as HTMLButtonElement
  ).click();
  const valid = board.querySelector(
    '.hex-a-gone-cell-valid'
  ) as SVGElement | null;
  expect(valid).toBeTruthy();
  valid!.dispatchEvent(new MouseEvent('click', { bubbles: true }));
}

describe('Hex-a-Gone AI stuck settle', () => {
  it('null AI selection on full board ends the game (no soft-lock on Red)', () => {
    vi.useFakeTimers();
    const { board, status } = mountPair();
    initGame(board, status);
    newGameVsAI('easy');

    vi.spyOn(ai, 'getAISelection').mockReturnValue(null);
    playOneHumanTriangle(board);
    expect(getGameState().currentPlayer).toBe('player2');

    // Before AI timer: fill board so selection is impossible → pass settles over
    for (const cell of getGameState().board) {
      cell.filled = true;
      cell.filledBy = cell.filledBy ?? 'player1';
    }

    vi.advanceTimersByTime(1000);

    expect(ai.getAISelection).toHaveBeenCalled();
    const ended = getGameState();
    expect(ended.phase).toBe('gameOver');
    expect(ended.winner).toBeTruthy();
    expect(status.querySelector('.status-ai-thinking')).toBeFalsy();
  });

  it('null AI placement with remaining valids uses first valid (no soft-lock)', () => {
    vi.useFakeTimers();
    const { board, status } = mountPair();
    initGame(board, status);
    newGameVsAI('easy');

    vi.spyOn(ai, 'getAISelection').mockReturnValue({ blocks: ['triangle'] });
    vi.spyOn(ai, 'getAIPlacement').mockReturnValue(null);

    playOneHumanTriangle(board);
    expect(getGameState().currentPlayer).toBe('player2');

    // Selection delay + placement delay(s)
    vi.advanceTimersByTime(2500);

    expect(status.querySelector('.status-ai-thinking')).toBeFalsy();
    expect(getGameState().currentPlayer).toBe('player1');
  });
});
