/**
 * Hex deep playability regressions (2026-10-07):
 * AI paint delay, null-move soft-lock recovery, HvA copy, computer-seat chrome.
 */
import { describe, it, expect, afterEach, vi } from 'vitest';
import { createInitialState } from '../../src/games/hex/types';
import { renderStatus } from '../../src/games/hex/board-ui';
import {
  initGame,
  newGameVsAI,
  getGameState,
} from '../../src/games/hex/game-controller';
import * as aiClient from '../../src/games/hex/ai-client';
import * as ai from '../../src/games/hex/ai';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const controllerSrc = readFileSync(
  join(process.cwd(), 'src/games/hex/game-controller.ts'),
  'utf8'
);

afterEach(() => {
  document.body.innerHTML = '';
  document.documentElement.removeAttribute('data-opponent');
  document.documentElement.removeAttribute('data-ai-seat');
  const app = document.getElementById('app');
  app?.removeAttribute('data-opponent');
  app?.removeAttribute('data-ai-seat');
  vi.useRealTimers();
  vi.restoreAllMocks();
});

function mountPair(): { board: HTMLElement; status: HTMLElement } {
  const app = document.createElement('div');
  app.id = 'app';
  const board = document.createElement('div');
  const status = document.createElement('div');
  app.append(board, status);
  document.body.appendChild(app);
  return { board, status };
}

function clickEmpty(board: HTMLElement, row = 5, col = 5): void {
  const cell = board.querySelector(
    `.hex-cell-group[data-row="${row}"][data-col="${col}"]`
  ) as SVGGElement | null;
  expect(cell).toBeTruthy();
  cell!.dispatchEvent(new MouseEvent('click', { bubbles: true }));
}

describe('Hex deep playability', () => {
  it('AI_THINKING_DELAY is 250ms (paint only; search budgets unchanged)', () => {
    expect(controllerSrc).toMatch(/AI_THINKING_DELAY\s*=\s*250/);
    expect(ai.AI_PLAY_DEADLINE_MS.easy).toBe(600);
    expect(ai.AI_PLAY_DEADLINE_MS.medium).toBe(1200);
    // Tip #472/#476 tablet time-box: Hard search budget is 450ms (not 2500).
    expect(ai.AI_PLAY_DEADLINE_MS.hard).toBe(450);
  });

  it('HvA status uses tap copy and You win! / Computer is thinking…', () => {
    const status = document.createElement('div');
    renderStatus(createInitialState(), status, 'human-vs-ai', false);
    expect(status.textContent).toMatch(/Your turn — Tap an empty hex/);
    expect(status.textContent).not.toMatch(/Click to place/);

    renderStatus(createInitialState(), status, 'human-vs-ai', true);
    expect(status.querySelector('.status-ai-thinking')?.textContent).toBe(
      'Computer is thinking…'
    );

    const won = { ...createInitialState(), winner: 'player1' as const };
    renderStatus(won, status, 'human-vs-ai', false);
    expect(status.textContent).toMatch(/You win!/);
    expect(status.textContent).not.toMatch(/You Wins!/);
    expect(status.textContent).not.toMatch(/You Win!/);
  });

  it('HvA computer seat shows thinking chrome even when isAIThinking is false', () => {
    const app = document.createElement('div');
    app.id = 'app';
    app.dataset.opponent = 'ai';
    app.dataset.aiSeat = 'player2';
    document.body.appendChild(app);

    const status = document.createElement('div');
    const state = {
      ...createInitialState(),
      currentPlayer: 'player2' as const,
    };
    renderStatus(state, status, 'human-vs-ai', false);
    expect(status.querySelector('.status-ai-thinking')?.textContent).toBe(
      'Computer is thinking…'
    );
    expect(status.textContent).not.toMatch(/AI's turn/);
    expect(status.textContent).not.toMatch(/Click/);
  });

  it('null worker reply falls back to a random legal move (no AI-seat soft-lock)', async () => {
    vi.useFakeTimers();
    vi.spyOn(aiClient, 'getBestMoveAsync').mockResolvedValue(null);
    const randomSpy = vi.spyOn(ai, 'getRandomMove');

    const { board, status } = mountPair();
    initGame(board, status);
    newGameVsAI('easy');
    clickEmpty(board, 5, 5);

    expect(getGameState().currentPlayer).toBe('player2');
    expect(status.querySelector('.status-ai-thinking')).toBeTruthy();

    await vi.advanceTimersByTimeAsync(250);
    await vi.runAllTimersAsync();
    // Flush microtasks from the async AI path
    await Promise.resolve();
    await Promise.resolve();

    expect(randomSpy).toHaveBeenCalled();
    expect(getGameState().currentPlayer).toBe('player1');
    expect(getGameState().moveHistory.length).toBe(2);
    expect(status.querySelector('.status-ai-thinking')).toBeFalsy();
  });

  it('ai-client watchdog is play-budget + 1500ms and falls back to sync search', () => {
    const clientSrc = readFileSync(
      join(process.cwd(), 'src/games/hex/ai-client.ts'),
      'utf8'
    );
    expect(clientSrc).toMatch(/watchdogMs\s*=\s*deadlineMs\s*\+\s*1500/);
    expect(clientSrc).toMatch(/Promise\.race/);
    expect(clientSrc).toMatch(/disposeHexAiWorker/);
  });
});
