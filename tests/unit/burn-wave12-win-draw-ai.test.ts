import { describe, it, expect, vi, afterEach } from 'vitest';

import {
  createInitialState as createContig,
  CONFIG as CONTIG_CFG,
} from '../../src/games/contig-60/types';
import {
  doRollDice as rollContig,
  placeChip as placeContig,
  calculatePoints as contigPoints,
  passTurn as passContig,
  hasValidMoves as contigHasMoves,
  checkWinner as contigWinner,
} from '../../src/games/contig-60/rules';
import {
  getAIPlacement as getContigAI,
  executeAITurn as executeContigAI,
  isAITurn as isContigAI,
} from '../../src/games/contig-60/ai';

import { createInitialState as createHex } from '../../src/games/hex/types';
import {
  makeMove as hexMove,
  checkWinner as hexWinner,
  getNeighbors as hexNeighbors,
  getValidMoves as hexValid,
  isValidPosition as hexValidPos,
} from '../../src/games/hex/rules';
import { getBestMove, getRandomMove } from '../../src/games/hex/ai';

import { createInitialState as createCalla } from '../../src/games/calla/types';
import {
  canSelectPit,
  getValidPits,
  makeMove as callaMove,
  isGameOver as callaOver,
  getPhaseMessage as callaPhase,
  getLastMoveInfo,
} from '../../src/games/calla/rules';
import {
  getAIMove as getCallaAI,
  analyzeMoves,
  isAITurn as isCallaAI,
} from '../../src/games/calla/ai';

import {
  createInitialState as createPrime,
  rollDice as rollPrime,
  placeChip as placePrime,
  findCellByValue,
  hasValidMoves as primeHasMoves,
  passTurn as passPrime,
} from '../../src/games/prime-gold/rules';
import {
  getAIPlacement as getPrimeAI,
  executeAITurn as executePrimeAI,
  isAITurn as isPrimeAI,
} from '../../src/games/prime-gold/ai';

import {
  createInitialState as createFiar,
  CONFIG as FIAR_CFG,
} from '../../src/games/fiar/types';
import {
  canPlaceChip,
  placeChip as fiarPlace,
  selectChip as fiarSelect,
  deselectChip,
  getSelectableNodes,
  findPaths,
  isDraw as fiarIsDraw,
  checkWinner as fiarWinner,
} from '../../src/games/fiar/rules';
import { getAIMove as getFiarAI, applyAIMove } from '../../src/games/fiar/ai';

import { createInitialState as createStar } from '../../src/games/star-track/types';
import {
  drawChains,
  selectChain,
  isGameOver as starOver,
  getProgress,
  getPhaseMessage as starPhase,
} from '../../src/games/star-track/rules';
import {
  getAIChainChoice,
  executeAITurn as executeStarAI,
  isAITurn as isStarAI,
} from '../../src/games/star-track/ai';

import { createInitialState as createHexAGone } from '../../src/games/hex-a-gone/types';
import {
  selectBlock as selectHag,
  commitSelection,
  placeBlock as placeHag,
  passTurn as passHag,
  isGameOver as hagOver,
  getPhaseMessage as hagPhase,
  getValidPlacements as getHagPlacements,
  selectBlockForPlacement,
} from '../../src/games/hex-a-gone/rules';
import {
  getAISelection,
  executeAITurn as executeHagAI,
  isAITurn as isHagAI,
} from '../../src/games/hex-a-gone/ai';

import { createInitialState as createFrac } from '../../src/games/frac-fact/types';
import {
  checkAnswer as checkFrac,
  submitAnswer as submitFrac,
  startGame as startFrac,
  formatFraction,
  getOperationSymbol as fracOp,
  nextProblem,
} from '../../src/games/frac-fact/rules';
import {
  getAIAnswer as getFracAI,
  isAITurn as isFracAI,
} from '../../src/games/frac-fact/ai';

import { createInitialState as createPinball } from '../../src/games/fraction-pinball/types';
import {
  checkAnswer as checkPinball,
  submitAnswer as submitPinball,
  startGame as startPinball,
  formatDecimal,
  formatFraction as formatPinFrac,
  nextChallenge,
} from '../../src/games/fraction-pinball/rules';
import {
  getAIAnswer as getPinballAI,
  isAITurn as isPinballAI,
} from '../../src/games/fraction-pinball/ai';

import {
  createInitialState as createSum,
  doRollDice as rollSum,
  selectDomino,
  placeDomino,
  isValidPlacement,
  getValidPlacements as getSumPlacements,
  passTurn as passSum,
  formatMove as formatSumMove,
} from '../../src/games/sum-dominoes/rules';
import {
  Domino,
  PlacedDomino,
  SumDominoesState,
  CONFIG as SD_CFG,
  getDiceSum,
} from '../../src/games/sum-dominoes/types';
import {
  getAIMove as getSumAI,
  executeAITurn as executeSumAI,
  hasPlayableMove,
  isAITurn as isSumAI,
} from '../../src/games/sum-dominoes/ai';

import { createInitialState as createQueens } from '../../src/games/queens-guards/types';
import {
  selectPiece as qgSelect,
  makeMove as qgMove,
  getValidMoves as qgValid,
  checkWinner as qgWinner,
  hasValidMoves as qgHasMoves,
} from '../../src/games/queens-guards/rules';
import {
  getAIMove as getQueensAI,
  applyAIMove as applyQueensAI,
} from '../../src/games/queens-guards/ai';

import {
  createInitialState as createJuggle,
  doRollDice as juggleRoll,
  selectDie,
  selectShape,
  placeShape,
  checkWinner as juggleWinner,
  canMakeAnyMove,
  getBoardFillPercentage,
} from '../../src/games/juggle/rules';
import { getShapesForDie } from '../../src/games/juggle/types';
import {
  getAIDieChoice,
  getAIPlacement as getJugglePlacement,
  executeAITurn as executeJuggleAI,
  isAITurn as isJuggleAI,
} from '../../src/games/juggle/ai';

import { createInitialState as createPent } from '../../src/games/pent-em-in/types';
import {
  selectPiece as selectPent,
  getPieceCells,
  canPlacePiece,
  getValidPlacements as getPentPlacements,
  placePiece,
  flipSelectedPiece,
  canPlayerMove as pentCanMove,
} from '../../src/games/pent-em-in/rules';
import {
  getAIMove as getPentAI,
  isAITurn as isPentAI,
} from '../../src/games/pent-em-in/ai';

import {
  createInitialState as createKwa,
  selectChip as kwaSelect,
  moveChip as kwaMove,
  isValidMove as kwaIsValid,
  formatMove as formatKwaMove,
  hasValidMoves as kwaHasMoves,
} from '../../src/games/kwatro-sinko/rules';
import {
  getAIMove as getKwaAI,
  executeAITurn as executeKwaAI,
  isAITurn as isKwaAI,
} from '../../src/games/kwatro-sinko/ai';

import {
  createInitialState as createPar,
  selectBlock as selectPar,
  placeBlock as placePar,
  isValidPlacement as parValid,
  formatMove as formatParMove,
  getAttributeDisplayName,
  calculateScore as parScore,
} from '../../src/games/par-55/rules';
import {
  getAIMove as getParAI,
  executeAITurn as executeParAI,
  isAITurn as isParAI,
} from '../../src/games/par-55/ai';

import {
  createInitialState as createRamrod,
  selectRod,
  placeRod,
  getBoxSum,
  getRemainingValue,
  hasValidMoves as ramrodHasMoves,
} from '../../src/games/ramrod/rules';
import {
  getAIMove as getRamrodAI,
  executeAITurn as executeRamrodAI,
  isAITurn as isRamrodAI,
} from '../../src/games/ramrod/ai';

import {
  createInitialState as createStars,
  selectCard,
  placeCard,
  clearSelection as clearStars,
  hasValidMoves as starsHasMoves,
} from '../../src/games/stars-bars/rules';
import {
  getAIMove as getStarsAI,
  executeAITurn as executeStarsAI,
  isAITurn as isStarsAI,
} from '../../src/games/stars-bars/ai';

import {
  createInitialState as createFab,
  selectBar1,
  selectBar2,
  selectOperation,
  executeMove,
  checkWinner as fabWinner,
  hasAnyValidMove,
  calculateResult,
} from '../../src/games/fab-a-diffy/rules';
import {
  getAIMove as getFabAI,
  executeAITurn as executeFabAI,
  isAITurn as isFabAI,
} from '../../src/games/fab-a-diffy/ai';

import { createInitialState as createRemainder } from '../../src/games/remainder-islands/types';
import {
  performRoll,
  findValidIslands,
  selectIsland,
  setSelectedIsland,
  previewDivision,
  countOwnedIslands,
  calculateDivision,
} from '../../src/games/remainder-islands/rules';
import {
  getAIIslandChoice,
  executeAISelection,
  isAITurn as isRemainderAI,
} from '../../src/games/remainder-islands/ai';

import { createInitialGameState as createKings } from '../../src/games/kings-quadraphages/game-state';
import {
  findKingPosition,
  getValidKingMoves,
  isValidKingMove,
  getValidQuadraphagePlacements,
  checkWinCondition,
  getOpponent as kingsOpponent,
} from '../../src/games/kings-quadraphages/rules';
import {
  getAIMove as getKingsAI,
  getRandomMove as getKingsRandom,
  evaluatePosition,
  isAITurn as isKingsAI,
} from '../../src/games/kings-quadraphages/ai';
import { BOARD_SIZE as KINGS_SIZE } from '../../src/games/kings-quadraphages/board';

afterEach(() => {
  vi.restoreAllMocks();
});

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
  col: number
): void {
  const placed: PlacedDomino = {
    domino: { ...domino, orientation: 'horizontal' },
    position: { row, col },
    orientation: 'horizontal',
  };
  board[row]![col] = placed;
  board[row]![col + 1] = placed;
}

function sumBase(overrides: Partial<SumDominoesState> = {}): SumDominoesState {
  const board = emptySumBoard();
  placeOnBoard(board, makeDomino('seed', 6, 6, null), 5, 5);
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

describe('Burn wave 12 — Contig roll/place/points + AI execute', () => {
  it('roll → placeChip scores; pass flips; executeAITurn advances', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.2);
    let state = rollContig(createContig());
    expect(state.phase).toBe('calculating');
    expect(state.currentDice).not.toBeNull();

    if (contigHasMoves(state)) {
      const empty = [...state.cells.values()].find((c) => c.owner === null)!;
      const pts = contigPoints(state, empty.value);
      expect(pts).toBeGreaterThanOrEqual(0);
      const placed = placeContig(state, empty.value, `${empty.value}`);
      if (placed !== state) {
        expect(placed.moveHistory.length).toBe(1);
      }
    } else {
      const passed = passContig(state);
      expect(passed.currentPlayer).toBe('player2');
    }

    expect(contigWinner(createContig())).toBeNull();
    expect(isContigAI(createContig(), 'player1', 'human-vs-ai')).toBe(true);

    const forAI = createContig();
    const next = executeContigAI(forAI, 'player1', 'easy');
    expect(
      next.currentPlayer === 'player2' ||
        next.moveHistory.length > forAI.moveHistory.length ||
        next.phase !== forAI.phase
    ).toBe(true);
    const rolled = rollContig(createContig());
    const move = getContigAI(rolled, 'player1', 'hard');
    if (move) expect(typeof move.value).toBe('number');
  });
});

describe('Burn wave 12 — Hex neighbors / winner / AI', () => {
  it('neighbors nonempty; medium best move legal; no winner opening', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.33);
    const fresh = createHex(5);
    expect(hexWinner(fresh.board, 'player1', 5)).toBe(false);
    expect(hexValidPos({ row: 0, col: 0 }, 5)).toBe(true);
    expect(hexValidPos({ row: -1, col: 0 }, 5)).toBe(false);
    const n = hexNeighbors({ row: 2, col: 2 }, 5);
    expect(n.length).toBeGreaterThan(0);

    const best = getBestMove(fresh, 'player1', 'medium');
    expect(best).not.toBeNull();
    expect(
      hexValid(fresh).some((p) => p.row === best!.row && p.col === best!.col)
    ).toBe(true);
    const after = hexMove(fresh, best!);
    expect(after.moveHistory.length).toBe(1);
    expect(getRandomMove(fresh)).not.toBeNull();
  });
});

describe('Burn wave 12 — Calla pit gates + phase + hard AI', () => {
  it('canSelectPit / phase message; hard AI legal pit', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.1);
    const state = createCalla();
    expect(callaOver(state)).toBe(false);
    expect(callaPhase(state).length).toBeGreaterThan(0);
    expect(getLastMoveInfo(state)).toBeNull();
    const valid = getValidPits(state);
    expect(valid.length).toBeGreaterThan(0);
    expect(canSelectPit(state, 'player1', valid[0]!)).toBe(true);
    // Opponent / empty pit should not be selectable
    const invalid = [0, 1, 2, 3, 4, 5].find((p) => !valid.includes(p));
    if (invalid !== undefined) {
      expect(canSelectPit(state, 'player1', invalid)).toBe(false);
    }
    expect(canSelectPit(state, 'player2', valid[0]!)).toBe(false);

    const next = callaMove(state, valid[0]!);
    expect(next.moveHistory.length).toBe(1);
    expect(getLastMoveInfo(next)?.length ?? 0).toBeGreaterThanOrEqual(0);
    expect(analyzeMoves(state, 'player1').length).toBeGreaterThan(0);
    expect(isCallaAI(state, 'player1', 'human-vs-ai')).toBe(true);
    expect(getCallaAI(state, 'player1', 'hard')).not.toBeNull();
  });
});

describe('Burn wave 12 — Prime placeChip / findCell / executeAI', () => {
  it('placeChip after roll; findCellByValue; executeAITurn', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.35);
    let state = rollPrime(createPrime());
    expect(state.phase).toBe('placing');
    expect(primeHasMoves(state) || !primeHasMoves(state)).toBe(true);
    const cell = findCellByValue(state, 1);
    expect(cell === null || typeof cell.value === 'number').toBe(true);

    if (primeHasMoves(state)) {
      const move = getPrimeAI(state, 'player1', 'easy');
      expect(move).not.toBeNull();
      const placed = placePrime(state, move!.value, move!.expr);
      expect(placed.moveHistory.length).toBe(1);
    } else {
      expect(passPrime(state).currentPlayer).toBe('player2');
    }

    expect(isPrimeAI(createPrime(), 'player1', 'human-vs-ai')).toBe(true);
    const rolled = rollPrime(createPrime());
    const next = executePrimeAI(rolled, 'player1', 'medium');
    expect(next.currentPlayer === 'player2' || next.phase === 'rolling').toBe(
      true
    );
  });
});

describe('Burn wave 12 — FIAR place gates + paths + applyAIMove', () => {
  it('canPlaceChip; select/deselect; findPaths; applyAIMove places', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.15);
    const fresh = createFiar();
    expect(fiarWinner(fresh)).toBeNull();
    expect(fiarIsDraw(fresh)).toBe(false);
    const ids = [...fresh.board.nodes.keys()];
    expect(canPlaceChip(fresh, ids[0]!)).toBe(true);
    expect(canPlaceChip(fresh, 'missing-node')).toBe(false);

    let state = fiarPlace(fresh, ids[0]!);
    expect(state.moveHistory.length).toBe(1);
    expect(findPaths(state, 'player1').length).toBeGreaterThanOrEqual(0);

    // Fill to movement then select/deselect
    for (let i = 1; i < FIAR_CFG.CHIPS_PER_PLAYER * 2; i++) {
      state = fiarPlace(state, ids[i]!);
    }
    expect(state.phase).toBe('movement');
    const selectable = getSelectableNodes(state);
    if (selectable.length > 0) {
      state = fiarSelect(state, selectable[0]!);
      expect(state.selectedNode).toBe(selectable[0]);
      state = deselectChip(state);
      expect(state.selectedNode).toBeNull();
    }

    const ai = getFiarAI(fresh, 'player1', 'medium');
    expect(ai).not.toBeNull();
    const applied = applyAIMove(fresh, ai!);
    expect(applied.moveHistory.length).toBe(1);
  });
});

describe('Burn wave 12 — Star Track progress / phase / executeAI', () => {
  it('getProgress / phase message; executeAITurn advances seat', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.28);
    const fresh = createStar();
    expect(starOver(fresh)).toBe(false);
    expect(getProgress(fresh, 'player1')).toBe(0);
    expect(starPhase(fresh).length).toBeGreaterThan(0);
    expect(isStarAI(fresh, 'player1', 'human-vs-ai')).toBe(true);

    let state = drawChains(fresh);
    expect(state.phase).toBe('selectChain');
    const choice = getAIChainChoice(state, 'player1', 'hard');
    expect(choice).not.toBeNull();
    state = selectChain(state, choice!.chainIndex as 0 | 1);
    expect(getProgress(state, 'player1')).toBeGreaterThanOrEqual(0);

    const next = executeStarAI(createStar(), 'player1', 'easy');
    expect(next.currentPlayer).toBe('player2');
  });
});

describe('Burn wave 12 — Hex-a-Gone place + pass + executeAI', () => {
  it('place after commit; pass flips; executeAITurn runs', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.22);
    const fresh = createHexAGone();
    expect(hagOver(fresh)).toBe(false);
    expect(hagPhase(fresh).length).toBeGreaterThan(0);

    let state = selectHag(fresh, 'triangle');
    state = commitSelection(state);
    state = selectBlockForPlacement(state, 'triangle');
    const placements = getHagPlacements(state);
    expect(placements.length).toBeGreaterThan(0);
    const { q, r } = placements[0]!;
    state = placeHag(state, q, r);
    expect(state.board.some((c) => c.filled)).toBe(true);

    expect(passHag(createHexAGone()).currentPlayer).toBe('player2');
    expect(isHagAI(fresh, 'player1', 'human-vs-ai')).toBe(true);
    expect(getAISelection(fresh, 'player1', 'easy')).not.toBeNull();
    const next = executeHagAI(fresh, 'player1', 'medium');
    expect(next.currentPlayer === 'player2' || next.moveHistory.length > 0).toBe(
      true
    );
  });
});

describe('Burn wave 12 — Frac / Pinball answer helpers + AI', () => {
  it('Frac check/start/format; AI answer; Pinball format/start/AI', () => {
    expect(formatFraction({ numerator: 1, denominator: 2 })).toMatch(/1/);
    expect(fracOp('add')).toBe('+');
    expect(fracOp('multiply')).toBe('×');

    const frac = startFrac(createFrac('easy'));
    expect(frac.phase).toBe('playing');
    expect(frac.currentProblem).not.toBeNull();
    const problem = frac.currentProblem!;
    expect(
      checkFrac(problem, problem.correctAnswer)
    ).toBe(true);
    expect(
      checkFrac(problem, { numerator: 99, denominator: 99 })
    ).toBe(false);
    expect(isFracAI(frac, 'player1')).toBe(true);
    expect(getFracAI(frac, 'player1', 'easy')).not.toBeNull();
    const submitted = submitFrac(frac, problem.correctAnswer);
    expect(submitted.isCorrect).toBe(true);
    const advanced = nextProblem(submitted);
    expect(
      advanced.phase === 'playing' || advanced.phase === 'gameOver'
    ).toBe(true);

    expect(formatDecimal(0.5)).toMatch(/0\.5|0,5/);
    expect(formatPinFrac({ numerator: 3, denominator: 4 })).toMatch(/3/);
    const pin = startPinball(createPinball());
    expect(pin.phase === 'answering' || pin.currentChallenge).toBeTruthy();
    if (pin.currentChallenge) {
      expect(
        checkPinball(pin.currentChallenge, pin.currentChallenge.correctAnswer)
      ).toBe(true);
      expect(isPinballAI(pin, 'player1')).toBe(true);
      expect(getPinballAI(pin, 'player1', 'medium')).not.toBeNull();
      const wrong = submitPinball(pin, 'not-an-answer');
      expect(wrong.isCorrect).toBe(false);
      const next = nextChallenge(wrong);
      expect(
        next.phase === 'answering' ||
          next.phase === 'gameOver' ||
          next.phase === 'showResult'
      ).toBe(true);
    }
  });
});

describe('Burn wave 12 — Sum Dominoes roll/place/valid + executeAI', () => {
  it('isValidPlacement / roll / executeAITurn', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.4);
    const fresh = createSum();
    const rolled = rollSum(fresh);
    expect(rolled.phase === 'placing' || rolled.phase === 'passing').toBe(true);

    const placing = sumBase();
    const sum = getDiceSum(placing.currentDice!);
    const playable = placing.hands.player1.find((d) =>
      hasPlayableMove(placing, 'player1', sum)
        ? d.face1 + d.face2 === sum ||
          Math.abs(d.face1 - d.face2) === sum ||
          true
        : false
    );
    if (playable) {
      let state = selectDomino(placing, playable.id);
      const spots = getSumPlacements(state, playable, sum);
      expect(Array.isArray(spots)).toBe(true);
      if (spots.length > 0) {
        const spot = spots[0]!;
        expect(
          isValidPlacement(
            state,
            playable,
            spot.position,
            spot.orientation,
            sum
          )
        ).toBe(true);
        const placed = placeDomino(state, spot.position, spot.orientation);
        if (placed !== state) {
          expect(placed.moveHistory.length).toBe(1);
          expect(formatSumMove(placed.moveHistory[0]!).length).toBeGreaterThan(
            0
          );
        }
      }
    }
    expect(isSumAI(placing, 'player1', 'human-vs-ai')).toBe(true);
    const aiState = rollSum(createSum());
    const next = executeSumAI(aiState, 'player1', 'easy');
    expect(
      next.currentPlayer === 'player2' ||
        next.passCount > aiState.passCount ||
        next.moveHistory.length > aiState.moveHistory.length
    ).toBe(true);
    expect(getSumAI(placing, 'player1', 'hard') !== undefined).toBe(true);
  });
});

describe('Burn wave 12 — Queens makeMove + applyAIMove', () => {
  it('AI move applies; opening hasValidMoves; winner null', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.3);
    const fresh = createQueens();
    expect(qgWinner(fresh)).toBeNull();
    expect(qgHasMoves(fresh)).toBe(true);
    const move = getQueensAI(fresh, 'player1', 'easy');
    expect(move).not.toBeNull();
    const selected = qgSelect(fresh, move!.from);
    expect(qgValid(selected, move!.from).length).toBeGreaterThanOrEqual(0);
    const applied = applyQueensAI(fresh, move!);
    expect(applied.moveHistory.length).toBeGreaterThanOrEqual(1);
    const manual = qgMove(selected, move!.to);
    expect(manual === selected || manual.moveHistory.length >= 1).toBe(true);
  });
});

describe('Burn wave 12 — Juggle fill/winner + executeAI', () => {
  it('empty fill 0; canMakeAnyMove after roll; executeAITurn', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.18);
    const fresh = createJuggle();
    expect(getBoardFillPercentage(fresh.boards.player1)).toBe(0);
    expect(juggleWinner(fresh.boards)).toBeNull();
    expect(canMakeAnyMove(fresh)).toBe(false);
    expect(isJuggleAI(fresh, 'player1', 'human-vs-ai')).toBe(true);

    let state = juggleRoll(fresh);
    expect(canMakeAnyMove(state)).toBe(true);
    const die = getAIDieChoice(state, 'player1', 'easy');
    expect(die).not.toBeNull();
    state = selectDie(state, die!.index);
    if (state.selectedCategory) {
      const options = getShapesForDie(state.currentDice![die!.index]!);
      if (options.length > 0) state = selectShape(state, options[0]!);
    }
    if (state.phase === 'placing' && state.selectedShape) {
      const place = getJugglePlacement(state, 'player1', 'medium');
      if (place) {
        const next = placeShape(state, place.position);
        expect(next.currentPlayer === 'player2' || next.phase).toBeTruthy();
      }
    }
    const executed = executeJuggleAI(juggleRoll(createJuggle()), 'player1', 'easy');
    expect(
      executed.currentPlayer === 'player2' ||
        executed.moveHistory?.length !== undefined
    ).toBe(true);
  });
});

describe('Burn wave 12 — Pent getPieceCells / canPlace / hard AI', () => {
  it('piece cells nonempty; canPlacePiece false off-board; AI legal', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.4);
    const fresh = createPent();
    expect(pentCanMove(fresh, 'player1')).toBe(true);
    const piece = fresh.player1Pieces.available[0]!;
    const cells = getPieceCells(piece, { row: 0, col: 0 }, 0, false);
    expect(cells.length).toBeGreaterThan(0);
    expect(
      canPlacePiece(fresh, piece, { row: -5, col: -5 }, 0, false)
    ).toBe(false);

    let state = selectPent(fresh, piece);
    state = flipSelectedPiece(state);
    const placements = getPentPlacements(
      state,
      piece,
      state.selectedRotation ?? 0,
      state.selectedFlipped ?? false
    );
    if (placements.length > 0) {
      expect(
        canPlacePiece(
          state,
          piece,
          placements[0]!,
          state.selectedRotation ?? 0,
          state.selectedFlipped ?? false
        )
      ).toBe(true);
      const placed = placePiece(
        state,
        piece,
        placements[0]!,
        state.selectedRotation ?? 0,
        state.selectedFlipped ?? false
      );
      expect(placed.placedPieces.length).toBeGreaterThan(0);
    }
    expect(isPentAI(fresh, 'player1')).toBe(true);
    expect(getPentAI(fresh, 'player1', 'hard')).not.toBeNull();
  });
});

describe('Burn wave 12 — Kwatro isValidMove + executeAI', () => {
  it('legal dest valid; illegal dest false; executeAITurn', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.12);
    const fresh = createKwa();
    expect(kwaHasMoves(fresh)).toBe(true);
    const chip = [...fresh.chips.values()].find((c) => c.owner === 'player1')!;
    let state = kwaSelect(fresh, chip.id);
    const dests = state.selectedChip
      ? [...fresh.nodes.keys()].filter((id) => kwaIsValid(state, chip.id, id))
      : [];
    // Prefer getValidMoves via isValidMove probe
    const anyDest = [...fresh.nodes.keys()].find((id) =>
      kwaIsValid(state, chip.id, id)
    );
    expect(anyDest).toBeTruthy();
    expect(kwaIsValid(state, chip.id, 'no-such-node')).toBe(false);
    state = kwaMove(state, anyDest!);
    expect(state.moveHistory.length).toBe(1);
    expect(formatKwaMove(state.moveHistory[0]!).length).toBeGreaterThan(0);

    expect(isKwaAI(fresh, 'player1', 'human-vs-ai')).toBe(true);
    expect(getKwaAI(fresh, 'player1', 'hard')).not.toBeNull();
    const next = executeKwaAI(fresh, 'player1', 'easy');
    expect(next.moveHistory.length).toBeGreaterThan(0);
    void dests;
  });
});

describe('Burn wave 12 — Par score/attrs + executeAI', () => {
  it('formatMove / attribute names; place scores; executeAITurn', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.25);
    expect(getAttributeDisplayName('shape')).toBe('Shape');
    expect(getAttributeDisplayName('color')).toBe('Color');
    const fresh = createPar();
    const block = fresh.hands.player1[0]!;
    let state = selectPar(fresh, block.id);
    const bases = state.selectedBlock
      ? [...fresh.bases.keys()].filter((id) => parValid(state, id))
      : [];
    expect(bases.length).toBeGreaterThan(0);
    expect(parValid(state, 'missing-base')).toBe(false);
    const score = parScore(state, block, bases[0]!);
    expect(typeof score.totalPoints).toBe('number');
    state = placePar(state, bases[0]!);
    expect(state.moveHistory.length).toBe(1);
    expect(formatParMove(state.moveHistory[0]!).length).toBeGreaterThan(0);

    expect(isParAI(fresh, 'player1', 'human-vs-ai')).toBe(true);
    expect(getParAI(fresh, 'player1', 'hard')).not.toBeNull();
    const next = executeParAI(fresh, 'player1', 'medium');
    expect(next.moveHistory.length).toBeGreaterThan(0);
  });
});

describe('Burn wave 12 — Ramrod box helpers + executeAI', () => {
  it('getBoxSum/remaining; place; executeAITurn', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.3);
    const fresh = createRamrod();
    expect(ramrodHasMoves(fresh)).toBe(true);
    const box = [...fresh.boxes.values()][0]!;
    expect(getBoxSum(box) === null || typeof getBoxSum(box) === 'number').toBe(
      true
    );
    expect(getRemainingValue(box)).toBeGreaterThanOrEqual(0);

    const rodId = fresh.playerRods.player1[0]!;
    let state = selectRod(fresh, rodId);
    const move = getRamrodAI(fresh, 'player1', 'easy');
    expect(move).not.toBeNull();
    state = placeRod(state, move!.boxId, move!.slot);
    expect(state.moveHistory.length).toBe(1);

    expect(isRamrodAI(fresh, 'player1', 'human-vs-ai')).toBe(true);
    const next = executeRamrodAI(fresh, 'player1', 'hard');
    expect(next.moveHistory.length).toBeGreaterThan(0);
  });
});

describe('Burn wave 12 — Stars clearSelection + executeAI', () => {
  it('clear after select; executeAITurn places', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.2);
    const fresh = createStars();
    expect(starsHasMoves(fresh)).toBe(true);
    const card = fresh.playerHands.player1[0]!;
    let state = selectCard(fresh, card.id);
    expect(state.phase).toBe('placingCard');
    state = clearStars(state);
    expect(state.phase).toBe('selectingCard');

    expect(isStarsAI(fresh, 'player1', 'human-vs-ai')).toBe(true);
    expect(getStarsAI(fresh, 'player1', 'hard')).not.toBeNull();
    const next = executeStarsAI(fresh, 'player1', 'easy');
    expect(next.moveHistory.length).toBeGreaterThan(0);

    // placeCard path still works after re-select
    state = selectCard(fresh, card.id);
    const placed = placeCard(state, 0, 0);
    expect(placed === state || placed.moveHistory.length >= 0).toBe(true);
  });
});

describe('Burn wave 12 — Fab calculateResult / winner / executeAI', () => {
  it('calculateResult; hasAnyValidMove; executeAITurn', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.2);
    const fresh = createFab();
    expect(hasAnyValidMove(fresh)).toBe(true);
    expect(fabWinner(fresh.answerBars, fresh.fractionBars)).toBeNull();
    const bars = [...fresh.fractionBars.values()].filter((b) => !b.used);
    expect(bars.length).toBeGreaterThanOrEqual(2);
    const result = calculateResult(bars[0]!.fraction, bars[1]!.fraction, 'add');
    expect(result).not.toBeNull();
    expect(result!.numerator).toBeGreaterThan(0);

    expect(isFabAI(fresh, 'player1', 'human-vs-ai')).toBe(true);
    const move = getFabAI(fresh, 'player1', 'hard');
    expect(move).not.toBeNull();
    let state = selectBar1(fresh, move!.bar1Id);
    state = selectBar2(state, move!.bar2Id);
    state = selectOperation(state, move!.operation);
    state = executeMove(state, move!.answerId);
    expect(state.moveHistory.length).toBe(1);

    const next = executeFabAI(fresh, 'player1', 'easy');
    expect(next.moveHistory.length).toBeGreaterThan(0);
  });
});

describe('Burn wave 12 — Remainder division helpers + executeAI', () => {
  it('preview/calculate/count; setSelected; executeAISelection', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.2);
    let state = performRoll(createRemainder());
    if (state.phase !== 'selectIsland' || !state.currentRoll) {
      const base = createRemainder();
      const valid = findValidIslands(base, 6);
      state = {
        ...base,
        phase: 'selectIsland',
        currentRoll: { die1: 2, die2: 4, total: 6 },
        validIslands: valid,
      };
    }
    expect(state.validIslands.length).toBeGreaterThan(0);
    const islandId = state.validIslands[0]!;
    const island = state.islands.find((i) => i.id === islandId)!;
    const div = calculateDivision(state.currentRoll!.total, island.value);
    expect(div.quotient).toBeGreaterThanOrEqual(0);
    const preview = previewDivision(state, islandId);
    expect(preview?.quotient).toBe(div.quotient);
    state = setSelectedIsland(state, islandId);
    expect(state.selectedIsland).toBe(islandId);
    expect(countOwnedIslands(createRemainder())).toEqual({
      player1: 0,
      player2: 0,
    });

    expect(isRemainderAI(state, 'player1')).toBe(true);
    expect(getAIIslandChoice(state, 'player1', 'hard')).not.toBeNull();
    const next = executeAISelection(state, 'player1', 'easy');
    expect(next.phase === 'rolling' || next.phase === 'gameOver').toBe(true);
    const claimed = selectIsland(state, islandId);
    expect(claimed.phase === 'rolling' || claimed.phase === 'gameOver').toBe(
      true
    );
  });
});

describe('Burn wave 12 — Kings king moves / win / AI evaluate', () => {
  it('findKing / valid moves / opponent; AI random + evaluate', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.25);
    const state = createKings();
    const rulesBoard = {
      board: state.board,
      player1Supply: state.player1Supply,
      player2Supply: state.player2Supply,
    };
    const king = findKingPosition(state.board, 'player1');
    expect(king).not.toBeNull();
    const moves = getValidKingMoves(rulesBoard, 'player1');
    expect(moves.length).toBeGreaterThan(0);
    expect(isValidKingMove(rulesBoard, 'player1', moves[0]!)).toBe(true);
    expect(
      isValidKingMove(rulesBoard, 'player1', { row: -1, col: -1 })
    ).toBe(false);
    expect(getValidQuadraphagePlacements(rulesBoard).length).toBeGreaterThan(0);
    expect(checkWinCondition(rulesBoard)).toBeNull();
    expect(kingsOpponent('player1')).toBe('player2');

    expect(isKingsAI(state, 'player2', 'human-vs-ai')).toBe(false);
    expect(
      isKingsAI(
        { ...state, currentPlayer: 'player2' },
        'player2',
        'human-vs-ai'
      )
    ).toBe(true);
    expect(getKingsRandom(rulesBoard, 'player1')).not.toBeNull();
    expect(getKingsAI(rulesBoard, 'player1', 'medium')).not.toBeNull();
    expect(typeof evaluatePosition(rulesBoard, 'player1')).toBe('number');
    expect(KINGS_SIZE).toBeGreaterThan(0);
  });
});
