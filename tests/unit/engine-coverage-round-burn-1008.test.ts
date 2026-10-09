/**
 * burn-1008-mp-engine-coverage-round — characterization tests for the lowest
 * branch-covered NON-AI engine modules on the wave5 tip.
 *
 * Pins CURRENT behavior only (legal moves, apply, win/draw, scoring, serialize).
 * Builds on helpers from #465 (state-roundtrip) and patterns from #482 / #515.
 * Does not change engine source. Unreachable arms are documented via it.todo.
 */
import { describe, it, expect } from 'vitest';

import {
  createInitialState as createPent,
  BOARD_SIZE as PENT_BOARD,
  type PentEmInState,
} from '../../src/games/pent-em-in/types';
import {
  canPlayerMove as pentCanMove,
  orientSelectedPieceToFit,
  selectedPieceFitsAnywhere,
  getCurrentOrientationPlacements,
  selectPiece as pentSelect,
  placePiece as pentPlace,
  cancelSelection as pentCancel,
} from '../../src/games/pent-em-in/rules';

import {
  createInitialGameState,
  getCurrentPhaseMessage,
  selectKing,
  moveKing,
  placeQuadraphage,
  type GameState as KingsFullState,
} from '../../src/games/kings-quadraphages/game-state';
import {
  isValidKingMove,
  isDrawCondition,
  getValidKingMoves,
  getValidQuadraphagePlacements,
  checkWinCondition,
} from '../../src/games/kings-quadraphages/rules';
import {
  serializeGameState,
  deserializeGameState,
} from '../../src/games/kings-quadraphages/serialization';
import {
  createEmptyBoard,
  placeKing,
  createCustomGameState,
} from './helpers/kings-board';

import {
  createInitialState as createPar,
  selectBlock as parSelect,
  placeBlock as parPlace,
  getValidPlacements as parValids,
  clearSelection as parClear,
  passTurn as parPass,
} from '../../src/games/par-55/rules';

import type { KwaState, Chip, BoardNode } from '../../src/games/kwatro-sinko/types';
import {
  createInitialState as createKwa,
  checkTrioForWin,
  moveChip as kwaMove,
  selectChip as kwaSelect,
  getValidMoves as kwaValids,
  clearSelection as kwaClear,
  passTurn as kwaPass,
  allChipsOffNumbered,
} from '../../src/games/kwatro-sinko/rules';

import {
  createInitialState as createPinball,
} from '../../src/games/fraction-pinball/types';
import {
  startGame as pinballStart,
  submitAnswer as pinballSubmit,
  nextChallenge as pinballNext,
} from '../../src/games/fraction-pinball/rules';
import type { FractionPinballState } from '../../src/games/fraction-pinball/types';

import {
  createInitialState as createPrime,
  rollDice as primeRoll,
  placeChip as primePlace,
  getValidPlacements as primeValids,
  passTurn as primePass,
} from '../../src/games/prime-gold/rules';
import type {
  PrimeGoldState,
  Player as PrimePlayer,
} from '../../src/games/prime-gold/types';

import { createInitialState as createCalla } from '../../src/games/calla/types';
import {
  makeMove as callaMove,
  settleNoValidMoves,
  getValidPits,
  isGameOver as callaOver,
} from '../../src/games/calla/rules';

import {
  createInitialState as createJuggle,
  selectedShapeFitsAnywhere,
  getCurrentOrientationPlacements as juggleOrients,
  selectShape as juggleSelectShape,
  selectDie as juggleSelectDie,
  abandonPlacement,
} from '../../src/games/juggle/rules';
import { SHAPE_POOLS } from '../../src/games/juggle/types';

import { createInitialState as createHag } from '../../src/games/hex-a-gone/types';
import {
  getPhaseMessage as hagPhase,
  commitSelection as hagCommit,
  passTurn as hagPass,
  isGameOver as hagOver,
} from '../../src/games/hex-a-gone/rules';
import type { HexAGoneGameState } from '../../src/games/hex-a-gone/types';

import {
  createInitialState as createRemainder,
} from '../../src/games/remainder-islands/types';
import {
  performRoll,
  selectIsland,
} from '../../src/games/remainder-islands/rules';
import type { RemainderIslandsState } from '../../src/games/remainder-islands/types';

import {
  createInitialState as createStar,
} from '../../src/games/star-track/types';
import {
  getChainLandingSpace,
  drawChains,
  selectChain,
} from '../../src/games/star-track/rules';
import type { StarTrackGameState, ChainLink } from '../../src/games/star-track/types';

import {
  createInitialState as createSum,
  doRollDice as sumRoll,
  selectDomino,
  getValidPlacements as sumValids,
  placeDomino,
} from '../../src/games/sum-dominoes/rules';
import { getDiceSum } from '../../src/games/sum-dominoes/types';

import {
  jsonRoundTrip,
  canonMoves,
  stripLazyCaches,
} from './helpers/state-roundtrip';
import { ALL_GAME_ADAPTERS } from './helpers/state-roundtrip-games';

// ─── helpers ─────────────────────────────────────────────────────────────────

function crowdedPentStrip(): PentEmInState {
  const board = createPent().board.map((row) => row.map((c) => ({ ...c })));
  for (let r = 0; r < PENT_BOARD; r++) {
    for (let c = 0; c < PENT_BOARD; c++) {
      if (!(r === 0 && c < 5)) {
        board[r]![c] = {
          ...board[r]![c]!,
          occupied: true,
          owner: 'player2',
          pieceId: 'block',
        };
      }
    }
  }
  return {
    ...createPent(),
    board,
    player1Pieces: { available: ['I5', 'L5', 'X', 'bogus-shape'], placed: [] },
  };
}

/**
 * Own a known 4-long TRBL prime vein on the spiral board
 * (cells (0,4),(1,3),(2,2),(3,1) — the only MIN_VEIN_LENGTH run at opening).
 */
function ownOpeningPrimeVein(
  state: PrimeGoldState,
  player: PrimePlayer
): PrimeGoldState {
  const cells = new Map(state.cells);
  const coords: Array<[number, number]> = [
    [0, 4],
    [1, 3],
    [2, 2],
    [3, 1],
  ];
  for (const [row, col] of coords) {
    const cell = cells.get(`${row},${col}`);
    if (!cell?.isPrime) {
      throw new Error(`expected prime at ${row},${col}`);
    }
    cells.set(`${row},${col}`, { ...cell, owner: player });
  }
  return { ...state, cells };
}

function kwaEntry(
  nodeId: string,
  chip: Chip
): { node: BoardNode; chip: Chip } {
  return {
    node: {
      id: nodeId,
      x: 0,
      y: 0,
      isNumbered: false,
      chip,
      connections: [],
    },
    chip,
  };
}

// =============================================================================
// pent-em-in/rules.ts — lowest rules branch % (89.74%)
// =============================================================================

describe('engine-coverage-round — pent-em-in', () => {
  it('orient/fits/placements reject wrong phase or missing selection', () => {
    const open = createPent();
    expect(orientSelectedPieceToFit(open)).toBe(open);
    expect(selectedPieceFitsAnywhere(open)).toBe(false);
    expect(getCurrentOrientationPlacements(open)).toEqual([]);

    const noSel: PentEmInState = {
      ...open,
      phase: 'placePiece',
      selectedPiece: null,
    };
    expect(orientSelectedPieceToFit(noSel)).toBe(noSel);
    expect(selectedPieceFitsAnywhere(noSel)).toBe(false);
    expect(getCurrentOrientationPlacements(noSel)).toEqual([]);
  });

  it('unknown shape ids: canPlayerMove short-circuits true; orient/fits reject', () => {
    const jammed = crowdedPentStrip();
    expect(pentCanMove(jammed, 'player1')).toBe(true);

    // Oddity: when available[0] is unknown, canPlayerMove returns
    // `available.length > 0` (true) without scanning — pins CURRENT behavior.
    const onlyBogus: PentEmInState = {
      ...jammed,
      player1Pieces: { available: ['bogus-shape'], placed: [] },
    };
    expect(pentCanMove(onlyBogus, 'player1')).toBe(true);

    const selectedBogus: PentEmInState = {
      ...jammed,
      phase: 'placePiece',
      selectedPiece: 'bogus-shape',
      selectedRotation: 0,
      selectedFlipped: false,
    };
    expect(orientSelectedPieceToFit(selectedBogus)).toBe(selectedBogus);
    expect(selectedPieceFitsAnywhere(selectedBogus)).toBe(false);

    // Unknown mid-list is skipped; real pieces still decide mobility
    const mixed: PentEmInState = {
      ...jammed,
      player1Pieces: { available: ['bogus-shape', 'I5'], placed: [] },
    };
    expect(pentCanMove(mixed, 'player1')).toBe(true);
  });

  it('orientSelectedPieceToFit is identity when selected piece cannot fit', () => {
    const jammed: PentEmInState = {
      ...crowdedPentStrip(),
      phase: 'placePiece',
      selectedPiece: 'X',
      selectedRotation: 0,
      selectedFlipped: false,
    };
    expect(selectedPieceFitsAnywhere(jammed)).toBe(false);
    expect(orientSelectedPieceToFit(jammed)).toEqual(jammed);
  });

  it('select → place → cancel; json round-trip preserves state', () => {
    let state = pentSelect(createPent(), 'X');
    expect(state.phase).toBe('placePiece');
    expect(state.previewPosition).not.toBeNull();
    const anchors = getCurrentOrientationPlacements(state);
    expect(anchors.length).toBeGreaterThan(0);
    state = pentPlace(
      state,
      'X',
      anchors[0]!,
      state.selectedRotation,
      state.selectedFlipped
    );
    expect(state.phase === 'selectPiece' || state.phase === 'gameOver').toBe(
      true
    );
    const json = jsonRoundTrip(stripLazyCaches(state));
    expect(json).toEqual(stripLazyCaches(state));
    const cancelled = pentCancel(pentSelect(createPent(), 'L5'));
    expect(cancelled.phase).toBe('selectPiece');
    expect(cancelled.selectedPiece).toBeNull();
  });
});

// =============================================================================
// kings-quadraphages — rules + game-state phase / draw edges
// =============================================================================

describe('engine-coverage-round — kings-quadraphages', () => {
  it('getCurrentPhaseMessage covers move / place / win / tie', () => {
    const open = createInitialGameState();
    expect(getCurrentPhaseMessage(open)).toMatch(/Click your King/);
    const selected = selectKing(open);
    expect(getCurrentPhaseMessage(selected)).toMatch(/green square/);
    // 1-based: player1 king starts at row 1 col 5 → move to row 2 col 5
    const afterMove = moveKing(selected, { row: 2, col: 5 });
    expect(afterMove.turnPhase).toBe('placeQuadraphage');
    expect(getCurrentPhaseMessage(afterMove)).toMatch(/Place a Quadraphage/);

    const p1Win: KingsFullState = {
      ...open,
      turnPhase: 'gameOver',
      winner: 'player1',
    };
    expect(getCurrentPhaseMessage(p1Win)).toMatch(/Player 1 wins/);
    const p2Win: KingsFullState = {
      ...open,
      turnPhase: 'gameOver',
      winner: 'player2',
    };
    expect(getCurrentPhaseMessage(p2Win)).toMatch(/Player 2 wins/);
    const tie: KingsFullState = {
      ...open,
      turnPhase: 'gameOver',
      winner: null,
    };
    expect(getCurrentPhaseMessage(tie)).toMatch(/Tie/);
  });

  it('isValidKingMove rejects stay-in-place via isEmpty before dedicated check', () => {
    const board = createEmptyBoard();
    placeKing(board, { row: 4, col: 4 }, 'player1');
    placeKing(board, { row: 0, col: 0 }, 'player2');
    const state = createCustomGameState(board);
    expect(isValidKingMove(state, 'player1', { row: 4, col: 4 })).toBe(false);
    expect(getValidKingMoves(state, 'player1').length).toBeGreaterThan(0);
  });

  it('isDrawCondition true when both supplies are zero and kings are free', () => {
    const board = createEmptyBoard();
    placeKing(board, { row: 4, col: 4 }, 'player1');
    placeKing(board, { row: 4, col: 6 }, 'player2');
    const state = createCustomGameState(board, 0, 0);
    expect(checkWinCondition(state)).toBeNull();
    expect(isDrawCondition(state)).toBe(true);
    expect(getValidQuadraphagePlacements(state).length).toBeGreaterThan(0);
  });

  it('dedicated serialize codec round-trips a mid-game place phase', () => {
    let state = createInitialGameState();
    state = selectKing(state);
    state = moveKing(state, { row: 2, col: 5 });
    expect(state.turnPhase).toBe('placeQuadraphage');
    const spot = getValidQuadraphagePlacements(state)[0]!;
    state = placeQuadraphage(state, { row: spot.row + 1, col: spot.col + 1 });
    const encoded = serializeGameState(state);
    const revived = deserializeGameState(encoded);
    expect(revived.currentPlayer).toBe(state.currentPlayer);
    expect(revived.turnPhase).toBe(state.turnPhase);
    expect(revived.player1Supply).toBe(state.player1Supply);
    expect(revived.player2Supply).toBe(state.player2Supply);
  });

  it.todo(
    'TODO(engine-coverage-round): isValidKingMove stay-in-place arm (rules.ts:90) unreachable — isEmpty rejects the king cell first'
  );

  it.todo(
    'TODO(engine-coverage-round): isDrawCondition board-full-both-kings-mobile arm (rules.ts:185) geometrically impossible'
  );

  it.todo(
    'TODO(engine-coverage-round): getCurrentPhaseMessage default never (game-state.ts:136) unreachable for typed TurnPhase'
  );
});

// =============================================================================
// par-55 — remaining defensive / settle arms
// =============================================================================

describe('engine-coverage-round — par-55', () => {
  it('clearSelection / passTurn / illegal place stay identity-safe', () => {
    let state = createPar();
    const blockId = state.hands.player1[0]!.id;
    state = parSelect(state, blockId);
    expect(state.phase).toBe('placingBlock');
    const cleared = parClear(state);
    expect(cleared.phase).toBe('selectingBlock');
    expect(cleared.selectedBlock).toBeNull();
    const passed = parPass(createPar());
    expect(passed.currentPlayer).toBe('player2');
    const open = createPar();
    expect(parPlace(open, 'nope')).toBe(open);
  });

  it('json round-trip after a scored place preserves hands and scores', () => {
    let state = createPar();
    state = parSelect(state, state.hands.player1[0]!.id);
    const baseId = parValids(state)[0]!;
    state = parPlace(state, baseId);
    const trip = jsonRoundTrip(stripLazyCaches(state));
    expect(trip.scores).toEqual(state.scores);
    expect(trip.currentPlayer).toBe(state.currentPlayer);
    expect(trip.hands.player1.length).toBe(state.hands.player1.length);
  });

  it.todo(
    'TODO(engine-coverage-round): par-55 defensive centerBase/!base/nested equal-score arms (see docs/engine-coverage-next5)'
  );
});

// =============================================================================
// kwatro-sinko — trio audit + forged move edges
// =============================================================================

describe('engine-coverage-round — kwatro-sinko', () => {
  it('checkTrioForWin rejects same-owner triples and non-winning arithmetic', () => {
    const a: Chip = { id: 'a', value: 2, owner: 'player1', position: 'n2-1' };
    const b: Chip = { id: 'b', value: 2, owner: 'player1', position: 'n2-2' };
    const c: Chip = { id: 'c', value: 2, owner: 'player1', position: 'n2-3' };
    expect(
      checkTrioForWin([
        kwaEntry('n2-1', a),
        kwaEntry('n2-2', b),
        kwaEntry('n2-3', c),
      ])
    ).toBeNull();

    const d: Chip = { id: 'd', value: 4, owner: 'player1', position: 'n2-1' };
    const e: Chip = { id: 'e', value: 4, owner: 'player1', position: 'n2-2' };
    const f: Chip = { id: 'f', value: 1, owner: 'player2', position: 'n2-3' };
    expect(
      checkTrioForWin([
        kwaEntry('n2-1', d),
        kwaEntry('n2-2', e),
        kwaEntry('n2-3', f),
      ])
    ).toBeNull();
  });

  it('checkTrioForWin accepts a 2+1 winning alignment', () => {
    const a: Chip = { id: 'a', value: 3, owner: 'player1', position: 'n2-1' };
    const b: Chip = { id: 'b', value: 3, owner: 'player1', position: 'n2-2' };
    const c: Chip = { id: 'c', value: 2, owner: 'player2', position: 'n2-3' };
    const win = checkTrioForWin([
      kwaEntry('n2-1', a),
      kwaEntry('n2-2', b),
      kwaEntry('n2-3', c),
    ]);
    expect(win).not.toBeNull();
    expect(win!.result).toBe(4);
  });

  it('select → move → clear / pass; serialize round-trip', () => {
    let state = createKwa();
    const chipId = 'p1-0';
    const moves = kwaValids(state, chipId);
    expect(moves.length).toBeGreaterThan(0);
    state = kwaSelect(state, chipId);
    expect(state.phase).toBe('selectingDest');
    state = kwaMove(state, moves[0]!);
    expect(state.phase === 'selectingChip' || state.phase === 'gameOver').toBe(
      true
    );
    const cleared = kwaClear(kwaSelect(createKwa(), chipId));
    expect(cleared.selectedChip).toBeNull();
    const passed = kwaPass(createKwa());
    expect(passed.currentPlayer).toBe('player2');
    const trip = jsonRoundTrip(stripLazyCaches(state));
    expect(trip.currentPlayer).toBe(state.currentPlayer);
    expect(
      typeof allChipsOffNumbered(state.nodes, state.chips, 'player1')
    ).toBe('boolean');
  });

  it('forged selectingDest with missing chip is identity', () => {
    const forged: KwaState = {
      ...createKwa(),
      phase: 'selectingDest',
      selectedChip: 'missing-chip',
    };
    expect(kwaMove(forged, 'n1-0')).toBe(forged);
  });

  it.todo(
    'TODO(engine-coverage-round): kwatro createBoard !node + moveChip !chip/!newNode after isValidMove unreachable on public graph'
  );

  it.todo(
    'TODO(engine-coverage-round): checkTrioForWin !likes||!opposite after byOwner.size===2 unreachable for 3-chip trio'
  );
});

// =============================================================================
// fraction-pinball — scoring / phase + private RNG note
// =============================================================================

describe('engine-coverage-round — fraction-pinball', () => {
  it('start → wrong answer → nextChallenge handoff; serialize mid-game', () => {
    let state: FractionPinballState = pinballStart(createPinball());
    expect(state.phase).toBe('answering');
    expect(state.currentChallenge).not.toBeNull();
    const wrong = state.currentChallenge!.answerChoices.find(
      (o) => o !== state.currentChallenge!.correctAnswer
    )!;
    state = pinballSubmit(state, wrong);
    expect(state.phase).toBe('showResult');
    expect(state.isCorrect).toBe(false);
    state = pinballNext(state);
    expect(
      state.currentPlayer === 'player1' || state.currentPlayer === 'player2'
    ).toBe(true);
    const trip = jsonRoundTrip(stripLazyCaches(state));
    expect(trip.player1Stats.ballsRemaining).toBe(
      state.player1Stats.ballsRemaining
    );
    expect(trip.roundNumber).toBe(state.roundNumber);
  });

  it.todo(
    'TODO(engine-coverage-round): generateWrongDecimals fill-while (rules.ts:97-104) is private RNG'
  );
});

// =============================================================================
// prime-gold — chip-exhaustion settle with real vein boards
// =============================================================================

describe('engine-coverage-round — prime-gold', () => {
  it('chip exhaustion awards player1 when board veins lead', () => {
    let state = ownOpeningPrimeVein(createPrime(), 'player1');
    state = {
      ...state,
      currentPlayer: 'player2',
      playerChips: { player1: 0, player2: 1 },
      phase: 'placing',
      diceRoll: { die1: 1, die2: 1, die3: 1 },
    };
    let valids = primeValids(state);
    if (valids.length === 0) {
      state = { ...state, phase: 'rolling', diceRoll: null };
      state = primeRoll(state);
      valids = primeValids(state);
    }
    expect(valids.length).toBeGreaterThan(0);
    // Avoid placing onto the seeded vein cells
    const veinVals = new Set([47, 23, 7, 19]);
    const pick =
      valids.find((p) => !veinVals.has(p.value)) ?? valids[0]!;
    const next = primePlace(state, pick.value, pick.expr);
    expect(next.phase).toBe('gameOver');
    expect(next.playerChips.player1).toBe(0);
    expect(next.playerChips.player2).toBe(0);
    expect(next.primeVeins.player1).toBeGreaterThanOrEqual(1);
    expect(next.primeVeins.player1).toBeGreaterThan(next.primeVeins.player2);
    expect(next.winner).toBe('player1');
  });

  it('chip exhaustion awards player2 when p2 veins lead', () => {
    let state = ownOpeningPrimeVein(createPrime(), 'player2');
    state = {
      ...state,
      currentPlayer: 'player1',
      playerChips: { player1: 1, player2: 0 },
      phase: 'placing',
      diceRoll: { die1: 1, die2: 1, die3: 1 },
    };
    let valids = primeValids(state);
    if (valids.length === 0) {
      state = { ...state, phase: 'rolling', diceRoll: null };
      state = primeRoll(state);
      valids = primeValids(state);
    }
    expect(valids.length).toBeGreaterThan(0);
    const veinVals = new Set([47, 23, 7, 19]);
    const pick =
      valids.find((p) => !veinVals.has(p.value)) ?? valids[0]!;
    const next = primePlace(state, pick.value, pick.expr);
    expect(next.phase).toBe('gameOver');
    expect(next.primeVeins.player2).toBeGreaterThan(next.primeVeins.player1);
    expect(next.winner).toBe('player2');
  });

  it('passTurn flips seat; serialize mid-rolling state', () => {
    let state = primeRoll(createPrime());
    const before = state.currentPlayer;
    state = primePass(state);
    expect(state.currentPlayer).not.toBe(before);
    expect(state.phase).toBe('rolling');
    const trip = jsonRoundTrip(stripLazyCaches(state));
    expect(trip.currentPlayer).toBe(state.currentPlayer);
  });
});

// =============================================================================
// calla — engine coverage (HvA copy pin removed; alpha Blue/Red wins)
// =============================================================================

describe('engine-coverage-round — calla', () => {
  it('settleNoValidMoves + legal pit apply + serialize', () => {
    const open = createCalla();
    const pits = getValidPits(open);
    expect(pits.length).toBeGreaterThan(0);
    const next = callaMove(open, pits[0]!);
    expect(
      callaOver(next) ||
        next.currentPlayer !== open.currentPlayer ||
        next.phase !== open.phase
    ).toBe(true);
    const empty = {
      ...open,
      player1Pits: Array(6).fill(0),
      player2Pits: Array(6).fill(0),
    };
    const settled = settleNoValidMoves(empty);
    expect(settled.phase).toBe('gameOver');
    const trip = jsonRoundTrip(stripLazyCaches(next));
    expect(trip.player1Calla).toBe(next.player1Calla);
  });
});

// =============================================================================
// juggle — null selection + abandon + orient
// =============================================================================

describe('engine-coverage-round — juggle', () => {
  it('selectedShapeFitsAnywhere false without selection; abandon clears shape', () => {
    const open = createJuggle();
    expect(selectedShapeFitsAnywhere(open)).toBe(false);
    expect(juggleOrients(open)).toEqual([]);

    let state = {
      ...createJuggle(),
      phase: 'selectingShape' as const,
      currentDice: [4, 1] as [number, number],
      selectedCategory: 'tetromino' as const,
      selectedDieValue: 4,
      selectedShape: null,
    };
    expect(selectedShapeFitsAnywhere(state)).toBe(false);
    const shape = SHAPE_POOLS.tetromino[0]!;
    state = juggleSelectShape(state, shape);
    expect(state.phase).toBe('placing');
    expect(selectedShapeFitsAnywhere(state)).toBe(true);
    const abandoned = abandonPlacement(state);
    expect(abandoned.selectedShape).toBeNull();
    expect(abandoned.phase).toBe('selectingShape');
  });

  it('selectDie auto-orients monomino; serialize', () => {
    let state = {
      ...createJuggle(),
      phase: 'selectingShape' as const,
      currentDice: [1, 2] as [number, number],
    };
    state = juggleSelectDie(state, 0);
    expect(state.phase).toBe('placing');
    expect(state.selectedShape).not.toBeNull();
    const trip = jsonRoundTrip(stripLazyCaches(state));
    expect(trip.selectedCategory).toBe(state.selectedCategory);
  });
});

// =============================================================================
// hex-a-gone — phase message default + pass / commit edges
// =============================================================================

describe('engine-coverage-round — hex-a-gone', () => {
  it('getPhaseMessage default arm for unknown phase; gameOver naming', () => {
    const weird: HexAGoneGameState = {
      ...createHag(),
      phase: 'not-a-phase' as HexAGoneGameState['phase'],
    };
    expect(hagPhase(weird)).toBe('');
    const over: HexAGoneGameState = {
      ...createHag(),
      phase: 'gameOver',
      winner: 'player2',
    };
    expect(hagPhase(over)).toMatch(/Red wins/);
    expect(hagOver(over)).toBe(true);
  });

  it('passTurn from empty selection hands off; commit requires blocks', () => {
    const open = createHag();
    expect(hagCommit(open)).toBe(open);
    const passed = hagPass(open);
    expect(passed.currentPlayer).toBe('player2');
  });
});

// =============================================================================
// remainder-islands — player2 score win settle
// =============================================================================

describe('engine-coverage-round — remainder-islands', () => {
  it('selectIsland awards player2 when p2 score leads at game over', () => {
    let state: RemainderIslandsState = {
      ...createRemainder(),
      turnsRemaining: 1,
      player1Score: 0,
      player2Score: 10,
      currentPlayer: 'player2',
    };
    state = performRoll(state);
    expect(state.phase).toBe('selectIsland');
    expect(state.validIslands.length).toBeGreaterThan(0);
    const next = selectIsland(state, state.validIslands[0]!);
    expect(next.phase).toBe('gameOver');
    expect(next.player2Score).toBeGreaterThan(next.player1Score);
    expect(next.winner).toBe('player2');
  });
});

// =============================================================================
// star-track — getChainLandingSpace hole / wrong phase
// =============================================================================

describe('engine-coverage-round — star-track', () => {
  it('getChainLandingSpace null on wrong phase or missing chain slot', () => {
    const open = createStar();
    expect(getChainLandingSpace(open, 0)).toBeNull();
    const state = drawChains(open);
    expect(state.phase).toBe('selectChain');
    expect(getChainLandingSpace(state, 0)).not.toBeNull();
    const hole = undefined as unknown as ChainLink;
    const holed: StarTrackGameState = {
      ...state,
      drawnChains: [state.drawnChains![0]!, hole],
    };
    expect(getChainLandingSpace(holed, 1)).toBeNull();
    const next = selectChain(state, 0);
    expect(
      next.phase === 'drawChains' ||
        next.phase === 'gameOver' ||
        next.phase === 'selectChain'
    ).toBe(true);
  });
});

// =============================================================================
// sum-dominoes — roll → select → place + serialize
// =============================================================================

describe('engine-coverage-round — sum-dominoes', () => {
  it('roll → select → place legal move when available; serialize', () => {
    let state = sumRoll(createSum());
    expect(state.currentDice).not.toBeNull();
    expect(state.phase === 'placing' || state.phase === 'passing').toBe(true);
    if (state.phase === 'passing') {
      const trip = jsonRoundTrip(stripLazyCaches(state));
      expect(trip.phase).toBe('passing');
      return;
    }
    const sum = getDiceSum(state.currentDice!);
    const playable = state.hands.player1.find((d) => {
      const valids = sumValids(state, d, sum);
      return valids.length > 0;
    });
    expect(playable).toBeTruthy();
    state = selectDomino(state, playable!.id);
    const valids = sumValids(state, playable!, sum);
    expect(valids.length).toBeGreaterThan(0);
    const v = valids[0]!;
    state = placeDomino(state, v.position, v.orientation);
    const trip = jsonRoundTrip(stripLazyCaches(state));
    expect(trip.moveHistory.length).toBe(state.moveHistory.length);
  });
});

// =============================================================================
// Cross-game adapter smoke for the five lowest rules engines (#465 helpers)
// =============================================================================

describe('engine-coverage-round — adapter smoke (lowest five)', () => {
  const lowest = [
    'pent-em-in',
    'kings-quadraphages',
    'par-55',
    'kwatro-sinko',
    'fraction-pinball',
  ];

  for (const id of lowest) {
    it(`${id}: one legal move + round-trip preserves legal-move set`, () => {
      const adapter = ALL_GAME_ADAPTERS.find((a) => a.id === id);
      expect(adapter).toBeTruthy();
      let state = adapter!.create();
      const moves = adapter!.legalMoves(state);
      expect(moves.length).toBeGreaterThan(0);
      state = adapter!.apply(state, moves[0]!);
      const revived = adapter!.roundTrip(state);
      expect(adapter!.normalize(revived)).toEqual(adapter!.normalize(state));
      expect(canonMoves(adapter!.legalMoves(revived))).toBe(
        canonMoves(adapter!.legalMoves(state))
      );
    });
  }
});
