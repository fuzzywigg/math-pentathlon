/**
 * Wave 20 — hand / bank / deck depletion after legal success.
 * Distinct from wave 15 phase no-ops, wave 16 place→score MatchDetails,
 * wave 18 pass/geometry/AI midphase, and wave 19 persist/serialize/lookup.
 * Tests-only. No product inventing.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';

import {
  createInitialState as createPar,
  selectBlock,
  placeBlock,
  getValidPlacements as parPlacements,
} from '../../src/games/par-55/rules';

import {
  createInitialState as createRamrod,
  selectRod,
  placeRod,
  getValidPlacements as ramPlacements,
} from '../../src/games/ramrod/rules';

import {
  createInitialState as createStars,
  selectCard,
  placeCard,
  getValidPlacements as starsPlacements,
} from '../../src/games/stars-bars/rules';
import { CONFIG as STARS_CONFIG } from '../../src/games/stars-bars/types';

import {
  createInitialState as createSum,
  doRollDice as sumRoll,
  selectDomino,
  placeDomino,
  getValidPlacements as sumPlacements,
  getRemainingCount,
  canPlayDomino,
} from '../../src/games/sum-dominoes/rules';
import { getDiceSum } from '../../src/games/sum-dominoes/types';

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
  createInitialState as createFab,
  selectBar1,
  selectBar2,
  selectOperation,
  executeMove,
  calculateResult,
  findMatchingAnswers,
} from '../../src/games/fab-a-diffy/rules';
import { Fraction } from '../../src/core/fractions/types';

afterEach(() => {
  vi.restoreAllMocks();
});

function findBarId(
  state: ReturnType<typeof createFab>,
  frac: Fraction
): string {
  for (const [id, bar] of state.fractionBars) {
    if (
      bar.fraction.numerator === frac.numerator &&
      bar.fraction.denominator === frac.denominator &&
      !bar.used
    ) {
      return id;
    }
  }
  throw new Error(`bar ${frac.numerator}/${frac.denominator} not found`);
}

function findAnswerId(
  state: ReturnType<typeof createFab>,
  frac: Fraction
): string {
  for (const [id, bar] of state.answerBars) {
    if (
      bar.fraction.numerator === frac.numerator &&
      bar.fraction.denominator === frac.denominator &&
      bar.claimedBy === null
    ) {
      return id;
    }
  }
  throw new Error(`answer ${frac.numerator}/${frac.denominator} not found`);
}

describe('Wave 20 hand-bank — Par 55 place depletes selected block', () => {
  it('placed block leaves the current hand; opponent hand unchanged', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.3);
    let state = createPar();
    const block = state.hands.player1[0];
    const opponentBefore = [...state.hands.player2];
    state = selectBlock(state, block.id);
    const placements = parPlacements(state);
    expect(placements.length).toBeGreaterThan(0);
    state = placeBlock(state, placements[0]);

    expect(state.hands.player1.find((b) => b.id === block.id)).toBeUndefined();
    expect(state.bases.get(placements[0])?.block?.id).toBe(block.id);
    expect(state.hands.player2.map((b) => b.id)).toEqual(
      opponentBefore.map((b) => b.id)
    );
    // Draw may refill to opening size, but never reintroduces the placed id
    expect(state.hands.player1.every((b) => b.id !== block.id)).toBe(true);
  });
});

describe('Wave 20 hand-bank — Ramrod place removes rod from seat inventory', () => {
  it('selected rod leaves playerRods after legal place (draw may refill)', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.2);
    let state = createRamrod();
    const rodId = state.playerRods.player1[0];
    const beforeLen = state.playerRods.player1.length;
    const opponentBefore = [...state.playerRods.player2];
    state = selectRod(state, rodId);
    const placements = ramPlacements(state, rodId);
    expect(placements.length).toBeGreaterThan(0);
    const { boxId, slot } = placements[0];
    state = placeRod(state, boxId, slot);

    expect(state.playerRods.player1.includes(rodId)).toBe(false);
    expect(state.rods.get(rodId)?.position).toEqual({ boxId, slot });
    expect(state.playerRods.player2).toEqual(opponentBefore);
    // Inventory length stays near opening if a spare rod was drawn
    expect(state.playerRods.player1.length).toBeGreaterThanOrEqual(
      beforeLen - 1
    );
    expect(state.playerRods.player1.length).toBeLessThanOrEqual(beforeLen);
  });
});

describe('Wave 20 hand-bank — Stars placeCard deck/hand ledger', () => {
  it('played card leaves hand; deck redraw keeps HAND_SIZE when deck remains', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.2);
    let state = createStars();
    const deckBefore = state.deck.length;
    expect(deckBefore).toBeGreaterThan(0);
    const card = state.playerHands.player1[0];
    const opponentBefore = state.playerHands.player2.map((c) => c.id);
    state = selectCard(state, card.id);
    const placements = starsPlacements(state);
    expect(placements.length).toBeGreaterThan(0);
    const { row, col } = placements[0];
    state = placeCard(state, row, col);

    expect(state.playerHands.player1.find((c) => c.id === card.id)).toBeUndefined();
    expect(state.cells[row][col].card?.id).toBe(card.id);
    expect(state.deck.length).toBe(deckBefore - 1);
    expect(state.playerHands.player1.length).toBe(STARS_CONFIG.HAND_SIZE);
    expect(state.playerHands.player2.map((c) => c.id)).toEqual(opponentBefore);
  });
});

describe('Wave 20 hand-bank — Sum Dominoes depletes without redraw', () => {
  it('legal place shrinks getRemainingCount by 1', () => {
    // Search a few RNG seeds until a playable roll+placement exists
    let placed = false;
    for (let seed = 0; seed < 40 && !placed; seed++) {
      vi.spyOn(Math, 'random').mockReturnValue(seed / 40);
      let state = createSum();
      state = sumRoll(state);
      if (!state.currentDice) {
        vi.restoreAllMocks();
        continue;
      }
      const sum = getDiceSum(state.currentDice);
      const hand = state.hands.player1;
      const playable = hand.find((d) => canPlayDomino(state, d, sum));
      if (!playable) {
        vi.restoreAllMocks();
        continue;
      }
      state = selectDomino(state, playable.id);
      const placements = sumPlacements(state, playable, sum);
      if (placements.length === 0) {
        vi.restoreAllMocks();
        continue;
      }
      const before = getRemainingCount(state, 'player1');
      const opponentBefore = getRemainingCount(state, 'player2');
      const { position, orientation } = placements[0];
      state = placeDomino(state, position, orientation);
      expect(getRemainingCount(state, 'player1')).toBe(before - 1);
      expect(getRemainingCount(state, 'player2')).toBe(opponentBefore);
      expect(state.hands.player1.find((d) => d.id === playable.id)).toBeUndefined();
      placed = true;
      vi.restoreAllMocks();
    }
    expect(placed).toBe(true);
  });
});

describe('Wave 20 hand-bank — Hex-a-Gone bank shape count drops', () => {
  it('placeBlock decrements bank[shape] and drains turnSelection', () => {
    let state = createHag();
    expect(state.bank.triangle).toBe(INITIAL_BANK.triangle);
    state = hagSelect(state, 'triangle');
    state = commitSelection(state);
    expect(state.phase).toBe('placeBlocks');
    state = selectBlockForPlacement(state, 'triangle');
    const placements = hagPlacements(state);
    expect(placements.length).toBeGreaterThan(0);
    const { q, r } = placements[0];
    const before = state.bank.triangle;
    state = placeHag(state, q, r);
    expect(state.bank.triangle).toBe(before - 1);
    expect(state.turnSelection.blocks.includes('triangle')).toBe(false);
    expect(state.placedBlocks.some((b) => b.shape === 'triangle')).toBe(true);
  });
});

describe('Wave 20 hand-bank — Fab bars marked used + answer claimed', () => {
  it('executeMove consumes both bars and claims answer inventory', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    let state = createFab();
    const barA = findBarId(state, { numerator: 1, denominator: 4 });
    const barB = findBarId(state, { numerator: 3, denominator: 4 });
    const answerId = findAnswerId(state, { numerator: 1, denominator: 1 });
    const unusedBefore = [...state.fractionBars.values()].filter(
      (b) => !b.used
    ).length;
    const unclaimedBefore = [...state.answerBars.values()].filter(
      (a) => a.claimedBy === null
    ).length;

    state = selectBar1(state, barA);
    state = selectBar2(state, barB);
    state = selectOperation(state, 'add');
    const result = calculateResult(
      state.fractionBars.get(barA)!.fraction,
      state.fractionBars.get(barB)!.fraction,
      'add'
    )!;
    expect(findMatchingAnswers(state, result)).toContain(answerId);
    state = executeMove(state, answerId);

    expect(state.fractionBars.get(barA)?.used).toBe(true);
    expect(state.fractionBars.get(barB)?.used).toBe(true);
    expect(state.answerBars.get(answerId)?.claimedBy).toBe('player1');
    expect(state.scores.player1).toBe(1);
    const unusedAfter = [...state.fractionBars.values()].filter(
      (b) => !b.used
    ).length;
    const unclaimedAfter = [...state.answerBars.values()].filter(
      (a) => a.claimedBy === null
    ).length;
    expect(unusedAfter).toBe(unusedBefore - 2);
    expect(unclaimedAfter).toBe(unclaimedBefore - 1);
  });
});
