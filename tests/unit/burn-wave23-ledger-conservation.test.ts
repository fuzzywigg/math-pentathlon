/**
 * Wave 23 — multi-step ledger conservation across existing games.
 * Complements hand-bank / piece-supply / quiz-track files: asserts totals that
 * must hold after sequences of legal success (not opening-only wave 19).
 * Tests-only. No product inventing.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';

import {
  createInitialState as createHag,
  INITIAL_BANK,
} from '../../src/games/hex-a-gone/types';
import {
  selectBlock as hagSelect,
  commitSelection,
  selectBlockForPlacement,
  placeBlock as placeHag,
  getValidPlacements as hagPlacements,
} from '../../src/games/hex-a-gone/rules';

import {
  createInitialState as createCalla,
  getPlayerPits,
  getPlayerCalla,
  getSideTotalCubes,
  TOTAL_CUBES,
  INITIAL_CUBES_PER_PIT,
  PITS_PER_SIDE,
} from '../../src/games/calla/types';
import { getValidPits, makeMove as callaMove } from '../../src/games/calla/rules';

import {
  createInitialState as createPrime,
  rollDice as primeRoll,
  getValidPlacements as primePlacements,
  placeChip as placePrime,
} from '../../src/games/prime-gold/rules';
import { CONFIG as PRIME_CFG } from '../../src/games/prime-gold/types';

import {
  createInitialState as createStars,
  selectCard,
  placeCard,
  getValidPlacements as starsPlacements,
} from '../../src/games/stars-bars/rules';
import { CONFIG as STARS_CONFIG } from '../../src/games/stars-bars/types';

import {
  createInitialState as createPar,
  selectBlock,
  placeBlock,
  getValidPlacements as parPlacements,
} from '../../src/games/par-55/rules';

import {
  createInitialState as createFab,
  selectBar1,
  selectBar2,
  selectOperation,
  executeMove,
  calculateResult,
  findMatchingAnswers,
} from '../../src/games/fab-a-diffy/rules';

import {
  createInitialState as createFiar,
  CONFIG as FIAR_CFG,
} from '../../src/games/fiar/types';
import { placeChip as placeFiar } from '../../src/games/fiar/rules';

import {
  createInitialState as createStar,
  TRACK_LENGTH,
} from '../../src/games/star-track/types';
import {
  drawChains,
  selectChain,
  getProgress,
} from '../../src/games/star-track/rules';

afterEach(() => {
  vi.restoreAllMocks();
});

function bankTotal(bank: Record<string, number>): number {
  return Object.values(bank).reduce((a, b) => a + b, 0);
}

describe('Wave 23 conservation — Hex-a-Gone bank + filled cells', () => {
  it('bank drop equals filled cells after multi-shape turn', () => {
    let state = createHag();
    const openingBank = bankTotal(INITIAL_BANK);
    expect(bankTotal(state.bank)).toBe(openingBank);
    expect(state.board.filter((c) => c.filled).length).toBe(0);

    state = hagSelect(state, 'triangle');
    state = hagSelect(state, 'rhombus');
    state = commitSelection(state);

    state = selectBlockForPlacement(state, 'triangle');
    const first = hagPlacements(state)[0];
    state = placeHag(state, first.q, first.r);

    if (state.phase === 'placeBlocks') {
      if (state.selectedBlockForPlacement !== 'rhombus') {
        state = selectBlockForPlacement(state, 'rhombus');
      }
      const spots = hagPlacements(state);
      expect(spots.length).toBeGreaterThan(0);
      state = placeHag(state, spots[0].q, spots[0].r);
    }

    const filled = state.board.filter((c) => c.filled).length;
    expect(filled).toBe(2);
    expect(bankTotal(state.bank)).toBe(openingBank - filled);
    expect(state.placedBlocks.length).toBe(filled);
  });
});

describe('Wave 23 conservation — Calla TOTAL_CUBES across two sows', () => {
  it('opening equals pits×cubes; two moves keep TOTAL_CUBES', () => {
    expect(TOTAL_CUBES).toBe(PITS_PER_SIDE * 2 * INITIAL_CUBES_PER_PIT);
    let state = createCalla();
    const sum = () =>
      getSideTotalCubes(state, 'player1') +
      getSideTotalCubes(state, 'player2') +
      getPlayerCalla(state, 'player1') +
      getPlayerCalla(state, 'player2');
    expect(sum()).toBe(TOTAL_CUBES);

    const pits1 = getValidPits(state);
    expect(pits1.length).toBeGreaterThan(0);
    state = callaMove(state, pits1[0]);
    expect(sum()).toBe(TOTAL_CUBES);

    const pits2 = getValidPits(state);
    if (pits2.length > 0) {
      const beforePit = getPlayerPits(state, state.currentPlayer)[pits2[0]];
      expect(beforePit).toBeGreaterThan(0);
      state = callaMove(state, pits2[0]);
      expect(sum()).toBe(TOTAL_CUBES);
    }
  });
});

describe('Wave 23 conservation — Prime chips + claimed cells', () => {
  it('STARTING_CHIPS×2 = remaining chips + owned cells after place', () => {
    let done = false;
    for (let seed = 0; seed < 40 && !done; seed++) {
      vi.spyOn(Math, 'random').mockReturnValue(seed / 40);
      let state = createPrime();
      const opening =
        PRIME_CFG.STARTING_CHIPS * 2;
      state = primeRoll(state);
      const placements = primePlacements(state);
      if (placements.length === 0) {
        vi.restoreAllMocks();
        continue;
      }
      state = placePrime(state, placements[0].value, placements[0].expr);
      const remaining =
        state.playerChips.player1 + state.playerChips.player2;
      const owned = [...state.cells.values()].filter(
        (c) => c.owner !== null
      ).length;
      expect(remaining + owned).toBe(opening);
      done = true;
      vi.restoreAllMocks();
    }
    expect(done).toBe(true);
  });
});

describe('Wave 23 conservation — Stars hand+deck card accounting', () => {
  it('hands + deck + board cards stay constant after place', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.27);
    let state = createStars();
    const countAll = () => {
      const hands =
        state.playerHands.player1.length + state.playerHands.player2.length;
      const board = state.cells.flat().filter((c) => c.card).length;
      return hands + state.deck.length + board;
    };
    const before = countAll();
    expect(state.playerHands.player1.length).toBe(STARS_CONFIG.HAND_SIZE);
    const card = state.playerHands.player1[0];
    state = selectCard(state, card.id);
    const spots = starsPlacements(state);
    expect(spots.length).toBeGreaterThan(0);
    state = placeCard(state, spots[0].row, spots[0].col);
    expect(countAll()).toBe(before);
  });
});

describe('Wave 23 conservation — Par bases occupancy vs hand ids', () => {
  it('placed block id appears on exactly one base and never both hands', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.35);
    let state = createPar();
    const block = state.hands.player1[0];
    state = selectBlock(state, block.id);
    const baseId = parPlacements(state)[0];
    state = placeBlock(state, baseId);
    expect(state.bases.get(baseId)?.block?.id).toBe(block.id);
    const handIds = [
      ...state.hands.player1.map((b) => b.id),
      ...state.hands.player2.map((b) => b.id),
    ];
    expect(handIds.includes(block.id)).toBe(false);
    const onBases = [...state.bases.values()].filter(
      (b) => b.block?.id === block.id
    );
    expect(onBases).toHaveLength(1);
  });
});

describe('Wave 23 conservation — Fab used bars + claimed answers', () => {
  it('after executeMove: used+unused bars = total; claimed+free answers = total', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    let state = createFab();
    const barsTotal = state.fractionBars.size;
    const answersTotal = state.answerBars.size;
    const a = [...state.fractionBars.entries()].find(
      ([, b]) =>
        b.fraction.numerator === 1 && b.fraction.denominator === 4 && !b.used
    )![0];
    const b = [...state.fractionBars.entries()].find(
      ([, bar]) =>
        bar.fraction.numerator === 3 &&
        bar.fraction.denominator === 4 &&
        !bar.used
    )![0];
    state = selectBar1(state, a);
    state = selectBar2(state, b);
    state = selectOperation(state, 'add');
    const result = calculateResult(
      state.fractionBars.get(a)!.fraction,
      state.fractionBars.get(b)!.fraction,
      'add'
    )!;
    const answerId = findMatchingAnswers(state, result)[0];
    state = executeMove(state, answerId);

    const used = [...state.fractionBars.values()].filter((x) => x.used).length;
    const unused = [...state.fractionBars.values()].filter((x) => !x.used)
      .length;
    expect(used + unused).toBe(barsTotal);
    expect(used).toBe(2);

    const claimed = [...state.answerBars.values()].filter(
      (x) => x.claimedBy !== null
    ).length;
    const free = [...state.answerBars.values()].filter(
      (x) => x.claimedBy === null
    ).length;
    expect(claimed + free).toBe(answersTotal);
    expect(claimed).toBe(1);
  });
});

describe('Wave 23 conservation — FIAR chipsPlaced + occupied nodes', () => {
  it('chipsPlaced sum equals occupied board nodes during placement', () => {
    let state = createFiar();
    const ids = ['0-0', '0-1', '0-2', '1-0', '1-1', '1-2'];
    for (const id of ids) {
      if (state.phase !== 'placement') break;
      state = placeFiar(state, id);
      const occupied = [...state.board.nodes.values()].filter(
        (n) => n.chip !== null
      ).length;
      expect(
        state.chipsPlaced.player1 + state.chipsPlaced.player2
      ).toBe(occupied);
    }
    expect(
      state.chipsPlaced.player1 + state.chipsPlaced.player2
    ).toBeGreaterThan(0);
    expect(
      state.chipsPlaced.player1 + state.chipsPlaced.player2
    ).toBeLessThanOrEqual(FIAR_CFG.CHIPS_PER_PLAYER * 2);
  });
});

describe('Wave 23 conservation — Star Track progress bounds', () => {
  it('positions stay within [0, TRACK_LENGTH]; progress mirrors position ratio', () => {
    let state = createStar();
    for (let turn = 0; turn < 4; turn++) {
      if (state.phase === 'gameOver') break;
      if (state.phase === 'drawChains') {
        state = drawChains(state);
      }
      if (state.phase === 'selectChain' && state.drawnChains) {
        state = selectChain(state, turn % 2);
      }
    }
    expect(state.player1Position).toBeGreaterThanOrEqual(0);
    expect(state.player1Position).toBeLessThanOrEqual(TRACK_LENGTH);
    expect(state.player2Position).toBeGreaterThanOrEqual(0);
    expect(state.player2Position).toBeLessThanOrEqual(TRACK_LENGTH);
    expect(getProgress(state, 'player1')).toBe(
      (state.player1Position / TRACK_LENGTH) * 100
    );
    expect(getProgress(state, 'player2')).toBe(
      (state.player2Position / TRACK_LENGTH) * 100
    );
  });
});
