import { describe, it, expect, vi, afterEach } from 'vitest';

import {
  createInitialState as createPrime,
  rollDice as rollPrime,
  getValidPlacements as getPrimePlacements,
  findCellByValue,
  passTurn as passPrime,
  hasValidMoves as primeHasMoves,
} from '../../src/games/prime-gold/rules';
import {
  getAIPlacement,
  isAITurn as isPrimeAITurn,
  executeAITurn as executePrimeAI,
} from '../../src/games/prime-gold/ai';

import {
  createInitialState as createStars,
  passTurn as passStars,
  hasValidMoves as starsHasMoves,
  getValidPlacements as getStarsPlacements,
  selectCard,
} from '../../src/games/stars-bars/rules';
import { AttributeCard, StarsState } from '../../src/games/stars-bars/types';
import {
  getAIMove as getStarsAI,
  isAITurn as isStarsAITurn,
  executeAITurn as executeStarsAI,
} from '../../src/games/stars-bars/ai';

import {
  createRod,
  createBoxId,
  RamrodState,
  SumBox,
  Rod,
} from '../../src/games/ramrod/types';
import {
  createInitialState as createRamrod,
  getValidPlacements as getRamrodPlacements,
  hasValidMoves as ramrodHasMoves,
} from '../../src/games/ramrod/rules';
import {
  getAIMove as getRamrodAI,
  executeAITurn as executeRamrodAI,
  isAITurn as isRamrodAITurn,
} from '../../src/games/ramrod/ai';

import { createInitialState as createPent } from '../../src/games/pent-em-in/types';
import {
  canPlacePiece,
  canPlayerMove as pentCanMove,
} from '../../src/games/pent-em-in/rules';
import {
  getAIMove as getPentAI,
  isAITurn as isPentAITurn,
} from '../../src/games/pent-em-in/ai';

import {
  createInitialState as createFiar,
  CONFIG as FIAR_CFG,
} from '../../src/games/fiar/types';
import {
  placeChip as fiarPlace,
  canMove,
  getSelectableNodes,
  deselectChip,
  isDraw,
} from '../../src/games/fiar/rules';
import { getAIMove as getFiarAI, applyAIMove } from '../../src/games/fiar/ai';

import {
  createInitialState as createFrac,
  getPlayerStats as fracStats,
} from '../../src/games/frac-fact/types';
import {
  submitAnswer as submitFrac,
  nextProblem,
} from '../../src/games/frac-fact/rules';
import { getAIAnswer as getFracAI } from '../../src/games/frac-fact/ai';

import {
  createInitialState as createPinball,
  getPlayerStats as pinballStats,
} from '../../src/games/fraction-pinball/types';
import {
  submitAnswer as submitPinball,
  nextChallenge,
} from '../../src/games/fraction-pinball/rules';
import { getAIAnswer as getPinballAI } from '../../src/games/fraction-pinball/ai';

import {
  createInitialState as createContig,
  getValidPlacements as getContigPlacements,
} from '../../src/games/contig-60/types';
import {
  doRollDice,
  passTurn as passContig,
  calculatePoints,
  placeChip as placeContig,
} from '../../src/games/contig-60/rules';
import {
  getAIPlacement as getContigAI,
  executeAITurn as executeContigAI,
} from '../../src/games/contig-60/ai';

import {
  canPlayDomino,
  selectDomino,
  placeDomino,
  getValidPlacements as getSumPlacements,
} from '../../src/games/sum-dominoes/rules';
import {
  Domino,
  PlacedDomino,
  SumDominoesState,
  CONFIG as SD_CFG,
} from '../../src/games/sum-dominoes/types';

import { createInitialState as createHex } from '../../src/games/hex/types';
import {
  makeMove,
  getValidMoves as getHexMoves,
} from '../../src/games/hex/rules';
import { getBestMove } from '../../src/games/hex/ai';

import {
  createInitialState as createJuggle,
  rotateShape,
  flipShape,
  isPlacementValid,
  selectDie,
  selectShape,
} from '../../src/games/juggle/rules';
import { getShapeById } from '../../src/games/juggle/types';
import {
  getAIDieChoice,
  getAIShapeChoice,
  getAIPlacement as getJugglePlacement,
} from '../../src/games/juggle/ai';

import { createInitialState as createRemainder } from '../../src/games/remainder-islands/types';
import {
  findValidIslands,
  selectIsland,
  performRoll,
  calculateDivision,
} from '../../src/games/remainder-islands/rules';
import {
  getAIIslandChoice,
  isAITurn as isRemainderAITurn,
} from '../../src/games/remainder-islands/ai';

import {
  createInitialState as createPar,
  selectBlock,
  isValidPlacement as isParValid,
} from '../../src/games/par-55/rules';
import {
  getAIMove as getParAI,
  executeAITurn as executeParAI,
} from '../../src/games/par-55/ai';

import {
  createInitialState as createKwa,
  getValidMoves as getKwaValid,
  hasValidMoves as kwaHasMoves,
} from '../../src/games/kwatro-sinko/rules';
import {
  getAIMove as getKwaAI,
  executeAITurn as executeKwaAI,
} from '../../src/games/kwatro-sinko/ai';

import { createInitialState as createCalla } from '../../src/games/calla/types';
import { getValidPits } from '../../src/games/calla/rules';
import {
  getAIMove as getCallaAI,
  analyzeMoves,
} from '../../src/games/calla/ai';

afterEach(() => {
  vi.restoreAllMocks();
});

function starCard(
  overrides: Partial<AttributeCard> & Pick<AttributeCard, 'id'>
): AttributeCard {
  return {
    shape: 'circle',
    color: 'red',
    size: 'small',
    thickness: 'thin',
    ...overrides,
  };
}

function ramrodWithRods(
  player1Rods: Rod[],
  boxes: Map<string, SumBox>
): RamrodState {
  const rods = new Map<string, Rod>();
  for (const rod of player1Rods) {
    rods.set(rod.id, { ...rod, owner: 'player1' });
  }
  const opp = createRod('opp-wave8', 2);
  opp.owner = 'player2';
  rods.set(opp.id, opp);

  return {
    boxes,
    rods,
    playerRods: {
      player1: player1Rods.map((r) => r.id),
      player2: [opp.id],
    },
    currentPlayer: 'player1',
    selectedRod: null,
    phase: 'selectingRod',
    scores: { player1: 0, player2: 0 },
    winner: null,
    moveHistory: [],
  };
}

function makeDomino(
  id: string,
  face1: number,
  face2: number,
  owner: Domino['owner'] = 'player1'
): Domino {
  return { id, face1, face2, owner, orientation: 'horizontal' };
}

function emptySumBoard(): (PlacedDomino | null)[][] {
  return Array.from({ length: SD_CFG.BOARD_SIZE }, () =>
    Array.from({ length: SD_CFG.BOARD_SIZE }, () => null)
  );
}

function placeOnBoard(
  board: (PlacedDomino | null)[][],
  domino: Domino,
  row: number,
  col: number,
  orientation: 'horizontal' | 'vertical'
): void {
  const placed: PlacedDomino = {
    domino: { ...domino, orientation },
    position: { row, col },
    orientation,
  };
  board[row][col] = placed;
  if (orientation === 'horizontal') board[row][col + 1] = placed;
  else board[row + 1][col] = placed;
}

function sumBase(overrides: Partial<SumDominoesState> = {}): SumDominoesState {
  const board = emptySumBoard();
  placeOnBoard(board, makeDomino('seed', 6, 6, null), 5, 5, 'horizontal');

  return {
    board,
    hands: {
      player1: [makeDomino('p1a', 2, 1), makeDomino('p1b', 3, 3)],
      player2: [makeDomino('p2a', 5, 5, 'player2')],
    },
    currentPlayer: 'player1',
    currentDice: [4, 4],
    selectedDomino: null,
    phase: 'placing',
    passCount: 0,
    winner: null,
    moveHistory: [],
    ...overrides,
  };
}

describe('Burn wave 8 — Prime Gold hard AI + pass / rolling null', () => {
  it('getAIPlacement returns null while still in rolling phase', () => {
    const state = createPrime();
    expect(state.phase).toBe('rolling');
    expect(getAIPlacement(state, 'player1', 'hard')).toBeNull();
  });

  it('hard getAIPlacement stays inside getValidPlacements after roll', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.33);
    let state = createPrime();
    state = rollPrime(state);
    expect(state.phase).toBe('placing');
    const placement = getAIPlacement(state, 'player1', 'hard');
    expect(placement).not.toBeNull();
    expect(
      getPrimePlacements(state).some((p) => p.value === placement!.value)
    ).toBe(true);
    expect(findCellByValue(state, placement!.value)?.owner).toBeNull();
  });

  it('passTurn from placing with no legal cells flips to opponent rolling', () => {
    const base = createPrime();
    const cells = new Map(base.cells);
    for (const [k, c] of cells) {
      cells.set(k, { ...c, owner: 'player2' });
    }
    const blocked = {
      ...base,
      cells,
      phase: 'placing' as const,
      diceRoll: { die1: 1, die2: 2, die3: 3 },
    };
    expect(primeHasMoves(blocked)).toBe(false);
    const next = passPrime(blocked);
    expect(next.currentPlayer).toBe('player2');
    expect(next.phase).toBe('rolling');
    expect(next.diceRoll).toBeNull();
  });

  it('isAITurn / executeAITurn respect human-vs-ai and hard difficulty', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.1);
    const fresh = createPrime();
    expect(isPrimeAITurn(fresh, 'player2', 'human-vs-ai')).toBe(false);
    expect(isPrimeAITurn(fresh, 'player1', 'human-vs-ai')).toBe(true);
    const next = executePrimeAI(fresh, 'player1', 'hard');
    expect(['rolling', 'placing', 'gameOver']).toContain(next.phase);
  });
});

describe('Burn wave 8 — Stars & Bars pass + medium AI legality', () => {
  it('passTurn flips seat when hand has no legal placements', () => {
    const base = createStars();
    const cells = base.cells.map((row) =>
      row.map((c) => ({
        ...c,
        card: starCard({ id: `fill-${c.row}-${c.col}` }),
        owner: 'player2' as const,
      }))
    );
    const state: StarsState = {
      ...base,
      cells,
      playerHands: {
        player1: [starCard({ id: 'stranded' })],
        player2: [starCard({ id: 'opp' })],
      },
      deck: [],
      currentPlayer: 'player1',
      phase: 'selectingCard',
      selectedCard: null,
    };
    expect(starsHasMoves(state)).toBe(false);
    expect(getStarsPlacements(state)).toHaveLength(0);
    const next = passStars(state);
    expect(next.currentPlayer).toBe('player2');
    expect(next.phase).toBe('selectingCard');
    expect(next.selectedCard).toBeNull();
  });

  it('medium getAIMove returns hand card on empty cell', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.42);
    const state = createStars();
    const move = getStarsAI(state, 'player1', 'medium');
    expect(move).not.toBeNull();
    expect(state.playerHands.player1.some((c) => c.id === move!.cardId)).toBe(
      true
    );
    expect(state.cells[move!.row][move!.col].card).toBeNull();
    const selected = selectCard(state, move!.cardId);
    expect(selected.selectedCard?.id).toBe(move!.cardId);
  });

  it('isAITurn false for human-vs-human; executeAITurn advances player', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.7);
    const state = createStars();
    expect(isStarsAITurn(state, 'player2', 'human-vs-human')).toBe(false);
    const next = executeStarsAI(state, 'player1', 'medium');
    expect(next.moveHistory.length).toBeGreaterThanOrEqual(1);
    expect(next.currentPlayer).toBe('player2');
  });
});

describe('Burn wave 8 — Ramrod medium AI + executeAITurn history', () => {
  it('medium getAIMove returns a legal rod/box/slot triple', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.2);
    const state = createRamrod();
    expect(ramrodHasMoves(state)).toBe(true);
    const move = getRamrodAI(state, 'player1', 'medium');
    expect(move).not.toBeNull();
    const rod = state.rods.get(move!.rodId);
    expect(rod?.owner).toBe('player1');
    const valids = getRamrodPlacements(state, move!.rodId);
    expect(
      valids.some((v) => v.boxId === move!.boxId && v.slot === move!.slot)
    ).toBe(true);
  });

  it('executeAITurn medium records history and flips player', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.55);
    const next = executeRamrodAI(createRamrod(), 'player1', 'medium');
    expect(next.moveHistory.length).toBeGreaterThanOrEqual(1);
    expect(next.currentPlayer).toBe('player2');
  });

  it('hard prefers completing a near-full box when available', () => {
    // Pin RNG: hard AI has 3% randomness that otherwise flakes CI.
    vi.spyOn(Math, 'random').mockReturnValue(0.5);
    const first = createRod('r-fill', 4);
    first.owner = 'player2';
    first.position = { boxId: createBoxId(1, 1), slot: 0 };

    const completer = createRod('r-done', 3);
    const distractor = createRod('r-noise', 1);
    const boxes = new Map<string, SumBox>();
    boxes.set(createBoxId(1, 1), {
      id: createBoxId(1, 1),
      targetSum: 7,
      row: 1,
      col: 1,
      rods: [first, null],
      completedBy: null,
    });
    boxes.set(createBoxId(0, 0), {
      id: createBoxId(0, 0),
      targetSum: 9,
      row: 0,
      col: 0,
      rods: [null, null],
      completedBy: null,
    });

    let state = ramrodWithRods([completer, distractor], boxes);
    state = {
      ...state,
      rods: new Map([...state.rods, [first.id, first]]),
    };

    const move = getRamrodAI(state, 'player1', 'hard');
    expect(move).not.toBeNull();
    expect(move!.rodId).toBe(completer.id);
    expect(move!.boxId).toBe(createBoxId(1, 1));
    expect(isRamrodAITurn(state, 'player1', 'human-vs-ai')).toBe(true);
  });
});

describe("Burn wave 8 — Pent'Em In hard AI legality", () => {
  it('hard getAIMove returns a canPlacePiece-legal shape', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.88);
    const state = createPent();
    const move = getPentAI(state, 'player1', 'hard');
    expect(move).not.toBeNull();
    expect(
      canPlacePiece(
        state,
        move!.shapeId,
        move!.position,
        move!.rotation,
        move!.flipped
      )
    ).toBe(true);
  });

  it('getAIMove null when seat cannot move; isAITurn tracks current player', () => {
    const state = createPent();
    const full = {
      ...state,
      board: state.board.map((row) =>
        row.map((cell) => ({
          ...cell,
          occupied: true,
          owner: 'player2' as const,
          pieceId: 'x',
        }))
      ),
      player1Pieces: { available: ['I5'], placed: [] },
      currentPlayer: 'player1' as const,
    };
    expect(pentCanMove(full, 'player1')).toBe(false);
    expect(getPentAI(full, 'player1', 'hard')).toBeNull();
    expect(isPentAITurn(state, 'player1')).toBe(true);
    expect(isPentAITurn(state, 'player2')).toBe(false);
  });
});

describe('Burn wave 8 — FIAR easy placement/movement + applyAIMove', () => {
  it('easy placement getAIMove returns type place on empty node', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    const state = createFiar();
    const move = getFiarAI(state, 'player1', 'easy');
    expect(move).not.toBeNull();
    expect(move!.type).toBe('place');
    expect(move!.nodeId).toBeTruthy();
    expect(state.board.nodes.get(move!.nodeId!)?.chip).toBeNull();
  });

  it('easy movement getAIMove returns a canMove path', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.99);
    let state = createFiar();
    const ids = [...state.board.nodes.keys()];
    for (let i = 0; i < FIAR_CFG.CHIPS_PER_PLAYER * 2; i++) {
      state = fiarPlace(state, ids[i]!);
    }
    expect(state.phase).toBe('movement');
    expect(getSelectableNodes(state).length).toBeGreaterThan(0);

    const move = getFiarAI(state, state.currentPlayer, 'easy');
    expect(move).not.toBeNull();
    expect(move!.type).toBe('move');
    expect(canMove(state, move!.from!, move!.to!)).toBe(true);

    const applied = applyAIMove(state, move!);
    expect(applied.moveHistory.length).toBeGreaterThan(
      state.moveHistory.length
    );
  });

  it('applyAIMove with malformed move is a no-op; deselectChip clears selection', () => {
    let state = createFiar();
    const firstId = [...state.board.nodes.keys()][0]!;
    state = fiarPlace(state, firstId);
    const selected = {
      ...state,
      phase: 'movement' as const,
      selectedNode: firstId,
    };
    const cleared = deselectChip(selected);
    expect(cleared.selectedNode).toBeNull();
    const noop = applyAIMove(state, { type: 'place' });
    expect(noop.moveHistory.length).toBe(state.moveHistory.length);
    expect(isDraw(createFiar())).toBe(false);
  });
});

describe('Burn wave 8 — Frac Fact / Pinball tie winners via next*', () => {
  it('Frac Fact nextProblem with tied scores ends as draw', () => {
    const problem = {
      id: 'p-tie',
      operand1: { numerator: 1, denominator: 2 },
      operand2: { numerator: 1, denominator: 4 },
      operation: 'add' as const,
      correctAnswer: { numerator: 3, denominator: 4 },
      answerChoices: [
        { numerator: 3, denominator: 4 },
        { numerator: 1, denominator: 2 },
        { numerator: 2, denominator: 3 },
        { numerator: 1, denominator: 1 },
      ],
    };
    let state = {
      ...createFrac('easy'),
      phase: 'showingResult' as const,
      currentProblem: problem,
      selectedAnswer: { numerator: 1, denominator: 2 },
      isCorrect: false,
      problemsCompleted: createFrac('easy').maxProblems - 1,
      player1Stats: { ...fracStats(createFrac('easy'), 'player1'), score: 20 },
      player2Stats: { ...fracStats(createFrac('easy'), 'player2'), score: 20 },
    };
    const over = nextProblem(state);
    expect(over.phase).toBe('gameOver');
    expect(over.winner).toBeNull();
  });

  it('Frac Fact submitAnswer marks wrong choice and stays on showingResult', () => {
    const problem = {
      id: 'p1',
      operand1: { numerator: 1, denominator: 2 },
      operand2: { numerator: 1, denominator: 3 },
      operation: 'add' as const,
      correctAnswer: { numerator: 5, denominator: 6 },
      answerChoices: [
        { numerator: 5, denominator: 6 },
        { numerator: 2, denominator: 5 },
        { numerator: 1, denominator: 6 },
        { numerator: 1, denominator: 1 },
      ],
    };
    const state = {
      ...createFrac('easy'),
      phase: 'playing' as const,
      currentProblem: problem,
    };
    const next = submitFrac(state, { numerator: 2, denominator: 5 });
    expect(next.phase).toBe('showingResult');
    expect(next.isCorrect).toBe(false);
    const answer = getFracAI(state, 'player1', 'easy');
    expect(answer).not.toBeNull();
    expect(
      problem.answerChoices.some(
        (c) =>
          c.numerator === answer!.numerator &&
          c.denominator === answer!.denominator
      )
    ).toBe(true);
  });

  it('Pinball nextChallenge with tied scores and exhausted balls draws', () => {
    const challenge = {
      id: 'c1',
      type: 'fractionToDecimal' as const,
      fraction: { numerator: 1, denominator: 2 },
      decimal: 0.5,
      answerChoices: ['0.5', '0.25', '0.75', '1'],
      correctAnswer: '0.5',
    };
    const base = createPinball();
    const state = {
      ...base,
      phase: 'showResult' as const,
      currentChallenge: challenge,
      selectedAnswer: '0.25',
      isCorrect: false,
      roundNumber: base.maxRounds,
      player1Stats: {
        ...pinballStats(base, 'player1'),
        score: 10,
        ballsRemaining: 0,
      },
      player2Stats: {
        ...pinballStats(base, 'player2'),
        score: 10,
        ballsRemaining: 0,
      },
    };
    const over = nextChallenge(state);
    expect(over.phase).toBe('gameOver');
    expect(over.winner).toBeNull();
  });

  it('Pinball submitAnswer wrong choice enters showResult', () => {
    const challenge = {
      id: 'c2',
      type: 'decimalToFraction' as const,
      fraction: { numerator: 1, denominator: 4 },
      decimal: 0.25,
      answerChoices: ['1/4', '1/2', '1/3', '2/5'],
      correctAnswer: '1/4',
    };
    const state = {
      ...createPinball(),
      phase: 'answering' as const,
      currentChallenge: challenge,
    };
    const next = submitPinball(state, '1/2');
    expect(next.phase).toBe('showResult');
    expect(next.isCorrect).toBe(false);
    const answer = getPinballAI(state, 'player1', 'easy');
    expect(answer).not.toBeNull();
    expect(challenge.answerChoices).toContain(answer);
  });
});

describe('Burn wave 8 — Contig pass + adjacency scoring + hard AI', () => {
  it('passTurn from calculating restores rolling for opponent', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    let state = doRollDice(createContig());
    expect(state.phase).toBe('calculating');
    const next = passContig(state);
    expect(next.phase).toBe('rolling');
    expect(next.currentPlayer).toBe('player2');
    expect(next.currentDice).toBeNull();
  });

  it('calculatePoints and placeChip score adjacency on a known value', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    let state = doRollDice(createContig());
    if (state.phase !== 'calculating' || !state.currentDice) {
      state = {
        ...createContig(),
        phase: 'calculating',
        currentDice: [1, 2, 3],
      };
    }
    const placements = getContigPlacements(state, state.currentDice!);
    if (placements.length === 0) {
      expect(passContig(state).phase).toBe('rolling');
      return;
    }
    const first = placements[0]!;
    const pts = calculatePoints(state, first.result);
    expect(pts).toBeGreaterThanOrEqual(0);
    const next = placeContig(state, first.result, first.expression);
    expect(next.scores.player1).toBe(pts);
    expect(next.cells.get(first.result)?.owner).toBe('player1');
  });

  it('hard getAIPlacement and executeAITurn stay legal', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.15);
    let state = doRollDice(createContig());
    if (state.phase !== 'calculating' || !state.currentDice) {
      state = {
        ...createContig(),
        phase: 'calculating',
        currentDice: [1, 2, 3],
      };
    }
    const placements = getContigPlacements(state, state.currentDice!);
    if (placements.length === 0) {
      expect(getContigAI(state, 'player1', 'hard')).toBeNull();
    } else {
      const place = getContigAI(state, 'player1', 'hard');
      expect(place).not.toBeNull();
      expect(placements.some((p) => p.result === place!.value)).toBe(true);
    }
    const advanced = executeContigAI(createContig(), 'player1', 'hard');
    expect(['rolling', 'calculating', 'gameOver']).toContain(advanced.phase);
  });
});

describe('Burn wave 8 — Sum Dominoes canPlay / invalid place no-op', () => {
  it('canPlayDomino / selectDomino agree on playable vs unplayable tiles', () => {
    const state = sumBase({
      hands: {
        player1: [
          makeDomino('a', 1, 1),
          makeDomino('b', 2, 2),
          makeDomino('c', 3, 5),
        ],
        player2: [makeDomino('p2', 4, 4, 'player2')],
      },
      currentDice: [4, 4],
    });
    const sum = 8;
    const playable = state.hands.player1.filter((d) =>
      canPlayDomino(state, d, sum)
    );
    const unplayable = state.hands.player1.filter(
      (d) => !canPlayDomino(state, d, sum)
    );
    expect(unplayable.length).toBeGreaterThan(0);
    expect(selectDomino(state, unplayable[0]!.id).selectedDomino).toBeNull();
    if (playable.length > 0) {
      expect(selectDomino(state, playable[0]!.id).selectedDomino).toBe(
        playable[0]!.id
      );
    }
  });

  it('placeDomino on illegal cell leaves board and hand unchanged', () => {
    let state = sumBase();
    const playable = state.hands.player1.find((d) =>
      canPlayDomino(state, d, 8)
    );
    if (!playable) {
      expect(state.hands.player1.length).toBeGreaterThan(0);
      return;
    }
    state = selectDomino(state, playable.id);
    const beforeHist = state.moveHistory.length;
    const beforeHand = state.hands.player1.length;
    const next = placeDomino(state, { row: 0, col: 0 }, 'horizontal');
    const valids = getSumPlacements(state, playable, 8);
    const isValid = valids.some(
      (v) =>
        v.position.row === 0 &&
        v.position.col === 0 &&
        v.orientation === 'horizontal'
    );
    if (!isValid) {
      expect(next.moveHistory.length).toBe(beforeHist);
      expect(next.hands.player1.length).toBe(beforeHand);
      expect(next.selectedDomino).toBe(playable.id);
    }
  });
});

describe('Burn wave 8 — Hex medium AI + occupied makeMove identity', () => {
  it('medium getBestMove returns an empty cell from getValidMoves', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.4);
    const state = createHex(5);
    const move = getBestMove(state, 'player1', 'medium');
    expect(move).not.toBeNull();
    expect(
      getHexMoves(state).some((m) => m.row === move!.row && m.col === move!.col)
    ).toBe(true);
    expect(state.board[move!.row][move!.col]).toBeNull();
  });

  it('makeMove on occupied cell returns unchanged history / player', () => {
    let state = createHex(5);
    state = makeMove(state, { row: 1, col: 1 });
    expect(state.board[1][1]).toBe('player1');
    const next = makeMove(state, { row: 1, col: 1 });
    expect(next.board[1][1]).toBe('player1');
    expect(next.moveHistory.length).toBe(state.moveHistory.length);
    expect(next.currentPlayer).toBe(state.currentPlayer);
  });
});

describe('Burn wave 8 — Juggle rotate/flip + hard AI chain', () => {
  it('rotateShape and flipShape keep tromino-L placement valid', () => {
    const tromino = getShapeById('tromino-L')!;
    expect(tromino.canFlip).toBe(true);
    let state = {
      ...createJuggle(),
      phase: 'placing' as const,
      currentDice: [3, 3] as [number, number],
      selectedCategory: 'tromino' as const,
      selectedShape: tromino,
      selectedRotation: 0 as const,
      selectedFlipped: false,
      currentPlayer: 'player1' as const,
    };
    expect(isPlacementValid(state, { row: 0, col: 0 })).toBe(true);
    state = rotateShape(state);
    expect(state.selectedRotation).toBe(90);
    expect(isPlacementValid(state, { row: 0, col: 0 })).toBe(true);
    state = flipShape(state);
    expect(state.selectedFlipped).toBe(true);
    expect(isPlacementValid(state, { row: 0, col: 0 })).toBe(true);
  });

  it('hard AI die → shape → placement stays legal', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    let state = {
      ...createJuggle(),
      phase: 'selectingShape' as const,
      currentDice: [2, 3] as [number, number],
      currentPlayer: 'player1' as const,
    };
    const die = getAIDieChoice(state, 'player1', 'hard');
    expect(die).not.toBeNull();
    state = selectDie(state, die!.index);
    const shape = getAIShapeChoice(state, 'player1', 'hard');
    expect(shape).not.toBeNull();
    state = selectShape(state, shape!.shape);
    expect(state.phase).toBe('placing');
    const placement = getJugglePlacement(state, 'player1', 'hard');
    expect(placement).not.toBeNull();
    expect(
      isPlacementValid(
        {
          ...state,
          selectedRotation: placement!.rotation,
          selectedFlipped: placement!.flipped,
        },
        placement!.position
      )
    ).toBe(true);
  });
});

describe('Burn wave 8 — Remainder Islands hard AI + invalid select no-op', () => {
  it('findValidIslands and hard getAIIslandChoice stay on the valid list', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.2);
    let state = createRemainder();
    state = performRoll(state);
    if (state.phase !== 'selectIsland' || !state.currentRoll) {
      state = {
        ...createRemainder(),
        phase: 'selectIsland',
        currentRoll: { die1: 3, die2: 4, total: 7 },
        validIslands: findValidIslands(createRemainder(), 7),
      };
    }
    expect(state.validIslands.length).toBeGreaterThan(0);
    const choice = getAIIslandChoice(state, 'player1', 'hard');
    expect(choice).not.toBeNull();
    expect(state.validIslands).toContain(choice!.islandId);

    const island = state.islands.find((i) => i.id === choice!.islandId)!;
    const div = calculateDivision(state.currentRoll!.total, island.value);
    expect(div.remainder).toBeGreaterThanOrEqual(0);
    expect(isRemainderAITurn(state, 'player1')).toBe(true);
  });

  it('selectIsland on unknown id is a no-op', () => {
    const state = {
      ...createRemainder(),
      phase: 'selectIsland' as const,
      currentRoll: { die1: 2, die2: 2, total: 4 },
      validIslands: findValidIslands(createRemainder(), 4),
    };
    const next = selectIsland(state, 'island-does-not-exist');
    expect(next.phase).toBe('selectIsland');
    expect(next.moveHistory?.length ?? 0).toBe(0);
  });
});

describe('Burn wave 8 — Par / Kwatro / Calla medium-hard legality', () => {
  it('Par hard getAIMove + executeAITurn history', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.3);
    const state = createPar();
    const move = getParAI(state, 'player1', 'hard');
    expect(move).not.toBeNull();
    expect(state.hands.player1.some((b) => b.id === move!.blockId)).toBe(true);
    const selected = selectBlock(state, move!.blockId);
    expect(isParValid(selected, move!.baseId)).toBe(true);
    const next = executeParAI(state, 'player1', 'hard');
    expect(next.moveHistory.length).toBeGreaterThanOrEqual(1);
  });

  it('Kwatro hard getAIMove lands on getValidMoves', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.8);
    const state = createKwa();
    expect(kwaHasMoves(state)).toBe(true);
    const move = getKwaAI(state, 'player1', 'hard');
    expect(move).not.toBeNull();
    expect(getKwaValid(state, move!.chipId)).toContain(move!.nodeId);
    const next = executeKwaAI(state, 'player1', 'medium');
    expect(next.moveHistory.length).toBeGreaterThanOrEqual(1);
  });

  it('Calla medium getAIMove pit ∈ getValidPits; analyzeMoves covers them', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.5);
    const state = createCalla();
    const valids = getValidPits(state);
    expect(valids.length).toBeGreaterThan(0);
    const analyzed = analyzeMoves(state, 'player1');
    expect(analyzed.length).toBe(valids.length);
    const move = getCallaAI(state, 'player1', 'medium');
    expect(move).not.toBeNull();
    expect(valids).toContain(move!.pit);
  });
});
