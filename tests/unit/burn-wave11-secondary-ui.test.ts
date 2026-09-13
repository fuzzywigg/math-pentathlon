import { describe, it, expect, afterEach, vi } from 'vitest';

import { createInitialState as createHex } from '../../src/games/hex/types';
import {
  renderBoard as renderHexBoard,
  renderStatus as renderHexStatus,
  formatPosition,
} from '../../src/games/hex/board-ui';

import { createInitialState as createCalla } from '../../src/games/calla/types';
import { renderBoard as renderCallaBoard } from '../../src/games/calla/board-ui';

import { createInitialState as createQueens } from '../../src/games/queens-guards/types';
import {
  renderBoard as renderQueensBoard,
  injectQGStyles,
  getPlayerName as queensName,
} from '../../src/games/queens-guards/board-ui';

import { createInitialState as createPent } from '../../src/games/pent-em-in/types';
import {
  renderPieceSelector,
  injectPentEmInStyles,
  getPlayerName as pentName,
} from '../../src/games/pent-em-in/board-ui';

import { createInitialState as createRemainder } from '../../src/games/remainder-islands/types';
import {
  renderScores as renderRemainderScores,
  renderBoard as renderRemainderBoard,
  injectRemainderIslandsStyles,
  getPlayerName as remainderName,
} from '../../src/games/remainder-islands/board-ui';

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

import { createInitialState as createStar } from '../../src/games/star-track/types';
import { renderBoard as renderStarBoard } from '../../src/games/star-track/board-ui';

import { createInitialState as createFrac } from '../../src/games/frac-fact/types';
import {
  renderScores as renderFracScores,
  renderAnswerChoices,
  injectFracFactStyles,
} from '../../src/games/frac-fact/board-ui';

import { createInitialState as createPinball } from '../../src/games/fraction-pinball/types';
import {
  renderScores as renderPinballScores,
  renderChallenge,
  injectFractionPinballStyles,
} from '../../src/games/fraction-pinball/board-ui';

import { createInitialState as createFiar } from '../../src/games/fiar/types';
import { renderBoard as renderFiarBoard } from '../../src/games/fiar/board-ui';

import { createInitialState as createKwa } from '../../src/games/kwatro-sinko/rules';
import { renderBoard as renderKwaBoard } from '../../src/games/kwatro-sinko/board-ui';

import { createInitialState as createPar } from '../../src/games/par-55/rules';
import {
  renderScores as renderParScores,
  renderBoard as renderParBoard,
} from '../../src/games/par-55/board-ui';

import { createInitialState as createPrime } from '../../src/games/prime-gold/rules';
import { renderDice as renderPrimeDice } from '../../src/games/prime-gold/board-ui';

import { createInitialState as createFab } from '../../src/games/fab-a-diffy/rules';
import { renderScores as renderFabScores } from '../../src/games/fab-a-diffy/board-ui';

import { createInitialState as createRamrod } from '../../src/games/ramrod/rules';
import { renderBoard as renderRamrodBoard } from '../../src/games/ramrod/board-ui';

import { createInitialState as createStars } from '../../src/games/stars-bars/rules';
import { renderPlayerHand as renderStarsHand } from '../../src/games/stars-bars/board-ui';

import { createInitialState as createJuggle } from '../../src/games/juggle/rules';
import {
  renderBoard as renderJuggleBoard,
  injectJuggleStyles,
  getPlayerName as juggleName,
} from '../../src/games/juggle/board-ui';

afterEach(() => {
  document.body.innerHTML = '';
  vi.restoreAllMocks();
});

describe('Burn wave 11 — Hex board / status / formatPosition', () => {
  it('renderBoard mounts cells; formatPosition; winner status', () => {
    const container = document.createElement('div');
    document.body.appendChild(container);
    const state = createHex(5);
    const clicked: string[] = [];
    renderHexBoard(state, container, (pos) =>
      clicked.push(`${pos.row},${pos.col}`)
    );
    expect(
      container.querySelectorAll('[data-row], .hex-cell').length
    ).toBeGreaterThan(0);
    expect(formatPosition({ row: 2, col: 3 })).toMatch(/2|3/);

    renderHexStatus(state, container);
    expect(container.textContent?.length).toBeGreaterThan(0);
    renderHexStatus({ ...state, winner: 'player1' }, container);
    expect(container.textContent).toMatch(/Win/i);
  });
});

describe('Burn wave 11 — Calla / Queens / Pent board chrome', () => {
  it('Calla renderBoard mounts pits', () => {
    const container = document.createElement('div');
    document.body.appendChild(container);
    renderCallaBoard(createCalla(), container, () => {});
    expect(
      container.querySelectorAll('.calla-pit, .calla-board').length
    ).toBeGreaterThan(0);
  });

  it('Queens inject styles + renderBoard; names distinct', () => {
    injectQGStyles();
    expect(document.getElementById('qg-styles')).toBeTruthy();
    const el = renderQueensBoard(createQueens(), () => {});
    document.body.appendChild(el);
    expect(el.tagName.toLowerCase()).toBe('svg');
    expect(el.querySelectorAll('[data-cell-key]').length).toBeGreaterThan(0);
    expect(queensName('player1')).not.toBe(queensName('player2'));
  });

  it('Pent piece selector click + inject styles', () => {
    injectPentEmInStyles();
    const selected: string[] = [];
    const el = renderPieceSelector(createPent(), (id) => selected.push(id));
    document.body.appendChild(el);
    expect(el.classList.contains('pent-piece-selector')).toBe(true);
    const opt = el.querySelector('.pent-piece-option') as HTMLElement | null;
    expect(opt).toBeTruthy();
    opt!.click();
    expect(selected.length).toBe(1);
    expect(pentName('player1').length).toBeGreaterThan(0);
  });
});

describe('Burn wave 11 — Remainder / Contig / Sum inject + boards', () => {
  it('Remainder scores with points + board + inject', () => {
    injectRemainderIslandsStyles();
    const state = {
      ...createRemainder(),
      player1Score: 12,
      player2Score: 7,
    };
    const scores = renderRemainderScores(state);
    document.body.appendChild(scores);
    expect(scores.classList.contains('remainder-scores')).toBe(true);
    expect(scores.textContent).toMatch(/12|7/);
    expect(remainderName('player1').length).toBeGreaterThan(0);

    const board = renderRemainderBoard(
      state,
      () => {},
      () => {}
    );
    document.body.appendChild(board);
    expect(
      board.querySelectorAll('.remainder-island, [data-island-id]').length
    ).toBeGreaterThan(0);
  });

  it('Contig renderBoard + inject styles', () => {
    injectContigStyles();
    const el = renderContigBoard(createContig(), () => {});
    document.body.appendChild(el);
    expect(el.classList.contains('contig-board')).toBe(true);
    expect(el.querySelectorAll('.contig-cell').length).toBe(60);
  });

  it('Sum hand + board + inject styles', () => {
    injectSDStyles();
    const state = createSum();
    const hand = renderSumHand(state, 'player1', () => {});
    document.body.appendChild(hand);
    expect(hand.classList.contains('sd-hand')).toBe(true);
    expect(hand.children.length).toBeGreaterThan(0);

    const board = renderSumBoard(state, () => {});
    document.body.appendChild(board);
    expect(board.classList.contains('sd-board')).toBe(true);
  });
});

describe('Burn wave 11 — Star / Frac / Pinball secondary chrome', () => {
  it('Star Track renderBoard draws CTA', () => {
    const container = document.createElement('div');
    document.body.appendChild(container);
    let drew = 0;
    renderStarBoard(createStar(), container, () => {
      drew++;
    });
    const btn = container.querySelector(
      '.star-track-draw-btn'
    ) as HTMLButtonElement | null;
    expect(btn).toBeTruthy();
    btn!.click();
    expect(drew).toBe(1);
  });

  it('Frac scores + answer choices with injected problem', () => {
    injectFracFactStyles();
    const problem = {
      id: 'w11-ui',
      operand1: { numerator: 1, denominator: 2 },
      operand2: { numerator: 1, denominator: 4 },
      operation: 'add' as const,
      correctAnswer: { numerator: 3, denominator: 4 },
      answerChoices: [
        { numerator: 3, denominator: 4 },
        { numerator: 1, denominator: 2 },
        { numerator: 1, denominator: 4 },
        { numerator: 1, denominator: 1 },
      ],
    };
    const base = createFrac('easy');
    const state = {
      ...base,
      phase: 'playing' as const,
      currentProblem: problem,
      player1Stats: { ...base.player1Stats, score: 2 },
      player2Stats: { ...base.player2Stats, score: 1 },
    };
    const scores = renderFracScores(state);
    document.body.appendChild(scores);
    expect(scores.classList.contains('frac-scores')).toBe(true);

    const picked: string[] = [];
    const choices = renderAnswerChoices(state, (a) =>
      picked.push(`${a.numerator}/${a.denominator}`)
    );
    document.body.appendChild(choices);
    const btn = choices.querySelector(
      'button, .frac-choice-btn'
    ) as HTMLElement | null;
    expect(btn).toBeTruthy();
    btn!.click();
    expect(picked.length).toBe(1);
  });

  it('Pinball challenge + scores + inject', () => {
    injectFractionPinballStyles();
    const challenge = {
      id: 'w11-pc',
      type: 'fractionToDecimal' as const,
      fraction: { numerator: 1, denominator: 2 },
      decimal: 0.5,
      answerChoices: ['0.5', '0.25', '0.75', '1'],
      correctAnswer: '0.5',
    };
    const state = {
      ...createPinball(),
      phase: 'answering' as const,
      currentChallenge: challenge,
    };
    const challengeEl = renderChallenge(state, () => {});
    document.body.appendChild(challengeEl);
    expect(challengeEl.classList.contains('pinball-challenge')).toBe(true);
    const scores = renderPinballScores(state);
    document.body.appendChild(scores);
    expect(scores.classList.contains('pinball-scores')).toBe(true);
  });
});

describe('Burn wave 11 — FIAR / Kwatro / Par / Prime / Fab / Ramrod / Stars / Juggle', () => {
  it('FIAR board SVG mounts nodes', () => {
    const el = renderFiarBoard(createFiar(), () => {});
    document.body.appendChild(el);
    expect(
      el.querySelectorAll('[data-node-id], .fiar-node, circle').length
    ).toBeGreaterThan(0);
  });

  it('Kwatro board mounts chips', () => {
    const el = renderKwaBoard(
      createKwa(),
      () => {},
      () => {}
    );
    document.body.appendChild(el);
    expect(el.classList.contains('kwa-board')).toBe(true);
  });

  it('Par scores + board', () => {
    const state = createPar();
    const scores = renderParScores(state);
    document.body.appendChild(scores);
    expect(scores.classList.contains('par55-scores')).toBe(true);
    const board = renderParBoard(state, () => {});
    document.body.appendChild(board);
    expect(board.classList.contains('par55-board')).toBe(true);
  });

  it('Prime dice roll CTA fires', () => {
    let rolled = 0;
    const dice = renderPrimeDice(createPrime(), () => {
      rolled++;
    });
    document.body.appendChild(dice);
    const btn = dice.querySelector('.pg-roll-btn') as HTMLButtonElement | null;
    expect(btn).toBeTruthy();
    btn!.click();
    expect(rolled).toBe(1);
  });

  it('Fab scores shell', () => {
    const scores = renderFabScores(createFab());
    document.body.appendChild(scores);
    expect(scores.classList.contains('fab-scores')).toBe(true);
  });

  it('Ramrod board mounts boxes', () => {
    const el = renderRamrodBoard(createRamrod(), () => {});
    document.body.appendChild(el);
    expect(
      el.classList.contains('ramrod-board') || el.querySelector('.ramrod-box')
    ).toBeTruthy();
  });

  it('Stars hand mounts cards', () => {
    const hand = renderStarsHand(createStars(), 'player1', () => {});
    document.body.appendChild(hand);
    expect(hand.classList.contains('stars-hand-container')).toBe(true);
    expect(hand.children.length).toBeGreaterThan(0);
  });

  it('Juggle boards + inject + names', () => {
    injectJuggleStyles();
    const state = createJuggle();
    const el = renderJuggleBoard(
      state.boards.player1,
      'player1',
      true,
      state,
      () => {},
      () => {},
      () => {}
    );
    document.body.appendChild(el);
    expect(el.classList.contains('juggle-board')).toBe(true);
    expect(juggleName('player1')).not.toBe(juggleName('player2'));
  });
});
