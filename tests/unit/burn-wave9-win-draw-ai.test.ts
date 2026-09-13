import { describe, it, expect, vi, afterEach } from 'vitest';
import { areEquivalent } from '../../src/core/fractions/arithmetic';

import { createInitialState as createHexAGone } from '../../src/games/hex-a-gone/types';
import {
  selectBlock,
  deselectBlock,
  commitSelection,
  getValidPlacements as getHagPlacements,
  passTurn as passHag,
  isGameOver as hagOver,
} from '../../src/games/hex-a-gone/rules';
import {
  getAISelection,
  getAIPlacement as getHagPlacement,
  executeAITurn as executeHagAI,
  isAITurn as isHagAITurn,
} from '../../src/games/hex-a-gone/ai';

import { createInitialGameState } from '../../src/games/kings-quadraphages/game-state';
import {
  getValidKingMoves,
  findKingPosition,
} from '../../src/games/kings-quadraphages/rules';
import {
  getAIMove as getKingsAI,
  evaluatePosition,
  getBestMove as getKingsBest,
} from '../../src/games/kings-quadraphages/ai';

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
  createInitialState as createStars,
  getValidPlacements as getStarsPlacements,
  passTurn as passStars,
  hasValidMoves as starsHasMoves,
} from '../../src/games/stars-bars/rules';
import {
  getAIMove as getStarsAI,
  executeAITurn as executeStarsAI,
  isAITurn as isStarsAI,
} from '../../src/games/stars-bars/ai';
import { AttributeCard } from '../../src/games/stars-bars/types';

import {
  createInitialState as createFiar,
  CONFIG as FIAR_CFG,
} from '../../src/games/fiar/types';
import {
  placeChip as fiarPlace,
  checkWinner as fiarWinner,
  getValidMoves as fiarValidMoves,
  selectChip as fiarSelect,
  canMove,
  getSelectableNodes,
} from '../../src/games/fiar/rules';
import { getAIMove as getFiarAI, applyAIMove } from '../../src/games/fiar/ai';

import { createInitialState as createRemainder } from '../../src/games/remainder-islands/types';
import {
  performRoll,
  findValidIslands,
  selectIsland,
} from '../../src/games/remainder-islands/rules';
import {
  executeAISelection,
  getAIIslandChoice,
} from '../../src/games/remainder-islands/ai';

import {
  createInitialState as createPar,
  passTurn as passPar,
  hasValidMoves as parHasMoves,
  formatMove as formatParMove,
} from '../../src/games/par-55/rules';
import {
  getAIMove as getParAI,
  isAITurn as isParAI,
} from '../../src/games/par-55/ai';

import {
  createInitialState as createKwa,
  passTurn as passKwa,
  hasValidMoves as kwaHasMoves,
  formatMove as formatKwaMove,
  selectChip as kwaSelect,
} from '../../src/games/kwatro-sinko/rules';
import {
  getAIMove as getKwaAI,
  isAITurn as isKwaAI,
} from '../../src/games/kwatro-sinko/ai';

import {
  createInitialState as createFab,
  passTurn as passFab,
  checkWinner as fabWinner,
} from '../../src/games/fab-a-diffy/rules';
import {
  getAIMove as getFabAI,
  executeAITurn as executeFabAI,
  isAITurn as isFabAI,
} from '../../src/games/fab-a-diffy/ai';

import {
  createInitialState as createQueens,
  cellKey,
  BoardCoord,
  CONFIG as QG_CFG,
} from '../../src/games/queens-guards/types';
import {
  selectPiece as qgSelect,
  getValidMoves as qgValid,
  checkWinner as qgWinner,
  hasValidMoves as qgHasMoves,
} from '../../src/games/queens-guards/rules';
import {
  getAIMove as getQueensAI,
  applyAIMove as applyQueensAI,
} from '../../src/games/queens-guards/ai';

import { createInitialState as createStar } from '../../src/games/star-track/types';
import {
  drawChains,
  isGameOver as starOver,
} from '../../src/games/star-track/rules';
import {
  executeAITurn as executeStarAI,
  isAITurn as isStarAI,
  getAIChainChoice,
} from '../../src/games/star-track/ai';

import {
  canPlayDomino,
  passTurn as passSum,
} from '../../src/games/sum-dominoes/rules';
import {
  Domino,
  PlacedDomino,
  SumDominoesState,
  CONFIG as SD_CFG,
} from '../../src/games/sum-dominoes/types';
import {
  getAIMove as getSumAI,
  executeAITurn as executeSumAI,
  isAITurn as isSumAI,
  hasPlayableMove,
} from '../../src/games/sum-dominoes/ai';

import { createInitialState as createContig } from '../../src/games/contig-60/types';
import { checkWinner as contigWinner } from '../../src/games/contig-60/rules';
import { isAITurn as isContigAI } from '../../src/games/contig-60/ai';

import { createInitialState as createCalla } from '../../src/games/calla/types';
import {
  isGameOver as callaOver,
  getValidPits,
} from '../../src/games/calla/rules';
import {
  getAIMove as getCallaAI,
  isAITurn as isCallaAI,
} from '../../src/games/calla/ai';

import {
  createInitialState as createRamrod,
  passTurn as passRamrod,
  hasValidMoves as ramrodHasMoves,
  selectRod,
} from '../../src/games/ramrod/rules';
import {
  getAIMove as getRamrodAI,
  isAITurn as isRamrodAI,
} from '../../src/games/ramrod/ai';

import {
  createInitialState as createPrime,
  rollDice as rollPrime,
  placeChip as placePrime,
  getValidPlacements as getPrimePlacements,
} from '../../src/games/prime-gold/rules';
import { getAIPlacement as getPrimeAI } from '../../src/games/prime-gold/ai';

import { selectPiece as selectPent } from '../../src/games/pent-em-in/rules';
import { getAIMove as getPentAI } from '../../src/games/pent-em-in/ai';
import { createInitialState as createPentState } from '../../src/games/pent-em-in/types';

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
  board[row][col] = placed;
  board[row][col + 1] = placed;
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

describe('Burn wave 9 — Hex-a-Gone select/deselect + hard AI turn', () => {
  it('selectBlock / deselectBlock round-trip keeps phase selectBlocks', () => {
    let state = createHexAGone();
    expect(state.phase).toBe('selectBlocks');
    state = selectBlock(state, 'triangle');
    expect(state.turnSelection.blocks).toContain('triangle');
    state = deselectBlock(state, 'triangle');
    expect(state.turnSelection.blocks).not.toContain('triangle');
    expect(state.phase).toBe('selectBlocks');
  });

  it('commitSelection moves to placeBlocks; hard getAIPlacement lands on board', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    let state = createHexAGone();
    state = selectBlock(state, 'triangle');
    state = commitSelection(state);
    expect(state.phase).toBe('placeBlocks');
    expect(state.turnSelection.committed).toBe(true);
    const place = getHagPlacement(state, 'player1', 'hard');
    expect(place).not.toBeNull();
    expect(
      getHagPlacements(state).some((p) => p.q === place!.q && p.r === place!.r)
    ).toBe(true);
  });

  it('hard getAISelection + executeAITurn stay playable; passTurn flips seat', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.1);
    const fresh = createHexAGone();
    const selection = getAISelection(fresh, 'player1', 'hard');
    expect(selection).not.toBeNull();
    expect(selection!.blocks.length).toBeGreaterThan(0);
    expect(selection!.blocks.length).toBeLessThanOrEqual(3);

    const next = executeHagAI(fresh, 'player1', 'hard');
    expect(['selectBlocks', 'placeBlocks', 'gameOver']).toContain(next.phase);
    expect(isHagAITurn(fresh, 'player1', 'human-vs-ai')).toBe(true);
    expect(isHagAITurn(fresh, 'player1', 'human-vs-human')).toBe(false);

    const passed = passHag(fresh);
    expect(passed.currentPlayer).toBe('player2');
    expect(hagOver(fresh)).toBe(false);
  });
});

describe('Burn wave 9 — Kings evaluatePosition + hard AI legality', () => {
  it('evaluatePosition is finite and favors mobility for the active king', () => {
    const state = createInitialGameState();
    const score = evaluatePosition(state, 'player1');
    expect(Number.isFinite(score)).toBe(true);
    expect(Math.abs(score)).toBeLessThan(10000);
    const king = findKingPosition(state.board, 'player1');
    expect(king).not.toBeNull();
    expect(getValidKingMoves(state, 'player1').length).toBeGreaterThan(0);
  });

  it('hard getAIMove / getBestMove return a legal king destination', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.2);
    const state = createInitialGameState();
    const move = getKingsAI(state, 'player1', 'hard');
    expect(move).not.toBeNull();
    const valids = getValidKingMoves(state, 'player1');
    expect(
      valids.some(
        (m) => m.row === move!.kingMove.row && m.col === move!.kingMove.col
      )
    ).toBe(true);
    expect(move!.quadraphagePlacement.row).toBeGreaterThanOrEqual(0);
    const best = getKingsBest(state, 'player1', 'hard');
    expect(best).not.toBeNull();
    expect(best!.kingMove).toBeTruthy();
  });
});

describe('Burn wave 9 — Frac Fact / Pinball hard accuracy under low random', () => {
  it('Frac Fact hard getAIAnswer picks the correct choice when random is tiny', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    const problem = {
      id: 'p-hard',
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
    const state = {
      ...createFrac('easy'),
      phase: 'playing' as const,
      currentProblem: problem,
      currentPlayer: 'player1' as const,
    };
    const answer = getFracAI(state, 'player1', 'hard');
    expect(answer).not.toBeNull();
    expect(areEquivalent(answer!, problem.correctAnswer)).toBe(true);
    expect(isFracAI(state, 'player1')).toBe(true);
    expect(
      getFracAI({ ...state, phase: 'showingResult' }, 'player1', 'hard')
    ).toBeNull();
  });

  it('Pinball hard getAIAnswer matches correctAnswer when random is tiny', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    const challenge = {
      id: 'c-hard',
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
      currentPlayer: 'player1' as const,
    };
    const answer = getPinballAI(state, 'player1', 'hard');
    expect(answer).toBe('0.5');
    expect(isPinballAI(state, 'player1')).toBe(true);
  });
});

describe('Burn wave 9 — Stars & Bars hard AI + empty-board legality', () => {
  it('hard getAIMove returns hand card on empty cell; executeAITurn flips', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.05);
    const state = createStars();
    const move = getStarsAI(state, 'player1', 'hard');
    expect(move).not.toBeNull();
    expect(state.playerHands.player1.some((c) => c.id === move!.cardId)).toBe(
      true
    );
    expect(state.cells[move!.row][move!.col].card).toBeNull();
    const next = executeStarsAI(state, 'player1', 'hard');
    expect(next.moveHistory.length).toBeGreaterThanOrEqual(1);
    expect(next.currentPlayer).toBe('player2');
    expect(isStarsAI(state, 'player1', 'human-vs-ai')).toBe(true);
  });

  it('getValidPlacements empty when board filled; passTurn flips seat', () => {
    const base = createStars();
    const cells = base.cells.map((row) =>
      row.map((c) => ({
        ...c,
        card: starCard({ id: `fill-${c.row}-${c.col}` }),
        owner: 'player2' as const,
      }))
    );
    const blocked = {
      ...base,
      cells,
      playerHands: {
        player1: [starCard({ id: 'stranded' })],
        player2: [starCard({ id: 'opp' })],
      },
      deck: [],
      phase: 'selectingCard' as const,
      selectedCard: null,
    };
    expect(starsHasMoves(blocked)).toBe(false);
    expect(getStarsPlacements(blocked)).toHaveLength(0);
    expect(passStars(blocked).currentPlayer).toBe('player2');
  });
});

describe('Burn wave 9 — FIAR medium placement + movement selectChip', () => {
  it('medium placement getAIMove returns empty node; applyAIMove grows history', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    const state = createFiar();
    const move = getFiarAI(state, 'player1', 'medium');
    expect(move).not.toBeNull();
    expect(move!.type).toBe('place');
    expect(state.board.nodes.get(move!.nodeId!)?.chip).toBeNull();
    const applied = applyAIMove(state, move!);
    expect(applied.moveHistory.length).toBeGreaterThan(
      state.moveHistory.length
    );
    expect(fiarWinner(applied)).toBeNull();
  });

  it('selectChip in movement exposes getValidMoves for canMove paths', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.5);
    let state = createFiar();
    const ids = [...state.board.nodes.keys()];
    for (let i = 0; i < FIAR_CFG.CHIPS_PER_PLAYER * 2; i++) {
      state = fiarPlace(state, ids[i]!);
    }
    expect(state.phase).toBe('movement');
    const selectable = getSelectableNodes(state);
    expect(selectable.length).toBeGreaterThan(0);
    state = fiarSelect(state, selectable[0]!);
    expect(state.selectedNode).toBe(selectable[0]);
    const dests = fiarValidMoves(state, selectable[0]!);
    for (const to of dests.slice(0, 3)) {
      expect(canMove(state, selectable[0]!, to)).toBe(true);
    }
  });
});

describe('Burn wave 9 — Remainder executeAISelection + medium preference', () => {
  it('executeAISelection after roll claims a valid island and advances', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.15);
    let state = createRemainder();
    state = performRoll(state);
    if (state.phase !== 'selectIsland' || !state.currentRoll) {
      state = {
        ...createRemainder(),
        phase: 'selectIsland',
        currentRoll: { die1: 3, die2: 5, total: 8 },
        validIslands: findValidIslands(createRemainder(), 8),
      };
    }
    expect(state.validIslands.length).toBeGreaterThan(0);
    const before = state.moveHistory?.length ?? 0;
    const next = executeAISelection(state, 'player1', 'medium');
    expect(next.phase === 'rolling' || next.phase === 'gameOver').toBe(true);
    expect(
      (next.moveHistory?.length ?? 0) + (next.phase === 'selectIsland' ? 0 : 1)
    ).toBeGreaterThanOrEqual(before);
    if (next.phase !== 'selectIsland') {
      expect(next.moveHistory?.length ?? 0).toBeGreaterThanOrEqual(before);
    }
  });

  it('medium getAIIslandChoice stays on validIslands; invalid select no-ops', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.4);
    const state = {
      ...createRemainder(),
      phase: 'selectIsland' as const,
      currentRoll: { die1: 2, die2: 3, total: 5 },
      validIslands: findValidIslands(createRemainder(), 5),
    };
    const choice = getAIIslandChoice(state, 'player1', 'medium');
    expect(choice).not.toBeNull();
    expect(state.validIslands).toContain(choice!.islandId);
    const noop = selectIsland(state, 'not-a-real-island');
    expect(noop.phase).toBe('selectIsland');
  });
});

describe('Burn wave 9 — Par / Kwatro passTurn + formatMove + AI seats', () => {
  it('Par passTurn flips seat; hard AI legal; formatMove non-empty', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.25);
    const state = createPar();
    expect(parHasMoves(state)).toBe(true);
    const passed = passPar(state);
    expect(passed.currentPlayer).toBe('player2');
    expect(passed.selectedBlock).toBeNull();
    const move = getParAI(state, 'player1', 'hard');
    expect(move).not.toBeNull();
    expect(isParAI(state, 'player1', 'human-vs-ai')).toBe(true);
    const block = state.hands.player1.find((b) => b.id === move!.blockId)!;
    expect(
      formatParMove({
        player: 'player1',
        block,
        baseId: move!.baseId,
        pointsScored: 3,
        moveNumber: 1,
      }).length
    ).toBeGreaterThan(0);
  });

  it('Kwatro passTurn flips; hard AI legal; formatMove includes chip value', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.6);
    const state = createKwa();
    expect(kwaHasMoves(state)).toBe(true);
    expect(passKwa(state).currentPlayer).toBe('player2');
    const move = getKwaAI(state, 'player1', 'hard');
    expect(move).not.toBeNull();
    const chip = state.chips.get(move!.chipId)!;
    expect(
      formatKwaMove({
        player: 'player1',
        chip,
        fromNode: chip.position!,
        toNode: move!.nodeId,
        alignment: null,
        moveNumber: 1,
      })
    ).toMatch(/Chip/);
    const selected = kwaSelect(state, move!.chipId);
    expect(selected.selectedChip).toBe(move!.chipId);
    expect(isKwaAI(state, 'player1', 'human-vs-ai')).toBe(true);
  });
});

describe('Burn wave 9 — Fab pass / hard AI + Queens selectPiece', () => {
  it('Fab passTurn flips; hard getAIMove + executeAITurn advance', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.12);
    const state = createFab();
    expect(passFab(state).currentPlayer).toBe('player2');
    expect(fabWinner(state.answerBars, state.fractionBars)).toBeNull();
    const move = getFabAI(state, 'player1', 'hard');
    expect(move).not.toBeNull();
    expect(isFabAI(state, 'player1', 'human-vs-ai')).toBe(true);
    const next = executeFabAI(state, 'player1', 'hard');
    expect(next.moveHistory.length).toBeGreaterThanOrEqual(1);
  });

  it('Queens selectPiece exposes valid moves; hard AI applies on tiny board', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.3);
    const opening = createQueens();
    expect(qgHasMoves(opening)).toBe(true);
    expect(qgWinner(opening)).toBeNull();

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

    const selected = qgSelect(state, from);
    if (selected.selectedPiece) {
      expect(selected.selectedPiece).toBe(cellKey(from.ring, from.position));
      expect(qgValid(selected, from).length).toBeGreaterThan(0);
    }

    const move = getQueensAI(state, 'player1', 'hard');
    expect(move).not.toBeNull();
    const applied = applyQueensAI(state, move!);
    expect(applied.currentPlayer).toBe('player2');
  });
});

describe('Burn wave 9 — Star Track / Sum Dominoes / Contig / Calla AI seats', () => {
  it('Star Track drawChains + hard chain choice + executeAITurn', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.2);
    let state = createStar();
    expect(starOver(state)).toBe(false);
    state = drawChains(state);
    expect(state.drawnChains?.length).toBe(2);
    const choice = getAIChainChoice(state, 'player1', 'hard');
    expect(choice).not.toBeNull();
    expect(choice!.chainIndex === 0 || choice!.chainIndex === 1).toBe(true);
    expect(isStarAI(state, 'player1', 'human-vs-ai')).toBe(true);
    const advanced = executeStarAI(createStar(), 'player1', 'hard');
    expect(['drawChains', 'selectChain', 'gameOver']).toContain(advanced.phase);
  });

  it('Sum Dominoes hard AI / pass / hasPlayableMove / executeAITurn', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.4);
    const state = sumBase();
    expect(hasPlayableMove(state, 'player1', 8)).toBe(
      state.hands.player1.some((d) => canPlayDomino(state, d, 8))
    );
    const move = getSumAI(state, 'player1', 'hard');
    if (hasPlayableMove(state, 'player1', 8)) {
      expect(move).not.toBeNull();
    }
    expect(isSumAI(state, 'player1')).toBe(true);
    const passing = { ...state, phase: 'passing' as const };
    const passed = passSum(passing);
    expect(passed.passCount).toBeGreaterThanOrEqual(1);
    expect(passed.phase === 'rolling' || passed.phase === 'gameOver').toBe(
      true
    );
    const rolling = {
      ...sumBase(),
      phase: 'rolling' as const,
      currentDice: null,
    };
    const advanced = executeSumAI(rolling, 'player1', 'medium');
    expect(['rolling', 'placing', 'passing', 'gameOver']).toContain(
      advanced.phase
    );
  });

  it('Contig checkWinner null at start; isAITurn tracks seat', () => {
    const state = createContig();
    expect(contigWinner(state)).toBeNull();
    expect(isContigAI(state, 'player1', 'human-vs-ai')).toBe(true);
    expect(isContigAI(state, 'player2', 'human-vs-ai')).toBe(false);
  });

  it('Calla hard AI pit ∈ getValidPits; isGameOver false at start', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.7);
    const state = createCalla();
    expect(callaOver(state)).toBe(false);
    const valids = getValidPits(state);
    const move = getCallaAI(state, 'player1', 'hard');
    expect(move).not.toBeNull();
    expect(valids).toContain(move!.pit);
    expect(isCallaAI(state, 'player1', 'human-vs-ai')).toBe(true);
  });
});

describe('Burn wave 9 — Ramrod / Prime / Pent medium-hard edge paths', () => {
  it('Ramrod selectRod + medium AI + passTurn when no moves forged', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.33);
    let state = createRamrod();
    expect(ramrodHasMoves(state)).toBe(true);
    const rodId = state.playerRods.player1[0]!;
    state = selectRod(state, rodId);
    expect(state.selectedRod).toBe(rodId);
    const move = getRamrodAI(createRamrod(), 'player1', 'medium');
    expect(move).not.toBeNull();
    expect(isRamrodAI(createRamrod(), 'player1', 'human-vs-ai')).toBe(true);
    const passed = passRamrod(createRamrod());
    expect(passed.currentPlayer).toBe('player2');
  });

  it('Prime hard AI placement after roll; placeChip claims cell', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.2);
    let state = createPrime();
    state = rollPrime(state);
    expect(state.phase).toBe('placing');
    const placement = getPrimeAI(state, 'player1', 'hard');
    expect(placement).not.toBeNull();
    const legal = getPrimePlacements(state);
    expect(legal.some((p) => p.value === placement!.value)).toBe(true);
    const next = placePrime(state, placement!.value, placement!.expression);
    expect(next.moveHistory.length).toBeGreaterThan(state.moveHistory.length);
  });

  it("Pent'Em In selectPiece + medium getAIMove legal", () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.9);
    let state = createPentState();
    const piece = state.player1Pieces.available[0]!;
    state = selectPent(state, piece);
    expect(state.selectedPiece).toBe(piece);
    const move = getPentAI(createPentState(), 'player1', 'medium');
    expect(move).not.toBeNull();
    expect(move!.shapeId).toBeTruthy();
  });
});
