/**
 * Wave 24 — hand / bank / deck depletion after legal success.
 * Revives closed #122/#129 inventory vertical after #127. Distinct from
 * wave 19 opening-invariants, wave 20 opponent/bounds, wave 21 attribute/polyomino,
 * wave 22 tutorial/reject/dice-expr.
 * Tests-only. Existing games only — no product inventing.
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
  deselectBlock,
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

import {
  createInitialState as createFiar,
  CONFIG as FIAR_CFG,
} from '../../src/games/fiar/types';
import { placeChip as placeFiar } from '../../src/games/fiar/rules';

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

describe('Wave 24 hand-bank — Par 55 place depletes selected block', () => {
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
    expect(state.hands.player1.every((b) => b.id !== block.id)).toBe(true);
  });

  it('second seat place also removes that seat block id permanently', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.41);
    let state = createPar();
    const p1 = state.hands.player1[0];
    state = selectBlock(state, p1.id);
    state = placeBlock(state, parPlacements(state)[0]);
    expect(state.currentPlayer).toBe('player2');

    const p2 = state.hands.player2[0];
    const p2BeforeIds = state.hands.player2.map((b) => b.id);
    state = selectBlock(state, p2.id);
    const spots = parPlacements(state);
    if (spots.length === 0) return; // rare full-board edge — skip soft
    state = placeBlock(state, spots[0]);
    expect(state.hands.player2.find((b) => b.id === p2.id)).toBeUndefined();
    expect(p2BeforeIds).toContain(p2.id);
  });
});

describe('Wave 24 hand-bank — Ramrod place removes rod from seat inventory', () => {
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
    expect(state.playerRods.player1.length).toBeGreaterThanOrEqual(
      beforeLen - 1
    );
    expect(state.playerRods.player1.length).toBeLessThanOrEqual(beforeLen);
  });

  it('placed rod is never still selectable from the same seat inventory', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.25);
    let state = createRamrod();
    const rodId = state.playerRods.player1[0];
    state = selectRod(state, rodId);
    const { boxId, slot } = ramPlacements(state, rodId)[0];
    state = placeRod(state, boxId, slot);
    expect(state.playerRods.player1.includes(rodId)).toBe(false);
    expect(state.playerRods.player2.includes(rodId)).toBe(false);
  });
});

describe('Wave 24 hand-bank — Stars placeCard deck/hand ledger', () => {
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

    expect(
      state.playerHands.player1.find((c) => c.id === card.id)
    ).toBeUndefined();
    expect(state.cells[row][col].card?.id).toBe(card.id);
    expect(state.deck.length).toBe(deckBefore - 1);
    expect(state.playerHands.player1.length).toBe(STARS_CONFIG.HAND_SIZE);
    expect(state.playerHands.player2.map((c) => c.id)).toEqual(opponentBefore);
  });

  it('two consecutive places each shrink the shared deck by 1', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.33);
    let state = createStars();
    const deck0 = state.deck.length;
    const c1 = state.playerHands.player1[0];
    state = selectCard(state, c1.id);
    const p1 = starsPlacements(state);
    expect(p1.length).toBeGreaterThan(0);
    state = placeCard(state, p1[0].row, p1[0].col);
    expect(state.deck.length).toBe(deck0 - 1);

    if (state.currentPlayer !== 'player2') return;
    const c2 = state.playerHands.player2[0];
    state = selectCard(state, c2.id);
    const p2 = starsPlacements(state);
    if (p2.length === 0) return;
    state = placeCard(state, p2[0].row, p2[0].col);
    expect(state.deck.length).toBe(deck0 - 2);
  });
});

describe('Wave 24 hand-bank — Sum Dominoes depletes without redraw', () => {
  it('legal place shrinks getRemainingCount by 1', () => {
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
      expect(
        state.hands.player1.find((d) => d.id === playable.id)
      ).toBeUndefined();
      const onBoard = state.board
        .flat()
        .some((cell) => cell?.domino.id === playable.id);
      expect(onBoard).toBe(true);
      placed = true;
      vi.restoreAllMocks();
    }
    expect(placed).toBe(true);
  });
});

describe('Wave 24 hand-bank — Hex-a-Gone bank shape count drops', () => {
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

  it('two-shape selection drains bank by 1 each after both places', () => {
    let state = createHag();
    const triBefore = state.bank.triangle;
    const rhoBefore = state.bank.rhombus;
    state = hagSelect(state, 'triangle');
    state = hagSelect(state, 'rhombus');
    expect(state.turnSelection.blocks).toEqual(['triangle', 'rhombus']);
    state = commitSelection(state);

    state = selectBlockForPlacement(state, 'triangle');
    const p1 = hagPlacements(state);
    expect(p1.length).toBeGreaterThan(0);
    state = placeHag(state, p1[0].q, p1[0].r);
    expect(state.bank.triangle).toBe(triBefore - 1);
    expect(state.phase).toBe('placeBlocks');

    if (state.selectedBlockForPlacement !== 'rhombus') {
      state = selectBlockForPlacement(state, 'rhombus');
    }
    const p2 = hagPlacements(state);
    expect(p2.length).toBeGreaterThan(0);
    state = placeHag(state, p2[0].q, p2[0].r);
    expect(state.bank.rhombus).toBe(rhoBefore - 1);
    expect(state.bank.triangle).toBe(triBefore - 1);
    expect(state.placedBlocks).toHaveLength(2);
  });

  it('deselectBlock before commit leaves bank untouched', () => {
    let state = createHag();
    const bank = { ...state.bank };
    state = hagSelect(state, 'triangle');
    state = deselectBlock(state, 'triangle');
    expect(state.turnSelection.blocks).toEqual([]);
    expect(state.bank).toEqual(bank);
  });
});

describe('Wave 24 hand-bank — Fab bars marked used + answer claimed', () => {
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

  it('multiply path also marks bars used and claims product answer', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    let state = createFab();
    const a = findBarId(state, { numerator: 1, denominator: 2 });
    const b = findBarId(state, { numerator: 1, denominator: 3 });
    const product = calculateResult(
      state.fractionBars.get(a)!.fraction,
      state.fractionBars.get(b)!.fraction,
      'multiply'
    )!;
    const matches = findMatchingAnswers(state, product);
    expect(matches.length).toBeGreaterThan(0);
    const answerId = matches[0];
    state = selectBar1(state, a);
    state = selectBar2(state, b);
    state = selectOperation(state, 'multiply');
    state = executeMove(state, answerId);
    expect(state.fractionBars.get(a)?.used).toBe(true);
    expect(state.fractionBars.get(b)?.used).toBe(true);
    expect(state.answerBars.get(answerId)?.claimedBy).toBe('player1');
  });
});

describe('Wave 24 hand-bank — FIAR chipsPlaced ledger', () => {
  it('placeChip bumps chipsPlaced and never exceeds CHIPS_PER_PLAYER', () => {
    let state = createFiar();
    expect(state.chipsPlaced.player1).toBe(0);
    expect(FIAR_CFG.CHIPS_PER_PLAYER).toBe(4);
    // Placement phase: any empty node id (getSelectableNodes is movement-only)
    state = placeFiar(state, '0-0');
    expect(state.chipsPlaced.player1).toBe(1);
    expect(state.chipsPlaced.player2).toBe(0);
    expect(state.board.nodes.get('0-0')?.chip).toBe('player1');

    const nodes = ['0-1', '0-2', '0-3', '1-0', '1-1', '1-2', '1-3', '2-0'];
    for (const id of nodes) {
      if (state.phase !== 'placement') break;
      if (
        state.chipsPlaced.player1 + state.chipsPlaced.player2 >=
        FIAR_CFG.CHIPS_PER_PLAYER * 2
      ) {
        break;
      }
      state = placeFiar(state, id);
    }
    expect(state.chipsPlaced.player1).toBeLessThanOrEqual(
      FIAR_CFG.CHIPS_PER_PLAYER
    );
    expect(state.chipsPlaced.player2).toBeLessThanOrEqual(
      FIAR_CFG.CHIPS_PER_PLAYER
    );
    expect(
      state.chipsPlaced.player1 + state.chipsPlaced.player2
    ).toBeGreaterThan(0);
  });
});
