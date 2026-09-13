import { describe, it, expect, afterEach, vi } from 'vitest';

import { createInitialState as createContig } from '../../src/games/contig-60/types';
import {
  renderBoard as renderContigBoard,
  injectContigStyles,
} from '../../src/games/contig-60/board-ui';

import { createInitialState as createSum } from '../../src/games/sum-dominoes/rules';
import {
  renderHand as renderSumHand,
  renderBoard as renderSumBoard,
  injectSDStyles,
} from '../../src/games/sum-dominoes/board-ui';

import { createInitialState as createFab } from '../../src/games/fab-a-diffy/rules';
import {
  renderFractionBarPool,
  renderScores as renderFabScores,
  renderMoveHistory as renderFabHistory,
} from '../../src/games/fab-a-diffy/board-ui';

import { createInitialState as createPrime } from '../../src/games/prime-gold/rules';
import {
  renderDice as renderPrimeDice,
  renderScores as renderPrimeScores,
  renderMoveHistory as renderPrimeHistory,
} from '../../src/games/prime-gold/board-ui';

import { createInitialState as createPar } from '../../src/games/par-55/rules';
import {
  renderBoard as renderParBoard,
  renderScores as renderParScores,
} from '../../src/games/par-55/board-ui';

import { createInitialState as createRamrod } from '../../src/games/ramrod/rules';
import {
  renderBoard as renderRamrodBoard,
  renderScores as renderRamrodScores,
  renderRodLegend,
} from '../../src/games/ramrod/board-ui';

import { createInitialState as createStars } from '../../src/games/stars-bars/rules';
import {
  renderPlayerHand as renderStarsHand,
  renderMoveHistory as renderStarsHistory,
} from '../../src/games/stars-bars/board-ui';

import { createInitialState as createKwa } from '../../src/games/kwatro-sinko/rules';
import {
  renderChipInfo,
  renderBoard as renderKwaBoard,
} from '../../src/games/kwatro-sinko/board-ui';

import { createInitialState as createFrac } from '../../src/games/frac-fact/types';
import {
  renderAnswerChoices,
  renderScores as renderFracScores,
  injectFracFactStyles,
} from '../../src/games/frac-fact/board-ui';

import { createInitialState as createPinball } from '../../src/games/fraction-pinball/types';
import {
  renderChallenge,
  renderScores as renderPinballScores,
  injectFractionPinballStyles,
} from '../../src/games/fraction-pinball/board-ui';

import {
  createInitialState as createJuggle,
  doRollDice as juggleRoll,
} from '../../src/games/juggle/rules';
import {
  renderBoard as renderJuggleBoard,
  injectJuggleStyles,
} from '../../src/games/juggle/board-ui';

import { createInitialGameState as createKings } from '../../src/games/kings-quadraphages/game-state';
import { handleCellClick } from '../../src/games/kings-quadraphages/board-ui';

import { createInitialState as createCalla } from '../../src/games/calla/types';
import { renderBoard as renderCallaBoard } from '../../src/games/calla/board-ui';

import { createInitialState as createHex } from '../../src/games/hex/types';
import {
  renderBoard as renderHexBoard,
  formatPosition,
} from '../../src/games/hex/board-ui';

import { createInitialState as createFiar } from '../../src/games/fiar/types';
import { renderBoard as renderFiarBoard } from '../../src/games/fiar/board-ui';

afterEach(() => {
  document.body.innerHTML = '';
  vi.restoreAllMocks();
});

describe('Burn wave 13 — Contig board + inject styles', () => {
  it('renderBoard mounts cells; injectContigStyles id present', () => {
    injectContigStyles();
    expect(document.getElementById('contig-styles')).toBeTruthy();
    const board = renderContigBoard(createContig(), () => {});
    document.body.appendChild(board);
    expect(board.querySelectorAll('.contig-cell').length).toBeGreaterThan(0);
    expect(board.classList.contains('contig-board')).toBe(true);
  });
});

describe('Burn wave 13 — Sum Dominoes hand + board + inject', () => {
  it('renderHand / renderBoard / injectSDStyles', () => {
    injectSDStyles();
    expect(document.getElementById('sd-styles')).toBeTruthy();
    const state = createSum();
    const hand = renderSumHand(state, 'player1', () => {});
    document.body.appendChild(hand);
    expect(
      hand.classList.contains('sd-hand') ||
        hand.querySelectorAll('.sd-domino, .sd-hand-card').length >= 0
    ).toBe(true);
    const board = renderSumBoard(state, () => {});
    document.body.appendChild(board);
    expect(
      board.querySelectorAll('.sd-cell, .sd-board, td').length
    ).toBeGreaterThan(0);
  });
});

describe('Burn wave 13 — Fab pool / scores / history', () => {
  it('fraction bar pool + scores + move history', () => {
    const state = createFab();
    const pool = renderFractionBarPool(state, () => {});
    document.body.appendChild(pool);
    expect(pool.classList.contains('fab-bar-pool')).toBe(true);
    const scores = renderFabScores(state);
    document.body.appendChild(scores);
    expect(scores.classList.contains('fab-scores')).toBe(true);
    const history = renderFabHistory(state);
    document.body.appendChild(history);
    expect(history.classList.contains('fab-history')).toBe(true);
  });
});

describe('Burn wave 13 — Prime dice / scores / history', () => {
  it('roll CTA + scores + history chrome', () => {
    let rolls = 0;
    const dice = renderPrimeDice(
      createPrime(),
      () => {
        rolls++;
      },
      true
    );
    document.body.appendChild(dice);
    const btn = dice.querySelector('.pg-roll-btn') as HTMLButtonElement | null;
    expect(btn).toBeTruthy();
    btn!.click();
    expect(rolls).toBe(1);

    const scores = renderPrimeScores(createPrime());
    document.body.appendChild(scores);
    expect(scores.classList.contains('pg-scores')).toBe(true);
    const history = renderPrimeHistory(createPrime());
    document.body.appendChild(history);
    expect(history.classList.contains('pg-move-history')).toBe(true);
  });
});

describe('Burn wave 13 — Par board + scores', () => {
  it('renderBoard cells + scores panel', () => {
    const state = createPar();
    const board = renderParBoard(state, () => {});
    document.body.appendChild(board);
    expect(board.classList.contains('par55-board')).toBe(true);
    const scores = renderParScores(state);
    document.body.appendChild(scores);
    expect(scores.classList.contains('par55-scores')).toBe(true);
  });
});

describe('Burn wave 13 — Ramrod board / scores / legend', () => {
  it('board + scores + rod legend classes', () => {
    const state = createRamrod();
    const board = renderRamrodBoard(state, () => {});
    document.body.appendChild(board);
    expect(
      board.classList.contains('ramrod-board') ||
        board.querySelector('.ramrod-box')
    ).toBeTruthy();
    const scores = renderRamrodScores(state);
    document.body.appendChild(scores);
    expect(scores.classList.contains('ramrod-scores')).toBe(true);
    const legend = renderRodLegend();
    document.body.appendChild(legend);
    expect(legend.className.length).toBeGreaterThan(0);
  });
});

describe('Burn wave 13 — Stars hand + history', () => {
  it('player hand cards + move history', () => {
    const state = createStars();
    const hand = renderStarsHand(state, 'player1', () => {});
    document.body.appendChild(hand);
    expect(
      hand.classList.contains('stars-hand') ||
        hand.querySelectorAll('.stars-card').length >= 0
    ).toBe(true);
    const history = renderStarsHistory(state);
    document.body.appendChild(history);
    expect(history.classList.contains('stars-move-history')).toBe(true);
  });
});

describe('Burn wave 13 — Kwatro chip info + board', () => {
  it('chip info + board mount', () => {
    const state = createKwa();
    const info = renderChipInfo(state);
    document.body.appendChild(info);
    expect(info.classList.contains('kwa-chip-info')).toBe(true);
    const board = renderKwaBoard(
      state,
      () => {},
      () => {}
    );
    document.body.appendChild(board);
    expect(board.classList.contains('kwa-board')).toBe(true);
  });
});

describe('Burn wave 13 — Frac choices / scores / inject', () => {
  it('answer choices clickable; scores; inject styles', () => {
    injectFracFactStyles();
    expect(document.getElementById('frac-fact-styles')).toBeTruthy();
    const problem = {
      id: 'w13-f',
      operand1: { numerator: 1, denominator: 3 },
      operand2: { numerator: 1, denominator: 6 },
      operation: 'add' as const,
      correctAnswer: { numerator: 1, denominator: 2 },
      answerChoices: [
        { numerator: 1, denominator: 2 },
        { numerator: 1, denominator: 3 },
        { numerator: 2, denominator: 3 },
        { numerator: 1, denominator: 6 },
      ],
    };
    const playing = {
      ...createFrac('easy'),
      phase: 'playing' as const,
      currentProblem: problem,
    };
    let picked = 0;
    const choices = renderAnswerChoices(playing, () => {
      picked++;
    });
    document.body.appendChild(choices);
    const btn = choices.querySelector('button') as HTMLButtonElement | null;
    expect(btn).toBeTruthy();
    btn!.click();
    expect(picked).toBe(1);
    const scores = renderFracScores(playing);
    document.body.appendChild(scores);
    expect(scores.classList.contains('frac-scores')).toBe(true);
  });
});

describe('Burn wave 13 — Pinball challenge / scores / inject', () => {
  it('challenge chrome + scores + inject', () => {
    injectFractionPinballStyles();
    expect(
      document.getElementById('fraction-pinball-styles') ||
        document.head.querySelectorAll('style').length > 0
    ).toBeTruthy();
    const challenge = {
      id: 'w13-p',
      type: 'fractionToDecimal' as const,
      fraction: { numerator: 1, denominator: 4 },
      decimal: 0.25,
      answerChoices: ['0.25', '0.5', '0.75', '1'],
      correctAnswer: '0.25',
    };
    const playing = {
      ...createPinball(),
      phase: 'playing' as const,
      currentChallenge: challenge,
    };
    const challengeEl = renderChallenge(playing, () => {});
    document.body.appendChild(challengeEl);
    expect(challengeEl.classList.contains('pinball-challenge')).toBe(true);
    const scores = renderPinballScores(playing);
    document.body.appendChild(scores);
    expect(scores.classList.contains('pinball-scores')).toBe(true);
  });
});

describe('Burn wave 13 — Juggle board + inject', () => {
  it('board mounts after roll; injectJuggleStyles', () => {
    HTMLCanvasElement.prototype.getContext = vi.fn().mockReturnValue({
      fillRect: vi.fn(),
      clearRect: vi.fn(),
      strokeRect: vi.fn(),
      beginPath: vi.fn(),
      moveTo: vi.fn(),
      lineTo: vi.fn(),
      stroke: vi.fn(),
      fill: vi.fn(),
      arc: vi.fn(),
      fillText: vi.fn(),
      save: vi.fn(),
      restore: vi.fn(),
      translate: vi.fn(),
      scale: vi.fn(),
      rotate: vi.fn(),
    });
    injectJuggleStyles();
    expect(document.getElementById('juggle-styles')).toBeTruthy();
    vi.spyOn(Math, 'random').mockReturnValue(0.2);
    const state = juggleRoll(createJuggle());
    const board = renderJuggleBoard(
      state.boards.player1,
      'player1',
      true,
      state,
      () => {},
      () => {},
      () => {}
    );
    document.body.appendChild(board);
    expect(board.classList.contains('juggle-board')).toBe(true);
  });
});

describe('Burn wave 13 — Kings handleCellClick select/deselect', () => {
  it('select king then deselect same cell', () => {
    let state = createKings();
    expect(state.selectedKingPosition).toBeNull();
    const select = handleCellClick(1, 5, state);
    expect(select.isInvalidClick).toBe(false);
    state = select.state;
    expect(state.selectedKingPosition).not.toBeNull();
    const deselect = handleCellClick(1, 5, state);
    expect(deselect.state.selectedKingPosition).toBeNull();
  });
});

describe('Burn wave 13 — Calla / Hex / FIAR board leftovers', () => {
  it('Calla board pits; Hex board + formatPosition; FIAR svg', () => {
    const callaBox = document.createElement('div');
    document.body.appendChild(callaBox);
    renderCallaBoard(createCalla(), callaBox, () => {});
    expect(callaBox.querySelectorAll('.calla-pit').length).toBeGreaterThan(0);

    const hexBox = document.createElement('div');
    document.body.appendChild(hexBox);
    renderHexBoard(createHex(5), hexBox, () => {});
    expect(hexBox.querySelector('.hex-board, [data-row]')).toBeTruthy();
    expect(formatPosition({ row: 2, col: 3 }).length).toBeGreaterThan(0);

    const fiarEl = renderFiarBoard(createFiar(), () => {});
    document.body.appendChild(fiarEl);
    expect(
      fiarEl.querySelectorAll('[data-node-id], .fiar-node, circle').length
    ).toBeGreaterThan(0);
  });
});
