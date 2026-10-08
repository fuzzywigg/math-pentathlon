/**
 * Headless adapters for AI calibration.
 * Policies: easy | medium | hard | random (uniform legal where available).
 * Never mutates rules — only drives existing engines.
 */
import type { Difficulty, GameAdapter, GameResult, Outcome, Policy } from './types';
import {
  installSeededRandom,
  pickRandom,
  plySeed,
  withSeededRandom,
} from './rng';

const MAX_PLIES = 400;
/**
 * Play budgets for search games (env read lazily so vitest can set vars
 * before first play() despite ESM import hoisting).
 * - CALIBRATION_WALL_CLOCK=1: real performance.now() deadlines.
 * - Default: seeded only (no deadline) — full search, slower but ordered.
 */
function searchOptions(seed: number, ply: number) {
  const env = (globalThis as { process?: { env?: Record<string, string | undefined> } })
    .process?.env;
  const wall = env?.CALIBRATION_WALL_CLOCK === '1';
  if (!wall) {
    return { seed: plySeed(seed, ply) };
  }
  return {
    seed: plySeed(seed, ply),
    deadlineMs: Number(env?.CALIBRATION_DEADLINE_MS ?? 300),
  };
}

function asDiff(policy: Policy): Difficulty {
  return policy === 'random' ? 'easy' : policy;
}

function outcomeFromWinner(
  winner: string | null | undefined,
  drawTokens: ReadonlyArray<string | null> = [null, 'draw', 'tie']
): Outcome {
  if (winner === 'player1') return 'player1';
  if (winner === 'player2') return 'player2';
  if (drawTokens.includes(winner as string | null)) return 'draw';
  return 'draw';
}

function result(
  winner: Outcome,
  length: number,
  seed: number
): GameResult {
  return { winner, length, seed };
}

// ─── stars-bars / par-55 / ramrod / kwatro / sum-dominoes / prime-gold ───

import { createInitialState as createStars } from '../../../src/games/stars-bars/rules';
import {
  executeAITurn as starsTurn,
  getAIMove as starsMove,
} from '../../../src/games/stars-bars/ai';
import {
  getValidPlacements as starsValids,
  passTurn as starsPass,
  selectCard as starsSelect,
  placeCard as starsPlace,
  hasValidMoves as starsHasMoves,
} from '../../../src/games/stars-bars/rules';

import { createInitialState as createPar } from '../../../src/games/par-55/rules';
import { executeAITurn as parTurn } from '../../../src/games/par-55/ai';

import { createInitialState as createRamrod } from '../../../src/games/ramrod/rules';
import { executeAITurn as ramrodTurn } from '../../../src/games/ramrod/ai';

import { createInitialState as createKwatro } from '../../../src/games/kwatro-sinko/rules';
import { executeAITurn as kwatroTurn } from '../../../src/games/kwatro-sinko/ai';

import { createInitialState as createSum } from '../../../src/games/sum-dominoes/rules';
import { executeAITurn as sumTurn } from '../../../src/games/sum-dominoes/ai';

import { createInitialState as createPrime } from '../../../src/games/prime-gold/rules';
import { executeAITurn as primeTurn } from '../../../src/games/prime-gold/ai';

import { createInitialState as createStarTrack } from '../../../src/games/star-track/types';
import { executeAITurn as starTrackTurn } from '../../../src/games/star-track/ai';
import {
  drawChains,
  selectChain,
  isGameOver as starTrackOver,
} from '../../../src/games/star-track/rules';

import { createInitialState as createHag } from '../../../src/games/hex-a-gone/types';
import { executeAITurn as hagTurn } from '../../../src/games/hex-a-gone/ai';

import { createInitialState as createContig } from '../../../src/games/contig-60/types';
import { executeAITurn as contigTurn } from '../../../src/games/contig-60/ai';

import { createInitialState as createFab } from '../../../src/games/fab-a-diffy/rules';
import { executeAITurn as fabTurn } from '../../../src/games/fab-a-diffy/ai';

function playExecuteLoop(
  create: () => { phase: string; winner?: string | null; currentPlayer: 'player1' | 'player2' },
  turn: (
    state: any,
    seat: 'player1' | 'player2',
    diff: Difficulty,
    opts?: { seed?: number; deadlineMs?: number }
  ) => any,
  seed: number,
  p1: Policy,
  p2: Policy,
  opts?: { useDeadline?: boolean; isTerminal?: (s: any) => boolean }
): GameResult {
  return withSeededRandom(seed, () => {
    let state: any = create();
    let length = 0;
    const terminal =
      opts?.isTerminal ??
      ((s: any) => s.phase === 'gameOver' || s.winner != null);

    while (!terminal(state) && length < MAX_PLIES) {
      installSeededRandom(plySeed(seed, length));
      const seat = state.currentPlayer as 'player1' | 'player2';
      const policy = seat === 'player1' ? p1 : p2;
      const before = state;
      const searchOpts =
        opts?.useDeadline && policy !== 'random'
          ? searchOptions(seed, length)
          : undefined;
      state = turn(state, seat, asDiff(policy), searchOpts);
      length += 1;
      if (
        state.phase === before.phase &&
        state.currentPlayer === before.currentPlayer &&
        state.winner === before.winner
      ) {
        // Stuck — force terminal as draw
        break;
      }
    }

    if (!terminal(state)) {
      return result('draw', length, seed);
    }
    return result(outcomeFromWinner(state.winner), length, seed);
  });
}

const starsBars: GameAdapter = {
  id: 'stars-bars',
  play(p1, p2, seed) {
    return withSeededRandom(seed, () => {
      let state = createStars();
      let length = 0;
      while (state.phase !== 'gameOver' && length < MAX_PLIES) {
        installSeededRandom(plySeed(seed, length));
        const seat = state.currentPlayer;
        const policy = seat === 'player1' ? p1 : p2;
        if (policy === 'random') {
          if (!starsHasMoves(state)) {
            state = starsPass(state);
          } else {
            // Sample a random card+placement via easy move (easy ≈ random) when
            // full enumeration is heavy; fall back to pass.
            const move = starsMove(state, seat, 'easy');
            if (!move) {
              state = starsPass(state);
            } else {
              let s = starsSelect(state, move.cardId);
              const valids = starsValids(s);
              if (valids.length === 0) {
                state = starsPass(state);
              } else {
                const cell = pickRandom(valids);
                state = starsPlace(s, cell.row, cell.col);
              }
            }
          }
        } else {
          state = starsTurn(state, seat, policy);
        }
        length += 1;
      }
      return result(outcomeFromWinner(state.winner), length, seed);
    });
  },
};

const par55: GameAdapter = {
  id: 'par-55',
  play: (p1, p2, seed) =>
    playExecuteLoop(createPar, parTurn, seed, p1, p2),
};

const ramrod: GameAdapter = {
  id: 'ramrod',
  play: (p1, p2, seed) =>
    playExecuteLoop(createRamrod, ramrodTurn, seed, p1, p2),
};

const kwatro: GameAdapter = {
  id: 'kwatro-sinko',
  play: (p1, p2, seed) =>
    playExecuteLoop(createKwatro, kwatroTurn, seed, p1, p2),
};

const sumDominoes: GameAdapter = {
  id: 'sum-dominoes',
  play: (p1, p2, seed) =>
    playExecuteLoop(createSum, sumTurn, seed, p1, p2),
};

const primeGold: GameAdapter = {
  id: 'prime-gold',
  play: (p1, p2, seed) =>
    playExecuteLoop(createPrime, primeTurn, seed, p1, p2),
};

const starTrack: GameAdapter = {
  id: 'star-track',
  play(p1, p2, seed) {
    return withSeededRandom(seed, () => {
      let state = createStarTrack();
      let length = 0;
      while (!starTrackOver(state) && length < MAX_PLIES) {
        installSeededRandom(plySeed(seed, length));
        const seat = state.currentPlayer;
        const policy = seat === 'player1' ? p1 : p2;
        if (policy === 'random') {
          let s = state.phase === 'drawChains' ? drawChains(state) : state;
          if (s.phase === 'selectChain' && s.drawnChains) {
            const idx = Math.floor(Math.random() * s.drawnChains.length) as 0 | 1;
            state = selectChain(s, idx);
          } else {
            state = starTrackTurn(state, seat, 'easy');
          }
        } else {
          state = starTrackTurn(state, seat, policy);
        }
        length += 1;
      }
      return result(outcomeFromWinner(state.winner), length, seed);
    });
  },
};

const hexAGone: GameAdapter = {
  id: 'hex-a-gone',
  play: (p1, p2, seed) =>
    playExecuteLoop(createHag, hagTurn, seed, p1, p2),
};

const contig60: GameAdapter = {
  id: 'contig-60',
  play: (p1, p2, seed) =>
    playExecuteLoop(createContig, contigTurn, seed, p1, p2),
};

const fabADiffy: GameAdapter = {
  id: 'fab-a-diffy',
  play: (p1, p2, seed) =>
    playExecuteLoop(createFab, fabTurn as any, seed, p1, p2, {
      useDeadline: true,
    }),
};

// ─── calla ───────────────────────────────────────────────────────────────

import { createInitialState as createCalla } from '../../../src/games/calla/types';
import { getAIMove as callaMove } from '../../../src/games/calla/ai';
import {
  getValidPits,
  makeMove as callaMake,
  settleNoValidMoves,
  isGameOver as callaOver,
} from '../../../src/games/calla/rules';

const calla: GameAdapter = {
  id: 'calla',
  play(p1, p2, seed) {
    return withSeededRandom(seed, () => {
      let state = createCalla();
      let length = 0;
      while (!callaOver(state) && length < MAX_PLIES) {
        installSeededRandom(plySeed(seed, length));
        const seat = state.currentPlayer;
        const policy = seat === 'player1' ? p1 : p2;
        const pits = getValidPits(state);
        if (pits.length === 0) {
          state = settleNoValidMoves(state);
          length += 1;
          continue;
        }
        if (policy === 'random') {
          state = callaMake(state, pickRandom(pits));
        } else {
          const move = callaMove(state, seat, policy);
          state = move ? callaMake(state, move.pit) : settleNoValidMoves(state);
        }
        length += 1;
      }
      return result(outcomeFromWinner(state.winner, [null, 'tie']), length, seed);
    });
  },
};

// ─── hex ─────────────────────────────────────────────────────────────────

import { createInitialState as createHex } from '../../../src/games/hex/types';
import {
  getBestMove,
  getRandomMove as hexRandom,
} from '../../../src/games/hex/ai';
import { makeMove as hexMake, getValidMoves as hexValids } from '../../../src/games/hex/rules';

const hex: GameAdapter = {
  id: 'hex',
  play(p1, p2, seed) {
    return withSeededRandom(seed, () => {
      let state = createHex();
      let length = 0;
      while (state.winner == null && length < MAX_PLIES) {
        installSeededRandom(plySeed(seed, length));
        const seat = state.currentPlayer;
        const policy = seat === 'player1' ? p1 : p2;
        const move =
          policy === 'random'
            ? hexRandom(state)
            : getBestMove(state, seat, policy, searchOptions(seed, length));
        if (!move) {
          const valids = hexValids(state);
          if (valids.length === 0) break;
          state = hexMake(state, pickRandom(valids));
        } else {
          state = hexMake(state, move);
        }
        length += 1;
      }
      return result(outcomeFromWinner(state.winner), length, seed);
    });
  },
};

// ─── kings ───────────────────────────────────────────────────────────────

import { createInitialGameState } from '../../../src/games/kings-quadraphages/game-state';
import {
  moveKing,
  placeQuadraphage,
} from '../../../src/games/kings-quadraphages/game-state';
import {
  getAIMove as kingsMove,
  getRandomMove as kingsRandom,
} from '../../../src/games/kings-quadraphages/ai';

const kings: GameAdapter = {
  id: 'kings-quadraphages',
  play(p1, p2, seed) {
    return withSeededRandom(seed, () => {
      let state = createInitialGameState();
      let length = 0;
      while (state.turnPhase !== 'gameOver' && length < MAX_PLIES) {
        installSeededRandom(plySeed(seed, length));
        const seat = state.currentPlayer;
        const policy = seat === 'player1' ? p1 : p2;
        const move =
          policy === 'random'
            ? kingsRandom(state, seat)
            : kingsMove(state, seat, policy);
        if (!move) break;
        state = moveKing(state, {
          row: move.kingMove.row + 1,
          col: move.kingMove.col + 1,
        });
        state = placeQuadraphage(state, {
          row: move.quadraphagePlacement.row + 1,
          col: move.quadraphagePlacement.col + 1,
        });
        length += 1;
      }
      return result(outcomeFromWinner(state.winner), length, seed);
    });
  },
};

// ─── queens-guards ───────────────────────────────────────────────────────

import { createInitialState as createQueens } from '../../../src/games/queens-guards/types';
import {
  getAIMove as queensMove,
  applyAIMove as queensApply,
} from '../../../src/games/queens-guards/ai';
import { getValidMoves as queensValids } from '../../../src/games/queens-guards/rules';
import { cellKey, cellsInRing, CONFIG as queensConfig } from '../../../src/games/queens-guards/types';
import { restoreCapturedPiece, makeMove as queensMake } from '../../../src/games/queens-guards/rules';

const queens: GameAdapter = {
  id: 'queens-guards',
  play(p1, p2, seed) {
    return withSeededRandom(seed, () => {
      let state = createQueens();
      let length = 0;
      while (state.winner == null && length < MAX_PLIES) {
        installSeededRandom(plySeed(seed, length));
        const seat = state.currentPlayer;
        const policy = seat === 'player1' ? p1 : p2;
        if (policy === 'random') {
          if (state.capturedPieces.length > 0) {
            const from = state.capturedPieces[0]!;
            const outer = queensConfig.NUM_RINGS - 1;
            const options: { ring: number; position: number }[] = [];
            for (let pos = 0; pos < cellsInRing(outer); pos++) {
              if (!state.cells.get(cellKey(outer, pos))?.piece) {
                options.push({ ring: outer, position: pos });
              }
            }
            if (options.length === 0) break;
            const to = pickRandom(options);
            state = restoreCapturedPiece(state, from, to);
          } else {
            const pieces = [...state.cells.values()].filter(
              (c) => c.piece?.player === seat
            );
            const moves: { from: { ring: number; position: number }; to: { ring: number; position: number } }[] = [];
            for (const cell of pieces) {
              const from = { ring: cell.ring, position: cell.position };
              for (const to of queensValids(state, from)) {
                moves.push({ from, to });
              }
            }
            if (moves.length === 0) break;
            const m = pickRandom(moves);
            state = queensMake(state, m.from, m.to);
          }
        } else {
          let move = queensMove(state, seat, policy, searchOptions(seed, length));
          if (!move) {
            // Deadline miss — legal random fallback (same as random policy path)
            if (state.capturedPieces.length > 0) {
              const from = state.capturedPieces[0]!;
              const outer = queensConfig.NUM_RINGS - 1;
              const options: { ring: number; position: number }[] = [];
              for (let pos = 0; pos < cellsInRing(outer); pos++) {
                if (!state.cells.get(cellKey(outer, pos))?.piece) {
                  options.push({ ring: outer, position: pos });
                }
              }
              if (options.length === 0) break;
              move = { from, to: pickRandom(options) };
            } else {
              const pieces = [...state.cells.values()].filter(
                (c) => c.piece?.player === seat
              );
              const legal: {
                from: { ring: number; position: number };
                to: { ring: number; position: number };
              }[] = [];
              for (const cell of pieces) {
                const from = { ring: cell.ring, position: cell.position };
                for (const to of queensValids(state, from)) {
                  legal.push({ from, to });
                }
              }
              if (legal.length === 0) break;
              move = pickRandom(legal);
            }
          }
          state = queensApply(state, move!);
        }
        length += 1;
      }
      return result(outcomeFromWinner(state.winner), length, seed);
    });
  },
};

// ─── fiar ────────────────────────────────────────────────────────────────

import { createInitialState as createFiar } from '../../../src/games/fiar/types';
import {
  getAIMove as fiarMove,
  applyAIMove as fiarApply,
} from '../../../src/games/fiar/ai';
import {
  canPlaceChip,
  getSelectableNodes,
  getValidMoves as fiarValids,
  placeChip,
  moveChip,
  setSelectedChipKind,
  normalizeSelectedChipKind,
} from '../../../src/games/fiar/rules';
import type { FiarGameState } from '../../../src/games/fiar/types';

function fiarRandomMove(state: FiarGameState) {
  if (state.phase === 'placement') {
    const inv = state.chipInventory[state.currentPlayer];
    const kinds = (
      [
        ...(inv.plain > 0 ? (['plain'] as const) : []),
        ...(inv.marked > 0 ? (['marked'] as const) : []),
      ] as const
    );
    const candidates: { nodeId: string; chipKind: 'plain' | 'marked' }[] = [];
    for (const chipKind of kinds) {
      for (const nodeId of state.board.nodes.keys()) {
        if (canPlaceChip(state, nodeId, chipKind)) {
          candidates.push({ nodeId, chipKind });
        }
      }
    }
    if (candidates.length === 0) return null;
    const pick = pickRandom(candidates);
    return {
      type: 'place' as const,
      nodeId: pick.nodeId,
      chipKind: pick.chipKind,
    };
  }
  if (state.phase === 'movement') {
    const selectable = getSelectableNodes(state);
    const moves: { from: string; to: string }[] = [];
    for (const from of selectable) {
      for (const to of fiarValids(state, from)) {
        moves.push({ from, to });
      }
    }
    if (moves.length === 0) return null;
    const m = pickRandom(moves);
    return { type: 'move' as const, from: m.from, to: m.to };
  }
  return null;
}

const fiar: GameAdapter = {
  id: 'fiar',
  play(p1, p2, seed) {
    return withSeededRandom(seed, () => {
      let state = createFiar();
      let length = 0;
      while (state.phase !== 'gameOver' && length < MAX_PLIES) {
        installSeededRandom(plySeed(seed, length));
        const seat = state.currentPlayer;
        const policy = seat === 'player1' ? p1 : p2;
        let move =
          policy === 'random'
            ? fiarRandomMove(state)
            : fiarMove(state, seat, policy, searchOptions(seed, length));
        // Deadline truncation can return null — legal random fallback.
        if (!move) move = fiarRandomMove(state);
        if (!move) break;
        if (move.type === 'place' && move.nodeId) {
          let s = setSelectedChipKind(state, move.chipKind ?? 'plain');
          s = normalizeSelectedChipKind(s);
          state = placeChip(s, move.nodeId, move.chipKind ?? 'plain');
        } else if (move.type === 'move' && move.from && move.to) {
          state = moveChip(state, move.from, move.to);
        } else {
          state = fiarApply(state, move);
        }
        length += 1;
      }
      return result(outcomeFromWinner(state.winner), length, seed);
    });
  },
};

// ─── pent-em-in ──────────────────────────────────────────────────────────

import { createInitialState as createPent } from '../../../src/games/pent-em-in/types';
import { getAIMove as pentMove } from '../../../src/games/pent-em-in/ai';
import {
  placePiece,
  canPlayerMove,
  getValidPlacements as pentValids,
} from '../../../src/games/pent-em-in/rules';
import {
  getPlayerPieces,
  getPentominoShape,
} from '../../../src/games/pent-em-in/types';
type Rotation = 0 | 90 | 180 | 270;

const pent: GameAdapter = {
  id: 'pent-em-in',
  play(p1, p2, seed) {
    return withSeededRandom(seed, () => {
      let state = createPent();
      let length = 0;
      while (state.phase !== 'gameOver' && length < MAX_PLIES) {
        installSeededRandom(plySeed(seed, length));
        const seat = state.currentPlayer;
        const policy = seat === 'player1' ? p1 : p2;
        if (!canPlayerMove(state, seat)) {
          // Opponent wins if current cannot move at start
          return result(
            seat === 'player1' ? 'player2' : 'player1',
            length,
            seed
          );
        }
        if (policy === 'random') {
          const pieces = getPlayerPieces(state, seat);
          const candidates: {
            shapeId: string;
            position: { row: number; col: number };
            rotation: Rotation;
            flipped: boolean;
          }[] = [];
          for (const shapeId of pieces.available) {
            const shape = getPentominoShape(shapeId);
            if (!shape) continue;
            const rotations: Rotation[] = shape.canRotate
              ? [0, 90, 180, 270]
              : [0];
            const flips = shape.canFlip ? [false, true] : [false];
            for (const rotation of rotations) {
              for (const flipped of flips) {
                for (const position of pentValids(
                  state,
                  shapeId,
                  rotation,
                  flipped
                )) {
                  candidates.push({ shapeId, position, rotation, flipped });
                }
              }
            }
          }
          if (candidates.length === 0) break;
          const m = pickRandom(candidates);
          state = placePiece(
            state,
            m.shapeId,
            m.position,
            m.rotation,
            m.flipped
          );
        } else {
          const move = pentMove(state, seat, policy);
          if (!move) break;
          state = placePiece(
            state,
            move.shapeId,
            move.position,
            move.rotation,
            move.flipped
          );
        }
        length += 1;
      }
      return result(outcomeFromWinner(state.winner), length, seed);
    });
  },
};

// ─── juggle ──────────────────────────────────────────────────────────────

import {
  createInitialState as createJuggle,
  doRollDice,
  canMakeAnyMove,
} from '../../../src/games/juggle/rules';
import { getOpponent as juggleOpp } from '../../../src/games/juggle/types';
import { executeAITurn as juggleTurn } from '../../../src/games/juggle/ai';

const juggle: GameAdapter = {
  id: 'juggle',
  play(p1, p2, seed) {
    return withSeededRandom(seed, () => {
      let state = createJuggle();
      let length = 0;
      while (state.phase !== 'gameOver' && length < MAX_PLIES) {
        installSeededRandom(plySeed(seed, length));
        const seat = state.currentPlayer;
        const policy = seat === 'player1' ? p1 : p2;
        if (state.phase === 'rolling') {
          state = doRollDice(state);
        }
        if (!canMakeAnyMove(state)) {
          // Skip turn when dice cannot place
          state = {
            ...state,
            currentPlayer: juggleOpp(seat),
            currentDice: null,
            selectedCategory: null,
            selectedShape: null,
            phase: 'rolling',
          };
          length += 1;
          continue;
        }
        const beforePlayer = state.currentPlayer;
        const beforePhase = state.phase;
        state = juggleTurn(state, seat, asDiff(policy));
        if (
          state.currentPlayer === beforePlayer &&
          state.phase === beforePhase &&
          !state.winner
        ) {
          state = {
            ...state,
            currentPlayer: juggleOpp(seat),
            currentDice: null,
            selectedCategory: null,
            selectedShape: null,
            phase: 'rolling',
          };
        }
        length += 1;
      }
      return result(outcomeFromWinner(state.winner), length, seed);
    });
  },
};

// ─── remainder-islands ───────────────────────────────────────────────────

import { createInitialState as createRemainder } from '../../../src/games/remainder-islands/types';
import { executeAISelection } from '../../../src/games/remainder-islands/ai';
import {
  performRoll,
  selectIsland,
} from '../../../src/games/remainder-islands/rules';

const remainder: GameAdapter = {
  id: 'remainder-islands',
  play(p1, p2, seed) {
    return withSeededRandom(seed, () => {
      let state = createRemainder();
      let length = 0;
      while (state.phase !== 'gameOver' && length < MAX_PLIES) {
        installSeededRandom(plySeed(seed, length));
        if (state.turnsRemaining <= 0) {
          const w =
            state.player1Score > state.player2Score
              ? 'player1'
              : state.player2Score > state.player1Score
                ? 'player2'
                : 'draw';
          return result(w, length, seed);
        }
        if (state.phase === 'rolling') {
          const before = state.turnsRemaining;
          state = performRoll(state);
          // Skip path may not set gameOver when turns hit 0
          if (state.phase === 'rolling' && state.turnsRemaining <= 0) {
            const w =
              state.player1Score > state.player2Score
                ? 'player1'
                : state.player2Score > state.player1Score
                  ? 'player2'
                  : 'draw';
            return result(w, length, seed);
          }
          if (state.turnsRemaining === before && state.phase === 'rolling') {
            // No progress
            length += 1;
            continue;
          }
        }
        if (state.phase === 'selectIsland') {
          const seat = state.currentPlayer;
          const policy = seat === 'player1' ? p1 : p2;
          if (policy === 'random') {
            if (state.validIslands.length === 0) break;
            state = selectIsland(state, pickRandom(state.validIslands));
          } else {
            state = executeAISelection(state, seat, policy);
          }
        }
        length += 1;
      }
      return result(outcomeFromWinner(state.winner), length, seed);
    });
  },
};

// ─── frac-fact / fraction-pinball (quiz) ─────────────────────────────────

import { createInitialState as createFrac } from '../../../src/games/frac-fact/types';
import {
  startGame as startFrac,
  submitAnswer as submitFrac,
  nextProblem,
} from '../../../src/games/frac-fact/rules';
import { getAIAnswer as fracAnswer } from '../../../src/games/frac-fact/ai';

import { createInitialState as createPin } from '../../../src/games/fraction-pinball/types';
import {
  startGame as startPin,
  submitAnswer as submitPin,
  nextChallenge,
} from '../../../src/games/fraction-pinball/rules';
import { getAIAnswer as pinAnswer } from '../../../src/games/fraction-pinball/ai';

const fracFact: GameAdapter = {
  id: 'frac-fact',
  play(p1, p2, seed) {
    return withSeededRandom(seed, () => {
      let state = startFrac(createFrac('medium'));
      let length = 0;
      while (state.phase !== 'gameOver' && length < MAX_PLIES) {
        installSeededRandom(plySeed(seed, length));
        if (state.phase === 'playing' && state.currentProblem) {
          const seat = state.currentPlayer;
          const policy = seat === 'player1' ? p1 : p2;
          const answer =
            policy === 'random'
              ? pickRandom(state.currentProblem.answerChoices)
              : fracAnswer(state, seat, policy);
          if (!answer) break;
          state = submitFrac(state, answer);
        }
        if (state.phase === 'showingResult') {
          state = nextProblem(state);
        }
        length += 1;
      }
      return result(outcomeFromWinner(state.winner), length, seed);
    });
  },
};

const fractionPinball: GameAdapter = {
  id: 'fraction-pinball',
  play(p1, p2, seed) {
    return withSeededRandom(seed, () => {
      let state = startPin(createPin());
      let length = 0;
      while (state.phase !== 'gameOver' && length < MAX_PLIES) {
        installSeededRandom(plySeed(seed, length));
        if (state.phase === 'answering' && state.currentChallenge) {
          const seat = state.currentPlayer;
          const policy = seat === 'player1' ? p1 : p2;
          const answer =
            policy === 'random'
              ? pickRandom(state.currentChallenge.answerChoices)
              : pinAnswer(state, seat, policy);
          if (!answer) break;
          state = submitPin(state, answer);
        } else if (state.phase === 'showResult') {
          state = nextChallenge(state);
        } else {
          break;
        }
        length += 1;
      }
      return result(outcomeFromWinner(state.winner), length, seed);
    });
  },
};

export const ALL_ADAPTERS: GameAdapter[] = [
  kings,
  hex,
  starTrack,
  hexAGone,
  calla,
  fiar,
  queens,
  contig60,
  juggle,
  fabADiffy,
  sumDominoes,
  par55,
  ramrod,
  kwatro,
  primeGold,
  pent,
  fracFact,
  remainder,
  fractionPinball,
  starsBars,
];

export function getAdapter(id: string): GameAdapter {
  const found = ALL_ADAPTERS.find((a) => a.id === id);
  if (!found) throw new Error(`Unknown game adapter: ${id}`);
  return found;
}
