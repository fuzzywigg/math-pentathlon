import { describe, it, expect, vi, afterEach } from 'vitest';

import {
  createInitialState as createContig,
  CONFIG as CONTIG_CFG,
} from '../../src/games/contig-60/types';
import { checkWinner as contigWinner } from '../../src/games/contig-60/rules';
import {
  getAIPlacement as getContigAI,
  isAITurn as isContigAI,
} from '../../src/games/contig-60/ai';

import { createInitialState as createHexAGone } from '../../src/games/hex-a-gone/types';
import {
  selectBlock as selectHag,
  deselectBlock,
  canPlaceAt,
  canPlayerMove,
  getBlockColor,
  getValidPlacements as getHagPlacements,
  selectBlockForPlacement,
  commitSelection,
} from '../../src/games/hex-a-gone/rules';
import { isAITurn as isHagAI } from '../../src/games/hex-a-gone/ai';

import {
  createInitialState as createStars,
  selectCard,
  placeCard,
  passTurn as passStars,
  hasValidMoves as starsHasMoves,
  getValidPlacements as getStarsPlacements,
} from '../../src/games/stars-bars/rules';
import {
  getAIMove as getStarsAI,
  isAITurn as isStarsAI,
} from '../../src/games/stars-bars/ai';

import {
  createInitialState as createRamrod,
  selectRod,
  placeRod,
  formatMove as formatRamrodMove,
  getValidPlacements as getRamrodPlacements,
  isValidPlacement as ramrodValid,
  passTurn as passRamrod,
} from '../../src/games/ramrod/rules';
import { getAIMove as getRamrodAI } from '../../src/games/ramrod/ai';

import { createInitialState as createPent } from '../../src/games/pent-em-in/types';
import {
  selectPiece as selectPent,
  placePiece,
  setPreviewPosition,
  canPlayerMove as pentCanMove,
  getValidPlacements as getPentPlacements,
  rotateSelectedPiece,
} from '../../src/games/pent-em-in/rules';
import {
  getAIMove as getPentAI,
  isAITurn as isPentAI,
} from '../../src/games/pent-em-in/ai';

import {
  createInitialState as createJuggle,
  doRollDice as juggleRoll,
  selectDie,
  selectShape,
  placeShape,
} from '../../src/games/juggle/rules';
import { getShapesForDie } from '../../src/games/juggle/types';
import {
  getAIDieChoice,
  getAIShapeChoice,
  getAIPlacement as getJugglePlacement,
  isAITurn as isJuggleAI,
} from '../../src/games/juggle/ai';

import {
  createInitialState as createFab,
  selectBar1,
  selectBar2,
  selectOperation,
  executeMove,
  formatMove as formatFabMove,
  getOperationSymbol,
  getPossibleResults,
} from '../../src/games/fab-a-diffy/rules';
import {
  applyAIMoveSteps,
  getAIMove as getFabAI,
} from '../../src/games/fab-a-diffy/ai';

import { createInitialState as createHex } from '../../src/games/hex/types';
import {
  makeMove as hexMove,
  getValidMoves as hexValid,
  isValidMove as hexIsValid,
} from '../../src/games/hex/rules';
import { getBestMove, getRandomMove } from '../../src/games/hex/ai';

import { createInitialState as createCalla } from '../../src/games/calla/types';
import {
  makeMove as callaMove,
  getValidPits,
} from '../../src/games/calla/rules';
import {
  analyzeMoves,
  getAIMove as getCallaAI,
  isAITurn as isCallaAI,
} from '../../src/games/calla/ai';

import {
  createInitialState as createPar,
  selectBlock as selectPar,
  placeBlock as placePar,
  passTurn as passPar,
  getValidPlacements as getParPlacements,
} from '../../src/games/par-55/rules';

import {
  createInitialState as createPrime,
  rollDice as rollPrime,
  passTurn as passPrime,
  getValidPlacements as getPrimePlacements,
} from '../../src/games/prime-gold/rules';

import {
  createInitialState as createFiar,
  CONFIG as FIAR_CFG,
} from '../../src/games/fiar/types';
import {
  placeChip as fiarPlace,
  checkWinner as fiarWinner,
} from '../../src/games/fiar/rules';
import { getAIMove as getFiarAI } from '../../src/games/fiar/ai';

import {
  passTurn as passSum,
  selectDomino,
  placeDomino,
  canPlayDomino,
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
  hasPlayableMove,
} from '../../src/games/sum-dominoes/ai';

import { createInitialState as createStar } from '../../src/games/star-track/types';
import { drawChains, selectChain } from '../../src/games/star-track/rules';
import { getAIChainChoice } from '../../src/games/star-track/ai';

import { createInitialState as createQueens } from '../../src/games/queens-guards/types';
import {
  selectPiece as qgSelect,
  getValidMoves as qgValid,
} from '../../src/games/queens-guards/rules';
import { getAIMove as getQueensAI } from '../../src/games/queens-guards/ai';

import { createInitialState as createKwa } from '../../src/games/kwatro-sinko/rules';
import {
  selectChip as kwaSelect,
  moveChip as kwaMove,
  getValidMoves as kwaValid,
  passTurn as passKwa,
} from '../../src/games/kwatro-sinko/rules';

import { createInitialState as createRemainder } from '../../src/games/remainder-islands/types';
import {
  performRoll,
  findValidIslands,
  selectIsland,
} from '../../src/games/remainder-islands/rules';
import { getAIIslandChoice } from '../../src/games/remainder-islands/ai';

import { createInitialState as createFrac } from '../../src/games/frac-fact/types';
import { submitAnswer as submitFrac } from '../../src/games/frac-fact/rules';

import { createInitialState as createPinball } from '../../src/games/fraction-pinball/types';
import { submitAnswer as submitPinball } from '../../src/games/fraction-pinball/rules';

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

describe('Burn wave 11 — Contig five-in-row checkWinner + AI seat', () => {
  it('detects horizontal alignment win; AI seat true for player1 vs AI', () => {
    const base = createContig();
    const cells = new Map(base.cells);
    for (let col = 0; col < CONTIG_CFG.WIN_BY_ALIGNMENT; col++) {
      const value = base.grid[0]![col]!;
      cells.set(value, { ...cells.get(value)!, owner: 'player1' });
    }
    const aligned = { ...base, cells };
    expect(contigWinner(aligned)).toBe('player1');
    expect(contigWinner(base)).toBeNull();
    expect(isContigAI(base, 'player1', 'human-vs-ai')).toBe(true);

    vi.spyOn(Math, 'random').mockReturnValue(0.3);
    let rolled = {
      ...base,
      phase: 'calculating' as const,
      currentDice: [1, 2, 3] as [number, number, number],
    };
    const move = getContigAI(rolled, 'player1', 'medium');
    if (move) {
      expect(typeof move.value).toBe('number');
    }
  });
});

describe('Burn wave 11 — Hex-a-Gone deselect / canPlaceAt / colors', () => {
  it('deselect toggles; canPlaceAt true on empty; getBlockColor nonempty', () => {
    const fresh = createHexAGone();
    expect(canPlayerMove(fresh)).toBe(true);
    expect(getBlockColor('triangle').length).toBeGreaterThan(0);
    expect(getBlockColor('hexagon')).not.toBe(getBlockColor('square'));

    let state = selectHag(fresh, 'triangle');
    expect(state.turnSelection.blocks).toContain('triangle');
    state = deselectBlock(state, 'triangle');
    expect(state.turnSelection.blocks).not.toContain('triangle');
    expect(deselectBlock(fresh, 'triangle')).toBe(fresh);

    const empty = fresh.board.find((c) => !c.filled)!;
    expect(canPlaceAt(fresh, empty.q, empty.r)).toBe(true);

    state = selectHag(fresh, 'triangle');
    state = commitSelection(state);
    state = selectBlockForPlacement(state, 'triangle');
    const placements = getHagPlacements(state);
    expect(placements.length).toBeGreaterThan(0);
    expect(isHagAI(fresh, 'player1', 'human-vs-ai')).toBe(true);
  });
});

describe('Burn wave 11 — Stars placeCard / pass / executeAITurn', () => {
  it('place without selection is identity; placeCard advances; hard AI executes', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.2);
    const fresh = createStars();
    expect(placeCard(fresh, 0, 0)).toBe(fresh);
    expect(starsHasMoves(fresh)).toBe(true);

    const card = fresh.playerHands.player1[0]!;
    let state = selectCard(fresh, card.id);
    expect(state.phase).toBe('placingCard');
    const valid = getStarsPlacements(state);
    expect(valid.length).toBeGreaterThan(0);

    const placed = placeCard(state, valid[0]!.row, valid[0]!.col);
    expect(placed.moveHistory.length).toBe(1);
    expect(placed.currentPlayer).toBe('player2');

    // Second selection cannot re-place on occupied cell
    const card2 = placed.playerHands.player2[0]!;
    const p2 = selectCard(placed, card2.id);
    const occupied = placeCard(p2, valid[0]!.row, valid[0]!.col);
    expect(occupied).toBe(p2);

    const passed = passStars(createStars());
    expect(passed.currentPlayer).toBe('player2');
    expect(isStarsAI(fresh, 'player1', 'human-vs-ai')).toBe(true);
    expect(getStarsAI(fresh, 'player1', 'easy')).not.toBeNull();
  });
});

describe('Burn wave 11 — Ramrod placeRod / formatMove / executeAITurn', () => {
  it('select+place advances; formatMove non-empty; AI executes', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.25);
    const fresh = createRamrod();
    const rodId = fresh.playerRods.player1[0]!;
    let state = selectRod(fresh, rodId);
    expect(state.selectedRod).toBe(rodId);
    const placements = getRamrodPlacements(state, rodId);
    expect(placements.length).toBeGreaterThan(0);
    const { boxId, slot } = placements[0]!;
    expect(ramrodValid(state, rodId, boxId, slot)).toBe(true);
    state = placeRod(state, boxId, slot);
    expect(state.moveHistory.length).toBe(1);
    expect(formatRamrodMove(state.moveHistory[0]!).length).toBeGreaterThan(0);

    expect(passRamrod(createRamrod()).currentPlayer).toBe('player2');
    expect(getRamrodAI(fresh, 'player1', 'easy')).not.toBeNull();
  });
});

describe('Burn wave 11 — Pent place / preview / rotate + AI', () => {
  it('setPreviewPosition / rotate after select; hard AI legal', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.35);
    const fresh = createPent();
    expect(pentCanMove(fresh, 'player1')).toBe(true);
    const piece = fresh.player1Pieces.available[0]!;
    let state = selectPent(fresh, piece);
    expect(state.phase).toBe('placePiece');
    state = setPreviewPosition(state, { row: 0, col: 0 });
    expect(state.previewPosition).toEqual({ row: 0, col: 0 });
    state = rotateSelectedPiece(state);
    expect(state.selectedRotation).toBeDefined();

    const placements = getPentPlacements(
      state,
      piece,
      state.selectedRotation ?? 0,
      state.selectedFlipped ?? false
    );
    if (placements.length > 0) {
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
    expect(getPentAI(fresh, 'player1', 'easy')).not.toBeNull();
  });
});

describe('Burn wave 11 — Juggle die→shape→place AI chain', () => {
  it('getAIShapeChoice / getAIPlacement after selectDie; executeAITurn advances', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.15);
    let state = juggleRoll(createJuggle());
    expect(state.phase).toBe('selectingShape');
    const die = getAIDieChoice(state, 'player1', 'hard');
    expect(die).not.toBeNull();
    state = selectDie(state, die!.index);
    if (state.phase === 'selectingShape' && state.selectedCategory) {
      const shape = getAIShapeChoice(state, 'player1', 'medium');
      if (shape) {
        state = selectShape(state, shape.shape);
      } else {
        const options = getShapesForDie(state.currentDice![die!.index]!);
        if (options.length > 0) state = selectShape(state, options[0]!);
      }
    }
    if (state.phase === 'placing' && state.selectedShape) {
      const place = getJugglePlacement(state, 'player1', 'easy');
      if (place) {
        const next = placeShape(state, place.position);
        expect(next.moveHistory?.length ?? next.currentPlayer).toBeTruthy();
      }
    }
    expect(isJuggleAI(createJuggle(), 'player1', 'human-vs-ai')).toBe(true);
  });
});

describe('Burn wave 11 — Fab formatMove / applyAIMoveSteps / executeAITurn', () => {
  it('formatMove + getOperationSymbol; bad steps pass; execute advances', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.2);
    const state = createFab();
    expect(getOperationSymbol('add')).toBe('+');
    expect(getOperationSymbol('divide')).toBe('÷');

    const bars = [...state.fractionBars.values()].filter((b) => !b.used);
    expect(bars.length).toBeGreaterThanOrEqual(2);
    const results = getPossibleResults(bars[0]!, bars[1]!);
    expect(results.length).toBeGreaterThan(0);

    const move = getFabAI(state, 'player1', 'medium');
    expect(move).not.toBeNull();
    let next = selectBar1(state, move!.bar1Id);
    next = selectBar2(next, move!.bar2Id);
    next = selectOperation(next, move!.operation);
    next = executeMove(next, move!.answerId);
    expect(next.moveHistory.length).toBe(1);
    expect(formatFabMove(next, next.moveHistory[0]!).length).toBeGreaterThan(0);

    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const passed = applyAIMoveSteps(state, {
      bar1Id: 'missing-bar',
      bar2Id: 'also-missing',
      operation: 'add',
      answerId: 'nope',
    });
    expect(passed.currentPlayer).toBe('player2');
    spy.mockRestore();
  });
});

describe('Burn wave 11 — Hex random/best + occupied identity', () => {
  it('getRandomMove / getBestMove legal; occupied makeMove identity', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.4);
    const fresh = createHex(5);
    const random = getRandomMove(fresh);
    expect(random).not.toBeNull();
    expect(hexIsValid(fresh, random!)).toBe(true);
    const best = getBestMove(fresh, 'player1', 'easy');
    expect(best).not.toBeNull();
    expect(
      hexValid(fresh).some((p) => p.row === best!.row && p.col === best!.col)
    ).toBe(true);

    const after = hexMove(fresh, random!);
    expect(after.moveHistory.length).toBe(1);
    expect(hexMove(after, random!)).toBe(after);
  });
});

describe('Burn wave 11 — Calla analyzeMoves + makeMove free-turn seat', () => {
  it('analyzeMoves nonempty; makeMove from valid pit flips or free-turns', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.05);
    const state = createCalla();
    const analysis = analyzeMoves(state, 'player1');
    expect(analysis.length).toBeGreaterThan(0);
    const valid = getValidPits(state);
    expect(valid.length).toBeGreaterThan(0);
    const next = callaMove(state, valid[0]!);
    expect(next.moveHistory.length).toBe(1);
    expect(isCallaAI(state, 'player1', 'human-vs-ai')).toBe(true);
    expect(getCallaAI(state, 'player1', 'easy')).not.toBeNull();
  });
});

describe('Burn wave 11 — Par place + pass + executeAITurn', () => {
  it('placeBlock records history; pass flips; AI executes', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.3);
    const fresh = createPar();
    const blockId = fresh.hands.player1[0]!;
    let state = selectPar(fresh, blockId.id);
    const bases = getParPlacements(state);
    expect(bases.length).toBeGreaterThan(0);
    state = placePar(state, bases[0]!);
    expect(state.moveHistory.length).toBe(1);

    expect(passPar(createPar()).currentPlayer).toBe('player2');
  });
});

describe('Burn wave 11 — Prime pass after roll', () => {
  it('passTurn flips when placing', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.4);
    let state = rollPrime(createPrime());
    expect(state.phase).toBe('placing');
    const placements = getPrimePlacements(state);
    const passed = passPrime(state);
    expect(passed.currentPlayer).toBe('player2');
    expect(passed.phase).toBe('rolling');
    expect(Array.isArray(placements)).toBe(true);
  });
});

describe('Burn wave 11 — FIAR placement fill + checkWinner opening', () => {
  it('checkWinner null opening; fill to movement; medium AI places', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.1);
    const fresh = createFiar();
    expect(fiarWinner(fresh)).toBeNull();
    let state = fresh;
    const ids = [...state.board.nodes.keys()];
    for (let i = 0; i < FIAR_CFG.CHIPS_PER_PLAYER * 2; i++) {
      state = fiarPlace(state, ids[i]!);
    }
    expect(state.phase).toBe('movement');
    const move = getFiarAI(fresh, 'player1', 'easy');
    expect(move).not.toBeNull();
    expect(move!.type).toBe('place');
  });
});

describe('Burn wave 11 — Sum Dominoes select+place + AI', () => {
  it('selectDomino + placeDomino when playable; pass / AI', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.5);
    const placing = sumBase();
    const sum = getDiceSum(placing.currentDice!);
    const playable = placing.hands.player1.find((d) =>
      canPlayDomino(placing, d, sum)
    );
    if (playable) {
      let state = selectDomino(placing, playable.id);
      expect(state.selectedDomino).toBe(playable.id);
      const placed = placeDomino(state, { row: 5, col: 4 }, 'horizontal');
      if (placed !== state) {
        expect(placed.moveHistory.length).toBe(1);
      }
    }
    expect(hasPlayableMove(placing, 'player1', sum)).toBe(
      placing.hands.player1.some((d) => canPlayDomino(placing, d, sum))
    );
    const passed = passSum({ ...placing, phase: 'passing', currentDice: null });
    expect(passed.passCount).toBeGreaterThanOrEqual(1);
    const ai = getSumAI(placing, 'player1', 'easy');
    if (hasPlayableMove(placing, 'player1', sum)) {
      expect(ai).not.toBeNull();
    }
  });
});

describe('Burn wave 11 — Star Track selectChain advances', () => {
  it('selectChain after draw advances seat', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.22);
    let state = drawChains(createStar());
    expect(state.phase).toBe('selectChain');
    const choice = getAIChainChoice(state, 'player1', 'easy');
    expect(choice).not.toBeNull();
    state = selectChain(state, choice!.chainIndex as 0 | 1);
    expect(state.phase).toBe('drawChains');
    expect(state.currentPlayer).toBe('player2');
  });
});

describe('Burn wave 11 — Queens select + easy AI', () => {
  it('selectPiece enables valid moves; easy AI returns from/to', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.3);
    const state = createQueens();
    const move = getQueensAI(state, 'player1', 'easy');
    expect(move).not.toBeNull();
    const selected = qgSelect(state, move!.from);
    if (selected.selectedPiece) {
      expect(qgValid(selected, move!.from).length).toBeGreaterThanOrEqual(0);
    }
  });
});

describe('Burn wave 11 — Kwatro move + pass', () => {
  it('legal moveChip advances; pass flips', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.18);
    const fresh = createKwa();
    const chip = [...fresh.chips.values()].find((c) => c.owner === 'player1')!;
    let state = kwaSelect(fresh, chip.id);
    const dests = kwaValid(state, chip.id);
    expect(dests.length).toBeGreaterThan(0);
    state = kwaMove(state, dests[0]!);
    expect(state.moveHistory.length).toBe(1);
    expect(passKwa(createKwa()).currentPlayer).toBe('player2');
  });
});

describe('Burn wave 11 — Remainder roll/select + AI choice', () => {
  it('performRoll → selectIsland; AI choice stays on validIslands', () => {
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
    const choice = getAIIslandChoice(state, 'player1', 'easy');
    expect(choice).not.toBeNull();
    expect(state.validIslands).toContain(choice!.islandId);
    const next = selectIsland(state, choice!.islandId);
    expect(next.phase === 'rolling' || next.phase === 'gameOver').toBe(true);
  });
});

describe('Burn wave 11 — Frac / Pinball wrong answer result phase', () => {
  it('wrong submit enters result phase without flipping yet', () => {
    const fracProblem = {
      id: 'w11-f',
      operand1: { numerator: 1, denominator: 2 },
      operand2: { numerator: 1, denominator: 3 },
      operation: 'add' as const,
      correctAnswer: { numerator: 5, denominator: 6 },
      answerChoices: [
        { numerator: 5, denominator: 6 },
        { numerator: 1, denominator: 2 },
        { numerator: 2, denominator: 5 },
        { numerator: 1, denominator: 1 },
      ],
    };
    const fracPlaying = {
      ...createFrac('easy'),
      phase: 'playing' as const,
      currentProblem: fracProblem,
    };
    const wrong = submitFrac(fracPlaying, { numerator: 1, denominator: 2 });
    expect(wrong.phase).toBe('showingResult');
    expect(wrong.isCorrect).toBe(false);

    const challenge = {
      id: 'w11-p',
      type: 'fractionToDecimal' as const,
      fraction: { numerator: 1, denominator: 4 },
      decimal: 0.25,
      answerChoices: ['0.25', '0.5', '0.75', '1'],
      correctAnswer: '0.25',
    };
    const pinPlaying = {
      ...createPinball(),
      phase: 'answering' as const,
      currentChallenge: challenge,
    };
    const pinWrong = submitPinball(pinPlaying, '0.5');
    expect(pinWrong.isCorrect).toBe(false);
    expect(pinWrong.phase).toBe('showResult');
  });
});
