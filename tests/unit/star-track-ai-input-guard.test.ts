/**
 * Star Track — AI-seat input lock (UI/board only).
 * Human must not see selectable draw/chain chrome while Red thinks,
 * and taps during the think pause must not change state.
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { readAppCss } from './_app-css';
import { createInitialState } from '../../src/games/star-track/types';
import { drawChains } from '../../src/games/star-track/rules';
import {
  fillChainArea,
  renderBoard,
  renderStatus,
} from '../../src/games/star-track/board-ui';

describe('Star Track AI-turn input guard', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    document.body.innerHTML = '';
    vi.restoreAllMocks();
  });

  it('fillChainArea with allowInput false disables draw and announces lock', () => {
    const host = document.createElement('div');
    const onDraw = vi.fn();
    fillChainArea(host, createInitialState(), onDraw, undefined, undefined, {
      allowInput: false,
    });

    const btn = host.querySelector(
      '.star-track-draw-btn'
    ) as HTMLButtonElement;
    expect(btn.disabled).toBe(true);
    expect(btn.getAttribute('aria-disabled')).toBe('true');
    expect(btn.getAttribute('aria-label')).toMatch(/not available/i);
    expect(host.textContent).toMatch(/Computer is thinking/);
    btn.click();
    expect(onDraw).not.toHaveBeenCalled();
  });

  it('fillChainArea with allowInput false marks chains not selectable', () => {
    const host = document.createElement('div');
    const onSelect = vi.fn();
    const drawn = drawChains(createInitialState());
    fillChainArea(host, drawn, undefined, onSelect, undefined, {
      allowInput: false,
    });

    expect(host.textContent).toMatch(/Computer is choosing/);
    const buttons = [
      ...host.querySelectorAll('.star-track-chain-btn'),
    ] as HTMLButtonElement[];
    expect(buttons).toHaveLength(2);
    expect(buttons.every((b) => b.disabled)).toBe(true);
    expect(
      buttons.every((b) =>
        (b.getAttribute('aria-label') ?? '').includes('not selectable')
      )
    ).toBe(true);
    buttons.forEach((b) => b.click());
    expect(onSelect).not.toHaveBeenCalled();
  });

  it('omitted callbacks during AI seat still render locked chrome', () => {
    const container = document.createElement('div');
    renderBoard(createInitialState(), container);
    const btn = container.querySelector(
      '.star-track-draw-btn'
    ) as HTMLButtonElement;
    expect(btn).toBeTruthy();
    expect(btn.disabled).toBe(true);
    expect(btn.getAttribute('aria-disabled')).toBe('true');

    const drawn = drawChains(createInitialState());
    renderBoard(drawn, container);
    expect(container.querySelectorAll('.star-track-chain-btn')).toHaveLength(2);
    expect(
      [
        ...container.querySelectorAll('.star-track-chain-btn'),
      ].every((b) => (b as HTMLButtonElement).disabled)
    ).toBe(true);
  });

  it('renderStatus uses Computer thinking + status-ai-thinking', () => {
    const status = document.createElement('div');
    renderStatus(createInitialState(), status, 'human-vs-ai', true);
    expect(status.querySelector('.status-ai-thinking')).toBeTruthy();
    expect(status.textContent).toMatch(/Computer is thinking/);
  });

  it('style.css ships 44px targets and star-track reduced-motion overrides', () => {
    const css = readAppCss();
    expect(css).toMatch(
      /\.star-track-draw-btn\s*\{[^}]*min-height:\s*44px/s
    );
    expect(css).toMatch(
      /\.star-track-chain-btn\s*\{[^}]*min-height:\s*44px/s
    );
    expect(css).toMatch(
      /@media\s*\(\s*pointer:\s*coarse\s*\)\s*\{[^}]*\.star-track-draw-btn/s
    );
    expect(css).toMatch(
      /@media\s*\(\s*prefers-reduced-motion:\s*reduce\s*\)\s*\{[^}]*\.star-track-goal/s
    );
    expect(css).toMatch(
      /\.star-track-draw-btn:hover:not\(:disabled\)[\s\S]*transform:\s*none/
    );
  });

  it('blocks human chrome during AI think pause after Blue picks a chain', async () => {
    const {
      initGame,
      newGameVsAI,
      getGameState,
    } = await import('../../src/games/star-track/game-controller');

    const app = document.createElement('div');
    app.id = 'app';
    const board = document.createElement('div');
    const status = document.createElement('div');
    app.append(board, status);
    document.body.appendChild(app);

    initGame(board, status);
    newGameVsAI('easy');

    (board.querySelector('.star-track-draw-btn') as HTMLButtonElement).click();
    expect(getGameState().phase).toBe('selectChain');
    (
      board.querySelectorAll('.star-track-chain-btn')[0] as HTMLButtonElement
    ).click();

    expect(getGameState().currentPlayer).toBe('player2');
    expect(getGameState().phase).toBe('drawChains');
    expect(status.querySelector('.status-ai-thinking')).toBeTruthy();
    expect(status.textContent).toMatch(/Computer is thinking/);

    const lockedDraw = board.querySelector(
      '.star-track-draw-btn'
    ) as HTMLButtonElement;
    expect(lockedDraw.disabled).toBe(true);
    expect(lockedDraw.getAttribute('aria-disabled')).toBe('true');
    const posBefore = getGameState().player2Position;
    lockedDraw.click();
    expect(getGameState().phase).toBe('drawChains');
    expect(getGameState().currentPlayer).toBe('player2');
    expect(getGameState().player2Position).toBe(posBefore);

    await vi.advanceTimersByTimeAsync(600);
    expect(getGameState().phase).toBe('selectChain');
    const lockedChains = [
      ...board.querySelectorAll('.star-track-chain-btn'),
    ] as HTMLButtonElement[];
    expect(lockedChains.length).toBe(2);
    expect(lockedChains.every((b) => b.disabled)).toBe(true);
    expect(
      lockedChains.every((b) =>
        (b.getAttribute('aria-label') ?? '').includes('not selectable')
      )
    ).toBe(true);
    lockedChains.forEach((b) => b.click());
    expect(getGameState().phase).toBe('selectChain');
    expect(getGameState().currentPlayer).toBe('player2');

    await vi.advanceTimersByTimeAsync(600);
    expect(getGameState().currentPlayer).toBe('player1');
    expect(getGameState().phase).toBe('drawChains');
    expect(
      (board.querySelector('.star-track-draw-btn') as HTMLButtonElement).disabled
    ).toBe(false);
    expect(status.querySelector('.status-ai-thinking')).toBeFalsy();
  });
});
