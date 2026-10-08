/**
 * Salvaged from #429 (compliant slice only).
 * Pins tip bank-button disabled/aria during AI seat + Confirm type=button.
 * Does NOT assert AI selection lookahead caps, HEX_SIZE retune, or HvA copy changes.
 */
import { describe, it, expect, afterEach, vi } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import {
  initGame,
  newGameVsAI,
  getGameState,
  destroyGame,
} from '../../src/games/hex-a-gone/game-controller';
import { createInitialState } from '../../src/games/hex-a-gone/types';
import { buildSelectionArea } from '../../src/games/hex-a-gone/board-ui';

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

describe('Hex-a-Gone salvage — bank a11y (#429 compliant)', () => {
  it('AI-seat bank buttons are disabled while interactive=false', () => {
    const state = createInitialState();
    const area = buildSelectionArea(state, undefined, undefined, {
      interactive: false,
    });
    const buttons = [
      ...area.querySelectorAll('.hex-a-gone-block-btn'),
    ] as HTMLButtonElement[];
    expect(buttons.length).toBeGreaterThan(0);
    expect(
      buttons.every(
        (b) => b.disabled || b.getAttribute('aria-disabled') === 'true'
      )
    ).toBe(true);
    expect(buttons.every((b) => b.type === 'button')).toBe(true);
  });

  it('Confirm is type=button and omitted when interactive=false', () => {
    const base = createInitialState();
    const state = {
      ...base,
      phase: 'selectBlocks' as const,
      turnSelection: {
        blocks: ['triangle' as const],
        committed: false,
      },
    };
    const withConfirm = buildSelectionArea(
      state,
      () => undefined,
      () => undefined,
      { interactive: true }
    );
    const btn = withConfirm.querySelector(
      '.hex-a-gone-confirm-btn'
    ) as HTMLButtonElement | null;
    expect(btn).toBeTruthy();
    expect(btn!.type).toBe('button');

    const noConfirm = buildSelectionArea(
      state,
      () => undefined,
      () => undefined,
      { interactive: false }
    );
    expect(noConfirm.querySelector('.hex-a-gone-confirm-btn')).toBeNull();
  });

  it('controller AI path disables bank while computer is thinking', () => {
    vi.useFakeTimers();
    const { board, status } = mountPair();
    initGame(board, status);
    newGameVsAI('easy');

    (
      board.querySelector(
        '.hex-a-gone-block-btn[data-shape="triangle"]:not(:disabled)'
      ) as HTMLButtonElement
    ).click();
    (
      board.querySelector('.hex-a-gone-confirm-btn') as HTMLButtonElement
    ).click();
    const valid = board.querySelector('.hex-a-gone-cell-valid') as SVGElement;
    expect(valid).toBeTruthy();
    valid.dispatchEvent(new MouseEvent('click', { bubbles: true }));

    expect(getGameState().currentPlayer).toBe('player2');
    expect(status.querySelector('.status-ai-thinking')).toBeTruthy();

    const buttons = [
      ...board.querySelectorAll('.hex-a-gone-block-btn'),
    ] as HTMLButtonElement[];
    expect(buttons.length).toBeGreaterThan(0);
    expect(
      buttons.every(
        (b) => b.disabled || b.getAttribute('aria-disabled') === 'true'
      )
    ).toBe(true);
  });

  it('tip keeps HEX_SIZE=30 and does not apply #429 Easy selection lookahead', () => {
    const boardSrc = readFileSync(
      join(import.meta.dirname, '../../src/games/hex-a-gone/board-ui.ts'),
      'utf8'
    );
    const aiSrc = readFileSync(
      join(import.meta.dirname, '../../src/games/hex-a-gone/ai.ts'),
      'utf8'
    );
    expect(boardSrc).toMatch(/const HEX_SIZE = 30/);
    // Tip still caps at 3 for all difficulties — not Easy=1…Hard=3 lookahead.
    expect(aiSrc).toContain(
      'const maxBlocks = Math.min(3, emptyCells, availableShapes.length)'
    );
    expect(aiSrc).not.toMatch(/config\.maxSelectionLookahead/);
  });

  it('game-play.css declares disabled bank cursor + coarse sticky confirm', () => {
    const css = readFileSync(
      join(import.meta.dirname, '../../src/ui/styles/game-play.css'),
      'utf8'
    );
    expect(css).toMatch(
      /\.hex-a-gone-block-btn:disabled[\s\S]*pointer-events:\s*none/
    );
    expect(css).toMatch(
      /@media \(pointer:\s*coarse\)[\s\S]*\.hex-a-gone-selection-status[\s\S]*position:\s*sticky/
    );
  });
});
