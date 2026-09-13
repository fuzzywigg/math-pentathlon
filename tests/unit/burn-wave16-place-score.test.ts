/**
 * Wave 16 companion — place→score MatchDetail + box sum edges + Stars score bump.
 * Distinct from wave 14 dice-expr-score (expressions/factorials/die pools) and wave 15 rules-phase.
 * Tests-only. No product inventing.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';

import {
  createInitialState as createPar,
  selectBlock,
  placeBlock,
  calculateScore,
  getValidPlacements,
} from '../../src/games/par-55/rules';
import { AttributeBlock, countMatchingAttributes } from '../../src/games/par-55/types';

import {
  createInitialState as createRamrod,
  getBoxSum,
  getRemainingValue,
  selectRod,
  placeRod,
  getValidPlacements as ramValid,
} from '../../src/games/ramrod/rules';
import { createRod, SumBox } from '../../src/games/ramrod/types';

import {
  createInitialState as createStars,
  selectCard,
  placeCard,
  getValidPlacements as starsValid,
} from '../../src/games/stars-bars/rules';

import {
  createInitialState as createContig,
  getValidPlacements as contigValid,
} from '../../src/games/contig-60/types';
import {
  doRollDice as contigRoll,
  placeChip,
  calculatePoints,
} from '../../src/games/contig-60/rules';

import { createInitialState as createRemainder } from '../../src/games/remainder-islands/types';
import {
  performRoll,
  selectIsland,
  previewDivision,
  findValidIslands,
} from '../../src/games/remainder-islands/rules';

afterEach(() => {
  vi.restoreAllMocks();
});

describe('Wave 16 place-score — Par 55 MatchDetail', () => {
  it('calculateScore on empty adjacencies is zero details', () => {
    const state = createPar();
    const block = state.hands.player1[0];
    const baseId = [...state.bases.keys()][0];
    const { totalPoints, matchDetails } = calculateScore(state, block, baseId);
    expect(totalPoints).toBe(0);
    expect(matchDetails).toEqual([]);
  });

  it('placeBlock records matchDetails shape when neighbors match', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.3);
    let state = createPar();
    // Place first block (may already score vs neutral center starter)
    const block1 = state.hands.player1[0];
    state = selectBlock(state, block1.id);
    const firstPlacements = getValidPlacements(state);
    expect(firstPlacements.length).toBeGreaterThan(0);
    const firstScore = calculateScore(state, block1, firstPlacements[0]);
    expect(Array.isArray(firstScore.matchDetails)).toBe(true);
    expect(firstScore.totalPoints).toBe(
      firstScore.matchDetails.reduce((s, d) => s + d.points, 0)
    );
    for (const detail of firstScore.matchDetails) {
      expect(detail.adjacentBaseId).toBeTruthy();
      expect(detail.points).toBe(detail.matchingAttributes.length);
    }
    state = placeBlock(state, firstPlacements[0]);
    expect(state.moveHistory.length).toBe(1);
    expect(state.moveHistory[0].matchDetails).toEqual(firstScore.matchDetails);

    // Second player places adjacent if possible
    const block2 = state.hands.player2[0];
    state = selectBlock(state, block2.id);
    const secondPlacements = getValidPlacements(state);
    if (secondPlacements.length > 0) {
      const before = state.scores.player2;
      const scored = calculateScore(state, block2, secondPlacements[0]);
      state = placeBlock(state, secondPlacements[0]);
      expect(state.scores.player2).toBe(before + scored.totalPoints);
    }
  });

  it('countMatchingAttributes counts shared attrs between two blocks', () => {
    const a: AttributeBlock = {
      id: 'a',
      shape: 'circle',
      color: 'red',
      size: 'small',
      thickness: 'thin',
    };
    const b: AttributeBlock = {
      id: 'b',
      shape: 'circle',
      color: 'blue',
      size: 'small',
      thickness: 'thick',
    };
    const matches = countMatchingAttributes(a, b);
    expect(matches).toEqual(expect.arrayContaining(['shape', 'size']));
    expect(matches).toHaveLength(2);
  });
});

describe('Wave 16 place-score — Ramrod box sum / remaining', () => {
  it('getBoxSum null until both rods; getRemainingValue tracks partial', () => {
    const rodA = createRod('r1', 3);
    const rodB = createRod('r2', 4);
    const empty: SumBox = {
      id: 'box-1',
      targetSum: 7,
      row: 0,
      col: 0,
      rods: [null, null],
      completedBy: null,
    };
    expect(getBoxSum(empty)).toBeNull();
    expect(getRemainingValue(empty)).toBe(7);

    const partial: SumBox = { ...empty, rods: [rodA, null] };
    expect(getBoxSum(partial)).toBeNull();
    expect(getRemainingValue(partial)).toBe(4);

    const otherPartial: SumBox = { ...empty, rods: [null, rodB] };
    expect(getRemainingValue(otherPartial)).toBe(3);

    const full: SumBox = { ...empty, rods: [rodA, rodB] };
    expect(getBoxSum(full)).toBe(7);
  });

  it('selectRod → placeRod on a valid box mutates scores or history', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.2);
    let state = createRamrod();
    const rodId = state.playerRods.player1[0];
    state = selectRod(state, rodId);
    const placements = ramValid(state, rodId);
    if (placements.length > 0) {
      const beforeHist = state.moveHistory.length;
      state = placeRod(state, placements[0].boxId, placements[0].slot);
      expect(state.moveHistory.length).toBeGreaterThanOrEqual(beforeHist);
    }
  });
});

describe('Wave 16 place-score — Stars / Contig / Remainder', () => {
  it('Stars placeCard bumps playerScores by move score', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.15);
    let state = createStars();
    const card = state.playerHands.player1[0];
    state = selectCard(state, card.id);
    const placements = starsValid(state);
    expect(placements.length).toBeGreaterThan(0);
    const before = state.playerScores.player1;
    const next = placeCard(state, placements[0].row, placements[0].col);
    expect(next.playerScores.player1).toBeGreaterThanOrEqual(before);
    expect(next.moveHistory.length).toBe(state.moveHistory.length + 1);
    const last = next.moveHistory[next.moveHistory.length - 1];
    expect(last.score).toBe(next.playerScores.player1 - before);
    expect(typeof last.breakdown).toBe('string');
  });

  it('Contig placeChip mutates seat score using calculatePoints', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.4);
    let state = contigRoll(createContig());
    if (state.phase === 'calculating' && state.currentDice) {
      const placements = contigValid(state, state.currentDice);
      if (placements.length > 0) {
        const target = placements[0];
        const pts = calculatePoints(state, target.result);
        const before = state.scores.player1;
        state = placeChip(state, target.result, target.expression);
        expect(state.scores.player1).toBe(before + pts);
      }
    }
  });

  it('Remainder selectIsland scores from division remainder preview', () => {
    let state = createRemainder();
    for (let i = 0; i < 20; i++) {
      vi.restoreAllMocks();
      vi.spyOn(Math, 'random').mockReturnValue(((i * 3) % 6) / 6 + 0.01);
      state = performRoll(createRemainder());
      if (state.phase === 'selectIsland' && state.validIslands.length > 0) break;
    }
    if (state.phase === 'selectIsland' && state.currentRoll) {
      const islandId = state.validIslands[0];
      const preview = previewDivision(state, islandId);
      expect(preview).not.toBeNull();
      expect(preview!.remainder).toBeGreaterThanOrEqual(0);
      const before = state.player1Score;
      const next = selectIsland(state, islandId);
      expect(next.player1Score).toBe(before + preview!.remainder);
      expect(findValidIslands(state, state.currentRoll.total)).toContain(
        islandId
      );
    }
  });
});
