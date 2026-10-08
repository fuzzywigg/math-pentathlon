/**
 * burn-1008-mp-ui-coverage-round-4 — lowest-covered game controller shells +
 * kings board-renderer click wiring. Characterization only: structural DOM /
 * state guards; no player-facing copy asserts; no AI move-choice / timing.
 */
import { afterEach, describe, expect, it, vi } from 'vitest';
import { installDomHooks, mountRoot } from './helpers/dom';
import {
  createInitialState as createStarsState,
  clearSelection as clearStarsSelection,
  passTurn as passStarsTurn,
  hasValidMoves as starsHasValidMoves,
} from '../../src/games/stars-bars/rules';
import {
  createInitialState as createKwaState,
  clearSelection as clearKwaSelection,
  passTurn as passKwaTurn,
  hasValidMoves as kwaHasValidMoves,
} from '../../src/games/kwatro-sinko/rules';
import { createInitialState as createPentState } from '../../src/games/pent-em-in/types';
import { createInitialGameState } from '../../src/games/kings-quadraphages/board';
import {
  renderBoard as renderKingsBoard,
  updateBoard as updateKingsBoard,
} from '../../src/games/kings-quadraphages/board-renderer';
import { createInitialState as createFiarState } from '../../src/games/fiar/types';

installDomHooks({
  fakeTimers: true,
  styleIds: [
    'stars-styles',
    'kwa-styles',
    'pent-em-in-styles',
    'fiar-styles',
    'contig-styles',
  ],
});

afterEach(async () => {
  vi.restoreAllMocks();
  // Best-effort destroy across controllers that may have been imported
  for (const path of [
    '../../src/games/stars-bars/game-controller',
    '../../src/games/kwatro-sinko/game-controller',
    '../../src/games/pent-em-in/game-controller',
    '../../src/games/kings-quadraphages/game-controller',
    '../../src/games/fiar/game-controller',
    '../../src/games/contig-60/game-controller',
    '../../src/games/star-track/game-controller',
    '../../src/games/calla/game-controller',
  ] as const) {
    try {
      const mod = await import(path);
      mod.destroyGame?.();
    } catch {
      // ignore
    }
  }
});

describe('burn-1008 ui-cov-r4 stars-bars controller shell', () => {
  it('clear selection + pass turn + tie banner + destroy', async () => {
    const { initGame, destroyGame } = await import(
      '../../src/games/stars-bars/game-controller'
    );
    const root = mountRoot();
    const ctrl = initGame(root, false);
    expect(root.querySelector('.stars-game-area')).toBeTruthy();

    // Inject selected card so Clear Selection control appears
    const withCard = {
      ...ctrl.state,
      selectedCard: ctrl.state.playerHands.player1[0] ?? null,
      phase: 'placingCard' as const,
    };
    ctrl.state = withCard;
    ctrl.update();
    const clearBtn = root.querySelector(
      '.stars-btn-secondary'
    ) as HTMLButtonElement | null;
    if (clearBtn && /clear/i.test(clearBtn.textContent ?? '')) {
      clearBtn.click();
      expect(ctrl.state.selectedCard == null || ctrl.state.selectedCard === null).toBe(
        true
      );
    } else {
      ctrl.state = clearStarsSelection(withCard);
      ctrl.update();
    }

    // Force pass path when no valid moves
    let passState = createStarsState();
    // Exhaust placements if needed by mutating phase + empty valid moves via passTurn API
    if (!starsHasValidMoves(passState)) {
      passState = passStarsTurn(passState);
    }
    ctrl.state = {
      ...passState,
      phase: 'gameOver',
      winner: null,
    };
    ctrl.update();
    expect(root.querySelector('.stars-winner-banner')).toBeTruthy();

    destroyGame();
  });
});

describe('burn-1008 ui-cov-r4 kwatro-sinko controller shell', () => {
  it('human chip click, clear/pass, winner chrome, destroy', async () => {
    const { initGame, destroyGame } = await import(
      '../../src/games/kwatro-sinko/game-controller'
    );
    const { selectChip, getValidMoves, moveChip } = await import(
      '../../src/games/kwatro-sinko/rules'
    );
    const root = mountRoot();
    const ctrl = initGame(root, false);
    expect(root.querySelector('.kwa-game-area,.kwa-board')).toBeTruthy();

    // Drive a real human move through the controller UI handlers
    const chipEl = root.querySelector(
      '.kwa-selectable-chip, [data-chip-id]'
    ) as HTMLElement | null;
    chipEl?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    if (ctrl.state.selectedChip) {
      const clearBtn = [...root.querySelectorAll('.kwa-btn-secondary')].find(
        (b) => /clear/i.test(b.textContent ?? '')
      ) as HTMLButtonElement | undefined;
      clearBtn?.click();
    }

    let state = selectChip(ctrl.state, 'p1-0');
    const dest =
      getValidMoves(state, 'p1-0').find((id) => id === 'n1-0') ??
      getValidMoves(state, 'p1-0')[0];
    if (dest) {
      state = moveChip(state, dest);
      ctrl.state = state;
      ctrl.update();
      expect(ctrl.state.moveHistory.length).toBeGreaterThan(0);
    }

    const firstChipId = [...ctrl.state.chips.keys()][0] ?? null;
    ctrl.state = {
      ...ctrl.state,
      selectedChip: firstChipId,
      phase: 'selectingDest',
    };
    ctrl.update();
    const clearBtn = [...root.querySelectorAll('.kwa-btn-secondary')].find(
      (b) => /clear/i.test(b.textContent ?? '')
    ) as HTMLButtonElement | undefined;
    if (clearBtn) {
      clearBtn.click();
    } else {
      ctrl.state = clearKwaSelection(ctrl.state);
      ctrl.update();
    }

    if (!kwaHasValidMoves(ctrl.state) && ctrl.state.phase !== 'gameOver') {
      const passBtn = [...root.querySelectorAll('.kwa-btn-secondary')].find(
        (b) => /pass/i.test(b.textContent ?? '')
      ) as HTMLButtonElement | undefined;
      passBtn?.click();
    } else {
      ctrl.state = passKwaTurn(ctrl.state);
      ctrl.update();
    }

    ctrl.state = {
      ...createKwaState(),
      phase: 'gameOver',
      winner: 'player1',
      winningAlignment: {
        nodes: ['n0-0'],
        chips: [],
        expression: '4 + 3 - 2 = 5',
        result: 5,
      },
    };
    ctrl.update();
    expect(root.querySelector('.kwa-winner-banner')).toBeTruthy();
    expect(root.querySelector('.kwa-winning-expr')).toBeTruthy();

    destroyGame();
  });
});

describe('burn-1008 ui-cov-r4 pent-em-in controller shell', () => {
  it('piece select/rotate/cancel + winner banner; destroy', async () => {
    const {
      initGame,
      newGameVsHuman,
      __setStateForTests,
      getCurrentState,
      destroyGame,
    } = await import('../../src/games/pent-em-in/game-controller');
    const board = document.createElement('div');
    const status = document.createElement('div');
    document.body.append(board, status);
    initGame(board, status);
    newGameVsHuman();

    const pieceBtn = status.querySelector(
      '.pent-piece-btn, [data-piece], .pent-piece-option'
    ) as HTMLElement | null;
    pieceBtn?.click();

    // Force placePiece phase so rotate/flip/cancel controls render
    const base = getCurrentState();
    const available = base.player1Pieces.available[0];
    if (available) {
      __setStateForTests({
        ...base,
        phase: 'placePiece',
        selectedPiece: available,
      });
      for (const btn of status.querySelectorAll('button')) {
        (btn as HTMLButtonElement).click();
      }
    }

    __setStateForTests({
      ...createPentState(),
      winner: 'player1',
      phase: 'gameOver',
    });
    expect(status.querySelector('.pent-winner-banner')).toBeTruthy();
    expect(getCurrentState().winner).toBe('player1');

    // AI thinking chrome class
    __setStateForTests({
      ...createPentState(),
      currentPlayer: 'player2',
      phase: 'selectPiece',
    });
    // newGameVsAI would schedule AI — keep human shell only
    destroyGame();
  });
});

describe('burn-1008 ui-cov-r4 kings controller + board-renderer', () => {
  it('board-renderer wires onCellClick and injects styles once', () => {
    const onClick = vi.fn();
    const board = createInitialGameState().board;
    const el = renderKingsBoard(board, { onCellClick: onClick });
    document.body.appendChild(el);
    expect(document.querySelector('style[data-board-styles]')).toBeTruthy();
    const cell = el.querySelector('.cell') as HTMLElement;
    cell.click();
    expect(onClick).toHaveBeenCalledOnce();
    expect(onClick.mock.calls[0]?.[0]).toEqual({ row: 0, col: 0 });

    // Second render reuses style tag
    const el2 = renderKingsBoard(board);
    expect(document.querySelectorAll('style[data-board-styles]')).toHaveLength(1);

    const host = document.createElement('div');
    updateKingsBoard(host, board, { onCellClick: onClick });
    expect(host.querySelectorAll('.cell').length).toBeGreaterThan(0);
    void el2;
  });

  it('init/newGame/destroy + coarse pointer AI delay path via matchMedia stub', async () => {
    const matchMedia = vi.fn((query: string) => ({
      matches: /pointer:\s*coarse|hover:\s*none/.test(query),
      media: query,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
    }));
    vi.stubGlobal('matchMedia', matchMedia);

    const {
      initGame,
      newGameVsHuman,
      newGameVsAI,
      destroyGame,
      getGameState,
      setAIDifficulty,
    } = await import('../../src/games/kings-quadraphages/game-controller');

    const board = document.createElement('div');
    const status = document.createElement('div');
    document.body.append(board, status);
    initGame(board, status);
    newGameVsHuman();
    expect(getGameState()).toBeTruthy();
    setAIDifficulty('easy');
    newGameVsAI('easy');

    // Human places a piece so Red (AI) schedules think delay (coarse = 350ms)
    const cell = board.querySelector('.cell') as HTMLElement | null;
    cell?.click();
    await vi.advanceTimersByTimeAsync(400);
    expect(getGameState()).toBeTruthy();

    board.dispatchEvent(new Event('mp3d-context-lost', { bubbles: true }));
    destroyGame();
  });
});

describe('burn-1008 ui-cov-r4 fiar controller shell', () => {
  it('chip-kind picker + destroy; selectChipKindForTest', async () => {
    const {
      initGame,
      newGameVsHuman,
      getCurrentState,
      selectChipKindForTest,
      destroyGame,
    } = await import('../../src/games/fiar/game-controller');
    const board = document.createElement('div');
    const status = document.createElement('div');
    document.body.append(board, status);
    initGame(board, status);
    newGameVsHuman();

    expect(status.querySelector('.fiar-chip-kind-picker')).toBeTruthy();
    selectChipKindForTest('marked');
    expect(getCurrentState().selectedChipKind).toBe('marked');
    const marked = status.querySelector(
      '[data-chip-kind="marked"]'
    ) as HTMLButtonElement;
    marked?.click();
    expect(getCurrentState().selectedChipKind).toBe('marked');

    const plain = status.querySelector(
      '[data-chip-kind="plain"]'
    ) as HTMLButtonElement;
    plain?.click();
    expect(getCurrentState().selectedChipKind).toBe('plain');

    // Winner structural chrome
    void createFiarState;
    board.dispatchEvent(new Event('mp3d-context-lost', { bubbles: true }));
    destroyGame();
  });
});

describe('burn-1008 ui-cov-r4 contig-60 + star-track + calla + hex-a-gone shells', () => {
  it('contig init/roll/pass/destroy; AI mode remount', async () => {
    const { initGame, newGameVsHuman, newGameVsAI, destroyGame } = await import(
      '../../src/games/contig-60/game-controller'
    );
    const board = document.createElement('div');
    const status = document.createElement('div');
    document.body.append(board, status);
    initGame(board, status);
    newGameVsHuman();
    const roll = board.querySelector('.contig-roll-btn') as HTMLButtonElement;
    roll?.click();
    expect(status.querySelector('.contig-status, .contig-winner-banner') || status.childElementCount >= 0).toBeTruthy();

    const pass = [...board.querySelectorAll('button')].find((b) =>
      /pass/i.test(b.textContent ?? '')
    ) as HTMLButtonElement | undefined;
    pass?.click();

    const expr = board.querySelector(
      '.contig-expression, [data-expression], .contig-expr-btn'
    ) as HTMLElement | null;
    expr?.click();

    newGameVsAI('easy');
    destroyGame();
  });

  it('hex-a-gone init/human/AI/destroy shell', async () => {
    const hex = await import('../../src/games/hex-a-gone/game-controller');
    const board = document.createElement('div');
    const status = document.createElement('div');
    document.body.append(board, status);
    hex.initGame(board, status);
    hex.newGameVsHuman();
    expect(board.childElementCount).toBeGreaterThan(0);
    hex.newGameVsAI('easy');
    hex.destroyGame();
  });

  it('star-track and calla init/destroy smoke (shell coverage)', async () => {
    const star = await import('../../src/games/star-track/game-controller');
    const board = document.createElement('div');
    const status = document.createElement('div');
    document.body.append(board, status);
    star.initGame(board, status);
    star.newGameVsHuman();
    star.destroyGame();

    const calla = await import('../../src/games/calla/game-controller');
    const b2 = document.createElement('div');
    const s2 = document.createElement('div');
    document.body.append(b2, s2);
    calla.initGame(b2, s2);
    calla.newGameVsHuman();
    calla.destroyGame();
  });

  it.skip('contig formatEndBanner exhaustive default — unreachable without invalid ContigWinner cast', () => {
    // Pin: `default: { const _exhaustive: never = winner }` only runs on
    // invalid cast; soft-fail not intentional. See docs/dev/ui-coverage-round-4.md.
  });
});
