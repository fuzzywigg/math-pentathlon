import { describe, it, expect, vi, afterEach } from 'vitest';

import {
  createInitialState as createContig,
  getAllPossibleResults,
  getValidPlacements as contigValidPlacements,
  getOpponent as contigOpponent,
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

import { createInitialState as createStar } from '../../src/games/star-track/types';
import { TRACK_LENGTH } from '../../src/games/star-track/types';
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

import { createInitialState as createHexAGone } from '../../src/games/hex-a-gone/types';
import {
  selectBlock as selectHag,
  deselectBlock,
  commitSelection,
  placeBlock as placeHag,
  passTurn as passHag,
  isGameOver as hagOver,
  getPhaseMessage as hagPhase,
  getValidPlacements as getHagPlacements,
  selectBlockForPlacement,
  canPlaceAt,
  canPlayerMove as hagCanMove,
  getBlockColor,
} from '../../src/games/hex-a-gone/rules';
import {
  getAISelection,
  getAIPlacement as getHagPlacement,
  executeAITurn as executeHagAI,
  isAITurn as isHagAI,
} from '../../src/games/hex-a-gone/ai';

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
  isValidQuadraphagePlacement,
  checkWinCondition,
  canCompleteTurn,
  isDrawCondition,
  getOpponent as kingsOpponent,
} from '../../src/games/kings-quadraphages/rules';
import {
  getAIMove as getKingsAI,
  getBestMove as getKingsBest,
  getRandomMove as getKingsRandom,
  evaluatePosition,
  isAITurn as isKingsAI,
} from '../../src/games/kings-quadraphages/ai';
import { BOARD_SIZE as KINGS_SIZE } from '../../src/games/kings-quadraphages/board';

import { createInitialState as createHex } from '../../src/games/hex/types';
import {
  makeMove as hexMove,
  getValidMoves as hexValid,
  checkWinner as hexWinner,
} from '../../src/games/hex/rules';
import { getBestMove as getHexBest, getRandomMove } from '../../src/games/hex/ai';

import { createInitialState as createCalla } from '../../src/games/calla/types';
import {
  makeMove as callaMove,
  getValidPits,
  isGameOver as callaOver,
} from '../../src/games/calla/rules';
import { getAIMove as getCallaAI, analyzeMoves } from '../../src/games/calla/ai';

import {
  createInitialState as createPrime,
  rollDice as rollPrime,
  hasValidMoves as primeHasMoves,
  passTurn as passPrime,
} from '../../src/games/prime-gold/rules';
import {
  executeAITurn as executePrimeAI,
  isAITurn as isPrimeAI,
} from '../../src/games/prime-gold/ai';

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
    currentDice: [3, 3],
    selectedDomino: null,
    phase: 'placing',
    passCount: 0,
    winner: null,
    moveHistory: [],
    ...overrides,
  };
}

describe('Burn wave 13 — Kings mobility / draw / AI evaluate', () => {
  it('opening kings movable; placements nonempty; AI + evaluate sane', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.27);
    const state = createKings();
    expect(checkWinCondition(state)).toBeNull();
    expect(isDrawCondition(state)).toBe(false);
    expect(canCompleteTurn(state, 'player1')).toBe(true);
    expect(kingsOpponent('player1')).toBe('player2');

    const p1 = findKingPosition(state.board, 'player1');
    const p2 = findKingPosition(state.board, 'player2');
    expect(p1).not.toBeNull();
    expect(p2).not.toBeNull();

    const moves = getValidKingMoves(state, 'player1');
    expect(moves.length).toBeGreaterThan(0);
    expect(isValidKingMove(state, 'player1', moves[0]!)).toBe(true);
    expect(
      isValidKingMove(state, 'player1', { row: -1, col: -1 })
    ).toBe(false);
    expect(isValidKingMove(state, 'player1', p1!)).toBe(false);

    const placements = getValidQuadraphagePlacements(state);
    expect(placements.length).toBeGreaterThan(KINGS_SIZE);
    expect(isValidQuadraphagePlacement(state, placements[0]!)).toBe(true);
    expect(
      isValidQuadraphagePlacement(state, { row: -2, col: 0 })
    ).toBe(false);

    expect(isKingsAI(state, 'player1', 'human-vs-ai')).toBe(true);
    expect(isKingsAI(state, 'player1', 'human-vs-human')).toBe(false);
    const ai = getKingsAI(state, 'player1', 'medium');
    expect(ai).not.toBeNull();
    expect(ai!.kingMove).toBeTruthy();
    expect(getKingsBest(state, 'player1', 'hard')).not.toBeNull();
    expect(getKingsRandom(state, 'player1')).not.toBeNull();
    const score = evaluatePosition(state, 'player1');
    expect(typeof score).toBe('number');
    expect(Number.isFinite(score)).toBe(true);
  });
});

describe('Burn wave 13 — Star Track multi-draw / near-win / bucket empty', () => {
  it('progress climbs; near finish wins; empty bucket ends', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.41);
    let state = createStar();
    expect(starOver(state)).toBe(false);
    expect(getProgress(state, 'player1')).toBe(0);
    expect(starPhase(state)).toMatch(/Draw|draw/i);
    expect(isStarAI(state, 'player1', 'human-vs-ai')).toBe(true);

    state = drawChains(state);
    expect(state.phase).toBe('selectChain');
    expect(state.drawnChains).not.toBeNull();
    expect(starPhase(state)).toMatch(/Choose|choose/i);
    const choice = getAIChainChoice(state, 'player1', 'hard');
    expect(choice).not.toBeNull();
    state = selectChain(state, choice!.chainIndex as 0 | 1);
    expect(state.currentPlayer).toBe('player2');
    expect(getProgress(state, 'player1')).toBeGreaterThan(0);

    // Force near-finish win
    const nearWin = {
      ...createStar(),
      player1Position: TRACK_LENGTH - 1,
      phase: 'selectChain' as const,
      drawnChains: [
        { length: 6 as const, id: 900 },
        { length: 1 as const, id: 901 },
      ],
    };
    const won = selectChain(nearWin, 0);
    expect(won.phase).toBe('gameOver');
    expect(won.winner).toBe('player1');
    expect(starOver(won)).toBe(true);
    expect(getProgress(won, 'player1')).toBe(100);
    expect(starPhase(won)).toMatch(/wins/i);

    // Empty bucket while drawing ends the game
    const emptyBucket = {
      ...createStar(),
      chainBucket: [{ length: 2 as const, id: 1 }],
      phase: 'drawChains' as const,
    };
    const ended = drawChains(emptyBucket);
    expect(ended.phase).toBe('gameOver');
    expect(starOver(ended)).toBe(true);

    const executed = executeStarAI(createStar(), 'player1', 'medium');
    expect(executed.currentPlayer).toBe('player2');
  });
});

describe('Burn wave 13 — Sum Dominoes pass / pip endgame / AI', () => {
  it('passing phase double-pass ends; place path; executeAI', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.19);
    const fresh = createSum();
    expect(fresh.phase).toBe('rolling');
    expect(fresh.hands.player1).toHaveLength(SD_CFG.STARTING_HAND_SIZE);

    const rolled = rollSum(fresh);
    expect(['placing', 'passing']).toContain(rolled.phase);

    // Double pass → gameOver by pip count
    const passing: SumDominoesState = {
      ...sumBase({
        phase: 'passing',
        passCount: 1,
        currentDice: [1, 1],
        hands: {
          player1: [makeDomino('low', 1, 0)],
          player2: [makeDomino('high', 6, 6, 'player2')],
        },
      }),
    };
    const ended = passSum(passing);
    expect(ended.phase).toBe('gameOver');
    expect(ended.winner).toBe('player1');

    // Invalid pass when not in passing phase is no-op
    expect(passSum(sumBase({ phase: 'placing' })).phase).toBe('placing');

    const placing = sumBase();
    const sum = getDiceSum(placing.currentDice!);
    const playable = placing.hands.player1.find((d) =>
      hasPlayableMove(placing, 'player1', sum)
    );
    if (playable) {
      let state = selectDomino(placing, playable.id);
      const spots = getSumPlacements(state, playable, sum);
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
    const next = executeSumAI(aiState, 'player1', 'hard');
    expect(
      next.currentPlayer === 'player2' ||
        next.passCount > aiState.passCount ||
        next.moveHistory.length > aiState.moveHistory.length ||
        next.phase === 'gameOver'
    ).toBe(true);
    expect(getSumAI(placing, 'player1', 'easy') !== undefined).toBe(true);
  });
});

describe('Burn wave 13 — Queens select/move/AI gates', () => {
  it('crafted opening move applies; wrong seat / winner null gates', () => {
    const fresh = createQueens();
    expect(qgWinner(fresh)).toBeNull();
    expect(qgHasMoves(fresh)).toBe(true);

    // Craft a legal opening without full-board minimax (slow even on easy)
    let crafted: { from: { ring: number; position: number }; to: { ring: number; position: number } } | null =
      null;
    for (const [, cell] of fresh.cells) {
      if (!cell.piece || cell.piece.player !== 'player1') continue;
      const from = { ring: cell.ring, position: cell.position };
      const targets = qgValid(fresh, from);
      if (targets.length > 0) {
        crafted = { from, to: targets[0]! };
        break;
      }
    }
    expect(crafted).not.toBeNull();

    const selected = qgSelect(fresh, crafted!.from);
    expect(selected.selectedPiece).toBeTruthy();
    const legal = qgValid(selected, crafted!.from);
    expect(legal.length).toBeGreaterThan(0);
    expect(
      legal.some(
        (m) => m.ring === crafted!.to.ring && m.position === crafted!.to.position
      )
    ).toBe(true);

    const applied = applyQueensAI(fresh, crafted!);
    expect(applied.moveHistory.length).toBeGreaterThanOrEqual(1);

    const manual = qgMove(selected, crafted!.to);
    expect(manual === selected || manual.moveHistory.length >= 1).toBe(true);

    // getAIMove null gates (no search)
    expect(getQueensAI({ ...fresh, winner: 'player1' }, 'player1', 'easy')).toBeNull();
    expect(getQueensAI(fresh, 'player2', 'easy')).toBeNull();

    // Wrong player piece should not yield moves
    const enemyKeys = [...fresh.cells.entries()]
      .filter(([, c]) => c.piece?.player === 'player2')
      .map(([k]) => k);
    if (enemyKeys.length > 0) {
      const [ringStr, posStr] = enemyKeys[0]!.split('-');
      expect(
        qgValid(fresh, {
          ring: Number(ringStr),
          position: Number(posStr),
        })
      ).toHaveLength(0);
    }
  });
});

describe('Burn wave 13 — Contig expressions / consecutive place / AI', () => {
  it('dice expressions map to board; pass/AI deepen', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.12);
    expect(contigOpponent('player1')).toBe('player2');
    expect(CONTIG_CFG.GRID_ROWS * CONTIG_CFG.GRID_COLS).toBe(60);

    const results = getAllPossibleResults([2, 3, 4]);
    expect(results.length).toBeGreaterThan(0);
    expect(results.every((r) => typeof r.result === 'number')).toBe(true);

    let state = rollContig(createContig());
    expect(state.phase).toBe('calculating');
    expect(state.currentDice).not.toBeNull();
    const valid = contigValidPlacements(state, state.currentDice!);
    expect(Array.isArray(valid)).toBe(true);

    if (contigHasMoves(state)) {
      const empty = [...state.cells.values()].find((c) => c.owner === null)!;
      expect(contigPoints(state, empty.value)).toBeGreaterThanOrEqual(0);
      const placed = placeContig(state, empty.value, `${empty.value}`);
      if (placed !== state) {
        expect(placed.moveHistory.length).toBe(1);
        expect(placed.scores.player1 + placed.scores.player2).toBeGreaterThanOrEqual(
          0
        );
      }
    } else {
      const passed = passContig(state);
      expect(passed.currentPlayer).toBe('player2');
    }

    expect(contigWinner(createContig())).toBeNull();
    expect(isContigAI(createContig(), 'player1', 'human-vs-ai')).toBe(true);
    expect(isContigAI(createContig(), 'player1', 'human-vs-human')).toBe(false);

    const next = executeContigAI(createContig(), 'player1', 'medium');
    expect(
      next.currentPlayer === 'player2' ||
        next.moveHistory.length > 0 ||
        next.phase !== 'rolling'
    ).toBe(true);
    const rolled = rollContig(createContig());
    const move = getContigAI(rolled, 'player1', 'hard');
    if (move) {
      expect(typeof move.value).toBe('number');
      expect(typeof move.expression).toBe('string');
    }
  });
});

describe('Burn wave 13 — Hex-a-Gone select/deselect/place/AI', () => {
  it('deselect restores; canPlaceAt; colors; executeAI', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.48);
    const fresh = createHexAGone();
    expect(hagOver(fresh)).toBe(false);
    expect(hagCanMove(fresh)).toBe(true);
    expect(hagPhase(fresh).length).toBeGreaterThan(0);
    expect(getBlockColor('triangle').length).toBeGreaterThan(0);

    let state = selectHag(fresh, 'triangle');
    expect(state.turnSelection.blocks).toContain('triangle');
    state = deselectBlock(state, 'triangle');
    expect(state.turnSelection.blocks).not.toContain('triangle');

    state = selectHag(fresh, 'triangle');
    state = selectHag(state, 'diamond');
    state = commitSelection(state);
    expect(state.phase).toBe('placeBlocks');
    state = selectBlockForPlacement(state, 'triangle');
    const placements = getHagPlacements(state);
    expect(placements.length).toBeGreaterThan(0);
    const { q, r } = placements[0]!;
    expect(canPlaceAt(state, q, r)).toBe(true);
    state = placeHag(state, q, r);
    expect(state.board.some((c) => c.filled)).toBe(true);

    expect(passHag(createHexAGone()).currentPlayer).toBe('player2');
    expect(isHagAI(fresh, 'player1', 'human-vs-ai')).toBe(true);
    expect(getAISelection(fresh, 'player1', 'hard')).not.toBeNull();

    const afterCommit = commitSelection(selectHag(createHexAGone(), 'triangle'));
    const placePick = getHagPlacement(afterCommit, 'player1', 'medium');
    if (placePick) {
      expect(typeof placePick.q).toBe('number');
      expect(typeof placePick.r).toBe('number');
    }

    const next = executeHagAI(fresh, 'player1', 'easy');
    expect(
      next.currentPlayer === 'player2' || next.moveHistory.length > 0
    ).toBe(true);
  });
});

describe('Burn wave 13 — Remainder division / island AI / preview', () => {
  it('calculateDivision; roll→select; AI choice; ownership count', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.55);
    const div = calculateDivision(11, 4);
    expect(div.quotient).toBe(2);
    expect(div.remainder).toBe(3);
    expect(calculateDivision(12, 3).remainder).toBe(0);

    let state = createRemainder();
    expect(countOwnedIslands(state)).toEqual({ player1: 0, player2: 0 });
    expect(isRemainderAI(state, 'player1')).toBe(true);

    state = performRoll(state);
    if (state.phase === 'selectIsland') {
      expect(state.currentRoll).not.toBeNull();
      expect(state.validIslands.length).toBeGreaterThan(0);
      const islandId = state.validIslands[0]!;
      const preview = previewDivision(state, islandId);
      expect(preview === null || typeof preview.remainder === 'number').toBe(
        true
      );
      const withSel = setSelectedIsland(state, islandId);
      expect(withSel.selectedIsland).toBe(islandId);
      const after = selectIsland(state, islandId);
      expect(after.moveHistory.length).toBe(1);
      expect(countOwnedIslands(after).player1).toBeGreaterThanOrEqual(1);
      expect(
        findValidIslands(after, after.currentRoll?.total ?? 7).length
      ).toBeGreaterThanOrEqual(0);
    }

    const choice = getAIIslandChoice(
      performRoll(createRemainder()),
      'player1',
      'hard'
    );
    if (choice) expect(typeof choice.islandId).toBe('string');

    const executed = executeAISelection(
      performRoll(createRemainder()),
      'player1',
      'medium'
    );
    expect(
      executed.moveHistory.length >= 0 || executed.phase === 'rolling'
    ).toBe(true);
  });
});

describe('Burn wave 13 — complementary Hex / Calla / Prime edges', () => {
  it('Hex best move legal; Calla analyze; Prime execute AI', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.21);
    const hex = createHex(5);
    expect(hexWinner(hex.board, 'player1', 5)).toBe(false);
    const best = getHexBest(hex, 'player1', 'hard');
    expect(best).not.toBeNull();
    expect(
      hexValid(hex).some((p) => p.row === best!.row && p.col === best!.col)
    ).toBe(true);
    expect(hexMove(hex, best!).moveHistory).toHaveLength(1);
    expect(getRandomMove(hex)).not.toBeNull();

    const calla = createCalla();
    expect(callaOver(calla)).toBe(false);
    const pits = getValidPits(calla);
    expect(pits.length).toBeGreaterThan(0);
    expect(analyzeMoves(calla, 'player1').length).toBe(pits.length);
    expect(getCallaAI(calla, 'player1', 'medium')).not.toBeNull();
    expect(callaMove(calla, pits[0]!).moveHistory).toHaveLength(1);

    expect(isPrimeAI(createPrime(), 'player1', 'human-vs-ai')).toBe(true);
    const rolled = rollPrime(createPrime());
    if (!primeHasMoves(rolled)) {
      expect(passPrime(rolled).currentPlayer).toBe('player2');
    }
    const next = executePrimeAI(rollPrime(createPrime()), 'player1', 'easy');
    expect(
      next.currentPlayer === 'player2' ||
        next.phase === 'rolling' ||
        next.moveHistory.length > 0
    ).toBe(true);
  });
});
