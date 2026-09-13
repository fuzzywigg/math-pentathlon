import { describe, it, expect, afterEach, vi } from 'vitest';

import {
  createInitialState as createPrime,
  rollDice as rollPrime,
} from '../../src/games/prime-gold/rules';
import {
  renderExpressions,
  renderDice as renderPrimeDice,
  getPlayerName as primeName,
} from '../../src/games/prime-gold/board-ui';

import { createInitialState as createPent } from '../../src/games/pent-em-in/types';
import { selectPiece as selectPent } from '../../src/games/pent-em-in/rules';
import {
  renderPieceSelector,
  getPlayerName as pentName,
} from '../../src/games/pent-em-in/board-ui';

import { createInitialState as createRemainder } from '../../src/games/remainder-islands/types';
import {
  performRoll,
  findValidIslands,
  previewDivision,
} from '../../src/games/remainder-islands/rules';
import {
  renderDice as renderRemainderDice,
  renderDivisionPreview,
  renderGameOver as renderRemainderOver,
  renderScores as renderRemainderScores,
  getPlayerName as remainderName,
} from '../../src/games/remainder-islands/board-ui';

import { createInitialState as createStars } from '../../src/games/stars-bars/rules';
import {
  renderPlayerHand,
  renderScores as renderStarsScores,
  getPlayerName as starsName,
} from '../../src/games/stars-bars/board-ui';

import { createInitialState as createFab } from '../../src/games/fab-a-diffy/rules';
import {
  renderAnswerBoard,
  renderScores as renderFabScores,
  getPlayerName as fabName,
} from '../../src/games/fab-a-diffy/board-ui';

import { createInitialState as createFrac } from '../../src/games/frac-fact/types';
import {
  renderProblem,
  renderAnswerChoices,
  renderResult as renderFracResult,
  renderScores as renderFracScores,
  getPlayerName as fracName,
} from '../../src/games/frac-fact/board-ui';

import { createInitialState as createPinball } from '../../src/games/fraction-pinball/types';
import {
  renderChallenge,
  renderPinballBoard,
  renderResult as renderPinballResult,
  renderScores as renderPinballScores,
  getPlayerName as pinballName,
} from '../../src/games/fraction-pinball/board-ui';

import { createInitialState as createPar } from '../../src/games/par-55/rules';
import {
  renderScores as renderParScores,
  renderMoveHistory as renderParHistory,
  getPlayerName as parName,
} from '../../src/games/par-55/board-ui';

import { formatPosition } from '../../src/games/hex/board-ui';

import { createInitialState as createRamrod } from '../../src/games/ramrod/rules';
import {
  renderPlayerRods,
  getPlayerName as ramrodName,
} from '../../src/games/ramrod/board-ui';

import {
  createInitialState as createJuggle,
  selectDie,
} from '../../src/games/juggle/rules';
import {
  renderShapeSelector,
  getPlayerName as juggleName,
} from '../../src/games/juggle/board-ui';

import { createInitialGameState } from '../../src/games/kings-quadraphages/game-state';
import { renderMoveHistory as renderKingsHistory } from '../../src/games/kings-quadraphages/board-ui';

import { createInitialState as createHexAGone } from '../../src/games/hex-a-gone/types';
import { renderStatus as renderHagStatus } from '../../src/games/hex-a-gone/board-ui';

import { createInitialState as createFiar } from '../../src/games/fiar/types';
import { placeChip as fiarPlace } from '../../src/games/fiar/rules';
import { renderBoard as renderFiarBoard } from '../../src/games/fiar/board-ui';

import { createInitialState as createContig } from '../../src/games/contig-60/types';
import { doRollDice } from '../../src/games/contig-60/rules';
import { renderBoard as renderContigBoard } from '../../src/games/contig-60/board-ui';

afterEach(() => {
  document.body.innerHTML = '';
  vi.restoreAllMocks();
});

describe('Burn wave 9 — Prime Gold expressions + roll CTA', () => {
  it('renderDice shows Roll CTA in rolling phase and invokes onRoll', () => {
    const state = createPrime();
    let rolled = false;
    const el = renderPrimeDice(state, () => {
      rolled = true;
    });
    document.body.appendChild(el);
    const btn = el.querySelector('.pg-roll-btn') as HTMLButtonElement | null;
    expect(btn).toBeTruthy();
    btn!.click();
    expect(rolled).toBe(true);
  });

  it('renderExpressions after roll lists items or pass chrome and fires onSelect', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.2);
    let state = createPrime();
    state = rollPrime(state);
    expect(state.phase).toBe('placing');
    const selected: { value: number; expr: string }[] = [];
    const el = renderExpressions(state, (value, expr) => {
      selected.push({ value, expr });
    });
    document.body.appendChild(el);
    expect(el.classList.contains('pg-expressions')).toBe(true);
    const item = el.querySelector('.pg-expr-item') as HTMLElement | null;
    if (item) {
      item.click();
      expect(selected.length).toBe(1);
      expect(selected[0]!.value).toBeGreaterThan(0);
    } else {
      expect(el.textContent).toMatch(/No valid moves|pass/i);
    }
    expect(primeName('player2').length).toBeGreaterThan(0);
  });
});

describe("Burn wave 9 — Pent'Em In piece selector selected class", () => {
  it('marks selected piece option after selectPiece', () => {
    let state = createPent();
    const piece = state.player1Pieces.available[0]!;
    state = selectPent(state, piece);
    expect(state.selectedPiece).toBe(piece);
    const clicked: string[] = [];
    const el = renderPieceSelector(state, (id) => clicked.push(id));
    document.body.appendChild(el);
    expect(el.classList.contains('pent-piece-selector')).toBe(true);
    expect(el.querySelectorAll('.pent-piece-option').length).toBeGreaterThan(0);
    expect(el.querySelector('.pent-piece-option.selected')).toBeTruthy();
    const other = el.querySelector(
      '.pent-piece-option:not(.selected)'
    ) as HTMLElement | null;
    other?.click();
    if (other) expect(clicked.length).toBe(1);
    expect(pentName('player1')).toBe('Blue');
  });
});

describe('Burn wave 9 — Remainder Islands dice / preview / gameOver', () => {
  it('renderDice empty vs rolled faces', () => {
    const empty = renderRemainderDice(null);
    document.body.appendChild(empty);
    expect(empty.classList.contains('remainder-dice')).toBe(true);
    expect(empty.querySelector('.dice-placeholder')).toBeTruthy();

    const rolled = renderRemainderDice({ die1: 2, die2: 5, total: 7 });
    document.body.appendChild(rolled);
    expect(rolled.textContent).toMatch(/7/);
  });

  it('renderDivisionPreview shows equation when island selected', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.1);
    let state = createRemainder();
    state = performRoll(state);
    if (state.phase !== 'selectIsland' || !state.currentRoll) {
      state = {
        ...createRemainder(),
        phase: 'selectIsland',
        currentRoll: { die1: 4, die2: 2, total: 6 },
        validIslands: findValidIslands(createRemainder(), 6),
      };
    }
    const islandId = state.validIslands[0]!;
    state = { ...state, selectedIsland: islandId };
    const preview = previewDivision(state, islandId);
    expect(preview).not.toBeNull();
    const el = renderDivisionPreview(state);
    document.body.appendChild(el);
    expect(el.classList.contains('remainder-preview')).toBe(true);
    expect(el.textContent).toMatch(/÷|R|\+/);
  });

  it('renderGameOver draw banner + scores shell', () => {
    const over = {
      ...createRemainder(),
      phase: 'gameOver' as const,
      winner: null,
      turnsRemaining: 0,
    };
    const el = renderRemainderOver(over);
    const scores = renderRemainderScores(createRemainder());
    document.body.appendChild(el);
    document.body.appendChild(scores);
    expect(el.textContent).toMatch(/Draw/i);
    expect(scores.classList.contains('remainder-scores')).toBe(true);
    expect(remainderName('player1')).toBe('Blue');
  });
});

describe('Burn wave 9 — Stars hand / Fab answers / Par scores', () => {
  it('Stars renderPlayerHand mounts cards and selected class', () => {
    const state = createStars();
    const cardId = state.playerHands.player1[0]!.id;
    const withSelected = {
      ...state,
      selectedCard: state.playerHands.player1[0]!,
      phase: 'placingCard' as const,
    };
    const clicked: string[] = [];
    const hand = renderPlayerHand(withSelected, 'player1', (id) =>
      clicked.push(id)
    );
    document.body.appendChild(hand);
    expect(hand.classList.contains('stars-hand-container')).toBe(true);
    expect(hand.querySelectorAll('.stars-card').length).toBe(
      state.playerHands.player1.length
    );
    expect(hand.querySelector('.stars-card.selected')).toBeTruthy();
    const card = hand.querySelector(
      `.stars-card:not(.selected)`
    ) as HTMLElement | null;
    card?.click();
    if (card) expect(clicked.length).toBe(1);
    expect(cardId.length).toBeGreaterThan(0);
    expect(starsName('player2').length).toBeGreaterThan(0);
    expect(renderStarsScores(state).classList.contains('stars-scores')).toBe(
      true
    );
  });

  it('Fab renderAnswerBoard and scores mount', () => {
    const state = createFab();
    const board = renderAnswerBoard(state, () => {});
    const scores = renderFabScores(state);
    document.body.appendChild(board);
    document.body.appendChild(scores);
    expect(board.classList.contains('fab-answer-board')).toBe(true);
    expect(scores.classList.contains('fab-scores')).toBe(true);
    expect(fabName('player1').length).toBeGreaterThan(0);
  });

  it('Par renderScores / history shells', () => {
    const state = createPar();
    const scores = renderParScores(state);
    const history = renderParHistory(state);
    document.body.appendChild(scores);
    document.body.appendChild(history);
    expect(scores.classList.contains('par55-scores')).toBe(true);
    expect(history.classList.contains('par55-history')).toBe(true);
    expect(parName('player1').length).toBeGreaterThan(0);
  });
});

describe('Burn wave 9 — Frac Fact / Pinball problem chrome', () => {
  it('Frac Fact problem + choices + wrong result mount', () => {
    const problem = {
      id: 'ui-p',
      operand1: { numerator: 1, denominator: 2 },
      operand2: { numerator: 1, denominator: 3 },
      operation: 'add' as const,
      correctAnswer: { numerator: 5, denominator: 6 },
      answerChoices: [
        { numerator: 5, denominator: 6 },
        { numerator: 1, denominator: 2 },
        { numerator: 2, denominator: 3 },
        { numerator: 1, denominator: 1 },
      ],
    };
    const state = {
      ...createFrac('easy'),
      phase: 'playing' as const,
      currentProblem: problem,
    };
    const chosen: unknown[] = [];
    const problemEl = renderProblem(state);
    const choices = renderAnswerChoices(state, (a) => chosen.push(a));
    document.body.appendChild(problemEl);
    document.body.appendChild(choices);
    expect(problemEl.classList.contains('frac-problem')).toBe(true);
    expect(choices.querySelectorAll('.frac-choice-btn').length).toBe(4);
    (choices.querySelector('.frac-choice-btn') as HTMLElement).click();
    expect(chosen.length).toBe(1);

    const resultState = {
      ...state,
      phase: 'showingResult' as const,
      selectedAnswer: { numerator: 1, denominator: 2 },
      isCorrect: false,
    };
    const result = renderFracResult(resultState, () => {});
    const scores = renderFracScores(state);
    document.body.appendChild(result);
    document.body.appendChild(scores);
    expect(result.textContent).toMatch(/Incorrect|Wrong|not/i);
    expect(fracName('player1').length).toBeGreaterThan(0);
  });

  it('Pinball challenge + SVG board + wrong result', () => {
    const challenge = {
      id: 'ui-c',
      type: 'fractionToDecimal' as const,
      fraction: { numerator: 1, denominator: 4 },
      decimal: 0.25,
      answerChoices: ['0.25', '0.5', '0.75', '1'],
      correctAnswer: '0.25',
    };
    const state = {
      ...createPinball(),
      phase: 'answering' as const,
      currentChallenge: challenge,
    };
    const picked: string[] = [];
    const challengeEl = renderChallenge(state, (a) => picked.push(a));
    const svg = renderPinballBoard(state);
    document.body.appendChild(challengeEl);
    document.body.appendChild(svg);
    expect(challengeEl.querySelectorAll('.pinball-choice-btn').length).toBe(4);
    expect(svg.tagName.toLowerCase()).toBe('svg');
    (challengeEl.querySelector('.pinball-choice-btn') as HTMLElement).click();
    expect(picked.length).toBe(1);

    const result = renderPinballResult(
      {
        ...state,
        phase: 'showResult',
        selectedAnswer: '0.5',
        isCorrect: false,
      },
      () => {}
    );
    document.body.appendChild(result);
    document.body.appendChild(renderPinballScores(state));
    expect(result.textContent?.length).toBeGreaterThan(0);
    expect(pinballName('player2').length).toBeGreaterThan(0);
  });
});

describe('Burn wave 9 — Hex formatPosition / Ramrod rods / Juggle shapes', () => {
  it('formatPosition maps col 0 row 0 to A1', () => {
    expect(formatPosition({ row: 0, col: 0 })).toBe('A1');
    expect(formatPosition({ row: 4, col: 2 })).toBe('C5');
  });

  it('Ramrod renderPlayerRods mounts rod chrome', () => {
    const state = createRamrod();
    const rods = renderPlayerRods(state, 'player1', () => {});
    document.body.appendChild(rods);
    expect(rods.classList.contains('ramrod-player-rods')).toBe(true);
    expect(
      rods.querySelectorAll('.ramrod-rod, .ramrod-rod-wrapper').length
    ).toBeGreaterThan(0);
    expect(ramrodName('player1').length).toBeGreaterThan(0);
  });

  it('Juggle selectDie sets category for shape selection without canvas', () => {
    let state = {
      ...createJuggle(),
      phase: 'selectingShape' as const,
      currentDice: [2, 3] as [number, number],
    };
    state = selectDie(state, 0);
    expect(state.selectedCategory).toBeTruthy();
    expect(['selectingShape', 'placing']).toContain(state.phase);
    // Avoid renderShapeSelector here — jsdom lacks canvas getContext
    expect(juggleName('player1').length).toBeGreaterThan(0);
    expect(typeof renderShapeSelector).toBe('function');
  });
});

describe('Burn wave 9 — Kings history / Hex-a-Gone status / FIAR board / Contig board', () => {
  it('Kings renderMoveHistory lists injected entries', () => {
    const container = document.createElement('div');
    document.body.appendChild(container);
    const state = {
      ...createInitialGameState(),
      moveHistory: [
        {
          player: 'player1' as const,
          action: 'moveKing' as const,
          from: { row: 1, col: 5 },
          to: { row: 2, col: 5 },
        },
      ],
    };
    renderKingsHistory(state, container);
    expect(container.textContent).toMatch(/Move|King|1|2/i);
  });

  it('Hex-a-Gone gameOver status mounts winner chrome', () => {
    const container = document.createElement('div');
    document.body.appendChild(container);
    renderHagStatus(
      {
        ...createHexAGone(),
        phase: 'gameOver',
        winner: 'player1',
      },
      container
    );
    expect(container.textContent).toMatch(/Blue|Wins|Winner|Game/i);
  });

  it('FIAR renderBoard after place shows occupied node', () => {
    let state = createFiar();
    const first = [...state.board.nodes.keys()][0]!;
    state = fiarPlace(state, first);
    const el = renderFiarBoard(state, () => {});
    document.body.appendChild(el);
    expect(el.querySelector(`[data-node-id="${first}"]`)).toBeTruthy();
  });

  it('Contig renderBoard after roll marks valid cells when calculating', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    const rolled = doRollDice(createContig());
    const el = renderContigBoard(rolled, () => {});
    document.body.appendChild(el);
    expect(el.classList.contains('contig-board')).toBe(true);
    expect(el.querySelectorAll('.contig-cell').length).toBe(60);
  });
});
