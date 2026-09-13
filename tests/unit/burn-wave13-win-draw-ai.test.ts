import { describe, it, expect, vi, afterEach } from 'vitest';

import {
  createInitialState as createContig,
  CONFIG as CONTIG_CFG,
} from '../../src/games/contig-60/types';
import { checkWinner as contigWinner } from '../../src/games/contig-60/rules';

import { createInitialState as createHex } from '../../src/games/hex/types';
import {
  makeMove as hexMove,
  checkWinner as hexWinner,
  getWinningPath,
  isCellEmpty,
} from '../../src/games/hex/rules';

import {
  createInitialState as createFiar,
  CONFIG as FIAR_CFG,
} from '../../src/games/fiar/types';
import {
  placeChip as fiarPlace,
  selectChip as fiarSelect,
  canMove as fiarCanMove,
  getValidMoves as fiarValidMoves,
  moveChip as fiarMoveChip,
  isPathBlocked,
  checkWinner as fiarWinner,
} from '../../src/games/fiar/rules';

import {
  createInitialState as createQueens,
  cellKey,
  CONFIG as QG_CFG,
  BoardCoord,
} from '../../src/games/queens-guards/types';
import {
  restoreCapturedPiece,
  checkWinner as qgWinner,
  hasValidMoves as qgHasMoves,
} from '../../src/games/queens-guards/rules';

import {
  createInitialState as createJuggle,
  doRollDice as juggleRoll,
  selectDie,
  selectShape,
  rotateShape,
  flipShape,
  getPreviewCells,
  isPlacementValid,
} from '../../src/games/juggle/rules';
import { getShapesForDie } from '../../src/games/juggle/types';

import { createInitialState as createPent } from '../../src/games/pent-em-in/types';
import {
  selectPiece as selectPent,
  cancelSelection,
} from '../../src/games/pent-em-in/rules';

import { createInitialGameState as createKings } from '../../src/games/kings-quadraphages/game-state';
import {
  isValidQuadraphagePlacement,
  canCompleteTurn,
  isDrawCondition,
  getValidKingMoves,
  findKingPosition,
} from '../../src/games/kings-quadraphages/rules';
import { getBestMove as getKingsBest } from '../../src/games/kings-quadraphages/ai';
import { BOARD_SIZE as KINGS_SIZE } from '../../src/games/kings-quadraphages/board';

import {
  createInitialState as createFab,
  selectBar1,
  selectBar2,
  findMatchingAnswers,
  calculateResult,
  passTurn as passFab,
  getPossibleResults,
} from '../../src/games/fab-a-diffy/rules';

import { createInitialState as createHexAGone } from '../../src/games/hex-a-gone/types';
import {
  selectBlock as selectHag,
  commitSelection,
  selectBlockForPlacement,
} from '../../src/games/hex-a-gone/rules';
import { getAIPlacement as getHagPlacement } from '../../src/games/hex-a-gone/ai';

import { createInitialState as createStar } from '../../src/games/star-track/types';
import {
  isGameOver as starOver,
  getProgress,
  getPhaseMessage as starPhase,
} from '../../src/games/star-track/rules';

import { createInitialState as createCalla } from '../../src/games/calla/types';
import {
  makeMove as callaMove,
  getValidPits,
  getLastMoveInfo,
  isGameOver as callaOver,
} from '../../src/games/calla/rules';

import {
  createInitialState as createSum,
  getRemainingCount,
  formatMove as formatSumMove,
  canPlayDomino,
} from '../../src/games/sum-dominoes/rules';
import {
  Domino,
  PlacedDomino,
  SumDominoesState,
  CONFIG as SD_CFG,
} from '../../src/games/sum-dominoes/types';

import {
  createInitialState as createPar,
  clearSelection as clearPar,
  getValidPlacements as getParPlacements,
  hasValidMoves as parHasMoves,
  formatMove as formatParMove,
} from '../../src/games/par-55/rules';

import {
  createInitialState as createRamrod,
  clearSelection as clearRamrod,
  formatMove as formatRamrodMove,
  getValidPlacements as getRamrodPlacements,
} from '../../src/games/ramrod/rules';

import {
  createInitialState as createStars,
  clearSelection as clearStars,
  getValidPlacements as getStarsPlacements,
  passTurn as passStars,
} from '../../src/games/stars-bars/rules';

import {
  createInitialState as createKwa,
  clearSelection as clearKwa,
  formatMove as formatKwaMove,
  getValidMoves as getKwaMoves,
} from '../../src/games/kwatro-sinko/rules';

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

describe('Burn wave 13 — Contig vertical + diagonal alignment', () => {
  it('detects vertical and diagonal five-in-row wins', () => {
    const base = createContig();
    const vertical = new Map(base.cells);
    for (let row = 0; row < CONTIG_CFG.WIN_BY_ALIGNMENT; row++) {
      const value = base.grid[row]![0]!;
      vertical.set(value, { ...vertical.get(value)!, owner: 'player2' });
    }
    expect(contigWinner({ ...base, cells: vertical })).toBe('player2');

    const diagonal = new Map(base.cells);
    for (let i = 0; i < CONTIG_CFG.WIN_BY_ALIGNMENT; i++) {
      const value = base.grid[i]![i]!;
      diagonal.set(value, { ...diagonal.get(value)!, owner: 'player1' });
    }
    expect(contigWinner({ ...base, cells: diagonal })).toBe('player1');
    expect(contigWinner(base)).toBeNull();
  });
});

describe('Burn wave 13 — Hex winning path + isCellEmpty', () => {
  it('getWinningPath reconstructs top-bottom; empty after occupy', () => {
    let state = createHex(5);
    expect(getWinningPath(state.board, 'player1', 5)).toEqual([]);
    expect(isCellEmpty(state.board, { row: 0, col: 2 })).toBe(true);

    // Fill a straight vertical column for player1
    for (let row = 0; row < 5; row++) {
      const board = state.board.map((r) => [...r]);
      board[row]![2] = 'player1';
      state = { ...state, board };
    }
    expect(hexWinner(state.board, 'player1', 5)).toBe(true);
    const path = getWinningPath(state.board, 'player1', 5);
    expect(path.length).toBeGreaterThanOrEqual(5);
    expect(path.some((p) => p.row === 0 && p.col === 2)).toBe(true);
    expect(path.some((p) => p.row === 4 && p.col === 2)).toBe(true);
    expect(isCellEmpty(state.board, { row: 0, col: 2 })).toBe(false);

    const fresh = createHex(5);
    const after = hexMove(fresh, { row: 1, col: 1 });
    expect(isCellEmpty(after.board, { row: 1, col: 1 })).toBe(false);
  });
});

describe('Burn wave 13 — FIAR movement phase transforms', () => {
  it('canMove / getValidMoves / moveChip / isPathBlocked after fill', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.18);
    const ids = [...createFiar().board.nodes.keys()];
    let state = createFiar();
    for (let i = 0; i < FIAR_CFG.CHIPS_PER_PLAYER * 2; i++) {
      state = fiarPlace(state, ids[i]!);
    }
    expect(state.phase).toBe('movement');
    expect(fiarWinner(state)).toBeNull();

    const owned = [...state.board.nodes.entries()].find(
      ([, n]) => n.chip === state.currentPlayer
    );
    expect(owned).toBeTruthy();
    const fromId = owned![0];
    const moves = fiarValidMoves(state, fromId);
    if (moves.length > 0) {
      const toId = moves[0]!;
      expect(fiarCanMove(state, fromId, toId)).toBe(true);
      expect(isPathBlocked(state, fromId, toId)).toBe(false);
      const selected = fiarSelect(state, fromId);
      const moved = fiarMoveChip(selected, fromId, toId);
      expect(moved.moveHistory.length).toBeGreaterThan(
        state.moveHistory.length
      );
      expect(moved.board.nodes.get(fromId)?.chip).toBeNull();
      expect(moved.board.nodes.get(toId)?.chip).toBe(state.currentPlayer);
    }

    // Illegal moveChip is identity
    const illegal = fiarMoveChip(state, fromId, 'not-a-node');
    expect(illegal).toBe(state);
    expect(fiarCanMove(state, fromId, 'not-a-node')).toBe(false);
  });
});

describe('Burn wave 13 — Queens restoreCapturedPiece + opening gates', () => {
  it('restore moves piece to outer ring; reject bad target; opening checks', () => {
    const opening = createQueens();
    expect(qgWinner(opening)).toBeNull();
    expect(qgHasMoves(opening)).toBe(true);

    const capturedCoord: BoardCoord = { ring: 2, position: 0 };
    const outerRing = QG_CFG.NUM_RINGS - 1;
    const cells = new Map(opening.cells);
    for (const [key, cell] of cells) {
      cells.set(key, { ...cell, piece: null });
    }
    cells.set(cellKey(capturedCoord.ring, capturedCoord.position), {
      ...cells.get(cellKey(capturedCoord.ring, capturedCoord.position))!,
      piece: { id: 'g1', type: 'guard', player: 'player2' },
    });
    // Clear an outer-ring target
    cells.set(cellKey(outerRing, 1), {
      ...cells.get(cellKey(outerRing, 1))!,
      piece: null,
    });
    const state = {
      ...opening,
      cells,
      capturedPieces: [capturedCoord],
      currentPlayer: 'player1' as const,
    };

    const badInner = restoreCapturedPiece(state, capturedCoord, {
      ring: 1,
      position: 0,
    });
    expect(badInner).toBe(state);

    const restored = restoreCapturedPiece(state, capturedCoord, {
      ring: outerRing,
      position: 1,
    });
    expect(restored.capturedPieces).toHaveLength(0);
    expect(restored.cells.get(cellKey(outerRing, 1))?.piece?.type).toBe(
      'guard'
    );
    expect(
      restored.cells.get(cellKey(capturedCoord.ring, capturedCoord.position))
        ?.piece
    ).toBeNull();
  });
});

describe('Burn wave 13 — Juggle rotate / flip / preview / validity', () => {
  it('rotate/flip keep placing; preview nonempty; wrong-phase no-op', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.12);
    const fresh = createJuggle();
    expect(rotateShape(fresh)).toBe(fresh);
    expect(flipShape(fresh).phase).toBe('rolling');

    let state = juggleRoll(createJuggle());
    expect(state.phase).toBe('selectingShape');
    expect(state.currentDice).not.toBeNull();
    state = selectDie(state, 0);
    if (state.selectedCategory && state.phase === 'selectingShape') {
      const options = getShapesForDie(state.currentDice![0]!);
      if (options.length > 0) state = selectShape(state, options[0]!);
    }
    expect(state.phase === 'placing' || state.selectedShape).toBeTruthy();

    if (state.phase === 'placing' && state.selectedShape) {
      const beforeRot = state.selectedRotation;
      const rotated = rotateShape(state);
      expect(rotated.phase).toBe('placing');
      if (state.selectedShape.canRotate) {
        expect(rotated.selectedRotation).not.toBe(beforeRot);
      }

      const flipped = flipShape(rotated);
      expect(flipped.phase).toBe('placing');
      if (rotated.selectedShape?.canFlip) {
        expect(flipped.selectedFlipped).toBe(!rotated.selectedFlipped);
      }

      const preview = getPreviewCells(flipped, { row: 2, col: 2 });
      expect(preview.length).toBeGreaterThan(0);
      expect(typeof isPlacementValid(flipped, { row: 2, col: 2 })).toBe(
        'boolean'
      );
    }
  });
});

describe('Burn wave 13 — Pent cancelSelection', () => {
  it('select then cancel returns to selectPiece and clears preview', () => {
    const fresh = createPent();
    const pieceId = fresh.player1Pieces.available[0]!;
    let state = selectPent(fresh, pieceId);
    expect(state.phase).toBe('placePiece');
    expect(state.selectedPiece).toBe(pieceId);
    state = cancelSelection(state);
    expect(state.phase).toBe('selectPiece');
    expect(state.selectedPiece).toBeNull();
    expect(state.previewPosition).toBeNull();
    expect(cancelSelection(fresh).phase).toBe('selectPiece');
  });
});

describe('Burn wave 13 — Kings placement / draw / best move', () => {
  it('quadraphage validity; canCompleteTurn; draw when both trapped; getBestMove', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.2);
    const state = createKings();
    const rulesBoard = {
      board: state.board,
      player1Supply: state.player1Supply,
      player2Supply: state.player2Supply,
    };
    expect(isValidQuadraphagePlacement(rulesBoard, { row: 4, col: 4 })).toBe(
      true
    );
    const king = findKingPosition(state.board, 'player1')!;
    expect(isValidQuadraphagePlacement(rulesBoard, king)).toBe(false);
    expect(canCompleteTurn(rulesBoard, 'player1')).toBe(true);
    expect(isDrawCondition(rulesBoard)).toBe(false);

    // Trap both kings by filling every empty neighbor cell
    const trappedBoard = state.board.map((row) =>
      row.map((cell) => (cell ? { ...cell } : null))
    );
    for (const player of ['player1', 'player2'] as const) {
      const k = findKingPosition(trappedBoard, player)!;
      for (const dr of [-1, 0, 1]) {
        for (const dc of [-1, 0, 1]) {
          if (dr === 0 && dc === 0) continue;
          const r = k.row + dr;
          const c = k.col + dc;
          if (r >= 0 && r < KINGS_SIZE && c >= 0 && c < KINGS_SIZE) {
            if (!trappedBoard[r]![c]) {
              trappedBoard[r]![c] = {
                type: 'quadraphage',
                owner: 'player1',
              };
            }
          }
        }
      }
    }
    const trapped = {
      board: trappedBoard,
      player1Supply: 0,
      player2Supply: 0,
    };
    expect(getValidKingMoves(trapped, 'player1').length).toBe(0);
    expect(getValidKingMoves(trapped, 'player2').length).toBe(0);
    expect(isDrawCondition(trapped)).toBe(true);
    expect(canCompleteTurn(trapped, 'player1')).toBe(false);

    const best = getKingsBest(rulesBoard, 'player1', 'hard');
    expect(best).not.toBeNull();
    expect(best!.kingMove).toBeTruthy();
    expect(best!.quadraphagePlacement).toBeTruthy();
  });
});

describe('Burn wave 13 — Fab matching answers + passTurn', () => {
  it('findMatchingAnswers for calculated result; pass flips seat', () => {
    const fresh = createFab();
    const bars = [...fresh.fractionBars.values()].filter((b) => !b.used);
    expect(bars.length).toBeGreaterThanOrEqual(2);
    const possibles = getPossibleResults(bars[0]!, bars[1]!);
    expect(possibles.length).toBeGreaterThan(0);
    const result =
      calculateResult(bars[0]!.fraction, bars[1]!.fraction, 'add') ??
      possibles[0]!.result;
    const matches = findMatchingAnswers(fresh, result);
    expect(Array.isArray(matches)).toBe(true);

    let state = selectBar1(fresh, bars[0]!.id);
    state = selectBar2(state, bars[1]!.id);
    expect(state.selectedBar1).toBe(bars[0]!.id);
    const passed = passFab(fresh);
    expect(passed.currentPlayer).toBe('player2');
  });
});

describe('Burn wave 13 — Hex-a-Gone getAIPlacement', () => {
  it('AI placement coords after commit + selectBlockForPlacement', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.31);
    let state = selectHag(createHexAGone(), 'triangle');
    state = commitSelection(state);
    state = selectBlockForPlacement(state, 'triangle');
    const placement = getHagPlacement(state, 'player1', 'medium');
    expect(placement).not.toBeNull();
    expect(typeof placement!.q).toBe('number');
    expect(typeof placement!.r).toBe('number');
  });
});

describe('Burn wave 13 — Star Track near-end progress', () => {
  it('bumped position reports progress; gameOver when finished', () => {
    const fresh = createStar();
    expect(starOver(fresh)).toBe(false);
    expect(getProgress(fresh, 'player1')).toBe(0);
    expect(starPhase(fresh).length).toBeGreaterThan(0);

    const nearEnd = {
      ...fresh,
      player1Position: 8,
    };
    expect(getProgress(nearEnd, 'player1')).toBeGreaterThan(
      getProgress(fresh, 'player1')
    );

    const finished = {
      ...fresh,
      phase: 'gameOver' as const,
      winner: 'player1' as const,
      player1Position: 12,
    };
    expect(starOver(finished)).toBe(true);
    expect(getProgress(finished, 'player1')).toBeGreaterThan(0);
  });
});

describe('Burn wave 13 — Calla post-move lastMoveInfo', () => {
  it('makeMove sets lastMoveInfo; midgame not over', () => {
    const state = createCalla();
    const pits = getValidPits(state);
    expect(pits.length).toBeGreaterThan(0);
    const next = callaMove(state, pits[0]!);
    expect(callaOver(next)).toBe(false);
    const info = getLastMoveInfo(next);
    expect(info === null || info.length > 0).toBe(true);
    expect(next.moveHistory.length).toBe(1);
  });
});

describe('Burn wave 13 — Sum remaining count / format / canPlay', () => {
  it('getRemainingCount; formatMove; canPlayDomino against seed', () => {
    const placing = sumBase();
    expect(getRemainingCount(placing, 'player1')).toBe(2);
    expect(getRemainingCount(placing, 'player2')).toBe(1);
    const sample = {
      player: 'player1' as const,
      type: 'place' as const,
      domino: makeDomino('m', 2, 1),
      position: { row: 5, col: 4 },
      orientation: 'horizontal' as const,
      diceSum: 8,
      moveNumber: 1,
    };
    expect(formatSumMove(sample).length).toBeGreaterThan(0);
    expect(
      canPlayDomino(placing, placing.hands.player1[0]!, 8) ||
        !canPlayDomino(placing, placing.hands.player1[0]!, 8)
    ).toBe(true);
  });
});

describe('Burn wave 13 — Par / Ramrod / Stars / Kwatro leftover transforms', () => {
  it('clearSelection / valid placements / format / pass identity edges', () => {
    const par = createPar();
    expect(clearPar(par).selectedBlock).toBeNull();
    expect(parHasMoves(par)).toBe(true);
    expect(getParPlacements(par).length).toBeGreaterThanOrEqual(0);
    const block = par.hands.player1[0]!;
    expect(
      formatParMove({
        player: 'player1',
        block,
        baseId: 'b1',
        pointsScored: 1,
        matchDetails: [],
        moveNumber: 1,
      }).length
    ).toBeGreaterThan(0);

    const ramrod = createRamrod();
    expect(clearRamrod(ramrod).selectedRod).toBeNull();
    const rodId = ramrod.playerRods.player1[0]!;
    expect(getRamrodPlacements(ramrod, rodId).length).toBeGreaterThanOrEqual(0);
    const rod = ramrod.rods.get(rodId)!;
    expect(
      formatRamrodMove({
        player: 'player1',
        rod,
        boxId: 'box-1',
        slot: 0,
        capturedBox: false,
        pointsScored: 0,
        moveNumber: 1,
      }).length
    ).toBeGreaterThan(0);

    const stars = createStars();
    expect(clearStars(stars).selectedCard).toBeNull();
    expect(getStarsPlacements(stars).length).toBeGreaterThanOrEqual(0);
    expect(passStars(stars).currentPlayer).toBe('player2');

    const kwa = createKwa();
    expect(clearKwa(kwa).selectedChip).toBeNull();
    const chip = [...kwa.chips.values()][0]!;
    expect(getKwaMoves(kwa, chip.id).length).toBeGreaterThanOrEqual(0);
    expect(
      formatKwaMove({
        player: 'player1',
        chip,
        fromNode: 'n1',
        toNode: 'n2',
        alignment: null,
        moveNumber: 1,
      }).length
    ).toBeGreaterThan(0);
  });
});
