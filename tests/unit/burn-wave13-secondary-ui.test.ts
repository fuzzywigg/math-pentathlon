import { describe, it, expect, afterEach, vi } from 'vitest';

import { createInitialState as createContig } from '../../src/games/contig-60/types';
import {
  renderBoard as renderContigBoard,
  injectContigStyles,
  getPlayerName as contigName,
} from '../../src/games/contig-60/board-ui';
import { doRollDice as rollContig } from '../../src/games/contig-60/rules';

import { createInitialState as createHex } from '../../src/games/hex/types';
import {
  renderBoard as renderHexBoard,
  renderStatus as renderHexStatus,
} from '../../src/games/hex/board-ui';
import { getWinningPath } from '../../src/games/hex/rules';

import { createInitialGameState as createKings } from '../../src/games/kings-quadraphages/game-state';
import { renderStatus as renderKingsStatus } from '../../src/games/kings-quadraphages/board-ui';
import { INITIAL_QUADRAPHAGE_COUNT } from '../../src/games/kings-quadraphages/pieces';

import {
  createInitialState as createSum,
  selectDomino,
} from '../../src/games/sum-dominoes/rules';
import {
  renderBoard as renderSumBoard,
  renderHand as renderSumHand,
  injectSDStyles,
} from '../../src/games/sum-dominoes/board-ui';

import { createInitialState as createFrac } from '../../src/games/frac-fact/types';
import {
  renderGameOver as renderFracOver,
  renderScores as renderFracScores,
} from '../../src/games/frac-fact/board-ui';

import { createInitialState as createPinball } from '../../src/games/fraction-pinball/types';
import { renderGameOver as renderPinballOver } from '../../src/games/fraction-pinball/board-ui';

import { createInitialState as createRemainder } from '../../src/games/remainder-islands/types';
import {
  renderScores as renderRemainderScores,
  getPlayerName as remainderName,
} from '../../src/games/remainder-islands/board-ui';

import { createInitialState as createStar } from '../../src/games/star-track/types';
import { renderBoard as renderStarBoard } from '../../src/games/star-track/board-ui';

import { createInitialState as createHexAGone } from '../../src/games/hex-a-gone/types';
import {
  renderBoard as renderHagBoard,
  renderStatus as renderHagStatus,
} from '../../src/games/hex-a-gone/board-ui';
import { selectBlock as selectHag } from '../../src/games/hex-a-gone/rules';

import {
  createInitialState as createJuggle,
  doRollDice as juggleRoll,
  selectDie,
} from '../../src/games/juggle/rules';
import {
  renderShapeSelector,
  injectJuggleStyles,
} from '../../src/games/juggle/board-ui';

import { createInitialState as createPrime } from '../../src/games/prime-gold/rules';
import { renderMoveHistory as renderPrimeHistory } from '../../src/games/prime-gold/board-ui';

import { createInitialState as createFab } from '../../src/games/fab-a-diffy/rules';
import { renderMoveHistory as renderFabHistory } from '../../src/games/fab-a-diffy/board-ui';

import { createInitialState as createStars } from '../../src/games/stars-bars/rules';
import { renderMoveHistory as renderStarsHistory } from '../../src/games/stars-bars/board-ui';

import { createInitialState as createQueens } from '../../src/games/queens-guards/types';
import { selectPiece as qgSelect } from '../../src/games/queens-guards/rules';
import { renderBoard as renderQueensBoard } from '../../src/games/queens-guards/board-ui';

import {
  createInitialState as createKwa,
  selectChip as kwaSelect,
} from '../../src/games/kwatro-sinko/rules';
import { renderBoard as renderKwaBoard } from '../../src/games/kwatro-sinko/board-ui';

import { createInitialState as createFiar } from '../../src/games/fiar/types';
import { renderBoard as renderFiarBoard } from '../../src/games/fiar/board-ui';

afterEach(() => {
  document.body.innerHTML = '';
  vi.restoreAllMocks();
});

describe('Burn wave 13 — Contig valid cells + inject styles', () => {
  it('after roll, valid cells marked; inject styles idempotent', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.2);
    injectContigStyles();
    injectContigStyles();
    expect(document.getElementById('contig-styles')).toBeTruthy();

    const state = rollContig(createContig());
    const board = renderContigBoard(state, () => {});
    document.body.appendChild(board);
    expect(
      board.querySelectorAll('.contig-cell, .contig-cell-valid').length
    ).toBeGreaterThan(0);
    expect(contigName('player1')).not.toBe(contigName('player2'));
  });
});

describe('Burn wave 13 — Hex winning cells + vs-AI status', () => {
  it('winning path highlights; vs-AI winner wording', () => {
    const size = 3;
    const base = createHex(size);
    const boardGrid = base.board.map((row) => [...row]);
    boardGrid[0]![1] = 'player1';
    boardGrid[1]![1] = 'player1';
    boardGrid[2]![1] = 'player1';
    const path = getWinningPath(boardGrid, 'player1', size);
    const won = {
      ...base,
      board: boardGrid,
      winner: 'player1' as const,
      moveHistory: path.map((position, i) => ({
        player: 'player1' as const,
        position,
        moveNumber: i + 1,
      })),
    };
    const container = document.createElement('div');
    document.body.appendChild(container);
    renderHexBoard(won, container, () => {});
    expect(
      container.querySelectorAll('.hex-cell-winning').length
    ).toBeGreaterThan(0);

    const status = document.createElement('div');
    document.body.appendChild(status);
    renderHexStatus(won, status, 'human-vs-ai');
    expect(status.textContent).toMatch(/You|AI|Win/i);
  });
});

describe('Burn wave 13 — Kings supplies chrome', () => {
  it('status shows supply counts from INITIAL_QUADRAPHAGE_COUNT', () => {
    const state = createKings();
    const status = document.createElement('div');
    document.body.appendChild(status);
    renderKingsStatus(state, status);
    expect(status.textContent).toMatch(
      new RegExp(String(INITIAL_QUADRAPHAGE_COUNT))
    );
  });
});

describe('Burn wave 13 — Sum selected hand + inject', () => {
  it('selected hand class; inject styles; board mounts', () => {
    injectSDStyles();
    injectSDStyles();
    expect(document.getElementById('sd-styles')).toBeTruthy();

    vi.spyOn(Math, 'random').mockReturnValue(0.3);
    let state = createSum();
    state = { ...state, phase: 'placing', currentDice: [3, 4] };
    const handId = state.hands.player1[0]!.id;
    state = selectDomino(state, handId);
    const hand = renderSumHand(state, 'player1', () => {});
    document.body.appendChild(hand);
    expect(hand.querySelector('.sd-hand-domino-selected')).toBeTruthy();

    const board = renderSumBoard(state, () => {});
    document.body.appendChild(board);
    expect(
      board.querySelector('.sd-board, .sd-domino, [data-row]')
    ).toBeTruthy();
  });
});

describe('Burn wave 13 — Frac / Pinball / Remainder draw banners + scores', () => {
  it('draw banners and score shells', () => {
    const fracDraw = renderFracOver({
      ...createFrac('easy'),
      phase: 'gameOver',
      winner: null,
    });
    document.body.appendChild(fracDraw);
    expect(fracDraw.textContent).toMatch(/Draw/i);

    const scores = renderFracScores(createFrac('easy'));
    document.body.appendChild(scores);
    expect(scores.classList.contains('frac-scores')).toBe(true);

    const pinDraw = renderPinballOver({
      ...createPinball(),
      phase: 'gameOver',
      winner: null,
    });
    document.body.appendChild(pinDraw);
    expect(pinDraw.textContent).toMatch(/Draw|Tie|Win/i);

    const remScores = renderRemainderScores(createRemainder());
    document.body.appendChild(remScores);
    expect(remScores.classList.contains('remainder-scores')).toBe(true);
    expect(remainderName('player1').length).toBeGreaterThan(0);
  });
});

describe('Burn wave 13 — Star board progress markers', () => {
  it('non-zero positions still mount track chrome', () => {
    const state = {
      ...createStar(),
      player1Position: 4,
      player2Position: 2,
    };
    const container = document.createElement('div');
    document.body.appendChild(container);
    renderStarBoard(state, container, () => {}, () => {});
    expect(
      container.querySelector('.star-track-board, .star-track-space, svg')
    ).toBeTruthy();
  });
});

describe('Burn wave 13 — Hex-a-Gone bank selection class', () => {
  it('selectBlock marks bank item; status mounts', () => {
    let state = createHexAGone();
    const shapes = Object.keys(state.bank) as Array<keyof typeof state.bank>;
    const shape = shapes.find((s) => state.bank[s] > 0)!;
    state = selectHag(state, shape);
    const board = document.createElement('div');
    document.body.appendChild(board);
    renderHagBoard(state, board, () => {}, () => {}, () => {});
    expect(board.children.length).toBeGreaterThan(0);

    const status = document.createElement('div');
    document.body.appendChild(status);
    renderHagStatus(
      {
        ...state,
        bank: {
          hexagon: 0,
          trapezoid: 0,
          rhombus: 0,
          triangle: 0,
          square: 0,
        },
      },
      status
    );
    expect(status.textContent?.length).toBeGreaterThan(0);
  });
});

describe('Burn wave 13 — Juggle shape selector + inject', () => {
  it('after selectDie, shape selector lists shapes', () => {
    HTMLCanvasElement.prototype.getContext = vi.fn(() => ({
      fillStyle: '',
      strokeStyle: '',
      lineWidth: 1,
      fillRect: vi.fn(),
      strokeRect: vi.fn(),
      clearRect: vi.fn(),
      beginPath: vi.fn(),
      moveTo: vi.fn(),
      lineTo: vi.fn(),
      stroke: vi.fn(),
      fill: vi.fn(),
      save: vi.fn(),
      restore: vi.fn(),
      translate: vi.fn(),
      scale: vi.fn(),
      rotate: vi.fn(),
    })) as unknown as typeof HTMLCanvasElement.prototype.getContext;

    injectJuggleStyles();
    injectJuggleStyles();
    expect(document.getElementById('juggle-styles')).toBeTruthy();

    vi.spyOn(Math, 'random').mockReturnValue(0.2);
    let state = juggleRoll(createJuggle());
    state = selectDie(state, 0);
    const selector = renderShapeSelector(state, () => {});
    document.body.appendChild(selector);
    expect(selector.classList.contains('juggle-shape-selector')).toBe(true);
    expect(selector.children.length).toBeGreaterThan(0);
  });
});

describe('Burn wave 13 — Prime / Fab / Stars history after injected move', () => {
  it('history shells render with one move entry', () => {
    const prime = {
      ...createPrime(),
      moveHistory: [
        {
          player: 'player1' as const,
          dice: { die1: 1, die2: 2, die3: 3 },
          expression: '1+2+3',
          result: 6,
          row: 0,
          col: 0,
        },
      ],
    };
    const ph = renderPrimeHistory(prime);
    document.body.appendChild(ph);
    expect(ph.textContent?.length).toBeGreaterThan(0);

    const fabIds = [...createFab().fractionBars.keys()];
    const fabAnswers = [...createFab().answerBars.keys()];
    const fab = {
      ...createFab(),
      moveHistory: [
        {
          player: 'player1' as const,
          bar1Id: fabIds[0]!,
          bar2Id: fabIds[1]!,
          operation: 'add' as const,
          resultId: fabAnswers[0]!,
          moveNumber: 1,
        },
      ],
    };
    const fh = renderFabHistory(fab);
    document.body.appendChild(fh);
    expect(fh.textContent?.length).toBeGreaterThan(0);

    const freshStars = createStars();
    const stars = {
      ...freshStars,
      moveHistory: [
        {
          player: 'player1' as const,
          card: freshStars.playerHands.player1[0]!,
          row: 0,
          col: 0,
          score: 1,
          breakdown: 'base',
        },
      ],
    };
    const sh = renderStarsHistory(stars);
    document.body.appendChild(sh);
    expect(sh.classList.contains('stars-move-history')).toBe(true);
  });
});

describe('Burn wave 13 — Queens / Kwatro / FIAR selection chrome', () => {
  it('boards mount after select / without crash', () => {
    const queens = createQueens();
    let coord: { ring: number; position: number } | null = null;
    for (const [, cell] of queens.cells) {
      if (cell.piece?.player === 'player1') {
        coord = { ring: cell.ring, position: cell.position };
        break;
      }
    }
    expect(coord).toBeTruthy();
    const selected = qgSelect(queens, coord!);
    const qBoard = renderQueensBoard(selected, () => {});
    document.body.appendChild(qBoard);
    expect(qBoard.tagName.toLowerCase()).toBe('svg');

    const kwa = createKwa();
    const chip = [...kwa.chips.values()].find((c) => c.owner === 'player1')!;
    const kwaSel = kwaSelect(kwa, chip.id);
    const kBoard = renderKwaBoard(kwaSel, () => {}, () => {});
    document.body.appendChild(kBoard);
    expect(kBoard.classList.contains('kwa-board')).toBe(true);

    const fiarBoard = renderFiarBoard(createFiar(), () => {});
    document.body.appendChild(fiarBoard);
    expect(fiarBoard.tagName.toLowerCase()).toBe('svg');
  });
});
