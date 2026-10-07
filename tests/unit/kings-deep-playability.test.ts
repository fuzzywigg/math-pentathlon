/**
 * Kings deep-playtest regressions (2026-10-07):
 * - vs-AI You/AI status copy (not Player 1/2)
 * - winner/supply labels honor aiSeat
 * - board injects coarse 44px sizing styles
 * - Medium AI never skips a forced win via top-N randomness
 */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, it, expect, vi, afterEach, beforeEach } from 'vitest';
import {
  createInitialGameState,
  selectKing,
  moveKing,
} from '../../src/games/kings-quadraphages/game-state';
import {
  renderBoard,
  renderStatus,
} from '../../src/games/kings-quadraphages/board-ui';
import { getAIMove } from '../../src/games/kings-quadraphages/ai';
import {
  applyGameModeChrome,
  clearGameModeChrome,
} from '../../src/ui/player-colors';
import {
  Board,
  BOARD_SIZE,
  RulesGameState,
  Position,
} from '../../src/games/kings-quadraphages/board';
import { Piece } from '../../src/games/kings-quadraphages/pieces';
import { getValidKingMoves } from '../../src/games/kings-quadraphages/rules';

afterEach(() => {
  document.body.innerHTML = '';
  document.head
    .querySelectorAll('style[data-kings-board-styles]')
    .forEach((el) => el.remove());
  vi.restoreAllMocks();
});

describe('Kings deep playability — vs-AI status copy', () => {
  it('uses You/AI phase copy instead of Player 1/2', () => {
    const el = document.createElement('div');
    renderStatus(createInitialGameState(), el, 'human-vs-ai', 'easy');
    expect(el.querySelector('.status-turn')?.textContent).toBe(
      'You: Click your King to select it'
    );

    const selected = selectKing(createInitialGameState());
    renderStatus(selected, el, 'human-vs-ai', 'easy');
    expect(el.querySelector('.status-turn')?.textContent).toBe(
      'You: Click a green square to move'
    );

    let placed = moveKing(selected, { row: 2, col: 5 });
    renderStatus(placed, el, 'human-vs-ai', 'medium');
    expect(el.querySelector('.status-turn')?.textContent).toBe(
      'You: Place a Quadraphage on a green square'
    );

    // HvH keeps the Player N contract used by exact-copy unit suites.
    renderStatus(createInitialGameState(), el, 'human-vs-human');
    expect(el.querySelector('.status-turn')?.textContent).toBe(
      'Player 1: Click your King to select it'
    );
  });

  it('winner + supply labels follow aiSeat when computer opens', () => {
    const app = document.createElement('div');
    app.id = 'app';
    document.body.appendChild(app);
    applyGameModeChrome(app, 'human-vs-ai', 'player1');

    const el = document.createElement('div');
    renderStatus(createInitialGameState(), el, 'human-vs-ai', 'hard');
    expect(el.querySelector('.supply-p1')?.textContent).toMatch(/AI:\s*30/);
    expect(el.querySelector('.supply-p2')?.textContent).toMatch(/You:\s*30/);

    const p1Wins = {
      ...createInitialGameState(),
      turnPhase: 'gameOver' as const,
      winner: 'player1' as const,
    };
    renderStatus(p1Wins, el, 'human-vs-ai', 'hard');
    expect(el.querySelector('.status-winner')?.textContent).toMatch(/AI Wins!/);
    expect(el.querySelector('.status-turn')?.textContent).toMatch(
      /Game Over! AI wins!/
    );

    const p2Wins = {
      ...createInitialGameState(),
      turnPhase: 'gameOver' as const,
      winner: 'player2' as const,
    };
    renderStatus(p2Wins, el, 'human-vs-ai', 'hard');
    expect(el.querySelector('.status-winner')?.textContent).toMatch(/You Win!/);

    clearGameModeChrome(app);
  });
});

describe('Kings deep playability — touch board styles', () => {
  it('injects kings-board class and ≥44px coarse sizing CSS', () => {
    const el = document.createElement('div');
    renderBoard(createInitialGameState(), el, () => undefined);

    expect(el.querySelector('.board.kings-board')).toBeTruthy();
    const style = document.head.querySelector(
      'style[data-kings-board-styles]'
    ) as HTMLStyleElement | null;
    expect(style?.textContent).toMatch(/\.board\.kings-board/);
    expect(style?.textContent).toMatch(/min\(420px/);
    expect(style?.textContent).toMatch(
      /@media\s*\(pointer:\s*coarse\),\s*\(hover:\s*none\)/
    );
    expect(style?.textContent).toMatch(/touch-action:\s*manipulation/);
  });

  it('keeps injected stylesheet registered once across re-renders', () => {
    const el = document.createElement('div');
    renderBoard(createInitialGameState(), el);
    renderBoard(selectKing(createInitialGameState()), el);
    expect(
      document.head.querySelectorAll('style[data-kings-board-styles]')
    ).toHaveLength(1);
  });
});

describe('Kings deep playability — Medium AI forced wins', () => {
  function createEmptyBoard(): Board {
    return Array.from({ length: BOARD_SIZE }, () =>
      Array.from({ length: BOARD_SIZE }, () => null)
    );
  }

  function placePiece(board: Board, pos: Position, piece: Piece): void {
    board[pos.row][pos.col] = piece;
  }

  function createRulesState(board: Board): RulesGameState {
    return { board, player1Supply: 30, player2Supply: 30 };
  }

  function winTrapBoard(): Board {
    const board = createEmptyBoard();
    placePiece(board, { row: 4, col: 4 }, { type: 'king', owner: 'player1' });
    placePiece(board, { row: 0, col: 0 }, { type: 'king', owner: 'player2' });
    placePiece(
      board,
      { row: 0, col: 1 },
      { type: 'quadraphage', owner: 'player1' }
    );
    placePiece(
      board,
      { row: 1, col: 0 },
      { type: 'quadraphage', owner: 'player1' }
    );
    return board;
  }

  it('medium still takes the trap when Math.random is near 1 (not diluted)', () => {
    const board = winTrapBoard();
    const state = createRulesState(board);
    expect(getValidKingMoves(state, 'player2')).toEqual([{ row: 1, col: 1 }]);

    // Previously top-5 random pool could skip the +10000 win when random≈1.
    vi.spyOn(Math, 'random').mockReturnValue(0.99);
    const move = getAIMove(state, 'player1', 'medium');
    expect(move).not.toBeNull();
    expect(move!.quadraphagePlacement).toEqual({ row: 1, col: 1 });
  });
});

describe('Kings deep playability — tablet AI think delay', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('uses a shorter think pause on coarse pointers', async () => {
    const matchMedia = vi.fn().mockImplementation((query: string) => ({
      matches: /pointer:\s*coarse|hover:\s*none/.test(query),
      media: query,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
      onchange: null,
    }));
    vi.stubGlobal('matchMedia', matchMedia);

    const {
      initGame,
      newGameVsAI,
      destroyGame,
      getGameState,
    } = await import('../../src/games/kings-quadraphages/game-controller');

    const app = document.createElement('div');
    app.id = 'app';
    const board = document.createElement('div');
    const status = document.createElement('div');
    document.body.append(app, board, status);

    initGame(board, status);
    newGameVsAI('easy', true);

    board
      .querySelector('.cell[data-row="1"][data-col="5"]')
      ?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    board
      .querySelector('.cell[data-row="2"][data-col="5"]')
      ?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    board
      .querySelector('.cell[data-row="1"][data-col="1"]')
      ?.dispatchEvent(new MouseEvent('click', { bubbles: true }));

    expect(status.textContent).toMatch(/AI is thinking/);

    // Coarse delay is 350ms — AI should still be thinking at 300ms.
    await vi.advanceTimersByTimeAsync(300);
    expect(getGameState().currentPlayer).toBe('player2');
    expect(status.textContent).toMatch(/AI is thinking/);

    await vi.advanceTimersByTimeAsync(50);
    await vi.advanceTimersByTimeAsync(300);
    expect(getGameState().currentPlayer).toBe('player1');

    destroyGame();
    vi.unstubAllGlobals();
  });
});

describe('Kings deep playability — source guard', () => {
  it('board-ui still declares kings-board sizing helpers', () => {
    const src = readFileSync(
      join(process.cwd(), 'src/games/kings-quadraphages/board-ui.ts'),
      'utf8'
    );
    expect(src).toContain('kings-board');
    expect(src).toContain('ensureKingsBoardStyles');
    expect(src).toContain('getVsAiPhaseMessage');
    expect(src).toContain('vsAiActorName');
  });
});
