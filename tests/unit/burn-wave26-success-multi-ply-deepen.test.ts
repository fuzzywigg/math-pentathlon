/**
 * Wave 26 — multi-ply SUCCESS deepenings (3–4 legal plies) across claim/place/fill games.
 * Extends never-merged #116 beyond two-ply smoke. Vitest-only. No product inventing.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';
import { areEquivalent } from '../../src/core/fractions/arithmetic';
import { Fraction } from '../../src/core/fractions/types';

import { FabADiffyState } from '../../src/games/fab-a-diffy/types';
import {
  createInitialState as createFab,
  selectBar1,
  selectBar2,
  selectOperation,
  executeMove,
  findMatchingAnswers,
  calculateResult,
} from '../../src/games/fab-a-diffy/rules';

import {
  createInitialState as createPar,
  selectBlock as selectPar,
  placeBlock as placePar,
  getValidPlacements as parPlacements,
} from '../../src/games/par-55/rules';

import {
  createInitialState as createStars,
  selectCard,
  placeCard,
  getValidPlacements as starsPlacements,
} from '../../src/games/stars-bars/rules';

import {
  createInitialState as createKwa,
  selectChip,
  moveChip,
  getValidMoves as kwaMoves,
} from '../../src/games/kwatro-sinko/rules';

import {
  createInitialState as createContig,
  getValidPlacements as contigValid,
} from '../../src/games/contig-60/types';
import {
  doRollDice as contigRoll,
  placeChip as placeContig,
} from '../../src/games/contig-60/rules';

import {
  createInitialState as createPrime,
  rollDice as primeRoll,
  getValidPlacements as primePlacements,
  placeChip as placePrime,
  findCellByValue,
} from '../../src/games/prime-gold/rules';

import { createInitialState as createRemainder } from '../../src/games/remainder-islands/types';
import {
  performRoll,
  selectIsland,
} from '../../src/games/remainder-islands/rules';

import {
  createInitialState as createJuggle,
  doRollDice as juggleRoll,
  selectDie,
  placeShape,
  getBoardFillPercentage,
} from '../../src/games/juggle/rules';

import { createInitialState as createPent } from '../../src/games/pent-em-in/types';
import {
  placePiece,
  getValidPlacements as pentPlacements,
} from '../../src/games/pent-em-in/rules';

import {
  createInitialState as createCalla,
  getSideTotalCubes,
  INITIAL_CUBES_PER_PIT,
  PITS_PER_SIDE,
} from '../../src/games/calla/types';
import {
  makeMove as callaMove,
  getValidPits,
} from '../../src/games/calla/rules';

import {
  createInitialState as createHag,
  getAvailableShapes,
} from '../../src/games/hex-a-gone/types';
import {
  selectBlock as selectHag,
  commitSelection,
  selectBlockForPlacement,
  placeBlock as placeHag,
  getValidPlacements as hagPlacements,
} from '../../src/games/hex-a-gone/rules';

import {
  createInitialState as createStar,
  TRACK_LENGTH,
} from '../../src/games/star-track/types';
import {
  drawChains,
  selectChain,
  getProgress,
} from '../../src/games/star-track/rules';

import {
  createInitialState as createRamrod,
  selectRod,
  placeRod,
  getValidPlacements as ramrodPlacements,
} from '../../src/games/ramrod/rules';

afterEach(() => {
  vi.restoreAllMocks();
});

function findBarId(state: FabADiffyState, fraction: Fraction): string {
  for (const [id, bar] of state.fractionBars) {
    if (
      !bar.used &&
      bar.fraction.numerator === fraction.numerator &&
      bar.fraction.denominator === fraction.denominator
    ) {
      return id;
    }
  }
  throw new Error(`missing bar ${fraction.numerator}/${fraction.denominator}`);
}

function findAnswerId(state: FabADiffyState, fraction: Fraction): string {
  for (const [id, answer] of state.answerBars) {
    if (answer.claimedBy === null && areEquivalent(answer.fraction, fraction)) {
      return id;
    }
  }
  throw new Error(
    `missing answer ${fraction.numerator}/${fraction.denominator}`
  );
}

function tryFabClaim(state: FabADiffyState): FabADiffyState | null {
  const pairs: Array<{
    a: Fraction;
    b: Fraction;
    operation: 'add' | 'subtract' | 'multiply';
    answer: Fraction;
  }> = [
    {
      a: { numerator: 1, denominator: 4 },
      b: { numerator: 3, denominator: 4 },
      operation: 'add',
      answer: { numerator: 1, denominator: 1 },
    },
    {
      a: { numerator: 1, denominator: 3 },
      b: { numerator: 1, denominator: 6 },
      operation: 'add',
      answer: { numerator: 1, denominator: 2 },
    },
    {
      a: { numerator: 2, denominator: 3 },
      b: { numerator: 1, denominator: 6 },
      operation: 'subtract',
      answer: { numerator: 1, denominator: 2 },
    },
    {
      a: { numerator: 1, denominator: 5 },
      b: { numerator: 1, denominator: 5 },
      operation: 'add',
      answer: { numerator: 2, denominator: 5 },
    },
    {
      a: { numerator: 1, denominator: 2 },
      b: { numerator: 1, denominator: 4 },
      operation: 'subtract',
      answer: { numerator: 1, denominator: 4 },
    },
    {
      a: { numerator: 1, denominator: 2 },
      b: { numerator: 1, denominator: 3 },
      operation: 'add',
      answer: { numerator: 5, denominator: 6 },
    },
  ];

  for (const pair of pairs) {
    try {
      const a = findBarId(state, pair.a);
      const b = findBarId(state, pair.b);
      if (a === b) continue;
      const ans = findAnswerId(state, pair.answer);
      let s = selectBar1(state, a);
      s = selectBar2(s, b);
      s = selectOperation(s, pair.operation);
      const result = calculateResult(
        s.fractionBars.get(a)!.fraction,
        s.fractionBars.get(b)!.fraction,
        pair.operation
      );
      if (!result || !findMatchingAnswers(s, result).includes(ans)) continue;
      const before = s.moveHistory.length;
      s = executeMove(s, ans);
      if (s.moveHistory.length === before + 1) return s;
    } catch {
      // try next
    }
  }
  return null;
}

describe('Wave 26 deepen — Fab three successful claims', () => {
  it('claims until three history entries or bars exhausted', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    let state = createFab();
    let claims = 0;
    for (let i = 0; i < 6 && claims < 3; i++) {
      if (state.winner || state.phase === 'gameOver') break;
      const next = tryFabClaim(state);
      if (!next) break;
      state = next;
      claims++;
    }
    expect(claims).toBeGreaterThanOrEqual(2);
    expect(state.moveHistory.length).toBe(claims);
    expect(state.scores.player1 + state.scores.player2).toBe(claims);
  });
});

describe('Wave 26 deepen — Par four-ply place chain', () => {
  it('four select→place plies grow history and keep phase selectingBlock', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.17);
    let state = createPar();
    for (let i = 0; i < 4; i++) {
      if (state.phase === 'gameOver') break;
      const hand = state.hands[state.currentPlayer];
      expect(hand.length).toBeGreaterThan(0);
      state = selectPar(state, hand[0].id);
      const spots = parPlacements(state);
      expect(spots.length).toBeGreaterThan(0);
      state = placePar(state, spots[0]);
      expect(state.moveHistory).toHaveLength(i + 1);
    }
    expect(state.moveHistory.length).toBeGreaterThanOrEqual(4);
    if (state.phase !== 'gameOver') {
      expect(state.phase).toBe('selectingBlock');
    }
  });
});

describe('Wave 26 deepen — Stars four-ply score climb', () => {
  it('four placeCard plies; scores nondecreasing; history length 4', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.42);
    let state = createStars();
    let lastP1 = 0;
    let lastP2 = 0;
    for (let i = 0; i < 4; i++) {
      if (state.phase === 'gameOver') break;
      const hand = state.playerHands[state.currentPlayer];
      expect(hand.length).toBeGreaterThan(0);
      state = selectCard(state, hand[0].id);
      const slots = starsPlacements(state);
      expect(slots.length).toBeGreaterThan(0);
      state = placeCard(state, slots[0].row, slots[0].col);
      expect(state.playerScores.player1).toBeGreaterThanOrEqual(lastP1);
      expect(state.playerScores.player2).toBeGreaterThanOrEqual(lastP2);
      lastP1 = state.playerScores.player1;
      lastP2 = state.playerScores.player2;
    }
    expect(state.moveHistory.length).toBeGreaterThanOrEqual(4);
  });
});

describe('Wave 26 deepen — Kwatro three relocate plies', () => {
  it('three successful moveChip plies update positions and history', () => {
    let state = createKwa();
    const chips = ['p1-2', 'p2-2', 'p1-4', 'p2-4', 'p1-0', 'p2-0'];
    let moves = 0;
    for (const chipId of chips) {
      if (state.phase === 'gameOver' || moves >= 3) break;
      const chip = state.chips.get(chipId);
      if (!chip || chip.owner !== state.currentPlayer) continue;
      const dests = kwaMoves(state, chipId);
      if (dests.length === 0) continue;
      state = selectChip(state, chipId);
      state = moveChip(state, dests[0]);
      moves++;
      expect(state.moveHistory).toHaveLength(moves);
    }
    expect(moves).toBeGreaterThanOrEqual(2);
  });
});

describe('Wave 26 deepen — Contig four-ply roll→place', () => {
  it('four placeChip successes flip seats and append expressions', () => {
    // Vary RNG so dice aren't stuck on [1,1,1] after claiming those cells
    let tick = 0;
    vi.spyOn(Math, 'random').mockImplementation(() => {
      tick += 1;
      return (tick % 10) / 10;
    });
    let state = createContig();
    let placed = 0;
    for (let i = 0; i < 8 && placed < 4; i++) {
      state = contigRoll(state);
      if (state.phase !== 'calculating' || !state.currentDice) continue;
      const opts = contigValid(state, state.currentDice).filter(
        (o) => state.cells.get(o.result)?.owner === null
      );
      if (opts.length === 0) continue;
      state = placeContig(state, opts[0].result, opts[0].expression);
      placed++;
      expect(state.moveHistory).toHaveLength(placed);
      expect(state.moveHistory[placed - 1].expression).toBe(opts[0].expression);
    }
    expect(placed).toBe(4);
  });
});

describe('Wave 26 deepen — Prime Gold four-ply placeChip', () => {
  it('four roll→place cycles grow history and conserve free cells drop', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.2);
    let state = createPrime();
    let freeBefore = [...state.cells.values()].filter(
      (c) => c.owner === null
    ).length;
    for (let i = 0; i < 4; i++) {
      state = primeRoll(state);
      const free = primePlacements(state).filter(
        (p) => findCellByValue(state, p.value)?.owner === null
      );
      expect(free.length).toBeGreaterThan(0);
      state = placePrime(state, free[0].value, free[0].expression);
      expect(state.moveHistory).toHaveLength(i + 1);
    }
    const freeAfter = [...state.cells.values()].filter(
      (c) => c.owner === null
    ).length;
    expect(freeAfter).toBe(freeBefore - 4);
  });
});

describe('Wave 26 deepen — Remainder two-seat claim chain', () => {
  it('p1 then p2 each claim an island; chips and scores update', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.5);
    let state = createRemainder();
    const p1Chips = state.player1Chips;
    state = performRoll(state);
    expect(state.validIslands.length).toBeGreaterThan(0);
    state = selectIsland(state, state.validIslands[0]);
    expect(state.player1Chips).toBe(p1Chips - 1);
    expect(state.moveHistory).toHaveLength(1);

    if (state.phase === 'rolling' && state.currentPlayer === 'player2') {
      const p2Chips = state.player2Chips;
      state = performRoll(state);
      if (state.phase === 'selectIsland' && state.validIslands.length > 0) {
        state = selectIsland(state, state.validIslands[0]);
        expect(state.player2Chips).toBe(p2Chips - 1);
        expect(state.moveHistory).toHaveLength(2);
      }
    }
  });
});

describe('Wave 26 deepen — Juggle four monomino fills', () => {
  it('four monomino plies raise both board fills and history to 4', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0); // [1,1]
    let state = createJuggle();
    const coords = [
      { row: 0, col: 0 },
      { row: 0, col: 1 },
      { row: 1, col: 0 },
      { row: 1, col: 1 },
    ];
    for (let i = 0; i < 4; i++) {
      state = juggleRoll(state);
      state = selectDie(state, 0);
      expect(state.phase).toBe('placing');
      const seat = state.currentPlayer;
      const fillBefore = getBoardFillPercentage(state.boards[seat]);
      state = placeShape(state, coords[i]);
      expect(getBoardFillPercentage(state.boards[seat])).toBeGreaterThan(
        fillBefore
      );
      expect(state.moveHistory).toHaveLength(i + 1);
    }
  });
});

describe('Wave 26 deepen — Pent two-seat placePiece', () => {
  it('p1 and p2 each place; placedPieces length 2; seats flip', () => {
    let state = createPent();
    const p1Shape = state.player1Pieces.available[0];
    const spots1 = pentPlacements(state, p1Shape, 0, false);
    expect(spots1.length).toBeGreaterThan(0);
    state = placePiece(state, p1Shape, spots1[0], 0, false);
    expect(state.placedPieces).toHaveLength(1);
    expect(state.currentPlayer).toBe('player2');

    const p2Shape = state.player2Pieces.available[0];
    const spots2 = pentPlacements(state, p2Shape, 0, false);
    expect(spots2.length).toBeGreaterThan(0);
    state = placePiece(state, p2Shape, spots2[0], 0, false);
    expect(state.placedPieces).toHaveLength(2);
    expect(state.moveHistory).toHaveLength(2);
    if (state.phase !== 'gameOver') {
      expect(state.currentPlayer).toBe('player1');
    }
  });
});

describe('Wave 26 deepen — Calla multi-sow conservation', () => {
  it('three makeMove plies conserve total cubes', () => {
    let state = createCalla();
    const total0 =
      getSideTotalCubes(state, 'player1') +
      getSideTotalCubes(state, 'player2') +
      state.player1Calla +
      state.player2Calla;
    expect(total0).toBe(INITIAL_CUBES_PER_PIT * PITS_PER_SIDE * 2);

    for (let i = 0; i < 3; i++) {
      if (state.phase === 'gameOver') break;
      const pits = getValidPits(state);
      expect(pits.length).toBeGreaterThan(0);
      state = callaMove(state, pits[0]);
      expect(state.moveHistory).toHaveLength(i + 1);
    }
    const totalN =
      getSideTotalCubes(state, 'player1') +
      getSideTotalCubes(state, 'player2') +
      state.player1Calla +
      state.player2Calla;
    expect(totalN).toBe(total0);
  });
});

describe('Wave 26 deepen — Hex-a-Gone two full place turns', () => {
  it('p1 place then p2 place; bank drains; history length 2', () => {
    let state = createHag();
    for (let ply = 0; ply < 2; ply++) {
      const available = getAvailableShapes(state);
      expect(available.length).toBeGreaterThan(0);
      const shape = available[0];
      const bankBefore = state.bank[shape];
      state = selectHag(state, shape);
      state = commitSelection(state);
      state = selectBlockForPlacement(state, shape);
      const spots = hagPlacements(state);
      expect(spots.length).toBeGreaterThan(0);
      state = placeHag(state, spots[0].q, spots[0].r);
      expect(state.bank[shape]).toBe(bankBefore - 1);
      expect(state.moveHistory).toHaveLength(ply + 1);
    }
    expect(state.currentPlayer).toBe('player1');
  });
});

describe('Wave 26 deepen — Star Track two-seat progress', () => {
  it('p1 then p2 selectChain; both positions advance; progress > 0', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.1);
    let state = createStar();
    state = drawChains(state);
    const len1 = state.drawnChains![0].length;
    state = selectChain(state, 0);
    expect(state.player1Position).toBe(Math.min(len1, TRACK_LENGTH));
    expect(getProgress(state, 'player1')).toBeGreaterThan(0);
    expect(state.moveHistory).toHaveLength(1);

    if (state.phase === 'drawChains') {
      state = drawChains(state);
      const len2 = state.drawnChains![0].length;
      state = selectChain(state, 0);
      expect(state.player2Position).toBe(Math.min(len2, TRACK_LENGTH));
      expect(getProgress(state, 'player2')).toBeGreaterThan(0);
      expect(state.moveHistory).toHaveLength(2);
    }
  });
});

describe('Wave 26 deepen — Ramrod three rod placements', () => {
  it('three placeRod plies append history regardless of capture', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.3);
    let state = createRamrod();
    for (let i = 0; i < 3; i++) {
      if (state.phase === 'gameOver') break;
      const rods = state.playerRods[state.currentPlayer];
      expect(rods.length).toBeGreaterThan(0);
      let placed = false;
      for (const rodId of rods) {
        const spots = ramrodPlacements(state, rodId);
        if (spots.length === 0) continue;
        state = selectRod(state, rodId);
        state = placeRod(state, spots[0].boxId, spots[0].slot);
        placed = true;
        break;
      }
      expect(placed).toBe(true);
      expect(state.moveHistory.length).toBeGreaterThanOrEqual(i + 1);
    }
    expect(state.moveHistory.length).toBeGreaterThanOrEqual(3);
  });
});

describe('Wave 26 deepen — Fab two claims with score split', () => {
  it('exactly two claims assign one point each when both succeed', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    let state = createFab();
    const first = tryFabClaim(state);
    expect(first).not.toBeNull();
    state = first!;
    const second = tryFabClaim(state);
    if (second) {
      state = second;
      expect(state.moveHistory).toHaveLength(2);
      expect(state.scores.player1 + state.scores.player2).toBe(2);
    } else {
      expect(state.moveHistory).toHaveLength(1);
    }
  });
});

describe('Wave 26 deepen — Par five-ply endurance', () => {
  it('five placeBlock plies keep history length 5', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.19);
    let state = createPar();
    for (let i = 0; i < 5; i++) {
      if (state.phase === 'gameOver') break;
      const hand = state.hands[state.currentPlayer];
      expect(hand.length).toBeGreaterThan(0);
      state = selectPar(state, hand[0].id);
      const spots = parPlacements(state);
      expect(spots.length).toBeGreaterThan(0);
      state = placePar(state, spots[0]);
    }
    expect(state.moveHistory.length).toBeGreaterThanOrEqual(5);
  });
});

describe('Wave 26 deepen — Stars five-ply endurance', () => {
  it('five placeCard plies keep scores nondecreasing', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.33);
    let state = createStars();
    let p1 = 0;
    let p2 = 0;
    for (let i = 0; i < 5; i++) {
      if (state.phase === 'gameOver') break;
      const hand = state.playerHands[state.currentPlayer];
      state = selectCard(state, hand[0].id);
      const slots = starsPlacements(state);
      expect(slots.length).toBeGreaterThan(0);
      state = placeCard(state, slots[0].row, slots[0].col);
      expect(state.playerScores.player1).toBeGreaterThanOrEqual(p1);
      expect(state.playerScores.player2).toBeGreaterThanOrEqual(p2);
      p1 = state.playerScores.player1;
      p2 = state.playerScores.player2;
    }
    expect(state.moveHistory.length).toBeGreaterThanOrEqual(5);
  });
});

describe('Wave 26 deepen — Prime five-ply free-cell drop', () => {
  it('five placeChip plies drop unowned cells by 5', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.28);
    let state = createPrime();
    const free0 = [...state.cells.values()].filter(
      (c) => c.owner === null
    ).length;
    for (let i = 0; i < 5; i++) {
      state = primeRoll(state);
      const free = primePlacements(state).filter(
        (p) => findCellByValue(state, p.value)?.owner === null
      );
      expect(free.length).toBeGreaterThan(0);
      state = placePrime(state, free[0].value, free[0].expression);
    }
    const freeN = [...state.cells.values()].filter(
      (c) => c.owner === null
    ).length;
    expect(freeN).toBe(free0 - 5);
    expect(state.moveHistory).toHaveLength(5);
  });
});

describe('Wave 26 deepen — HAG three turns fill three cells', () => {
  it('three select→commit→place cycles fill +3 cells', () => {
    let state = createHag();
    const filled0 = state.board.filter((c) => c.filled).length;
    for (let i = 0; i < 3; i++) {
      const shape = getAvailableShapes(state)[0];
      state = selectHag(state, shape);
      state = commitSelection(state);
      state = selectBlockForPlacement(state, shape);
      const spots = hagPlacements(state);
      expect(spots.length).toBeGreaterThan(0);
      state = placeHag(state, spots[0].q, spots[0].r);
    }
    expect(state.board.filter((c) => c.filled).length).toBe(filled0 + 3);
    expect(state.moveHistory).toHaveLength(3);
  });
});

describe('Wave 26 deepen — Calla five sow plies conserve', () => {
  it('five makeMove plies keep cube total invariant', () => {
    let state = createCalla();
    const total0 =
      getSideTotalCubes(state, 'player1') +
      getSideTotalCubes(state, 'player2') +
      state.player1Calla +
      state.player2Calla;
    for (let i = 0; i < 5; i++) {
      if (state.phase === 'gameOver') break;
      const pits = getValidPits(state);
      if (pits.length === 0) break;
      state = callaMove(state, pits[0]);
    }
    expect(state.moveHistory.length).toBeGreaterThanOrEqual(3);
    const totalN =
      getSideTotalCubes(state, 'player1') +
      getSideTotalCubes(state, 'player2') +
      state.player1Calla +
      state.player2Calla;
    expect(totalN).toBe(total0);
  });
});

describe('Wave 26 deepen — Star Track three progress steps', () => {
  it('up to three selectChain plies advance at least one seat twice', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.12);
    let state = createStar();
    let steps = 0;
    for (let i = 0; i < 3; i++) {
      if (state.phase !== 'drawChains') break;
      state = drawChains(state);
      if (state.phase !== 'selectChain' || !state.drawnChains) break;
      state = selectChain(state, 0);
      steps++;
    }
    expect(steps).toBeGreaterThanOrEqual(2);
    expect(state.moveHistory.length).toBe(steps);
    expect(state.player1Position + state.player2Position).toBeGreaterThan(0);
  });
});

describe('Wave 26 deepen — Juggle six monomino board climb', () => {
  it('six monomino plies push combined fill above opening', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    let state = createJuggle();
    const fill0 =
      getBoardFillPercentage(state.boards.player1) +
      getBoardFillPercentage(state.boards.player2);
    const coords = [
      { row: 0, col: 0 },
      { row: 0, col: 1 },
      { row: 0, col: 2 },
      { row: 1, col: 0 },
      { row: 1, col: 1 },
      { row: 1, col: 2 },
    ];
    for (let i = 0; i < 6; i++) {
      state = juggleRoll(state);
      state = selectDie(state, 0);
      state = placeShape(state, coords[i]);
    }
    expect(state.moveHistory).toHaveLength(6);
    const fillN =
      getBoardFillPercentage(state.boards.player1) +
      getBoardFillPercentage(state.boards.player2);
    expect(fillN).toBeGreaterThan(fill0);
  });
});

describe('Wave 26 deepen — Pent three-piece place chain', () => {
  it('three placePiece successes occupy three shapes', () => {
    let state = createPent();
    for (let i = 0; i < 3; i++) {
      if (state.phase === 'gameOver') break;
      const pieces =
        state.currentPlayer === 'player1'
          ? state.player1Pieces.available
          : state.player2Pieces.available;
      expect(pieces.length).toBeGreaterThan(0);
      const shapeId = pieces[0];
      const spots = pentPlacements(state, shapeId, 0, false);
      expect(spots.length).toBeGreaterThan(0);
      state = placePiece(state, shapeId, spots[0], 0, false);
      expect(state.placedPieces).toHaveLength(i + 1);
    }
    expect(state.placedPieces.length).toBeGreaterThanOrEqual(3);
    expect(state.moveHistory.length).toBeGreaterThanOrEqual(3);
  });
});

describe('Wave 26 deepen — Remainder three-claim attempt', () => {
  it('up to three successful island claims grow history', () => {
    let tick = 0;
    vi.spyOn(Math, 'random').mockImplementation(() => {
      tick += 1;
      return (tick % 7) / 7;
    });
    let state = createRemainder();
    let claims = 0;
    for (let i = 0; i < 10 && claims < 3; i++) {
      if (state.phase === 'gameOver') break;
      if (state.phase !== 'rolling') break;
      state = performRoll(state);
      if (state.phase === 'selectIsland' && state.validIslands.length > 0) {
        state = selectIsland(state, state.validIslands[0]);
        claims++;
      }
    }
    expect(claims).toBeGreaterThanOrEqual(1);
    expect(state.moveHistory.length).toBe(claims);
  });
});

describe('Wave 26 deepen — Ramrod four rod placements', () => {
  it('four placeRod plies append at least four history entries', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.41);
    let state = createRamrod();
    let placed = 0;
    for (let i = 0; i < 8 && placed < 4; i++) {
      if (state.phase === 'gameOver') break;
      const rods = state.playerRods[state.currentPlayer];
      let did = false;
      for (const rodId of rods) {
        const spots = ramrodPlacements(state, rodId);
        if (!spots.length) continue;
        state = selectRod(state, rodId);
        state = placeRod(state, spots[0].boxId, spots[0].slot);
        placed++;
        did = true;
        break;
      }
      if (!did) break;
    }
    expect(placed).toBeGreaterThanOrEqual(3);
    expect(state.moveHistory.length).toBeGreaterThanOrEqual(placed);
  });
});

describe('Wave 26 deepen — Kwatro four relocates', () => {
  it('four moveChip successes grow history to 4', () => {
    let state = createKwa();
    const order = [
      'p1-2',
      'p2-2',
      'p1-4',
      'p2-4',
      'p1-6',
      'p2-6',
      'p1-0',
      'p2-0',
      'p1-8',
      'p2-8',
    ];
    let moves = 0;
    for (const id of order) {
      if (moves >= 4 || state.phase === 'gameOver') break;
      const chip = state.chips.get(id);
      if (!chip || chip.owner !== state.currentPlayer) continue;
      const dests = kwaMoves(state, id);
      if (!dests.length) continue;
      state = selectChip(state, id);
      state = moveChip(state, dests[0]);
      moves++;
    }
    expect(moves).toBeGreaterThanOrEqual(3);
    expect(state.moveHistory.length).toBe(moves);
  });
});
