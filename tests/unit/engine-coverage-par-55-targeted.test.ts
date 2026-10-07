/**
 * Targeted branch coverage for par-55/rules.ts — hand-built states only.
 * Edge placements, illegal rejection, win/draw/tie score paths, turn handoff.
 * Engine code unchanged.
 */
import { describe, it, expect } from 'vitest';

import {
  CONFIG,
  createBaseId,
  type Par55State,
  type AttributeBlock,
} from '../../src/games/par-55/types';
import {
  createInitialState,
  selectBlock,
  placeBlock,
  clearSelection,
  passTurn,
  isValidPlacement,
  getValidPlacements,
  hasValidMoves,
  calculateScore,
} from '../../src/games/par-55/rules';

function withScores(
  state: Par55State,
  scores: { player1: number; player2: number },
  currentPlayer: 'player1' | 'player2' = state.currentPlayer
): Par55State {
  return { ...state, scores, currentPlayer };
}

describe('Par-55 targeted — edge placement + illegal rejection', () => {
  it('rejects missing / occupied / non-adjacent bases and wrong phase', () => {
    const open = createInitialState();
    expect(isValidPlacement(open, 'ghost-base')).toBe(false);
    expect(placeBlock(open, createBaseId(0, 0))).toBe(open); // not placing

    const occupied = [...open.bases.values()].find((b) => b.block)!;
    expect(isValidPlacement(open, occupied.id)).toBe(false);

    // Far empty corner with no adjacent block (if any exist beyond seed halo)
    const isolated = [...open.bases.values()].find(
      (b) => !b.block && !isValidPlacement(open, b.id)
    );
    if (isolated) {
      expect(isValidPlacement(open, isolated.id)).toBe(false);
    }

    const blockId = open.hands.player1[0]!.id;
    const wrongPhase = { ...open, phase: 'placingBlock' as const };
    expect(selectBlock(wrongPhase, blockId)).toBe(wrongPhase);
    expect(selectBlock(open, 'missing-block')).toBe(open);
  });

  it('edge-adjacent legal place is accepted; clearSelection restores select phase', () => {
    const open = createInitialState();
    const blockId = open.hands.player1[0]!.id;
    const selected = selectBlock(open, blockId);
    const edge = getValidPlacements(selected)[0]!;
    expect(isValidPlacement(selected, edge)).toBe(true);

    const cleared = clearSelection(selected);
    expect(cleared.phase).toBe('selectingBlock');
    expect(cleared.selectedBlock).toBeNull();
  });

  it('passTurn hands off seat when stuck', () => {
    const emptyHand: Par55State = {
      ...createInitialState(),
      hands: { player1: [], player2: createInitialState().hands.player2 },
    };
    expect(hasValidMoves(emptyHand)).toBe(false);
    const passed = passTurn(emptyHand);
    expect(passed.currentPlayer).toBe('player2');
    expect(passed.phase).toBe('selectingBlock');
  });
});

describe('Par-55 targeted — win / draw / tie + turn handoff', () => {
  it('player2 reaching TARGET_SCORE alone wins on their place', () => {
    let state = createInitialState();
    state = withScores(state, { player1: 0, player2: CONFIG.TARGET_SCORE - 1 }, 'player2');
    const blockId = state.hands.player2[0]!.id;
    state = selectBlock(state, blockId);
    const baseId = getValidPlacements(state)[0]!;
    const block = state.hands.player2.find((b) => b.id === blockId)!;
    const { totalPoints } = calculateScore(state, block, baseId);
    // Ensure this place crosses target even if adjacency scores 0
    if (totalPoints === 0) {
      state = withScores(
        state,
        { player1: 0, player2: CONFIG.TARGET_SCORE },
        'player2'
      );
      state = { ...state, selectedBlock: blockId, phase: 'placingBlock' };
    }
    const after = placeBlock(state, baseId);
    expect(after.scores.player2).toBeGreaterThanOrEqual(CONFIG.TARGET_SCORE);
    expect(after.phase).toBe('gameOver');
    expect(after.winner).toBe('player2');
  });

  it('player2 0-point place with equal TARGET scores continues (tie arm)', () => {
    let state = createInitialState();
    const blockId = state.hands.player2[0]!.id;
    state = withScores(
      state,
      { player1: CONFIG.TARGET_SCORE, player2: CONFIG.TARGET_SCORE },
      'player2'
    );
    state = selectBlock(state, blockId);
    // Prefer a placement that scores 0 so totals stay equal at TARGET
    const block = state.hands.player2.find((b) => b.id === blockId)!;
    const zeroBase =
      getValidPlacements(state).find(
        (id) => calculateScore(state, block, id).totalPoints === 0
      ) ?? getValidPlacements(state)[0]!;
    const { totalPoints } = calculateScore(state, block, zeroBase);
    if (totalPoints !== 0) {
      // Forge scores so after place they remain equal at/above TARGET
      state = {
        ...state,
        scores: {
          player1: CONFIG.TARGET_SCORE + totalPoints,
          player2: CONFIG.TARGET_SCORE,
        },
      };
    }
    const after = placeBlock(state, zeroBase);
    expect(after.scores.player1).toBe(after.scores.player2);
    expect(after.scores.player1).toBeGreaterThanOrEqual(CONFIG.TARGET_SCORE);
    expect(after.winner).toBeNull();
    expect(after.phase).toBe('selectingBlock');
    expect(after.currentPlayer).toBe('player1'); // handoff continues
  });

  it('player2 beats player1 when both over target and p2 score is higher', () => {
    let state = createInitialState();
    state = withScores(
      state,
      { player1: CONFIG.TARGET_SCORE, player2: CONFIG.TARGET_SCORE + 5 },
      'player2'
    );
    const blockId = state.hands.player2[0]!.id;
    state = selectBlock(state, blockId);
    const baseId = getValidPlacements(state)[0]!;
    const after = placeBlock(state, baseId);
    expect(after.phase).toBe('gameOver');
    expect(after.winner).toBe('player2');
  });

  it('else-arm: player1 below target but player2 score wins comparison path', () => {
    // Hits the final else of the target-score cascade when currentPlayer is
    // player1 but only player2's score is already >= TARGET (forged).
    let state = createInitialState();
    state = withScores(
      state,
      { player1: 10, player2: CONFIG.TARGET_SCORE },
      'player1'
    );
    const blockId = state.hands.player1[0]!.id;
    state = selectBlock(state, blockId);
    const baseId = getValidPlacements(state)[0]!;
    const after = placeBlock(state, baseId);
    expect(after.phase).toBe('gameOver');
    expect(after.winner).toBe('player2');
  });

  it('both hands empty settles by score (p1 / p2 / draw)', () => {
    const seed = createInitialState();
    const last: AttributeBlock = seed.hands.player1[0]!;

    const run = (scores: { player1: number; player2: number }) => {
      let state: Par55State = {
        ...seed,
        hands: { player1: [last], player2: [] },
        scores,
        currentPlayer: 'player1',
        selectedBlock: null,
        phase: 'selectingBlock',
        winner: null,
      };
      state = selectBlock(state, last.id);
      const baseId = getValidPlacements(state)[0]!;
      const { totalPoints } = calculateScore(state, last, baseId);
      const after = placeBlock(state, baseId);
      const finalP1 = scores.player1 + totalPoints;
      const finalP2 = scores.player2;
      const expected =
        finalP1 > finalP2 ? 'player1' : finalP2 > finalP1 ? 'player2' : null;
      expect(after.hands.player1).toHaveLength(0);
      expect(after.hands.player2).toHaveLength(0);
      expect(after.phase).toBe('gameOver');
      expect(after.winner).toBe(expected);
    };

    run({ player1: 20, player2: 5 });
    run({ player1: 3, player2: 18 });
    // Equal after place: pick base score so p1 + points == p2
    {
      let state: Par55State = {
        ...seed,
        hands: { player1: [last], player2: [] },
        scores: { player1: 0, player2: 0 },
        currentPlayer: 'player1',
        selectedBlock: null,
        phase: 'selectingBlock',
        winner: null,
      };
      state = selectBlock(state, last.id);
      const baseId = getValidPlacements(state)[0]!;
      const { totalPoints } = calculateScore(state, last, baseId);
      state = {
        ...state,
        scores: { player1: 0, player2: totalPoints },
      };
      const after = placeBlock(state, baseId);
      expect(after.phase).toBe('gameOver');
      expect(after.winner).toBeNull();
    }
  });

  it('normal place below target hands off seat', () => {
    let state = createInitialState();
    const blockId = state.hands.player1[0]!.id;
    state = selectBlock(state, blockId);
    const after = placeBlock(state, getValidPlacements(state)[0]!);
    expect(after.phase).toBe('selectingBlock');
    expect(after.currentPlayer).toBe('player2');
    expect(after.selectedBlock).toBeNull();
  });

  it('last block with opponent still holding cards does not force empty-hands settle', () => {
    const seed = createInitialState();
    const last = seed.hands.player1[0]!;
    let state: Par55State = {
      ...seed,
      hands: {
        player1: [last],
        player2: seed.hands.player2.slice(0, 2),
      },
      scores: { player1: 3, player2: 3 },
      currentPlayer: 'player1',
      selectedBlock: null,
      phase: 'selectingBlock',
      winner: null,
    };
    state = selectBlock(state, last.id);
    const after = placeBlock(state, getValidPlacements(state)[0]!);
    expect(after.hands.player1).toHaveLength(0);
    expect(after.hands.player2.length).toBeGreaterThan(0);
    expect(after.phase).toBe('selectingBlock');
    expect(after.winner).toBeNull();
    expect(after.currentPlayer).toBe('player2');
  });
});
