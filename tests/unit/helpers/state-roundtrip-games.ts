/**
 * Per-game adapters for state round-trip fuzz tests.
 * Each adapter: create → list legal moves → apply → detect over → AI choice → round-trip.
 */

import type { FractionOperation } from '../../../src/core/fractions/types';
import { findValidPlacements } from '../../../src/core/polyomino/placement';

import {
  createInitialState as createCalla,
  type CallaGameState,
} from '../../../src/games/calla/types';
import {
  getValidPits,
  makeMove as callaMakeMove,
  isGameOver as callaIsOver,
  settleNoValidMoves,
} from '../../../src/games/calla/rules';
import { getAIMove as callaAI } from '../../../src/games/calla/ai';

import {
  createInitialState as createContig,
  getValidPlacements as contigPlacements,
  type ContigState,
} from '../../../src/games/contig-60/types';
import {
  doRollDice as contigRoll,
  placeChip as contigPlace,
  passTurn as contigPass,
} from '../../../src/games/contig-60/rules';
import { getAIPlacement as contigAI } from '../../../src/games/contig-60/ai';

import { type FabADiffyState } from '../../../src/games/fab-a-diffy/types';
import {
  createInitialState as createFab,
  calculateResult,
  findMatchingAnswers,
  selectBar1,
  selectBar2,
  selectOperation,
  executeMove as fabExecute,
  passTurn as fabPass,
  hasAnyValidMove,
} from '../../../src/games/fab-a-diffy/rules';
import { getAIMove as fabAI } from '../../../src/games/fab-a-diffy/ai';

import {
  createInitialState as createFiar,
  type FiarGameState,
  type ChipKind,
} from '../../../src/games/fiar/types';
import {
  canPlaceChip,
  setSelectedChipKind,
  placeChip as fiarPlace,
  getValidMoves as fiarValidMoves,
  getSelectableNodes,
  moveChip as fiarMove,
  isDraw as fiarIsDraw,
} from '../../../src/games/fiar/rules';
import { getAIMove as fiarAI } from '../../../src/games/fiar/ai';

import {
  createInitialState as createFracFact,
  type FracFactState,
} from '../../../src/games/frac-fact/types';
import {
  startGame as fracStart,
  submitAnswer as fracSubmit,
  nextProblem as fracNext,
} from '../../../src/games/frac-fact/rules';
import { getAIAnswer as fracAI } from '../../../src/games/frac-fact/ai';

import {
  createInitialState as createPinball,
  type FractionPinballState,
} from '../../../src/games/fraction-pinball/types';
import {
  startGame as pinballStart,
  submitAnswer as pinballSubmit,
  nextChallenge as pinballNext,
} from '../../../src/games/fraction-pinball/rules';
import { getAIAnswer as pinballAI } from '../../../src/games/fraction-pinball/ai';

import {
  createInitialState as createHex,
  type HexGameState,
} from '../../../src/games/hex/types';
import {
  getValidMoves as hexValid,
  makeMove as hexMake,
} from '../../../src/games/hex/rules';
import { getBestMove as hexAI } from '../../../src/games/hex/ai';

import {
  createInitialState as createHexAGone,
  getAvailableShapes,
  type HexAGoneGameState,
  type BlockShape,
} from '../../../src/games/hex-a-gone/types';
import {
  selectBlock as hagSelect,
  commitSelection,
  placeBlock as hagPlace,
  getValidPlacements as hagPlacements,
  passTurn as hagPass,
  isGameOver as hagIsOver,
  canPlayerMove as hagCanMove,
} from '../../../src/games/hex-a-gone/rules';
import { getAISelection as hagAISelect } from '../../../src/games/hex-a-gone/ai';

import {
  getShapesForDie,
  type JuggleState,
} from '../../../src/games/juggle/types';
import {
  createInitialState as createJuggle,
  doRollDice as juggleRoll,
  selectDie,
  selectShape,
  rotateShape,
  flipShape,
  placeShape,
  canMakeAnyMove,
} from '../../../src/games/juggle/rules';
import { getAIDieChoice as juggleAI } from '../../../src/games/juggle/ai';

import {
  createInitialGameState,
  selectKing,
  moveKing,
  placeQuadraphage,
  type GameState as KingsState,
} from '../../../src/games/kings-quadraphages/game-state';
import {
  getValidKingMoves,
  getValidQuadraphagePlacements,
} from '../../../src/games/kings-quadraphages/rules';
import { getAIMove as kingsAI } from '../../../src/games/kings-quadraphages/ai';
import {
  serializeGameState,
  deserializeGameState,
} from '../../../src/games/kings-quadraphages/serialization';

import { type KwaState } from '../../../src/games/kwatro-sinko/types';
import {
  createInitialState as createKwatro,
  getValidMoves as kwaValid,
  selectChip as kwaSelect,
  moveChip as kwaMove,
  passTurn as kwaPass,
  hasValidMoves as kwaHasMoves,
} from '../../../src/games/kwatro-sinko/rules';
import { getAIMove as kwaAI } from '../../../src/games/kwatro-sinko/ai';

import { type Par55State } from '../../../src/games/par-55/types';
import {
  createInitialState as createPar55,
  getValidPlacements as parPlacements,
  selectBlock as parSelect,
  placeBlock as parPlace,
  passTurn as parPass,
  hasValidMoves as parHasMoves,
} from '../../../src/games/par-55/rules';
import { getAIMove as parAI } from '../../../src/games/par-55/ai';

import {
  createInitialState as createPent,
  getPlayerPieces,
  getPentominoShape,
  type PentEmInState,
} from '../../../src/games/pent-em-in/types';
import {
  getValidPlacements as pentPlacements,
  placePiece,
  canPlayerMove as pentCanMove,
} from '../../../src/games/pent-em-in/rules';
import { getAIMove as pentAI } from '../../../src/games/pent-em-in/ai';

import { type PrimeGoldState } from '../../../src/games/prime-gold/types';
import {
  createInitialState as createPrime,
  rollDice as primeRoll,
  getValidPlacements as primePlacements,
  placeChip as primePlace,
  passTurn as primePass,
  hasValidMoves as primeHasMoves,
} from '../../../src/games/prime-gold/rules';
import { getAIPlacement as primeAI } from '../../../src/games/prime-gold/ai';

import {
  createInitialState as createQueens,
  parseKey,
  type QueensGuardsState,
} from '../../../src/games/queens-guards/types';
import {
  getValidMoves as queensValid,
  makeMove as queensMake,
  getRestoreTargets,
  restoreCapturedPiece,
} from '../../../src/games/queens-guards/rules';
import { getAIMove as queensAI } from '../../../src/games/queens-guards/ai';

import { type RamrodState } from '../../../src/games/ramrod/types';
import {
  createInitialState as createRamrod,
  getValidPlacements as ramPlacements,
  selectRod,
  placeRod,
  passTurn as ramPass,
  hasValidMoves as ramHasMoves,
} from '../../../src/games/ramrod/rules';
import { getAIMove as ramAI } from '../../../src/games/ramrod/ai';

import {
  createInitialState as createRemainder,
  type RemainderIslandsState,
} from '../../../src/games/remainder-islands/types';
import {
  performRoll,
  selectIsland,
} from '../../../src/games/remainder-islands/rules';
import { getAIIslandChoice as remAI } from '../../../src/games/remainder-islands/ai';

import {
  createInitialState as createStarTrack,
  type StarTrackGameState,
} from '../../../src/games/star-track/types';
import {
  drawChains,
  selectChain,
  isGameOver as starIsOver,
} from '../../../src/games/star-track/rules';
import { getAIChainChoice as starAI } from '../../../src/games/star-track/ai';

import { type StarsState } from '../../../src/games/stars-bars/types';
import {
  createInitialState as createStars,
  getValidPlacements as starsPlacements,
  selectCard,
  placeCard,
  passTurn as starsPass,
  hasValidMoves as starsHasMoves,
} from '../../../src/games/stars-bars/rules';
import { getAIMove as starsAI } from '../../../src/games/stars-bars/ai';

import {
  getDiceSum,
  type SumDominoesState,
} from '../../../src/games/sum-dominoes/types';
import {
  createInitialState as createSumDom,
  doRollDice as sumRoll,
  getValidPlacements as sumPlacements,
  selectDomino,
  placeDomino,
  passTurn as sumPass,
} from '../../../src/games/sum-dominoes/rules';
import { getAIMove as sumAI } from '../../../src/games/sum-dominoes/ai';

import {
  AI_COMPARE_SEED,
  DEFAULT_MAX_MOVES,
  LOOP_PRONE_MAX_MOVES,
  jsonRoundTrip,
  stripLazyCaches,
  withSeededRandom,
} from './state-roundtrip';

export interface GameFuzzAdapter<S = unknown> {
  id: string;
  maxMoves: number;
  /** Create initial state (call inside withSeededRandom when shuffle/RNG is used). */
  create: () => S;
  isOver: (state: S) => boolean;
  /** Stable, JSON-serializable legal move descriptors. */
  legalMoves: (state: S) => unknown[];
  apply: (state: S, move: unknown) => S;
  /** Mid-game save path for this game. */
  roundTrip: (state: S) => S;
  /** AI choice under fixed seed (easy). null when N/A or game over. */
  aiChoice: (state: S) => unknown;
  /** Normalize before deep equality (strip caches, etc.). */
  normalize: (state: S) => S;
}

function currentPlayer(state: { currentPlayer: string }): 'player1' | 'player2' {
  return state.currentPlayer as 'player1' | 'player2';
}

function jsonTrip<S>(state: S): S {
  return jsonRoundTrip(stripLazyCaches(state as object)) as S;
}

function mockAI<T>(fn: () => T): T {
  return withSeededRandom(AI_COMPARE_SEED, fn);
}

// ─── calla ───────────────────────────────────────────────────────────────────

const calla: GameFuzzAdapter<CallaGameState> = {
  id: 'calla',
  maxMoves: DEFAULT_MAX_MOVES,
  create: () => createCalla(),
  isOver: (s) => callaIsOver(s),
  legalMoves: (s) => {
    if (callaIsOver(s)) return [];
    const pits = getValidPits(s);
    if (pits.length === 0) return [{ type: 'settle' }];
    return pits.map((pit) => ({ type: 'pit', pit }));
  },
  apply: (s, move) => {
    const m = move as { type: string; pit?: number };
    if (m.type === 'settle') return settleNoValidMoves(s);
    return callaMakeMove(s, m.pit!);
  },
  roundTrip: jsonTrip,
  aiChoice: (s) =>
    callaIsOver(s)
      ? null
      : mockAI(() => callaAI(s, currentPlayer(s), 'easy')),
  normalize: (s) => jsonTrip(s),
};

// ─── contig-60 ───────────────────────────────────────────────────────────────

const contig: GameFuzzAdapter<ContigState> = {
  id: 'contig-60',
  maxMoves: DEFAULT_MAX_MOVES,
  create: () => createContig(),
  isOver: (s) => s.phase === 'gameOver' || s.winner !== null,
  legalMoves: (s) => {
    if (s.phase === 'gameOver') return [];
    if (s.phase === 'rolling') return [{ type: 'roll' }];
    if (!s.currentDice) return [{ type: 'pass' }];
    const placements = contigPlacements(s, s.currentDice);
    if (placements.length === 0) return [{ type: 'pass' }];
    return placements.map((p) => ({
      type: 'place',
      result: p.result,
      expression: p.expression,
    }));
  },
  apply: (s, move) => {
    const m = move as {
      type: string;
      result?: number;
      expression?: string;
    };
    if (m.type === 'roll') return contigRoll(s);
    if (m.type === 'pass') return contigPass(s);
    return contigPlace(s, m.result!, m.expression!);
  },
  roundTrip: jsonTrip,
  aiChoice: (s) => {
    if (s.phase !== 'calculating' || !s.currentDice) return null;
    return mockAI(() => contigAI(s, currentPlayer(s), 'easy'));
  },
  normalize: (s) => jsonTrip(s),
};

// ─── fab-a-diffy ─────────────────────────────────────────────────────────────

const OPS: FractionOperation[] = ['add', 'subtract', 'multiply', 'divide'];

const fab: GameFuzzAdapter<FabADiffyState> = {
  id: 'fab-a-diffy',
  maxMoves: DEFAULT_MAX_MOVES,
  create: () => createFab(),
  isOver: (s) => s.phase === 'gameOver' || s.winner !== null,
  legalMoves: (s) => {
    if (s.phase === 'gameOver') return [];
    const bars = [...s.fractionBars.values()].filter((b) => !b.used);
    const turns: unknown[] = [];
    for (const b1 of bars) {
      for (const b2 of bars) {
        if (b1.id === b2.id) continue;
        for (const op of OPS) {
          const result = calculateResult(b1.fraction, b2.fraction, op);
          if (!result || result.numerator < 0) continue;
          for (const answerId of findMatchingAnswers(s, result)) {
            turns.push({
              type: 'turn',
              bar1Id: b1.id,
              bar2Id: b2.id,
              operation: op,
              answerId,
            });
          }
        }
      }
    }
    if (turns.length === 0 && !hasAnyValidMove(s)) {
      return [{ type: 'pass' }];
    }
    return turns;
  },
  apply: (s, move) => {
    const m = move as {
      type: string;
      bar1Id?: string;
      bar2Id?: string;
      operation?: FractionOperation;
      answerId?: string;
    };
    if (m.type === 'pass') return fabPass(s);
    let next = selectBar1(s, m.bar1Id!);
    next = selectBar2(next, m.bar2Id!);
    next = selectOperation(next, m.operation!);
    return fabExecute(next, m.answerId!);
  },
  roundTrip: jsonTrip,
  aiChoice: (s) =>
    s.phase === 'gameOver'
      ? null
      : fabAI(s, currentPlayer(s), 'easy', { seed: AI_COMPARE_SEED }),
  normalize: (s) => jsonTrip(s),
};

// ─── fiar ────────────────────────────────────────────────────────────────────

const fiar: GameFuzzAdapter<FiarGameState> = {
  id: 'fiar',
  maxMoves: LOOP_PRONE_MAX_MOVES,
  create: () => createFiar({ starter: 'player2' }),
  isOver: (s) =>
    s.phase === 'gameOver' || s.winner !== null || fiarIsDraw(s),
  legalMoves: (s) => {
    if (s.phase === 'gameOver' || s.winner || fiarIsDraw(s)) return [];
    if (s.phase === 'placement') {
      const inv = s.chipInventory[s.currentPlayer];
      const kinds: ChipKind[] = [];
      if (inv.plain > 0) kinds.push('plain');
      if (inv.marked > 0) kinds.push('marked');
      const moves: unknown[] = [];
      for (const [id, n] of s.board.nodes) {
        if (n.chip) continue;
        for (const k of kinds) {
          if (canPlaceChip(s, id, k)) {
            moves.push({ type: 'place', nodeId: id, chipKind: k });
          }
        }
      }
      return moves;
    }
    const moves: unknown[] = [];
    for (const from of getSelectableNodes(s)) {
      for (const to of fiarValidMoves(s, from)) {
        moves.push({ type: 'move', from, to });
      }
    }
    return moves;
  },
  apply: (s, move) => {
    const m = move as {
      type: string;
      nodeId?: string;
      chipKind?: ChipKind;
      from?: string;
      to?: string;
    };
    if (m.type === 'place') {
      let next = setSelectedChipKind(s, m.chipKind!);
      return fiarPlace(next, m.nodeId!, m.chipKind!);
    }
    return fiarMove(s, m.from!, m.to!);
  },
  roundTrip: jsonTrip,
  aiChoice: (s) =>
    s.phase === 'gameOver' || s.winner
      ? null
      : fiarAI(s, currentPlayer(s), 'easy', { seed: AI_COMPARE_SEED }),
  normalize: (s) => jsonTrip(s),
};

// ─── frac-fact ───────────────────────────────────────────────────────────────

const fracFact: GameFuzzAdapter<FracFactState> = {
  id: 'frac-fact',
  maxMoves: DEFAULT_MAX_MOVES,
  create: () => fracStart(createFracFact('easy')),
  isOver: (s) => s.phase === 'gameOver' || s.winner !== null,
  legalMoves: (s) => {
    if (s.phase === 'gameOver') return [];
    if (s.phase === 'showingResult') return [{ type: 'next' }];
    if (!s.currentProblem) return [];
    return s.currentProblem.answerChoices.map((choice) => ({
      type: 'answer',
      choice,
    }));
  },
  apply: (s, move) => {
    const m = move as {
      type: string;
      choice?: { numerator: number; denominator: number };
    };
    if (m.type === 'next') return fracNext(s);
    return fracSubmit(s, m.choice!);
  },
  roundTrip: jsonTrip,
  aiChoice: (s) =>
    s.phase !== 'playing' || !s.currentProblem
      ? null
      : mockAI(() => fracAI(s, currentPlayer(s), 'easy')),
  normalize: (s) => jsonTrip(s),
};

// ─── fraction-pinball ────────────────────────────────────────────────────────

const pinball: GameFuzzAdapter<FractionPinballState> = {
  id: 'fraction-pinball',
  maxMoves: DEFAULT_MAX_MOVES,
  create: () => pinballStart(createPinball()),
  isOver: (s) => s.phase === 'gameOver' || s.winner !== null,
  legalMoves: (s) => {
    if (s.phase === 'gameOver') return [];
    if (s.phase === 'showResult') {
      return [{ type: 'next' }];
    }
    if (!s.currentChallenge) return [];
    return s.currentChallenge.answerChoices.map((answer) => ({
      type: 'answer',
      answer,
    }));
  },
  apply: (s, move) => {
    const m = move as { type: string; answer?: string };
    if (m.type === 'next') return pinballNext(s);
    return pinballSubmit(s, m.answer!);
  },
  roundTrip: jsonTrip,
  aiChoice: (s) =>
    s.phase !== 'answering' || !s.currentChallenge
      ? null
      : mockAI(() => pinballAI(s, currentPlayer(s), 'easy')),
  normalize: (s) => jsonTrip(s),
};

// ─── hex ─────────────────────────────────────────────────────────────────────

const hex: GameFuzzAdapter<HexGameState> = {
  id: 'hex',
  maxMoves: DEFAULT_MAX_MOVES,
  create: () => createHex(5),
  isOver: (s) => s.winner !== null,
  legalMoves: (s) =>
    s.winner ? [] : hexValid(s).map((p) => ({ row: p.row, col: p.col })),
  apply: (s, move) => hexMake(s, move as { row: number; col: number }),
  roundTrip: jsonTrip,
  aiChoice: (s) =>
    s.winner
      ? null
      : hexAI(s, currentPlayer(s), 'easy', { seed: AI_COMPARE_SEED }),
  normalize: (s) => jsonTrip(s),
};

// ─── hex-a-gone ──────────────────────────────────────────────────────────────

const hexAGone: GameFuzzAdapter<HexAGoneGameState> = {
  id: 'hex-a-gone',
  maxMoves: DEFAULT_MAX_MOVES,
  create: () => createHexAGone(),
  isOver: (s) => hagIsOver(s),
  legalMoves: (s) => {
    if (hagIsOver(s)) return [];
    if (s.phase === 'selectBlocks') {
      const moves: unknown[] = [];
      const available = getAvailableShapes(s);
      for (const shape of available) {
        if (!s.turnSelection.blocks.includes(shape)) {
          moves.push({ type: 'select', shape });
        }
      }
      if (s.turnSelection.blocks.length > 0) {
        moves.push({ type: 'commit' });
      }
      if (s.turnSelection.blocks.length === 0 && !hagCanMove(s)) {
        moves.push({ type: 'pass' });
      }
      // Always allow commit path: if nothing selected but can move, must select first.
      if (moves.length === 0 && hagCanMove(s) && available.length > 0) {
        moves.push({ type: 'select', shape: available[0] });
      }
      return moves;
    }
    return hagPlacements(s).map((p) => ({ type: 'place', q: p.q, r: p.r }));
  },
  apply: (s, move) => {
    const m = move as {
      type: string;
      shape?: BlockShape;
      q?: number;
      r?: number;
    };
    if (m.type === 'select') return hagSelect(s, m.shape!);
    if (m.type === 'commit') return commitSelection(s);
    if (m.type === 'pass') return hagPass(s);
    return hagPlace(s, m.q!, m.r!);
  },
  roundTrip: jsonTrip,
  aiChoice: (s) =>
    s.phase !== 'selectBlocks'
      ? null
      : mockAI(() => hagAISelect(s, currentPlayer(s), 'easy')),
  normalize: (s) => jsonTrip(s),
};

// ─── juggle ──────────────────────────────────────────────────────────────────

const juggle: GameFuzzAdapter<JuggleState> = {
  id: 'juggle',
  maxMoves: DEFAULT_MAX_MOVES,
  create: () => createJuggle(),
  isOver: (s) => s.phase === 'gameOver' || s.winner !== null,
  legalMoves: (s) => {
    if (s.phase === 'gameOver') return [];
    if (s.phase === 'rolling') return [{ type: 'roll' }];
    if (!s.currentDice) return [];
    const turns: unknown[] = [];
    for (const dieIndex of [0, 1] as const) {
      const shapes = getShapesForDie(s.currentDice[dieIndex]);
      for (const shape of shapes) {
        const rotations = shape.canRotate
          ? ([0, 90, 180, 270] as const)
          : ([0] as const);
        const flips = shape.canFlip ? [false, true] : [false];
        for (const rot of rotations) {
          for (const flipped of flips) {
            const board = s.boards[s.currentPlayer];
            for (const pos of findValidPlacements(
              board,
              shape,
              rot,
              flipped
            )) {
              turns.push({
                type: 'place',
                dieIndex,
                shapeId: shape.id,
                rot,
                flipped,
                row: pos.row,
                col: pos.col,
              });
            }
          }
        }
      }
    }
    if (turns.length === 0 && !canMakeAnyMove(s)) {
      // No legal placement after roll — still no pass API; treat as stuck.
      return [];
    }
    return turns;
  },
  apply: (s, move) => {
    const m = move as {
      type: string;
      dieIndex?: 0 | 1;
      shapeId?: string;
      rot?: 0 | 90 | 180 | 270;
      flipped?: boolean;
      row?: number;
      col?: number;
    };
    if (m.type === 'roll') return juggleRoll(s);
    let next = s.phase === 'rolling' ? juggleRoll(s) : s;
    next = selectDie(next, m.dieIndex!);
    const shape = getShapesForDie(next.currentDice![m.dieIndex!]).find(
      (sh) => sh.id === m.shapeId
    );
    if (!shape) return s;
    if (next.phase === 'selectingShape') {
      next = selectShape(next, shape);
    }
    let guard = 0;
    while (next.selectedRotation !== m.rot && guard++ < 4) {
      next = rotateShape(next);
    }
    if (next.selectedFlipped !== m.flipped) {
      next = flipShape(next);
    }
    return placeShape(next, { row: m.row!, col: m.col! });
  },
  roundTrip: jsonTrip,
  aiChoice: (s) =>
    s.phase === 'gameOver' || !s.currentDice
      ? null
      : mockAI(() => juggleAI(s, currentPlayer(s), 'easy')),
  normalize: (s) => jsonTrip(s),
};

// ─── kings-quadraphages (dedicated serialize) ────────────────────────────────

const kings: GameFuzzAdapter<KingsState> = {
  id: 'kings-quadraphages',
  maxMoves: DEFAULT_MAX_MOVES,
  create: () => createInitialGameState(),
  isOver: (s) => s.turnPhase === 'gameOver' || s.winner !== null,
  legalMoves: (s) => {
    if (s.turnPhase === 'gameOver') return [];
    if (s.turnPhase === 'moveKing') {
      return getValidKingMoves(s, s.currentPlayer).map((p) => ({
        type: 'king',
        row: p.row + 1,
        col: p.col + 1,
      }));
    }
    // Cap placement enumeration — board has many empties; sample via full list is OK for N picks.
    return getValidQuadraphagePlacements(s).map((p) => ({
      type: 'quad',
      row: p.row + 1,
      col: p.col + 1,
    }));
  },
  apply: (s, move) => {
    const m = move as { type: string; row: number; col: number };
    if (m.type === 'king') {
      let next = s.selectedKingPosition ? s : selectKing(s);
      return moveKing(next, { row: m.row, col: m.col });
    }
    return placeQuadraphage(s, { row: m.row, col: m.col });
  },
  roundTrip: (s) => deserializeGameState(serializeGameState(s)),
  aiChoice: (s) =>
    s.turnPhase !== 'moveKing'
      ? null
      : mockAI(() => kingsAI(s, s.currentPlayer, 'easy')),
  normalize: (s) => structuredClone(s),
};

// ─── kwatro-sinko ────────────────────────────────────────────────────────────

const kwatro: GameFuzzAdapter<KwaState> = {
  id: 'kwatro-sinko',
  maxMoves: LOOP_PRONE_MAX_MOVES,
  create: () => createKwatro(),
  isOver: (s) => s.phase === 'gameOver' || s.winner !== null,
  legalMoves: (s) => {
    if (s.phase === 'gameOver') return [];
    const turns: unknown[] = [];
    for (const chip of s.chips.values()) {
      if (chip.owner !== s.currentPlayer) continue;
      for (const to of kwaValid(s, chip.id)) {
        turns.push({ type: 'move', chipId: chip.id, nodeId: to });
      }
    }
    if (turns.length === 0) return [{ type: 'pass' }];
    return turns;
  },
  apply: (s, move) => {
    const m = move as { type: string; chipId?: string; nodeId?: string };
    if (m.type === 'pass') return kwaPass(s);
    let next = kwaSelect(s, m.chipId!);
    return kwaMove(next, m.nodeId!);
  },
  roundTrip: jsonTrip,
  aiChoice: (s) =>
    s.phase === 'gameOver' || !kwaHasMoves(s)
      ? null
      : mockAI(() => kwaAI(s, currentPlayer(s), 'easy')),
  normalize: (s) => jsonTrip(s),
};

// ─── par-55 ──────────────────────────────────────────────────────────────────

const par55: GameFuzzAdapter<Par55State> = {
  id: 'par-55',
  maxMoves: DEFAULT_MAX_MOVES,
  create: () => createPar55(),
  isOver: (s) => s.phase === 'gameOver' || s.winner !== null,
  legalMoves: (s) => {
    if (s.phase === 'gameOver') return [];
    const bases = parPlacements(s);
    const turns: unknown[] = [];
    for (const block of s.hands[s.currentPlayer]) {
      for (const baseId of bases) {
        turns.push({ type: 'place', blockId: block.id, baseId });
      }
    }
    if (turns.length === 0 || !parHasMoves(s)) return [{ type: 'pass' }];
    return turns;
  },
  apply: (s, move) => {
    const m = move as { type: string; blockId?: string; baseId?: string };
    if (m.type === 'pass') return parPass(s);
    let next = parSelect(s, m.blockId!);
    return parPlace(next, m.baseId!);
  },
  roundTrip: jsonTrip,
  aiChoice: (s) =>
    s.phase === 'gameOver'
      ? null
      : mockAI(() => parAI(s, currentPlayer(s), 'easy')),
  normalize: (s) => jsonTrip(s),
};

// ─── pent-em-in ──────────────────────────────────────────────────────────────

const pent: GameFuzzAdapter<PentEmInState> = {
  id: 'pent-em-in',
  maxMoves: DEFAULT_MAX_MOVES,
  create: () => createPent(),
  isOver: (s) => s.phase === 'gameOver' || s.winner !== null,
  legalMoves: (s) => {
    if (s.phase === 'gameOver') return [];
    if (!pentCanMove(s, s.currentPlayer)) return [];
    const pieces = getPlayerPieces(s, s.currentPlayer);
    const turns: unknown[] = [];
    for (const shapeId of pieces.available) {
      const sh = getPentominoShape(shapeId);
      if (!sh) continue;
      const rotations = sh.canRotate
        ? ([0, 90, 180, 270] as const)
        : ([0] as const);
      const flips = sh.canFlip ? [false, true] : [false];
      for (const rot of rotations) {
        for (const flipped of flips) {
          for (const pos of pentPlacements(s, shapeId, rot, flipped)) {
            turns.push({
              type: 'place',
              shapeId,
              rot,
              flipped,
              row: pos.row,
              col: pos.col,
            });
          }
        }
      }
    }
    return turns;
  },
  apply: (s, move) => {
    const m = move as {
      shapeId: string;
      rot: 0 | 90 | 180 | 270;
      flipped: boolean;
      row: number;
      col: number;
    };
    return placePiece(
      s,
      m.shapeId,
      { row: m.row, col: m.col },
      m.rot,
      m.flipped
    );
  },
  roundTrip: jsonTrip,
  aiChoice: (s) =>
    s.phase === 'gameOver'
      ? null
      : mockAI(() => pentAI(s, currentPlayer(s), 'easy')),
  normalize: (s) => jsonTrip(s),
};

// ─── prime-gold ──────────────────────────────────────────────────────────────

const prime: GameFuzzAdapter<PrimeGoldState> = {
  id: 'prime-gold',
  maxMoves: DEFAULT_MAX_MOVES,
  create: () => createPrime(),
  isOver: (s) => s.phase === 'gameOver' || s.winner !== null,
  legalMoves: (s) => {
    if (s.phase === 'gameOver') return [];
    if (s.phase === 'rolling') return [{ type: 'roll' }];
    const placements = primePlacements(s);
    if (placements.length === 0 || !primeHasMoves(s)) {
      return [{ type: 'pass' }];
    }
    return placements.map((p) => ({
      type: 'place',
      value: p.value,
      expression: p.expr,
    }));
  },
  apply: (s, move) => {
    const m = move as {
      type: string;
      value?: number;
      expression?: string;
    };
    if (m.type === 'roll') return primeRoll(s);
    if (m.type === 'pass') return primePass(s);
    return primePlace(s, m.value!, m.expression!);
  },
  roundTrip: jsonTrip,
  aiChoice: (s) => {
    if (s.phase === 'gameOver' || s.phase === 'rolling') return null;
    return mockAI(() => primeAI(s, currentPlayer(s), 'easy'));
  },
  normalize: (s) => jsonTrip(s),
};

// ─── queens-guards ───────────────────────────────────────────────────────────

const queens: GameFuzzAdapter<QueensGuardsState> = {
  id: 'queens-guards',
  maxMoves: DEFAULT_MAX_MOVES,
  create: () => createQueens(),
  isOver: (s) => s.winner !== null,
  legalMoves: (s) => {
    if (s.winner) return [];
    if (s.capturedPieces.length > 0) {
      const captured = s.capturedPieces[0];
      return getRestoreTargets(s).map((to) => ({
        type: 'restore',
        from: captured,
        to,
      }));
    }
    const turns: unknown[] = [];
    for (const [key, cell] of s.cells) {
      if (cell.piece?.player !== s.currentPlayer) continue;
      const from = parseKey(key);
      for (const to of queensValid(s, from)) {
        turns.push({ type: 'move', from, to });
      }
    }
    return turns;
  },
  apply: (s, move) => {
    const m = move as {
      type: string;
      from: { ring: number; position: number };
      to: { ring: number; position: number };
    };
    if (m.type === 'restore') {
      return restoreCapturedPiece(s, m.from, m.to);
    }
    return queensMake(s, m.from, m.to);
  },
  roundTrip: jsonTrip,
  aiChoice: (s) =>
    s.winner
      ? null
      : queensAI(s, currentPlayer(s), 'easy', { seed: AI_COMPARE_SEED }),
  normalize: (s) => jsonTrip(s),
};

// ─── ramrod ──────────────────────────────────────────────────────────────────

const ramrod: GameFuzzAdapter<RamrodState> = {
  id: 'ramrod',
  maxMoves: DEFAULT_MAX_MOVES,
  create: () => createRamrod(),
  isOver: (s) => s.phase === 'gameOver' || s.winner !== null,
  legalMoves: (s) => {
    if (s.phase === 'gameOver') return [];
    const turns: unknown[] = [];
    for (const rodId of s.playerRods[s.currentPlayer]) {
      for (const p of ramPlacements(s, rodId)) {
        turns.push({ type: 'place', rodId, boxId: p.boxId, slot: p.slot });
      }
    }
    if (turns.length === 0 || !ramHasMoves(s)) return [{ type: 'pass' }];
    return turns;
  },
  apply: (s, move) => {
    const m = move as {
      type: string;
      rodId?: string;
      boxId?: string;
      slot?: number;
    };
    if (m.type === 'pass') return ramPass(s);
    let next = selectRod(s, m.rodId!);
    return placeRod(next, m.boxId!, m.slot!);
  },
  roundTrip: jsonTrip,
  aiChoice: (s) =>
    s.phase === 'gameOver'
      ? null
      : mockAI(() => ramAI(s, currentPlayer(s), 'easy')),
  normalize: (s) => jsonTrip(s),
};

// ─── remainder-islands ───────────────────────────────────────────────────────

const remainder: GameFuzzAdapter<RemainderIslandsState> = {
  id: 'remainder-islands',
  maxMoves: DEFAULT_MAX_MOVES,
  create: () => createRemainder(),
  isOver: (s) => s.phase === 'gameOver' || s.winner !== null,
  legalMoves: (s) => {
    if (s.phase === 'gameOver') return [];
    if (s.phase === 'rolling') return [{ type: 'roll' }];
    return s.validIslands.map((islandId) => ({ type: 'island', islandId }));
  },
  apply: (s, move) => {
    const m = move as { type: string; islandId?: string };
    if (m.type === 'roll') return performRoll(s);
    return selectIsland(s, m.islandId!);
  },
  roundTrip: jsonTrip,
  aiChoice: (s) =>
    s.phase !== 'selectIsland'
      ? null
      : mockAI(() => remAI(s, currentPlayer(s), 'easy')),
  normalize: (s) => jsonTrip(s),
};

// ─── star-track ──────────────────────────────────────────────────────────────

const starTrack: GameFuzzAdapter<StarTrackGameState> = {
  id: 'star-track',
  maxMoves: DEFAULT_MAX_MOVES,
  create: () => createStarTrack(),
  isOver: (s) => starIsOver(s),
  legalMoves: (s) => {
    if (starIsOver(s)) return [];
    if (s.phase === 'drawChains') return [{ type: 'draw' }];
    if (s.phase === 'selectChain' && s.drawnChains) {
      return [
        { type: 'chain', index: 0 },
        { type: 'chain', index: 1 },
      ];
    }
    return [];
  },
  apply: (s, move) => {
    const m = move as { type: string; index?: 0 | 1 };
    if (m.type === 'draw') return drawChains(s);
    return selectChain(s, m.index!);
  },
  roundTrip: jsonTrip,
  aiChoice: (s) =>
    s.phase !== 'selectChain'
      ? null
      : mockAI(() => starAI(s, currentPlayer(s), 'easy')),
  normalize: (s) => jsonTrip(s),
};

// ─── stars-bars ──────────────────────────────────────────────────────────────

const starsBars: GameFuzzAdapter<StarsState> = {
  id: 'stars-bars',
  maxMoves: DEFAULT_MAX_MOVES,
  create: () => createStars(),
  isOver: (s) => s.phase === 'gameOver' || s.winner !== null,
  legalMoves: (s) => {
    if (s.phase === 'gameOver') return [];
    const spots = starsPlacements(s);
    const turns: unknown[] = [];
    for (const card of s.playerHands[s.currentPlayer]) {
      for (const { row, col } of spots) {
        turns.push({ type: 'place', cardId: card.id, row, col });
      }
    }
    if (turns.length === 0 || !starsHasMoves(s)) return [{ type: 'pass' }];
    return turns;
  },
  apply: (s, move) => {
    const m = move as {
      type: string;
      cardId?: string;
      row?: number;
      col?: number;
    };
    if (m.type === 'pass') return starsPass(s);
    let next = selectCard(s, m.cardId!);
    return placeCard(next, m.row!, m.col!);
  },
  roundTrip: jsonTrip,
  aiChoice: (s) =>
    s.phase === 'gameOver'
      ? null
      : mockAI(() => starsAI(s, currentPlayer(s), 'easy')),
  normalize: (s) => jsonTrip(s),
};

// ─── sum-dominoes ────────────────────────────────────────────────────────────

const sumDominoes: GameFuzzAdapter<SumDominoesState> = {
  id: 'sum-dominoes',
  maxMoves: DEFAULT_MAX_MOVES,
  create: () => createSumDom(),
  isOver: (s) => s.phase === 'gameOver' || s.winner !== null,
  legalMoves: (s) => {
    if (s.phase === 'gameOver') return [];
    if (s.phase === 'rolling') return [{ type: 'roll' }];
    if (s.phase === 'passing') return [{ type: 'pass' }];
    if (!s.currentDice) return [{ type: 'pass' }];
    const sum = getDiceSum(s.currentDice);
    const turns: unknown[] = [];
    for (const d of s.hands[s.currentPlayer]) {
      for (const p of sumPlacements(s, d, sum)) {
        turns.push({
          type: 'place',
          dominoId: d.id,
          row: p.position.row,
          col: p.position.col,
          orientation: p.orientation,
        });
      }
    }
    if (turns.length === 0) return [{ type: 'pass' }];
    return turns;
  },
  apply: (s, move) => {
    const m = move as {
      type: string;
      dominoId?: string;
      row?: number;
      col?: number;
      orientation?: 'horizontal' | 'vertical';
    };
    if (m.type === 'roll') return sumRoll(s);
    if (m.type === 'pass') return sumPass(s);
    let next = selectDomino(s, m.dominoId!);
    return placeDomino(
      next,
      { row: m.row!, col: m.col! },
      m.orientation!
    );
  },
  roundTrip: jsonTrip,
  aiChoice: (s) =>
    s.phase === 'gameOver' || s.phase === 'rolling'
      ? null
      : mockAI(() => sumAI(s, currentPlayer(s), 'easy')),
  normalize: (s) => jsonTrip(s),
};

export const ALL_GAME_ADAPTERS: GameFuzzAdapter[] = [
  calla,
  contig,
  fab,
  fiar,
  fracFact,
  pinball,
  hex,
  hexAGone,
  juggle,
  kings,
  kwatro,
  par55,
  pent,
  prime,
  queens,
  ramrod,
  remainder,
  starTrack,
  starsBars,
  sumDominoes,
] as GameFuzzAdapter[];
