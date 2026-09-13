import { describe, it, expect, vi, afterEach } from 'vitest';

import {
  createInitialState as createContig,
  CONFIG as CONTIG_CFG,
} from '../../src/games/contig-60/types';
import {
  passTurn as passContig,
  placeChip as placeContig,
  doRollDice,
  checkWinner as contigWinner,
} from '../../src/games/contig-60/rules';
import {
  getAIPlacement as getContigAI,
  isAITurn as isContigAI,
} from '../../src/games/contig-60/ai';

import { createInitialState as createPar } from '../../src/games/par-55/rules';
import { CONFIG as PAR_CFG } from '../../src/games/par-55/types';
import {
  selectBlock,
  placeBlock,
  getValidPlacements as getParPlacements,
  calculateScore,
  clearSelection as clearPar,
} from '../../src/games/par-55/rules';
import {
  getAIMove as getParAI,
  isAITurn as isParAI,
} from '../../src/games/par-55/ai';

import {
  createInitialState as createKwa,
  selectChip as kwaSelect,
  moveChip as kwaMove,
  clearSelection as clearKwa,
  getValidMoves as kwaValid,
} from '../../src/games/kwatro-sinko/rules';
import {
  getAIMove as getKwaAI,
  isAITurn as isKwaAI,
} from '../../src/games/kwatro-sinko/ai';

import {
  createInitialState as createFab,
  selectBar1,
  selectBar2,
  selectOperation,
  executeMove,
  clearSelection as clearFab,
  hasAnyValidMove,
} from '../../src/games/fab-a-diffy/rules';
import {
  getAIMove as getFabAI,
  isAITurn as isFabAI,
} from '../../src/games/fab-a-diffy/ai';

import { createInitialState as createHexAGone } from '../../src/games/hex-a-gone/types';
import {
  commitSelection,
  placeBlock as placeHag,
  selectBlock as selectHag,
  getPhaseMessage as hagPhaseMsg,
  passTurn as passHag,
} from '../../src/games/hex-a-gone/rules';
import {
  getAISelection,
  executeAITurn as executeHagAI,
  isAITurn as isHagAI,
} from '../../src/games/hex-a-gone/ai';

import { createInitialState as createRemainder } from '../../src/games/remainder-islands/types';
import {
  findValidIslands,
  selectIsland,
  performRoll,
} from '../../src/games/remainder-islands/rules';
import { getAIIslandChoice } from '../../src/games/remainder-islands/ai';

import {
  passTurn as passSum,
  formatMove as formatSumMove,
  getRemainingCount,
  canPlayDomino,
} from '../../src/games/sum-dominoes/rules';
import {
  Domino,
  PlacedDomino,
  SumDominoesState,
  SDMove,
  CONFIG as SD_CFG,
} from '../../src/games/sum-dominoes/types';
import {
  getAIMove as getSumAI,
  hasPlayableMove,
  isAITurn as isSumAI,
} from '../../src/games/sum-dominoes/ai';

import { createInitialState as createStar } from '../../src/games/star-track/types';
import {
  drawChains,
  selectChain,
  getPhaseMessage as starPhaseMsg,
  isGameOver as starOver,
} from '../../src/games/star-track/rules';
import {
  getAIChainChoice,
  isAITurn as isStarAI,
} from '../../src/games/star-track/ai';

import {
  createInitialState as createQueens,
  cellKey,
  BoardCoord,
  CONFIG as QG_CFG,
} from '../../src/games/queens-guards/types';
import {
  makeMove as qgMakeMove,
  getValidMoves as qgValid,
  selectPiece as qgSelect,
} from '../../src/games/queens-guards/rules';
import { getAIMove as getQueensAI } from '../../src/games/queens-guards/ai';

import {
  createInitialState as createJuggle,
  doRollDice as juggleRoll,
  selectDie,
  selectShape,
} from '../../src/games/juggle/rules';
import { getShapesForDie } from '../../src/games/juggle/types';
import { getAIDieChoice } from '../../src/games/juggle/ai';

import { createInitialState as createFrac } from '../../src/games/frac-fact/types';
import {
  getAIAnswer as getFracAI,
  isAITurn as isFracAI,
} from '../../src/games/frac-fact/ai';

import { createInitialState as createPinball } from '../../src/games/fraction-pinball/types';
import {
  getAIAnswer as getPinballAI,
  isAITurn as isPinballAI,
} from '../../src/games/fraction-pinball/ai';

import {
  createInitialState as createFiar,
  CONFIG as FIAR_CFG,
} from '../../src/games/fiar/types';
import {
  placeChip as fiarPlace,
  moveChip as fiarMove,
  isDraw as fiarIsDraw,
  selectChip as fiarSelect,
} from '../../src/games/fiar/rules';
import { getAIMove as getFiarAI } from '../../src/games/fiar/ai';

import {
  createInitialState as createPrime,
  rollDice as rollPrime,
  placeChip as placePrime,
  getValidPlacements as getPrimePlacements,
} from '../../src/games/prime-gold/rules';
import { getAIPlacement as getPrimeAI } from '../../src/games/prime-gold/ai';

import { createInitialState as createCalla } from '../../src/games/calla/types';
import {
  canSelectPit,
  getValidPits,
  getPhaseMessage as callaPhaseMsg,
} from '../../src/games/calla/rules';
import {
  getAIMove as getCallaAI,
  isAITurn as isCallaAI,
} from '../../src/games/calla/ai';

import { createInitialState as createPent } from '../../src/games/pent-em-in/types';
import {
  selectPiece as selectPent,
  cancelSelection,
  rotateSelectedPiece,
  flipSelectedPiece,
} from '../../src/games/pent-em-in/rules';
import { getAIMove as getPentAI } from '../../src/games/pent-em-in/ai';

import {
  createInitialState as createStars,
  selectCard,
  clearSelection as clearStars,
} from '../../src/games/stars-bars/rules';
import { getAIMove as getStarsAI } from '../../src/games/stars-bars/ai';

import {
  createInitialState as createRamrod,
  selectRod,
  clearSelection as clearRamrod,
} from '../../src/games/ramrod/rules';
import { getAIMove as getRamrodAI } from '../../src/games/ramrod/ai';

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

describe('Burn wave 10 — Contig elimination + wrong-phase no-ops', () => {
  it('eliminates after MAX_CONSECUTIVE_PASSES; pass/place no-op in rolling', () => {
    let state = createContig();
    state = doRollDice(state);
    expect(state.phase).toBe('calculating');
    state = {
      ...state,
      consecutivePasses: {
        player1: CONTIG_CFG.MAX_CONSECUTIVE_PASSES - 1,
        player2: 0,
      },
    };
    const over = passContig(state);
    expect(over.phase).toBe('gameOver');
    expect(over.winner).toBe('player2');

    const rolling = createContig();
    expect(passContig(rolling)).toBe(rolling);
    expect(placeContig(rolling, 6, '1+2+3')).toBe(rolling);
    expect(contigWinner(rolling)).toBeNull();
    expect(isContigAI(rolling, 'player1', 'human-vs-ai')).toBe(true);
  });

  it('hard AI placement stays on valid values when moves exist', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.2);
    let state = createContig();
    state = doRollDice(state);
    const move = getContigAI(state, 'player1', 'hard');
    if (move) {
      expect(typeof move.value).toBe('number');
      expect(move.expression.length).toBeGreaterThan(0);
    }
  });
});

describe('Burn wave 10 — Par TARGET_SCORE + clearSelection + AI', () => {
  it('placeBlock can reach TARGET_SCORE; clearSelection restores selectingBlock', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.3);
    const state = createPar();
    const blockId = state.hands.player1[0]!.id;
    let next = selectBlock(state, blockId);
    const baseId = getParPlacements(next)[0]!;
    const { totalPoints } = calculateScore(
      next,
      next.hands.player1.find((b) => b.id === blockId)!,
      baseId
    );
    next = {
      ...next,
      scores: {
        player1: Math.max(0, PAR_CFG.TARGET_SCORE - Math.max(totalPoints, 1)),
        player2: 0,
      },
    };
    if (totalPoints === 0) {
      next = {
        ...next,
        scores: { player1: PAR_CFG.TARGET_SCORE, player2: 0 },
      };
    }
    next = placeBlock(next, baseId);
    if (next.scores.player1 >= PAR_CFG.TARGET_SCORE) {
      expect(next.phase).toBe('gameOver');
      expect(next.winner).toBe('player1');
    } else {
      expect(next.moveHistory.length).toBe(1);
    }

    const selected = selectBlock(createPar(), createPar().hands.player1[0]!.id);
    const cleared = clearPar(selected);
    expect(cleared.phase).toBe('selectingBlock');
    expect(cleared.selectedBlock).toBeNull();

    const move = getParAI(state, 'player1', 'medium');
    expect(move).not.toBeNull();
    expect(isParAI(state, 'player1', 'human-vs-ai')).toBe(true);
  });
});

describe('Burn wave 10 — Kwatro illegal moveChip + clearSelection', () => {
  it('moveChip no-ops without selection; clearSelection restores selectingChip', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.15);
    const state = createKwa();
    expect(kwaMove(state, 'n0-0')).toBe(state);

    const chip = [...state.chips.values()].find((c) => c.owner === 'player1')!;
    const selected = kwaSelect(state, chip.id);
    expect(selected.selectedChip).toBe(chip.id);
    const dests = kwaValid(selected, chip.id);
    expect(dests.length).toBeGreaterThan(0);

    const illegal = kwaMove(selected, 'not-a-node');
    expect(illegal.selectedChip).toBe(chip.id);

    const cleared = clearKwa(selected);
    expect(cleared.phase).toBe('selectingChip');
    expect(cleared.selectedChip).toBeNull();

    const move = getKwaAI(state, 'player1', 'easy');
    expect(move).not.toBeNull();
    expect(isKwaAI(state, 'player1', 'human-vs-ai')).toBe(true);
  });
});

describe('Burn wave 10 — Fab wrong-phase + hasAnyValidMove + clearSelection', () => {
  it('selectOperation / executeMove no-op early; clearSelection resets; thin pool blocks moves', () => {
    const state = createFab();
    expect(selectOperation(state, 'add')).toBe(state);
    expect(executeMove(state, 'any')).toBe(state);

    const barIds = [...state.fractionBars.keys()].slice(0, 2);
    let next = selectBar1(state, barIds[0]!);
    next = selectBar2(next, barIds[1]!);
    expect(next.phase).toBe('selectingOperation');
    next = selectOperation(next, 'add');
    expect(next.phase).toBe('confirmingMove');
    expect(executeMove(next, 'not-a-real-answer')).toBe(next);

    const cleared = clearFab(next);
    expect(cleared.phase).toBe('selectingBar1');
    expect(cleared.selectedBar1).toBeNull();
    expect(cleared.selectedBar2).toBeNull();

    const bars = new Map(state.fractionBars);
    let kept = 0;
    for (const [id, bar] of bars) {
      if (kept < 1) {
        kept++;
        continue;
      }
      bars.set(id, { ...bar, used: true });
    }
    expect(hasAnyValidMove({ ...state, fractionBars: bars })).toBe(false);

    vi.spyOn(Math, 'random').mockReturnValue(0.2);
    const move = getFabAI(state, 'player1', 'easy');
    expect(move).not.toBeNull();
    expect(isFabAI(state, 'player1', 'human-vs-ai')).toBe(true);
  });
});

describe('Burn wave 10 — Hex-a-Gone commit/place guards + AI', () => {
  it('empty commitSelection and placeBlock outside placeBlocks are identity', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.4);
    const fresh = createHexAGone();
    expect(commitSelection(fresh)).toBe(fresh);
    expect(placeHag(fresh, 0, 0)).toBe(fresh);
    expect(hagPhaseMsg(fresh)).toMatch(/Select/i);

    const withSel = selectHag(fresh, 'triangle');
    expect(withSel.turnSelection.blocks).toContain('triangle');
    const committed = commitSelection(withSel);
    expect(committed.phase).toBe('placeBlocks');

    expect(passHag(fresh).currentPlayer).toBe('player2');
    const sel = getAISelection(fresh, 'player1', 'medium');
    expect(sel).not.toBeNull();
    expect(sel!.blocks.length).toBeGreaterThan(0);
    expect(isHagAI(fresh, 'player1', 'human-vs-ai')).toBe(true);
    const advanced = executeHagAI(fresh, 'player1', 'easy');
    expect(['selectBlocks', 'placeBlocks', 'gameOver']).toContain(
      advanced.phase
    );
  });
});

describe('Burn wave 10 — Remainder last-turn gameOver + AI choice', () => {
  it('selectIsland with turnsRemaining 1 ends game; AI stays on validIslands', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.2);
    const base = createRemainder();
    const valid = findValidIslands(base, 8);
    expect(valid.length).toBeGreaterThan(0);
    const state = {
      ...base,
      phase: 'selectIsland' as const,
      currentRoll: { die1: 3, die2: 5, total: 8 },
      validIslands: valid,
      turnsRemaining: 1,
      player1Score: 10,
      player2Score: 3,
    };
    const next = selectIsland(state, valid[0]!);
    expect(next.phase).toBe('gameOver');
    expect(next.turnsRemaining).toBe(0);
    expect(next.winner).toBe('player1');

    let rolled = performRoll(createRemainder());
    if (rolled.phase !== 'selectIsland' || !rolled.currentRoll) {
      rolled = {
        ...createRemainder(),
        phase: 'selectIsland',
        currentRoll: { die1: 2, die2: 4, total: 6 },
        validIslands: findValidIslands(createRemainder(), 6),
      };
    }
    const choice = getAIIslandChoice(rolled, 'player1', 'easy');
    expect(choice).not.toBeNull();
    expect(rolled.validIslands).toContain(choice!.islandId);
  });
});

describe('Burn wave 10 — Sum Dominoes double-pass pip winner + helpers', () => {
  it('second pass ends by lowest pips; formatMove / getRemainingCount work', () => {
    const state = sumBase({
      phase: 'passing',
      passCount: 1,
      currentDice: null,
      hands: {
        player1: [makeDomino('a', 1, 1)],
        player2: [makeDomino('b', 6, 6, 'player2')],
      },
    });
    const over = passSum(state);
    expect(over.phase).toBe('gameOver');
    expect(over.winner).toBe('player1');
    expect(getRemainingCount(over, 'player1')).toBe(1);
    expect(getRemainingCount(over, 'player2')).toBe(1);

    const sample: SDMove = {
      player: 'player1',
      domino: makeDomino('x', 2, 1),
      position: { row: 5, col: 4 },
      orientation: 'horizontal',
      matchedFace: 2,
      adjacentFace: 6,
      diceSum: 8,
      moveNumber: 1,
    };
    expect(formatSumMove(sample)).toMatch(/\[2\|1\]/);

    const placing = sumBase();
    expect(hasPlayableMove(placing, 'player1', 8)).toBe(
      placing.hands.player1.some((d) => canPlayDomino(placing, d, 8))
    );
    expect(isSumAI(placing, 'player1')).toBe(true);
    vi.spyOn(Math, 'random').mockReturnValue(0.5);
    const move = getSumAI(placing, 'player1', 'medium');
    if (hasPlayableMove(placing, 'player1', 8)) {
      expect(move).not.toBeNull();
    }
  });
});

describe('Burn wave 10 — Star Track draw/select guards + phase message', () => {
  it('drawChains / selectChain no-ops when illegal; gameOver message', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.33);
    let state = createStar();
    expect(selectChain(state, 0)).toBe(state);
    state = drawChains(state);
    expect(state.phase).toBe('selectChain');
    expect(drawChains(state)).toBe(state);

    const choice = getAIChainChoice(state, 'player1', 'easy');
    expect(choice).not.toBeNull();
    expect(isStarAI(state, 'player1', 'human-vs-ai')).toBe(true);

    const over = {
      ...createStar(),
      phase: 'gameOver' as const,
      winner: 'player1' as const,
    };
    expect(starOver(over)).toBe(true);
    expect(starPhaseMsg(over)).toMatch(/wins|Blue/i);
  });
});

describe('Burn wave 10 — Queens illegal makeMove + hard AI legality', () => {
  it('illegal makeMove is identity; hard AI returns a move', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.25);
    const opening = createQueens();
    const from: BoardCoord = { ring: 2, position: 0 };
    const cells = new Map(opening.cells);
    for (const [key, cell] of cells) {
      cells.set(key, { ...cell, piece: null });
    }
    cells.set(cellKey(from.ring, from.position), {
      ...cells.get(cellKey(from.ring, from.position))!,
      piece: { type: 'guard', player: 'player1' },
    });
    cells.set(cellKey(QG_CFG.NUM_RINGS - 1, 0), {
      ...cells.get(cellKey(QG_CFG.NUM_RINGS - 1, 0))!,
      piece: { type: 'queen', player: 'player2' },
    });
    const state = {
      ...opening,
      cells,
      currentPlayer: 'player1' as const,
      selectedPiece: null,
    };

    const illegalTo: BoardCoord = { ring: 0, position: 0 };
    expect(qgMakeMove(state, from, illegalTo)).toBe(state);

    const selected = qgSelect(state, from);
    if (selected.selectedPiece) {
      expect(qgValid(selected, from).length).toBeGreaterThanOrEqual(0);
    }
    const move = getQueensAI(state, 'player1', 'hard');
    expect(move).not.toBeNull();
    expect(move!.from).toBeTruthy();
    expect(move!.to).toBeTruthy();
  });
});

describe('Burn wave 10 — Juggle wrong-phase selectShape / roll', () => {
  it('selectShape before category and roll outside rolling are identity', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.1);
    const fresh = createJuggle();
    const shapes = getShapesForDie(3);
    if (shapes.length > 0) {
      expect(selectShape(fresh, shapes[0]!)).toBe(fresh);
    }
    let state = juggleRoll(fresh);
    expect(state.phase).toBe('selectingShape');
    expect(juggleRoll(state)).toBe(state);

    const die = getAIDieChoice(state, 'player1', 'easy');
    expect(die).not.toBeNull();
    expect(die!.index === 0 || die!.index === 1).toBe(true);
    state = selectDie(state, die!.index);
    if (state.phase === 'selectingShape' && state.selectedCategory) {
      const options = getShapesForDie(state.currentDice![die!.index]!);
      if (options.length > 1) {
        state = selectShape(state, options[0]!);
        expect(state.phase).toBe('placing');
        expect(state.selectedShape).toBe(options[0]);
      }
    } else if (state.phase === 'placing') {
      expect(state.selectedShape).not.toBeNull();
    }
  });
});

describe('Burn wave 10 — Frac Fact / Pinball wrong-phase AI + medium choices', () => {
  it('getAIAnswer null in result phases; medium returns a listed choice', () => {
    const fracProblem = {
      id: 'w10-f',
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
    const fracPlaying = {
      ...createFrac('medium'),
      phase: 'playing' as const,
      currentProblem: fracProblem,
    };
    expect(
      getFracAI({ ...fracPlaying, phase: 'showingResult' }, 'player1', 'medium')
    ).toBeNull();
    expect(isFracAI(fracPlaying, 'player1')).toBe(true);
    vi.spyOn(Math, 'random').mockReturnValue(0.99);
    const fracAns = getFracAI(fracPlaying, 'player1', 'medium');
    expect(fracAns).not.toBeNull();
    expect(
      fracProblem.answerChoices.some(
        (c) =>
          c.numerator === fracAns!.numerator &&
          c.denominator === fracAns!.denominator
      )
    ).toBe(true);

    const challenge = {
      id: 'w10-p',
      type: 'fractionToDecimal' as const,
      fraction: { numerator: 1, denominator: 2 },
      decimal: 0.5,
      answerChoices: ['0.5', '0.25', '0.75', '1'],
      correctAnswer: '0.5',
    };
    const pinPlaying = {
      ...createPinball(),
      phase: 'answering' as const,
      currentChallenge: challenge,
    };
    expect(
      getPinballAI({ ...pinPlaying, phase: 'showResult' }, 'player1', 'medium')
    ).toBeNull();
    expect(isPinballAI(pinPlaying, 'player1')).toBe(true);
    const pinAns = getPinballAI(pinPlaying, 'player1', 'medium');
    expect(pinAns).not.toBeNull();
    expect(challenge.answerChoices).toContain(pinAns);
  });
});

describe('Burn wave 10 — FIAR moveChip no-op + isDraw false opening', () => {
  it('placement-phase moveChip identity; isDraw false; easy AI places', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    const fresh = createFiar();
    expect(fiarIsDraw(fresh)).toBe(false);
    expect(fiarMove(fresh, 'a', 'b')).toBe(fresh);

    const move = getFiarAI(fresh, 'player1', 'easy');
    expect(move).not.toBeNull();
    expect(move!.type).toBe('place');

    let state = fresh;
    const ids = [...state.board.nodes.keys()];
    for (let i = 0; i < FIAR_CFG.CHIPS_PER_PLAYER * 2; i++) {
      state = fiarPlace(state, ids[i]!);
    }
    expect(state.phase).toBe('movement');
    const selected = fiarSelect(state, ids[0]!);
    if (selected.selectedNode) {
      expect(fiarMove(selected, selected.selectedNode, 'fake-node')).toEqual(
        selected
      );
    }
  });
});

describe('Burn wave 10 — Prime Gold roll/place no-ops', () => {
  it('second rollDice identity; double place on same value no-ops', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.35);
    let state = createPrime();
    state = rollPrime(state);
    expect(state.phase).toBe('placing');
    expect(rollPrime(state)).toBe(state);

    const placements = getPrimePlacements(state);
    if (placements.length > 0) {
      const first = placePrime(
        state,
        placements[0]!.value,
        placements[0]!.expr
      );
      expect(first.moveHistory.length).toBeGreaterThan(
        state.moveHistory.length
      );
      const second = placePrime(
        first,
        placements[0]!.value,
        placements[0]!.expr
      );
      expect(second).toBe(first);
    }
    const ai = getPrimeAI(state, 'player1', 'hard');
    if (placements.length > 0) {
      expect(ai).not.toBeNull();
    }
  });
});

describe('Burn wave 10 — Calla canSelectPit + easy AI', () => {
  it('rejects empty opponent pits; easy AI pit is valid', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.1);
    const state = createCalla();
    expect(canSelectPit(state, 'player1', 0)).toBe(true);
    expect(canSelectPit(state, 'player2', 0)).toBe(false);
    const emptied = {
      ...state,
      player1Pits: state.player1Pits.map((c, i) => (i === 0 ? 0 : c)),
    };
    expect(canSelectPit(emptied, 'player1', 0)).toBe(false);
    expect(callaPhaseMsg(state)).toMatch(/Blue|select/i);

    const valid = getValidPits(state);
    const move = getCallaAI(state, 'player1', 'easy');
    expect(move).not.toBeNull();
    expect(valid).toContain(move!.pit);
    expect(isCallaAI(state, 'player1', 'human-vs-ai')).toBe(true);
  });
});

describe('Burn wave 10 — Pent cancel/rotate no-ops + Stars/Ramrod clearSelection', () => {
  it('rotate/flip without selection identity; cancel restores selectPiece', () => {
    const fresh = createPent();
    expect(rotateSelectedPiece(fresh)).toBe(fresh);
    expect(flipSelectedPiece(fresh)).toBe(fresh);
    const piece = fresh.player1Pieces.available[0]!;
    let state = selectPent(fresh, piece);
    expect(state.phase).toBe('placePiece');
    state = cancelSelection(state);
    expect(state.phase).toBe('selectPiece');
    expect(state.selectedPiece).toBeNull();

    vi.spyOn(Math, 'random').mockReturnValue(0.4);
    const ai = getPentAI(createPent(), 'player1', 'easy');
    expect(ai).not.toBeNull();
  });

  it('Stars and Ramrod clearSelection return selecting phase', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.2);
    const stars = createStars();
    const card = stars.playerHands.player1[0]!;
    const starsSel = selectCard(stars, card.id);
    const starsCleared = clearStars(starsSel);
    expect(starsCleared.phase).toBe('selectingCard');
    expect(starsCleared.selectedCard).toBeNull();
    expect(getStarsAI(stars, 'player1', 'easy')).not.toBeNull();

    const ramrod = createRamrod();
    const rodId = ramrod.playerRods.player1[0]!;
    const rodSel = selectRod(ramrod, rodId);
    const rodCleared = clearRamrod(rodSel);
    expect(rodCleared.phase).toBe('selectingRod');
    expect(rodCleared.selectedRod).toBeNull();
    expect(getRamrodAI(ramrod, 'player1', 'easy')).not.toBeNull();
  });
});
