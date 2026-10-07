/**
 * Queens & Guards — tablet playability keepers:
 * 44px touch budget (CSS pin), AI-seat aria honesty, reduced-motion, status copy.
 */
import { describe, it, expect, afterEach, vi } from 'vitest';
import {
  cellKey,
  createInitialState,
  parseKey,
} from '../../src/games/queens-guards/types';
import { getValidMoves, selectPiece } from '../../src/games/queens-guards/rules';
import {
  injectQGStyles,
  renderBoard,
} from '../../src/games/queens-guards/board-ui';
import {
  initGame,
  newGameVsAI,
  destroyGame,
  getGameState,
} from '../../src/games/queens-guards/game-controller';
import * as aiClient from '../../src/games/queens-guards/ai-client';
import * as ai from '../../src/games/queens-guards/ai';

afterEach(() => {
  destroyGame();
  document.body.innerHTML = '';
  document.getElementById('qg-styles')?.remove();
  vi.useRealTimers();
  vi.restoreAllMocks();
});

describe('Queens & Guards touch + aria playability', () => {
  it('injectQGStyles pins board ≥660px for ~44px hex tap targets', () => {
    injectQGStyles();
    const css = document.getElementById('qg-styles')?.textContent ?? '';
    expect(css).toMatch(/min-width:\s*660px/);
    expect(css).toMatch(/\.qg-game-area[\s\S]*overflow-x:\s*auto/);
    expect(css).toContain('prefers-reduced-motion');
    expect(css).toMatch(/\.qg-winner-banner[\s\S]*animation:\s*none/);
  });

  it('renderBoard marks SVG with qg-board and intrinsic pixel size', () => {
    const svg = renderBoard(createInitialState(), () => undefined);
    expect(svg.getAttribute('class')).toBe('qg-board');
    const w = Number(svg.getAttribute('width'));
    const h = Number(svg.getAttribute('height'));
    expect(w).toBeGreaterThan(600);
    expect(h).toBe(w);
    expect(svg.getAttribute('preserveAspectRatio')).toContain('meet');
  });

  it('human turn announces valid destinations without aria-disabled', () => {
    let state = createInitialState();
    state = selectPiece(state, { ring: 5, position: 1 });
    const moves = getValidMoves(state, { ring: 5, position: 1 });
    expect(moves.length).toBeGreaterThan(0);
    const svg = renderBoard(state, () => undefined);
    const piece = svg.querySelector('g[data-cell-key="5-1"]');
    expect(piece?.getAttribute('aria-disabled')).toBeNull();
    expect(piece?.getAttribute('aria-label')).toMatch(/selected/);
    const dest = moves[0]!;
    const destEl = svg.querySelector(
      `g[data-cell-key="${cellKey(dest.ring, dest.position)}"]`
    );
    expect(destEl?.getAttribute('aria-label')).toMatch(/valid move/);
  });

  it('AI-seat render (no handler) sets aria-disabled and omits valid moves', () => {
    const state = {
      ...createInitialState(),
      currentPlayer: 'player2' as const,
      selectedPiece: cellKey(5, 0),
    };
    const svg = renderBoard(state, undefined);
    const cells = [...svg.querySelectorAll('g[data-cell-key]')];
    expect(cells.length).toBeGreaterThan(10);
    for (const cell of cells) {
      expect(cell.getAttribute('aria-disabled')).toBe('true');
      const label = cell.getAttribute('aria-label') ?? '';
      expect(label).toMatch(/not available/);
      expect(label).not.toMatch(/valid move/);
    }
    expect((cells[0] as SVGGElement).style.cursor).toBe('default');
  });

  it('status uses tap-friendly restore copy and thinking lock', async () => {
    vi.useFakeTimers();
    injectQGStyles();
    const board = document.createElement('div');
    board.className = 'qg-board-container';
    const status = document.createElement('div');
    document.body.append(board, status);
    initGame(board, status);
    newGameVsAI('easy');

    // Opening instruction
    expect(status.textContent).toMatch(/Select a piece to move/i);

    vi.spyOn(aiClient, 'getAIMoveAsync').mockImplementation(
      () => new Promise(() => undefined)
    );

    // Play one Blue move so AI seat + thinking chrome paints.
    const live = getGameState();
    for (const [key, cell] of live.cells) {
      if (cell.piece?.player !== 'player1') continue;
      const from = parseKey(key);
      const moves = getValidMoves(live, from);
      if (!moves[0]) continue;
      board
        .querySelector(`g[data-cell-key="${key}"]`)!
        .dispatchEvent(new MouseEvent('click', { bubbles: true }));
      const to = moves[0];
      board
        .querySelector(
          `g[data-cell-key="${cellKey(to.ring, to.position)}"]`
        )!
        .dispatchEvent(new MouseEvent('click', { bubbles: true }));
      break;
    }

    // Immediately after the human ply (before paint-delay timer fires) the
    // computer seat must already show thinking chrome — never "Select a piece".
    expect(status.textContent).toMatch(/Computer is thinking/i);
    expect(status.textContent).not.toMatch(/Select a piece/i);
    expect(status.querySelector('.status-ai-thinking')).toBeTruthy();

    await vi.advanceTimersByTimeAsync(300);
    expect(status.textContent).toMatch(/Computer is thinking/i);
    // Board locked: no click handlers while thinking.
    const locked = renderBoard(getGameState(), undefined);
    expect(
      locked.querySelector('g[data-cell-key]')?.getAttribute('aria-disabled')
    ).toBe('true');
  });

  it('AI paint delay stays under 400ms (tablet snappiness)', async () => {
    vi.useFakeTimers();
    injectQGStyles();
    const board = document.createElement('div');
    const status = document.createElement('div');
    document.body.append(board, status);
    initGame(board, status);
    newGameVsAI('medium');

    const syncMove: ai.AIMove = {
      from: { ring: 5, position: 0 },
      to: { ring: 4, position: 0 },
    };
    const asyncSpy = vi
      .spyOn(aiClient, 'getAIMoveAsync')
      .mockResolvedValue(syncMove);
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

    const live = getGameState();
    for (const [key, cell] of live.cells) {
      if (cell.piece?.player !== 'player1') continue;
      const from = parseKey(key);
      const moves = getValidMoves(live, from);
      if (!moves[0]) continue;
      board
        .querySelector(`g[data-cell-key="${key}"]`)!
        .dispatchEvent(new MouseEvent('click', { bubbles: true }));
      board
        .querySelector(
          `g[data-cell-key="${cellKey(moves[0].ring, moves[0].position)}"]`
        )!
        .dispatchEvent(new MouseEvent('click', { bubbles: true }));
      break;
    }

    expect(asyncSpy).not.toHaveBeenCalled();
    await vi.advanceTimersByTimeAsync(200);
    expect(asyncSpy).not.toHaveBeenCalled();
    await vi.advanceTimersByTimeAsync(100);
    await Promise.resolve();
    await Promise.resolve();
    expect(asyncSpy).toHaveBeenCalled();
  });
});
