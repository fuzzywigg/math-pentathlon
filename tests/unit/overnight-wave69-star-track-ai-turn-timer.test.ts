/**
 * Wave 69 leftover after tip/#350 — Star Track VsAI double 600ms AI delays.
 * Remainder wave 68 covered its timer; Star Track AI path had no fake timers.
 * Exercises controller AI orchestration without changing rules or scoring.
 */
import { describe, it, expect, afterEach, vi } from 'vitest';
import {
  initGame,
  newGameVsAI,
  getGameState,
} from '../../src/games/star-track/game-controller';

import { click } from '../helpers/dom-click';

afterEach(() => {
  vi.useRealTimers();
  vi.restoreAllMocks();
  document.body.innerHTML = '';
});

describe('Wave 69 star-track — AI turn timer', () => {
  it('after P1 chain pick, fake timers advance P2 through draw and select', () => {
    vi.useFakeTimers();

    const app = document.createElement('div');
    app.id = 'app';
    document.body.appendChild(app);
    const board = document.createElement('div');
    const status = document.createElement('div');
    app.appendChild(board);
    app.appendChild(status);

    initGame(board, status);
    newGameVsAI('easy');

    click(board.querySelector('.star-track-draw-btn'));
    expect(getGameState().phase).toBe('selectChain');
    expect(getGameState().drawnChains.length).toBe(2);

    click(board.querySelectorAll('.star-track-chain-btn')[0] ?? null);
    expect(getGameState().currentPlayer).toBe('player2');
    expect(getGameState().phase).toBe('drawChains');
    expect(status.querySelector('.status-ai-thinking')).toBeTruthy();

    vi.advanceTimersByTime(600);
    expect(getGameState().phase).toBe('selectChain');
    expect(getGameState().currentPlayer).toBe('player2');
    expect(getGameState().drawnChains.length).toBe(2);

    vi.advanceTimersByTime(600);
    expect(getGameState().currentPlayer).toBe('player1');
    expect(getGameState().phase).toBe('drawChains');
    expect(board.querySelector('.star-track-draw-btn')).toBeTruthy();
    expect(status.querySelector('.status-ai-thinking')).toBeFalsy();
    expect(app.dataset.opponent).toBe('ai');
  });
});
