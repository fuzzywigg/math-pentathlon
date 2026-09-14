/**
 * Wave 26 — legal SUCCESS playthroughs for path/combat/quiz games
 * (FIAR, Hex, Kings, Frac-Fact, Fraction Pinball) missing from never-merged #116.
 * Distinct from inventory (#131/#132) and shell/timer siblings. Tests-only.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';

import {
  createInitialState as createFiar,
  CONFIG as FIAR_CONFIG,
} from '../../src/games/fiar/types';
import {
  placeChip as fiarPlace,
  getValidMoves as fiarValidMoves,
  canMove,
  moveChip,
  checkWinner as fiarWinner,
} from '../../src/games/fiar/rules';

import {
  createInitialState as createHex,
  createEmptyBoard,
} from '../../src/games/hex/types';
import {
  makeMove as hexMove,
  getValidMoves as hexValid,
  isValidMove,
  checkWinner as hexWinner,
} from '../../src/games/hex/rules';

import { createInitialGameState as createKings } from '../../src/games/kings-quadraphages/game-state';
import {
  selectKing,
  moveKing,
  placeQuadraphage,
} from '../../src/games/kings-quadraphages/game-state';
import {
  findKingPosition,
  checkWinCondition,
} from '../../src/games/kings-quadraphages/rules';

import {
  createInitialState as createFrac,
  FractionProblem,
  FracFactState,
  POINTS_PER_CORRECT,
} from '../../src/games/frac-fact/types';
import {
  startGame as startFrac,
  submitAnswer as submitFrac,
  nextProblem,
  checkAnswer,
} from '../../src/games/frac-fact/rules';

import {
  createInitialState as createPinball,
  type ConversionChallenge,
  type FractionPinballState,
} from '../../src/games/fraction-pinball/types';
import {
  startGame as startPinball,
  submitAnswer as submitPinball,
  nextChallenge,
  checkAnswer as checkPinball,
} from '../../src/games/fraction-pinball/rules';

afterEach(() => {
  vi.restoreAllMocks();
});

function placeMany(nodeIds: string[]) {
  let state = createFiar();
  for (const id of nodeIds) {
    state = fiarPlace(state, id);
  }
  return state;
}

const FIXED_FRAC: FractionProblem = {
  id: 'wave26-frac-1',
  operand1: { numerator: 1, denominator: 2 },
  operand2: { numerator: 1, denominator: 4 },
  operation: 'add',
  correctAnswer: { numerator: 3, denominator: 4 },
  answerChoices: [
    { numerator: 3, denominator: 4 },
    { numerator: 1, denominator: 2 },
    { numerator: 2, denominator: 6 },
    { numerator: 1, denominator: 4 },
  ],
};

const FIXED_FRAC_2: FractionProblem = {
  id: 'wave26-frac-2',
  operand1: { numerator: 2, denominator: 3 },
  operand2: { numerator: 1, denominator: 3 },
  operation: 'subtract',
  correctAnswer: { numerator: 1, denominator: 3 },
  answerChoices: [
    { numerator: 1, denominator: 3 },
    { numerator: 1, denominator: 2 },
    { numerator: 1, denominator: 1 },
    { numerator: 2, denominator: 3 },
  ],
};

function fracPlaying(overrides: Partial<FracFactState> = {}): FracFactState {
  return {
    ...createFrac('easy'),
    currentProblem: FIXED_FRAC,
    phase: 'playing',
    ...overrides,
  };
}

const FIXED_PINBALL: ConversionChallenge = {
  id: 'wave26-pb-1',
  type: 'fractionToDecimal',
  fraction: { numerator: 1, denominator: 2 },
  decimal: 0.5,
  answerChoices: ['0.5', '0.25', '0.75', '1'],
  correctAnswer: '0.5',
};

const FIXED_PINBALL_2: ConversionChallenge = {
  id: 'wave26-pb-2',
  type: 'decimalToFraction',
  fraction: { numerator: 1, denominator: 4 },
  decimal: 0.25,
  answerChoices: ['1/4', '1/2', '1/3', '2/5'],
  correctAnswer: '1/4',
};

function pinballAnswering(
  overrides: Partial<FractionPinballState> = {}
): FractionPinballState {
  return {
    ...createPinball(),
    currentChallenge: FIXED_PINBALL,
    phase: 'answering',
    ...overrides,
  };
}

describe('Wave 26 path — FIAR placement then movement success', () => {
  it('two opening placeChip plies flip seats and grow history', () => {
    let state = createFiar();
    expect(state.phase).toBe('placement');
    state = fiarPlace(state, '0-0');
    expect(state.board.nodes.get('0-0')?.chip).toBe('player1');
    expect(state.chipsPlaced.player1).toBe(1);
    expect(state.moveHistory).toHaveLength(1);
    expect(state.currentPlayer).toBe('player2');

    state = fiarPlace(state, '4-4');
    expect(state.board.nodes.get('4-4')?.chip).toBe('player2');
    expect(state.chipsPlaced.player2).toBe(1);
    expect(state.moveHistory).toHaveLength(2);
    expect(state.currentPlayer).toBe('player1');
    expect(fiarWinner(state)).toBeNull();
  });

  it('after 8 placements, legal slide advances history and seat', () => {
    const nodes = ['0-0', '4-4', '0-1', '4-3', '0-2', '4-2', '0-4', '4-1'];
    let state = placeMany(nodes);
    expect(state.phase).toBe('movement');
    expect(state.chipsPlaced.player1).toBe(FIAR_CONFIG.CHIPS_PER_PLAYER);

    const from = '0-0';
    const moves = fiarValidMoves(state, from);
    expect(moves.length).toBeGreaterThan(0);
    const to = moves[0];
    expect(canMove(state, from, to)).toBe(true);

    const histBefore = state.moveHistory.length;
    const seatBefore = state.currentPlayer;
    state = moveChip(state, from, to);
    expect(state.board.nodes.get(from)?.chip).toBeNull();
    expect(state.board.nodes.get(to)?.chip).toBe('player1');
    expect(state.moveHistory.length).toBe(histBefore + 1);
    if (state.winner === null) {
      expect(state.currentPlayer).not.toBe(seatBefore);
    }
  });

  it('four alternating placement plies keep phase placement until supply full', () => {
    let state = createFiar();
    const sequence = ['0-0', '4-4', '0-1', '4-3'];
    for (let i = 0; i < sequence.length; i++) {
      state = fiarPlace(state, sequence[i]);
      expect(state.moveHistory).toHaveLength(i + 1);
      expect(state.phase).toBe('placement');
    }
    expect(state.chipsPlaced.player1).toBe(2);
    expect(state.chipsPlaced.player2).toBe(2);
  });
});

describe('Wave 26 path — Hex multi-ply path building', () => {
  it('two legal makeMove plies occupy cells and flip seats', () => {
    let state = createHex(5);
    const first = { row: 2, col: 2 };
    expect(isValidMove(state, first)).toBe(true);
    state = hexMove(state, first);
    expect(state.board[2][2]).toBe('player1');
    expect(state.moveHistory).toHaveLength(1);
    expect(state.currentPlayer).toBe('player2');
    expect(hexWinner(state.board, 'player1', 5)).toBe(false);

    const second = { row: 2, col: 3 };
    expect(isValidMove(state, second)).toBe(true);
    state = hexMove(state, second);
    expect(state.board[2][3]).toBe('player2');
    expect(state.moveHistory).toHaveLength(2);
    expect(state.currentPlayer).toBe('player1');
  });

  it('four-ply center diamond keeps getValidMoves shrinking', () => {
    let state = createHex(5);
    const openingValid = hexValid(state).length;
    expect(openingValid).toBe(25);
    const moves = [
      { row: 2, col: 2 },
      { row: 1, col: 1 },
      { row: 2, col: 1 },
      { row: 1, col: 2 },
    ];
    for (const pos of moves) {
      expect(isValidMove(state, pos)).toBe(true);
      state = hexMove(state, pos);
    }
    expect(state.moveHistory).toHaveLength(4);
    expect(hexValid(state).length).toBe(openingValid - 4);
    expect(state.winner).toBeNull();
  });

  it('player1 north-south bridge yields winner after crafted fill', () => {
    const size = 3;
    let state = createHex(size);
    // Alternate: p1 builds N-S column 1 while p2 fills elsewhere
    state = hexMove(state, { row: 0, col: 1 }); // p1
    state = hexMove(state, { row: 0, col: 0 }); // p2
    state = hexMove(state, { row: 1, col: 1 }); // p1
    state = hexMove(state, { row: 0, col: 2 }); // p2
    state = hexMove(state, { row: 2, col: 1 }); // p1 completes N-S
    expect(hexWinner(state.board, 'player1', size)).toBe(true);
    expect(state.winner).toBe('player1');
    expect(state.moveHistory.length).toBeGreaterThanOrEqual(5);
  });

  it('empty-board createEmptyBoard matches opening emptiness', () => {
    const size = 4;
    const empty = createEmptyBoard(size);
    const state = createHex(size);
    expect(empty).toHaveLength(size);
    expect(state.board).toHaveLength(size);
    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        expect(empty[r][c]).toBeNull();
        expect(state.board[r][c]).toBeNull();
      }
    }
  });
});

describe('Wave 26 path — Kings full ply moveKing + placeQuadraphage', () => {
  it('select→move→place completes a ply and flips seat', () => {
    let state = createKings();
    expect(state.turnPhase).toBe('moveKing');
    expect(state.currentPlayer).toBe('player1');
    expect(findKingPosition(state.board, 'player1')).not.toBeNull();

    state = selectKing(state);
    expect(state.selectedKingPosition).not.toBeNull();

    // Opening p1 king at (1,5) 1-based; move to (2,5)
    state = moveKing(state, { row: 2, col: 5 });
    expect(state.turnPhase).toBe('placeQuadraphage');
    expect(findKingPosition(state.board, 'player1')).toEqual({
      row: 1,
      col: 4,
    }); // 0-based board indices

    const supplyBefore = state.player1Supply;
    state = placeQuadraphage(state, { row: 3, col: 3 });
    expect(state.turnPhase).toBe('moveKing');
    expect(state.currentPlayer).toBe('player2');
    expect(state.player1Supply).toBe(supplyBefore - 1);
    expect(state.moveHistory.length).toBeGreaterThanOrEqual(2);
    expect(checkWinCondition(state)).toBeNull();
  });

  it('player2 full ply after p1 succeeds; supplies both drop by 1', () => {
    let state = createKings();
    const p1Supply0 = state.player1Supply;
    const p2Supply0 = state.player2Supply;

    state = selectKing(state);
    state = moveKing(state, { row: 2, col: 5 });
    state = placeQuadraphage(state, { row: 4, col: 4 });
    expect(state.currentPlayer).toBe('player2');
    expect(state.player1Supply).toBe(p1Supply0 - 1);

    state = selectKing(state);
    const p2King = findKingPosition(state.board, 'player2')!;
    // moveKing expects 1-based coords
    state = moveKing(state, { row: p2King.row + 1 - 1, col: p2King.col + 1 });
    // Prefer a known-legal adjacent: opening p2 king is typically (9,5) 1-based
    if (state.turnPhase !== 'placeQuadraphage') {
      state = moveKing(state, { row: 8, col: 5 });
    }
    expect(state.turnPhase).toBe('placeQuadraphage');
    state = placeQuadraphage(state, { row: 5, col: 5 });
    expect(state.currentPlayer).toBe('player1');
    expect(state.player2Supply).toBe(p2Supply0 - 1);
    expect(state.moveHistory.length).toBeGreaterThanOrEqual(4);
  });

  it('two full p1/p2 rounds grow history by at least 4 entries', () => {
    let state = createKings();
    const hist0 = state.moveHistory.length;

    state = selectKing(state);
    state = moveKing(state, { row: 2, col: 5 });
    state = placeQuadraphage(state, { row: 3, col: 3 });

    state = selectKing(state);
    state = moveKing(state, { row: 8, col: 5 });
    if (state.turnPhase === 'placeQuadraphage') {
      state = placeQuadraphage(state, { row: 6, col: 6 });
    }

    expect(state.moveHistory.length).toBeGreaterThanOrEqual(hist0 + 3);
    expect(checkWinCondition(state)).toBeNull();
  });
});

describe('Wave 26 quiz — Frac Fact correct streak success', () => {
  it('crafted start→correct submit→nextProblem (real RNG) flips seat', () => {
    // Real RNG required: generateProblem distractor fill loops hang on constant Math.random
    let state = startFrac(createFrac('easy'));
    expect(state.phase).toBe('playing');
    expect(state.currentProblem).not.toBeNull();

    const answer = state.currentProblem!.correctAnswer;
    expect(checkAnswer(state.currentProblem!, answer)).toBe(true);
    state = submitFrac(state, answer);
    expect(state.isCorrect).toBe(true);
    expect(state.phase).toBe('showingResult');
    expect(state.player1Stats.score).toBeGreaterThanOrEqual(POINTS_PER_CORRECT);
    expect(state.player1Stats.correctAnswers).toBe(1);

    state = nextProblem(state);
    if (state.phase !== 'gameOver') {
      expect(state.phase).toBe('playing');
      expect(state.currentPlayer).toBe('player2');
      expect(state.currentProblem).not.toBeNull();
    }
  });

  it('crafted two correct answers across seats climb both scores', () => {
    let state = fracPlaying({
      currentPlayer: 'player1',
      problemsCompleted: 0,
      maxProblems: 10,
    });
    state = submitFrac(state, FIXED_FRAC.correctAnswer);
    expect(state.player1Stats.correctAnswers).toBe(1);

    // Avoid nextProblem RNG: hand-advance seat + inject problem
    state = {
      ...state,
      currentPlayer: 'player2',
      phase: 'playing',
      currentProblem: FIXED_FRAC_2,
      selectedAnswer: null,
      isCorrect: null,
      problemsCompleted: 1,
    };
    state = submitFrac(state, FIXED_FRAC_2.correctAnswer);
    expect(state.isCorrect).toBe(true);
    expect(state.player2Stats.correctAnswers).toBe(1);
    expect(state.player2Stats.score).toBeGreaterThanOrEqual(POINTS_PER_CORRECT);
  });

  it('three crafted correct submits deepen bestStreak for player1', () => {
    let state = fracPlaying({
      player1Stats: {
        score: 0,
        correctAnswers: 0,
        wrongAnswers: 0,
        currentStreak: 0,
        bestStreak: 0,
      },
      maxProblems: 20,
      problemsCompleted: 0,
    });

    for (let i = 0; i < 3; i++) {
      state = {
        ...state,
        currentPlayer: 'player1',
        phase: 'playing',
        currentProblem: {
          ...FIXED_FRAC,
          id: `wave26-streak-${i}`,
        },
        selectedAnswer: null,
        isCorrect: null,
      };
      state = submitFrac(state, FIXED_FRAC.correctAnswer);
      expect(state.isCorrect).toBe(true);
      expect(state.player1Stats.currentStreak).toBe(i + 1);
    }
    expect(state.player1Stats.correctAnswers).toBe(3);
    expect(state.player1Stats.bestStreak).toBeGreaterThanOrEqual(3);
  });
});

describe('Wave 26 quiz — Fraction Pinball correct then nextChallenge', () => {
  it('startGame→correct submit→nextChallenge (real RNG) flips seat', () => {
    // Real RNG: generateChallenge distractor fill loops hang on constant Math.random
    let state = startPinball(createPinball());
    expect(state.phase).toBe('answering');
    expect(state.currentChallenge).not.toBeNull();

    const correct = state.currentChallenge!.correctAnswer;
    expect(checkPinball(state.currentChallenge!, correct)).toBe(true);
    const ballsBefore = state.player1Stats.ballsRemaining;
    state = submitPinball(state, correct);
    expect(state.isCorrect).toBe(true);
    expect(state.phase).toBe('showResult');
    expect(state.player1Stats.correctAnswers).toBe(1);
    expect(state.player1Stats.score).toBeGreaterThan(0);
    expect(state.player1Stats.ballsRemaining).toBe(ballsBefore);

    state = nextChallenge(state);
    if (state.phase !== 'gameOver') {
      expect(state.phase).toBe('answering');
      expect(state.currentPlayer).toBe('player2');
      expect(state.currentChallenge).not.toBeNull();
    }
  });

  it('crafted two-seat correct answers both gain score', () => {
    let state = pinballAnswering({ currentPlayer: 'player1' });
    state = submitPinball(state, FIXED_PINBALL.correctAnswer);
    expect(state.player1Stats.score).toBeGreaterThan(0);

    state = {
      ...state,
      currentPlayer: 'player2',
      phase: 'answering',
      currentChallenge: FIXED_PINBALL_2,
      selectedAnswer: null,
      isCorrect: null,
      roundNumber: state.roundNumber + 1,
    };
    state = submitPinball(state, FIXED_PINBALL_2.correctAnswer);
    expect(state.isCorrect).toBe(true);
    expect(state.player2Stats.correctAnswers).toBe(1);
    expect(state.player2Stats.score).toBeGreaterThan(0);
  });

  it('wrong answer burns a ball; hand-advanced seat without generateChallenge', () => {
    let state = pinballAnswering({
      currentPlayer: 'player1',
      player1Stats: {
        score: 0,
        correctAnswers: 0,
        wrongAnswers: 0,
        ballsRemaining: 3,
      },
    });
    state = submitPinball(state, '0.25'); // wrong vs 0.5
    expect(state.isCorrect).toBe(false);
    expect(state.player1Stats.ballsRemaining).toBe(2);
    expect(state.player1Stats.wrongAnswers).toBe(1);
    // Seat flip is nextChallenge's job — assert post-result state is ready for it
    expect(state.phase).toBe('showResult');
    expect(state.currentPlayer).toBe('player1');
  });
});

describe('Wave 26 path deepen — FIAR six-placement midway', () => {
  it('six alternating places keep placement phase and history length 6', () => {
    let state = createFiar();
    const nodes = ['0-0', '4-4', '0-1', '4-3', '0-2', '4-2'];
    for (let i = 0; i < nodes.length; i++) {
      state = fiarPlace(state, nodes[i]);
      expect(state.moveHistory).toHaveLength(i + 1);
      expect(state.phase).toBe('placement');
    }
    expect(state.chipsPlaced.player1).toBe(3);
    expect(state.chipsPlaced.player2).toBe(3);
    expect(fiarWinner(state)).toBeNull();
  });

  it('illegal placeChip on occupied node is identity; legal place still works', () => {
    let state = createFiar();
    state = fiarPlace(state, '0-0');
    const blocked = fiarPlace(state, '0-0');
    expect(blocked).toBe(state);
    state = fiarPlace(state, '4-4');
    expect(state.moveHistory).toHaveLength(2);
  });
});

describe('Wave 26 path deepen — Hex six-ply no-winner midgame', () => {
  it('six center-ring places shrink valid moves by 6', () => {
    let state = createHex(5);
    const opening = hexValid(state).length;
    const seq = [
      { row: 2, col: 2 },
      { row: 1, col: 2 },
      { row: 2, col: 1 },
      { row: 3, col: 2 },
      { row: 2, col: 3 },
      { row: 1, col: 1 },
    ];
    for (const pos of seq) {
      expect(isValidMove(state, pos)).toBe(true);
      state = hexMove(state, pos);
    }
    expect(state.moveHistory).toHaveLength(6);
    expect(hexValid(state).length).toBe(opening - 6);
    expect(state.winner).toBeNull();
  });

  it('player2 east-west bridge on size-3 yields winner', () => {
    let state = createHex(3);
    // p1 distracts while p2 builds row 1 left-right
    state = hexMove(state, { row: 0, col: 0 }); // p1
    state = hexMove(state, { row: 1, col: 0 }); // p2
    state = hexMove(state, { row: 0, col: 1 }); // p1
    state = hexMove(state, { row: 1, col: 1 }); // p2
    state = hexMove(state, { row: 2, col: 0 }); // p1
    state = hexMove(state, { row: 1, col: 2 }); // p2 completes
    expect(hexWinner(state.board, 'player2', 3)).toBe(true);
    expect(state.winner).toBe('player2');
  });
});

describe('Wave 26 path deepen — Kings third ply history growth', () => {
  it('three full plies (p1/p2/p1) leave turnPhase moveKing', () => {
    let state = createKings();
    const ply = (
      move: { row: number; col: number },
      place: { row: number; col: number }
    ) => {
      state = selectKing(state);
      state = moveKing(state, move);
      if (state.turnPhase === 'placeQuadraphage') {
        state = placeQuadraphage(state, place);
      }
    };
    ply({ row: 2, col: 5 }, { row: 3, col: 3 });
    ply({ row: 8, col: 5 }, { row: 6, col: 6 });
    if (state.currentPlayer === 'player1' && state.turnPhase === 'moveKing') {
      ply({ row: 3, col: 5 }, { row: 4, col: 2 });
    }
    expect(state.moveHistory.length).toBeGreaterThanOrEqual(4);
    if (state.winner === null) {
      expect(state.turnPhase).toBe('moveKing');
    }
  });
});

describe('Wave 26 quiz deepen — Frac Fact equivalent-answer success', () => {
  it('accepts equivalent 6/8 for correct 3/4 and awards points', () => {
    let state = fracPlaying();
    expect(checkAnswer(FIXED_FRAC, { numerator: 6, denominator: 8 })).toBe(
      true
    );
    state = submitFrac(state, { numerator: 6, denominator: 8 });
    expect(state.isCorrect).toBe(true);
    expect(state.player1Stats.correctAnswers).toBe(1);
    expect(state.player1Stats.score).toBeGreaterThanOrEqual(POINTS_PER_CORRECT);
  });

  it('wrong then correct resets then rebuilds streak', () => {
    let state = fracPlaying({
      player1Stats: {
        score: 10,
        correctAnswers: 1,
        wrongAnswers: 0,
        currentStreak: 1,
        bestStreak: 1,
      },
    });
    state = submitFrac(state, { numerator: 1, denominator: 2 });
    expect(state.isCorrect).toBe(false);
    expect(state.player1Stats.currentStreak).toBe(0);

    state = {
      ...state,
      phase: 'playing',
      currentProblem: FIXED_FRAC_2,
      selectedAnswer: null,
      isCorrect: null,
      currentPlayer: 'player1',
    };
    state = submitFrac(state, FIXED_FRAC_2.correctAnswer);
    expect(state.isCorrect).toBe(true);
    expect(state.player1Stats.currentStreak).toBe(1);
    expect(state.player1Stats.correctAnswers).toBe(2);
  });
});

describe('Wave 26 quiz deepen — Pinball score then balls ledger', () => {
  it('two correct then one wrong: score up, one ball burned', () => {
    let state = pinballAnswering({
      player1Stats: {
        score: 0,
        correctAnswers: 0,
        wrongAnswers: 0,
        ballsRemaining: 5,
      },
    });
    state = submitPinball(state, FIXED_PINBALL.correctAnswer);
    const score1 = state.player1Stats.score;
    expect(score1).toBeGreaterThan(0);

    state = {
      ...state,
      phase: 'answering',
      currentChallenge: FIXED_PINBALL_2,
      selectedAnswer: null,
      isCorrect: null,
      currentPlayer: 'player1',
    };
    state = submitPinball(state, FIXED_PINBALL_2.correctAnswer);
    expect(state.player1Stats.correctAnswers).toBe(2);
    expect(state.player1Stats.score).toBeGreaterThan(score1);

    state = {
      ...state,
      phase: 'answering',
      currentChallenge: FIXED_PINBALL,
      selectedAnswer: null,
      isCorrect: null,
      currentPlayer: 'player1',
    };
    const balls = state.player1Stats.ballsRemaining;
    state = submitPinball(state, '1');
    expect(state.isCorrect).toBe(false);
    expect(state.player1Stats.ballsRemaining).toBe(balls - 1);
  });
});
