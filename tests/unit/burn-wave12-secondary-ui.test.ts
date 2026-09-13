import { describe, it, expect, afterEach, vi } from 'vitest';

import { createInitialState as createContig } from '../../src/games/contig-60/types';
import {
  renderDice as renderContigDice,
  renderExpressionSelector,
  getPlayerName as contigName,
} from '../../src/games/contig-60/board-ui';

import { createInitialState as createHexAGone } from '../../src/games/hex-a-gone/types';
import {
  renderBoard as renderHagBoard,
  renderStatus as renderHagStatus,
} from '../../src/games/hex-a-gone/board-ui';
import { getPhaseMessage as hagPhase } from '../../src/games/hex-a-gone/rules';

import { createInitialGameState as createKings } from '../../src/games/kings-quadraphages/game-state';
import {
  renderBoard as renderKingsBoard,
  renderStatus as renderKingsStatus,
  renderMoveHistory as renderKingsHistory,
} from '../../src/games/kings-quadraphages/board-ui';

import { createInitialState as createFab } from '../../src/games/fab-a-diffy/rules';
import {
  renderAnswerBoard,
  renderOperationSelector,
  injectFabStyles,
  getPlayerName as fabName,
} from '../../src/games/fab-a-diffy/board-ui';

import { createInitialState as createCalla } from '../../src/games/calla/types';
import { renderStatus as renderCallaStatus } from '../../src/games/calla/board-ui';
import { getPhaseMessage as callaPhase } from '../../src/games/calla/rules';

import { createInitialState as createStar } from '../../src/games/star-track/types';
import { renderStatus as renderStarStatus } from '../../src/games/star-track/board-ui';
import { getPhaseMessage as starPhase } from '../../src/games/star-track/rules';

import { createInitialState as createFrac } from '../../src/games/frac-fact/types';
import {
  renderProblem,
  renderResult as renderFracResult,
  renderGameOver as renderFracOver,
  getPlayerName as fracName,
} from '../../src/games/frac-fact/board-ui';

import { createInitialState as createPinball } from '../../src/games/fraction-pinball/types';
import {
  renderResult as renderPinballResult,
  renderGameOver as renderPinballOver,
  renderPinballBoard,
  getPlayerName as pinballName,
} from '../../src/games/fraction-pinball/board-ui';

import { createInitialState as createRemainder } from '../../src/games/remainder-islands/types';
import {
  renderDice as renderRemainderDice,
  renderDivisionPreview,
  renderGameOver as renderRemainderOver,
} from '../../src/games/remainder-islands/board-ui';

import { createInitialState as createPar } from '../../src/games/par-55/rules';
import {
  renderHand as renderParHand,
  renderMoveHistory as renderParHistory,
  injectPar55Styles,
  getPlayerName as parName,
} from '../../src/games/par-55/board-ui';

import { createInitialState as createPrime } from '../../src/games/prime-gold/rules';
import {
  renderBoard as renderPrimeBoard,
  renderExpressions,
  injectPrimeGoldStyles,
  getPlayerName as primeName,
} from '../../src/games/prime-gold/board-ui';

import { createInitialState as createRamrod } from '../../src/games/ramrod/rules';
import {
  renderPlayerRods,
  renderMoveHistory as renderRamrodHistory,
  injectRamrodStyles,
  getPlayerName as ramrodName,
} from '../../src/games/ramrod/board-ui';

import { createInitialState as createStars } from '../../src/games/stars-bars/rules';
import {
  renderBoard as renderStarsBoard,
  renderScores as renderStarsScores,
  injectStarsStyles,
  getPlayerName as starsName,
} from '../../src/games/stars-bars/board-ui';

import { createInitialState as createKwa } from '../../src/games/kwatro-sinko/rules';
import {
  renderMoveHistory as renderKwaHistory,
  injectKwaStyles,
  getPlayerName as kwaName,
} from '../../src/games/kwatro-sinko/board-ui';

import { createInitialState as createFiar } from '../../src/games/fiar/types';
import {
  injectFiarStyles,
  getPlayerName as fiarName,
  getPlayerColor as fiarColor,
} from '../../src/games/fiar/board-ui';

import {
  createInitialState as createJuggle,
  doRollDice as juggleRoll,
  selectDie,
  selectShape,
} from '../../src/games/juggle/rules';
import {
  renderDice as renderJuggleDice,
  renderShapeSelector,
  renderShapeControls,
} from '../../src/games/juggle/board-ui';
import { getShapesForDie } from '../../src/games/juggle/types';

import { createInitialState as createHex } from '../../src/games/hex/types';
import { renderStatus as renderHexStatus } from '../../src/games/hex/board-ui';

import { getPlayerName as queensName } from '../../src/games/queens-guards/board-ui';

import { createInitialState as createPent } from '../../src/games/pent-em-in/types';
import {
  renderBoard as renderPentBoard,
  getPlayerName as pentName,
} from '../../src/games/pent-em-in/board-ui';

import { createInitialState as createSum } from '../../src/games/sum-dominoes/rules';
import {
  renderDice as renderSumDice,
  getPlayerName as sumName,
} from '../../src/games/sum-dominoes/board-ui';

afterEach(() => {
  document.body.innerHTML = '';
  vi.restoreAllMocks();
});

describe('Burn wave 12 — Contig dice / expressions / names', () => {
  it('renderDice roll CTA; expression selector with dice; names distinct', () => {
    let rolled = 0;
    const dice = renderContigDice(null, () => {
      rolled++;
    }, true);
    document.body.appendChild(dice);
    const btn = dice.querySelector(
      '.contig-roll-btn'
    ) as HTMLButtonElement | null;
    expect(btn).toBeTruthy();
    btn!.click();
    expect(rolled).toBe(1);

    const withDice = {
      ...createContig(),
      phase: 'calculating' as const,
      currentDice: [2, 3, 4] as [number, number, number],
    };
    const exprs = renderExpressionSelector(
      withDice,
      () => {},
      () => {}
    );
    document.body.appendChild(exprs);
    expect(exprs.classList.contains('contig-expressions')).toBe(true);
    expect(contigName('player1')).not.toBe(contigName('player2'));
  });
});

describe('Burn wave 12 — Hex-a-Gone / Kings board chrome', () => {
  it('Hex-a-Gone board + status phase text', () => {
    const container = document.createElement('div');
    const status = document.createElement('div');
    document.body.appendChild(container);
    document.body.appendChild(status);
    const state = createHexAGone();
    renderHagBoard(state, container, () => {}, () => {});
    expect(
      container.querySelectorAll('.hex-a-gone-board, .hex-a-gone-cell').length
    ).toBeGreaterThan(0);
    renderHagStatus(state, status);
    expect(status.textContent?.length).toBeGreaterThan(0);
    expect(hagPhase(state).length).toBeGreaterThan(0);
  });

  it('Kings board / status / history mount', () => {
    const state = createKings();
    const board = document.createElement('div');
    const status = document.createElement('div');
    const history = document.createElement('div');
    history.id = 'move-history';
    document.body.appendChild(board);
    document.body.appendChild(status);
    document.body.appendChild(history);
    renderKingsBoard(state, board, () => {});
    expect(board.querySelectorAll('.cell, .board').length).toBeGreaterThan(0);
    renderKingsStatus(state, status);
    expect(status.textContent?.length).toBeGreaterThan(0);
    renderKingsHistory(state, history);
    expect(history.textContent?.length).toBeGreaterThan(0);
  });
});

describe('Burn wave 12 — Fab answer board / ops / inject', () => {
  it('inject styles; answer board + op selector; names', () => {
    injectFabStyles();
    expect(document.getElementById('fab-styles')).toBeTruthy();
    const state = createFab();
    const answers = renderAnswerBoard(state, () => {});
    document.body.appendChild(answers);
    expect(answers.classList.contains('fab-answer-board')).toBe(true);
    const ops = renderOperationSelector(state, () => {});
    document.body.appendChild(ops);
    expect(ops.classList.contains('fab-operation-selector')).toBe(true);
    expect(fabName('player1')).not.toBe(fabName('player2'));
  });
});

describe('Burn wave 12 — Calla / Star / Hex status messages', () => {
  it('Calla status mirrors phase message', () => {
    const container = document.createElement('div');
    document.body.appendChild(container);
    const state = createCalla();
    renderCallaStatus(state, container);
    expect(container.textContent?.length).toBeGreaterThan(0);
    expect(callaPhase(state).length).toBeGreaterThan(0);
  });

  it('Star Track status + Hex status', () => {
    const starBox = document.createElement('div');
    const hexBox = document.createElement('div');
    document.body.appendChild(starBox);
    document.body.appendChild(hexBox);
    const star = createStar();
    renderStarStatus(star, starBox);
    expect(starBox.textContent?.length).toBeGreaterThan(0);
    expect(starPhase(star).length).toBeGreaterThan(0);
    renderHexStatus(createHex(5), hexBox);
    expect(hexBox.textContent?.length).toBeGreaterThan(0);
  });
});

describe('Burn wave 12 — Frac / Pinball problem-result-over', () => {
  it('Frac problem / result / gameOver banners', () => {
    const problem = {
      id: 'w12-f',
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
    const playing = {
      ...createFrac('easy'),
      phase: 'playing' as const,
      currentProblem: problem,
    };
    const problemEl = renderProblem(playing);
    document.body.appendChild(problemEl);
    expect(problemEl.classList.contains('frac-problem')).toBe(true);

    const resultState = {
      ...playing,
      phase: 'showingResult' as const,
      isCorrect: true,
      selectedAnswer: problem.correctAnswer,
    };
    const resultEl = renderFracResult(resultState, () => {});
    document.body.appendChild(resultEl);
    expect(resultEl.textContent?.length).toBeGreaterThan(0);

    const over = renderFracOver({
      ...createFrac('easy'),
      phase: 'gameOver' as const,
      winner: 'player1' as const,
    });
    document.body.appendChild(over);
    expect(over.textContent).toMatch(/Win|Blue|Player/i);
    expect(fracName('player1').length).toBeGreaterThan(0);
  });

  it('Pinball result / gameOver / board SVG', () => {
    const challenge = {
      id: 'w12-p',
      type: 'fractionToDecimal' as const,
      fraction: { numerator: 1, denominator: 2 },
      decimal: 0.5,
      answerChoices: ['0.5', '0.25', '0.75', '1'],
      correctAnswer: '0.5',
    };
    const state = {
      ...createPinball(),
      phase: 'showResult' as const,
      currentChallenge: challenge,
      isCorrect: true,
      selectedAnswer: '0.5',
    };
    const result = renderPinballResult(state, () => {});
    document.body.appendChild(result);
    expect(result.textContent?.length).toBeGreaterThan(0);

    const over = renderPinballOver({
      ...createPinball(),
      phase: 'gameOver' as const,
      winner: 'player2' as const,
    });
    document.body.appendChild(over);
    expect(over.textContent).toMatch(/Win|Red|Player/i);

    const board = renderPinballBoard(createPinball());
    document.body.appendChild(board);
    expect(board.tagName.toLowerCase()).toBe('svg');
    expect(pinballName('player1')).not.toBe(pinballName('player2'));
  });
});

describe('Burn wave 12 — Remainder dice / preview / gameOver', () => {
  it('dice null chrome; division preview; gameOver', () => {
    const dice = renderRemainderDice(null);
    document.body.appendChild(dice);
    expect(dice.classList.contains('remainder-dice')).toBe(true);

    const base = createRemainder();
    const withRoll = {
      ...base,
      phase: 'selectIsland' as const,
      currentRoll: { die1: 3, die2: 3, total: 6 },
      validIslands: base.islands.slice(0, 2).map((i) => i.id),
      selectedIsland: base.islands[0]!.id,
    };
    const preview = renderDivisionPreview(withRoll);
    document.body.appendChild(preview);
    expect(preview.classList.contains('remainder-preview')).toBe(true);

    const over = renderRemainderOver({
      ...base,
      phase: 'gameOver' as const,
      winner: 'player1' as const,
    });
    document.body.appendChild(over);
    expect(over.textContent).toMatch(/Win|Blue|Player/i);
  });
});

describe('Burn wave 12 — Par / Prime / Ramrod / Stars inject chrome', () => {
  it('Par hand + history + inject + names', () => {
    injectPar55Styles();
    expect(document.getElementById('par55-styles')).toBeTruthy();
    const state = createPar();
    const hand = renderParHand(state, 'player1', () => {});
    document.body.appendChild(hand);
    expect(hand.classList.contains('par55-hand')).toBe(true);
    const history = renderParHistory(state);
    document.body.appendChild(history);
    expect(history.classList.contains('par55-history')).toBe(true);
    expect(parName('player1').length).toBeGreaterThan(0);
  });

  it('Prime board + expressions + inject', () => {
    injectPrimeGoldStyles();
    expect(document.head.querySelectorAll('style').length).toBeGreaterThan(0);
    const state = createPrime();
    const board = renderPrimeBoard(state, () => {});
    document.body.appendChild(board);
    expect(board.querySelector('.pg-board')).toBeTruthy();
    const exprs = renderExpressions(state, () => {});
    document.body.appendChild(exprs);
    expect(exprs.classList.contains('pg-expressions')).toBe(true);
    expect(primeName('player1')).not.toBe(primeName('player2'));
  });

  it('Ramrod rods + history + inject', () => {
    injectRamrodStyles();
    expect(document.getElementById('ramrod-styles')).toBeTruthy();
    const state = createRamrod();
    const rods = renderPlayerRods(state, 'player1', () => {});
    document.body.appendChild(rods);
    expect(rods.classList.contains('ramrod-player-rods')).toBe(true);
    const history = renderRamrodHistory(state);
    document.body.appendChild(history);
    expect(history.classList.contains('ramrod-history')).toBe(true);
    expect(ramrodName('player1').length).toBeGreaterThan(0);
  });

  it('Stars board + scores + inject', () => {
    injectStarsStyles();
    expect(document.head.querySelectorAll('style').length).toBeGreaterThan(0);
    const state = createStars();
    const board = renderStarsBoard(state, () => {});
    document.body.appendChild(board);
    expect(board.querySelector('.stars-board')).toBeTruthy();
    const scores = renderStarsScores(state);
    document.body.appendChild(scores);
    expect(scores.classList.contains('stars-scores')).toBe(true);
    expect(starsName('player1')).not.toBe(starsName('player2'));
  });
});

describe('Burn wave 12 — Kwa / FIAR / Queens / Pent / Sum chrome', () => {
  it('Kwatro history + inject + names', () => {
    injectKwaStyles();
    expect(document.getElementById('kwa-styles')).toBeTruthy();
    const history = renderKwaHistory(createKwa());
    document.body.appendChild(history);
    expect(history.classList.contains('kwa-history')).toBe(true);
    expect(kwaName('player1').length).toBeGreaterThan(0);
  });

  it('FIAR inject + color/name helpers', () => {
    injectFiarStyles();
    expect(document.getElementById('fiar-styles')).toBeTruthy();
    expect(fiarName('player1')).not.toBe(fiarName('player2'));
    expect(fiarColor('player1')).not.toBe(fiarColor('player2'));
    expect(createFiar().phase).toBe('placement');
  });

  it('Queens / Pent / Sum name helpers + boards', () => {
    expect(queensName('player1')).not.toBe(queensName('player2'));
    const pent = renderPentBoard(
      createPent(),
      () => {},
      () => {}
    );
    document.body.appendChild(pent);
    expect(pent.tagName.toLowerCase()).toBe('svg');
    expect(pentName('player1').length).toBeGreaterThan(0);

    let rolled = 0;
    const dice = renderSumDice(null, () => {
      rolled++;
    }, true);
    document.body.appendChild(dice);
    const btn = dice.querySelector('.sd-roll-btn') as HTMLButtonElement | null;
    expect(btn).toBeTruthy();
    btn!.click();
    expect(rolled).toBe(1);
    expect(sumName('player1')).not.toBe(sumName('player2'));
    expect(createSum().phase).toBe('rolling');
  });
});

describe('Burn wave 12 — Juggle dice / shape selector / controls', () => {
  it('dice CTA; after roll shape controls when placing', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.2);
    // jsdom has no canvas — stub getContext for shape preview paints
    HTMLCanvasElement.prototype.getContext = vi.fn().mockReturnValue({
      fillStyle: '',
      strokeStyle: '',
      fillRect: vi.fn(),
      strokeRect: vi.fn(),
      clearRect: vi.fn(),
    }) as unknown as typeof HTMLCanvasElement.prototype.getContext;

    let rolled = 0;
    const dice = renderJuggleDice(
      null,
      () => {
        rolled++;
      },
      () => {},
      true,
      'rolling'
    );
    document.body.appendChild(dice);
    const btn = dice.querySelector(
      '.juggle-roll-btn, button'
    ) as HTMLButtonElement | null;
    expect(btn).toBeTruthy();
    btn!.click();
    expect(rolled).toBe(1);

    let state = juggleRoll(createJuggle());
    state = selectDie(state, 0);
    if (state.selectedCategory) {
      const options = getShapesForDie(state.currentDice![0]!);
      const selector = renderShapeSelector(state, () => {});
      document.body.appendChild(selector);
      expect(selector.classList.contains('juggle-shape-selector')).toBe(true);
      if (options.length > 0) {
        state = selectShape(state, options[0]!);
        const controls = renderShapeControls(
          state,
          () => {},
          () => {}
        );
        document.body.appendChild(controls);
        expect(controls.classList.contains('juggle-shape-controls')).toBe(true);
      }
    }
  });
});
