/**
 * Hex-a-Gone deep playability regressions (2026-10-07):
 * AI think budget, Easy/Hard selection caps, HvA copy, AI-seat bank lock.
 */
import { describe, it, expect, afterEach, vi } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { createInitialState } from '../../src/games/hex-a-gone/types';
import { getAISelection } from '../../src/games/hex-a-gone/ai';
import { renderBoard, renderStatus } from '../../src/games/hex-a-gone/board-ui';
import {
  initGame,
  newGameVsAI,
  getGameState,
  destroyGame,
} from '../../src/games/hex-a-gone/game-controller';
import * as ai from '../../src/games/hex-a-gone/ai';

const styleCss = readFileSync(join(process.cwd(), 'src/style.css'), 'utf8');

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

describe('Hex-a-Gone deep playability', () => {
  it('AI_THINKING_DELAY keeps a 3-block AI turn under the 3s tablet budget', () => {
    vi.useFakeTimers();
    vi.spyOn(ai, 'getAISelection').mockReturnValue({
      blocks: ['triangle', 'square', 'rhombus'],
    });
    vi.spyOn(ai, 'getAIPlacement').mockImplementation((state) => {
      const cell = state.board.find((c) => !c.filled);
      return cell ? { q: cell.q, r: cell.r } : null;
    });

    const { board, status } = mountPair();
    initGame(board, status);
    newGameVsAI('hard');
    playOneHumanTriangle(board);
    expect(getGameState().currentPlayer).toBe('player2');
    expect(status.querySelector('.status-ai-thinking')).toBeTruthy();

    // delay × (select kickoff + 3 places) = 350 × 4 = 1400ms
    vi.advanceTimersByTime(1400);
    expect(status.querySelector('.status-ai-thinking')).toBeFalsy();
    expect(getGameState().currentPlayer).toBe('player1');
  });

  it('Easy selections are capped at 1 block; Hard may select up to 3', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    const easy = getAISelection(createInitialState(), 'player1', 'easy');
    expect(easy).not.toBeNull();
    expect(easy!.blocks.length).toBe(1);

    const hard = getAISelection(createInitialState(), 'player1', 'hard');
    expect(hard).not.toBeNull();
    expect(hard!.blocks.length).toBeGreaterThanOrEqual(1);
    expect(hard!.blocks.length).toBeLessThanOrEqual(3);
  });

  it('HvA human win copy is “You win!” (not “You Wins!”)', () => {
    const status = document.createElement('div');
    const state = {
      ...createInitialState(),
      phase: 'gameOver' as const,
      winner: 'player1' as const,
    };
    renderStatus(state, status, 'human-vs-ai', false);
    expect(status.textContent).toMatch(/You win!/);
    expect(status.textContent).not.toMatch(/You Wins!/);
  });

  it('HvA phase copy uses Your turn / AI instead of Blue/Red', () => {
    const status = document.createElement('div');
    renderStatus(createInitialState(), status, 'human-vs-ai', false);
    expect(status.textContent).toMatch(/Your turn/);
    expect(status.textContent).not.toMatch(/Blue's turn/);
    expect(status.textContent).not.toMatch(/You's turn/);
  });

  it('AI-seat bank buttons are disabled while Computer is thinking', () => {
    vi.useFakeTimers();
    vi.spyOn(ai, 'getAISelection').mockReturnValue({ blocks: ['triangle'] });
    vi.spyOn(ai, 'getAIPlacement').mockImplementation((state) => {
      const cell = state.board.find((c) => !c.filled);
      return cell ? { q: cell.q, r: cell.r } : null;
    });

    const { board, status } = mountPair();
    initGame(board, status);
    newGameVsAI('easy');
    playOneHumanTriangle(board);

    expect(status.textContent).toMatch(/Computer is thinking/);
    const buttons = [
      ...board.querySelectorAll('.hex-a-gone-block-btn'),
    ] as HTMLButtonElement[];
    expect(buttons.length).toBeGreaterThan(0);
    expect(buttons.every((b) => b.disabled || b.getAttribute('aria-disabled') === 'true')).toBe(
      true
    );
  });

  it('board SVG viewBox pads HEX_SIZE=32 and CSS declares ≥380px board + coarse 420px', () => {
    const el = document.createElement('div');
    renderBoard(createInitialState(), el);
    const svg = el.querySelector('.hex-a-gone-board');
    expect(svg?.getAttribute('viewBox')).toBe('-195 -205 390 410');
    expect(styleCss).toContain('width: min(380px, 100%)');
    expect(styleCss).toContain('width: min(420px, 96vw)');
  });
});
