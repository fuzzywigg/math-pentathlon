/**
 * Contig 60 — AI-seat input lock after official end-rules (#380).
 * Human must not see Pass / expression chrome or valid-cell targets while Red thinks.
 */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, it, expect, afterEach, vi } from 'vitest';
import { readAppCss } from './_app-css';
import { createInitialState } from '../../src/games/contig-60/types';
import * as types from '../../src/games/contig-60/types';
import {
  initGame,
  newGameVsAI,
} from '../../src/games/contig-60/game-controller';
import { injectContigStyles } from '../../src/games/contig-60/board-ui';

afterEach(() => {
  document.body.innerHTML = '';
  document.getElementById('contig-styles')?.remove();
  vi.restoreAllMocks();
});

describe('Contig 60 AI seat input lock', () => {
  it('hides expression/pass chrome and valid targets on the AI calculating seat', () => {
    const base = createInitialState();
    vi.spyOn(types, 'createInitialState').mockReturnValue({
      ...base,
      currentPlayer: 'player2',
      phase: 'calculating',
      currentDice: [2, 3, 4],
    });

    const board = document.createElement('div');
    const status = document.createElement('div');
    document.body.append(board, status);
    initGame(board, status);
    newGameVsAI('easy');

    expect(board.querySelector('.contig-expr-option')).toBeNull();
    expect(board.querySelector('.contig-pass-btn')).toBeNull();
    expect(board.querySelector('.contig-cell-valid')).toBeNull();
    expect(status.textContent).toMatch(/Computer is thinking/);
    expect(status.querySelector('.status-ai-thinking')).toBeTruthy();
  });

  it('still shows Pass Turn for the human seat when dice have no placements', () => {
    const base = createInitialState();
    // Own every cell so getValidPlacements is empty.
    const cells = new Map(base.cells);
    for (const [value, cell] of cells) {
      cells.set(value, { ...cell, owner: 'player1' });
    }
    vi.spyOn(types, 'createInitialState').mockReturnValue({
      ...base,
      cells,
      currentPlayer: 'player1',
      phase: 'calculating',
      currentDice: [1, 1, 1],
    });

    const board = document.createElement('div');
    const status = document.createElement('div');
    document.body.append(board, status);
    initGame(board, status);

    expect(board.querySelector('.contig-pass-btn')?.textContent).toBe(
      'Pass Turn'
    );
    expect(status.textContent).toMatch(/No valid moves/);
  });

  it('ships 44px min touch targets for roll/pass and coarse-pointer cells', () => {
    injectContigStyles();
    const injected =
      document.getElementById('contig-styles')?.textContent ?? '';
    expect(injected).toMatch(/pointer:\s*coarse/);
    expect(injected).toMatch(/min-height:\s*44px/);
    expect(injected).toMatch(/\.contig-expr-option[\s\S]*min-height:\s*44px/);

    const css = readAppCss();
    expect(css).toMatch(/\.contig-roll-btn\s*\{[\s\S]*?min-height:\s*44px/);
    expect(css).toMatch(/\.contig-pass-btn\s*\{[\s\S]*?min-height:\s*44px/);
  });
});
