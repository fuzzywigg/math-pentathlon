/**
 * Targeted branch coverage for ramrod/rules.ts — hand-built states only.
 * Edge placements, illegal rejection, win/draw by score or empty hands,
 * turn handoff. Engine code unchanged.
 */
import { describe, it, expect } from 'vitest';

import {
  createRod,
  createBoxId,
  CONFIG,
  type RamrodState,
  type Rod,
  type SumBox,
} from '../../src/games/ramrod/types';
import {
  selectRod,
  placeRod,
  passTurn,
  clearSelection,
  isValidPlacement,
  getValidPlacements,
  hasValidMoves,
} from '../../src/games/ramrod/rules';

function forgeState(partial: {
  player1Rods: Rod[];
  player2Rods?: Rod[];
  boxes?: Map<string, SumBox>;
  scores?: { player1: number; player2: number };
  currentPlayer?: 'player1' | 'player2';
}): RamrodState {
  const rods = new Map<string, Rod>();
  for (const rod of partial.player1Rods) {
    rods.set(rod.id, { ...rod, owner: 'player1' });
  }
  const p2 =
    partial.player2Rods ??
    (() => {
      const opp = createRod('opp-1', 2);
      opp.owner = 'player2';
      return [opp];
    })();
  for (const rod of p2) {
    rods.set(rod.id, { ...rod, owner: 'player2' });
  }

  const boxes =
    partial.boxes ??
    (() => {
      const m = new Map<string, SumBox>();
      m.set(createBoxId(0, 0), {
        id: createBoxId(0, 0),
        targetSum: 5,
        row: 0,
        col: 0,
        rods: [null, null],
        completedBy: null,
      });
      m.set(createBoxId(0, 1), {
        id: createBoxId(0, 1),
        targetSum: 12,
        row: 0,
        col: 1,
        rods: [null, null],
        completedBy: null,
      });
      return m;
    })();

  return {
    boxes,
    rods,
    playerRods: {
      player1: partial.player1Rods.map((r) => r.id),
      player2: p2.map((r) => r.id),
    },
    currentPlayer: partial.currentPlayer ?? 'player1',
    selectedRod: null,
    phase: 'selectingRod',
    scores: partial.scores ?? { player1: 0, player2: 0 },
    winner: null,
    moveHistory: [],
  };
}

describe('Ramrod targeted — edge placement + illegal rejection', () => {
  it('corner / edge box: rod longer than targetSum is rejected', () => {
    const huge = createRod('huge', 10);
    const state = forgeState({ player1Rods: [huge] });
    const boxId = createBoxId(0, 0); // target 5
    expect(isValidPlacement(state, huge.id, boxId, 0)).toBe(false);
    expect(getValidPlacements(state, huge.id).every((p) => p.boxId !== boxId)).toBe(
      true
    );

    const selected = selectRod(state, huge.id);
    expect(placeRod(selected, boxId, 0)).toBe(selected);
  });

  it('rejects wrong phase, missing rod, occupied slot, completed box, bad pair sum', () => {
    const rod = createRod('r1', 3);
    const open = forgeState({ player1Rods: [rod] });
    const wrongPhase = { ...open, phase: 'placingRod' as const };
    expect(selectRod(wrongPhase, rod.id)).toBe(wrongPhase);
    expect(selectRod(open, 'ghost-rod')).toBe(open);
    expect(placeRod(open, createBoxId(0, 0), 0)).toBe(open); // not placing

    const other = createRod('other', 2);
    const boxes = new Map<string, SumBox>();
    boxes.set(createBoxId(0, 0), {
      id: createBoxId(0, 0),
      targetSum: 5,
      row: 0,
      col: 0,
      rods: [other, null],
      completedBy: null,
    });
    boxes.set(createBoxId(0, 1), {
      id: createBoxId(0, 1),
      targetSum: 7,
      row: 0,
      col: 1,
      rods: [null, null],
      completedBy: 'player2',
    });
    const withPartial = forgeState({
      player1Rods: [rod],
      boxes,
    });
    // Bad pair: 4 + 2 ≠ 5
    const bad = createRod('bad', 4);
    const withBad = forgeState({ player1Rods: [bad], boxes });
    expect(isValidPlacement(withBad, bad.id, createBoxId(0, 0), 1)).toBe(false);
    expect(isValidPlacement(withPartial, rod.id, createBoxId(0, 0), 0)).toBe(
      false
    ); // occupied
    expect(isValidPlacement(withPartial, rod.id, createBoxId(0, 1), 0)).toBe(
      false
    ); // completed
    expect(isValidPlacement(withPartial, rod.id, 'missing-box', 0)).toBe(false);
  });

  it('clearSelection + passTurn hand off seat cleanly', () => {
    const rod = createRod('r1', 2);
    const selected = selectRod(forgeState({ player1Rods: [rod] }), rod.id);
    expect(clearSelection(selected).phase).toBe('selectingRod');
    expect(clearSelection(selected).selectedRod).toBeNull();

    const passed = passTurn(selected);
    expect(passed.currentPlayer).toBe('player2');
    expect(passed.selectedRod).toBeNull();
    expect(passed.phase).toBe('selectingRod');
  });
});

describe('Ramrod targeted — win / draw + turn handoff', () => {
  it('player2 wins when placement pushes their score to TARGET_SCORE', () => {
    // Pre-fill slot 0 with length 2; place length 3 to complete sum 5.
    const existing = createRod('ex', 2);
    const boxes = new Map<string, SumBox>();
    boxes.set(createBoxId(0, 0), {
      id: createBoxId(0, 0),
      targetSum: 5,
      row: 0,
      col: 0,
      rods: [existing, null],
      completedBy: null,
    });
    const closer = createRod('closer', 3);
    let state = forgeState({
      player1Rods: [createRod('p1-dummy', 1)],
      player2Rods: [closer],
      boxes,
      scores: { player1: 0, player2: CONFIG.TARGET_SCORE - 5 },
      currentPlayer: 'player2',
    });
    state = {
      ...state,
      rods: new Map([...state.rods, [existing.id, existing]]),
    };
    state = selectRod(state, closer.id);
    const after = placeRod(state, createBoxId(0, 0), 1);
    expect(after.scores.player2).toBeGreaterThanOrEqual(CONFIG.TARGET_SCORE);
    expect(after.phase).toBe('gameOver');
    expect(after.winner).toBe('player2');
    expect(after.currentPlayer).toBe('player2'); // no handoff on win
  });

  it('both hands empty ends with p1 win / p2 win / draw by score compare', () => {
    const makeEmptyHands = (
      scores: { player1: number; player2: number },
      lastRod: Rod
    ): RamrodState => {
      const boxes = new Map<string, SumBox>();
      boxes.set(createBoxId(0, 0), {
        id: createBoxId(0, 0),
        targetSum: lastRod.length + 1,
        row: 0,
        col: 0,
        rods: [null, null],
        completedBy: null,
      });
      // Only current player has the last rod; opponent already empty.
      // After place, draw finds nothing and both lists empty.
      return forgeState({
        player1Rods: [lastRod],
        player2Rods: [],
        boxes,
        scores,
      });
    };

    const cases: Array<{
      scores: { player1: number; player2: number };
      winner: 'player1' | 'player2' | null;
    }> = [
      { scores: { player1: 10, player2: 3 }, winner: 'player1' },
      { scores: { player1: 2, player2: 9 }, winner: 'player2' },
      { scores: { player1: 4, player2: 4 }, winner: null },
    ];

    for (const { scores, winner } of cases) {
      const last = createRod(`last-${scores.player1}-${scores.player2}`, 2);
      let state = makeEmptyHands(scores, last);
      // Mark every other rod as owned/positioned so draw finds none
      const rods = new Map(state.rods);
      for (const r of rods.values()) {
        if (r.id !== last.id) {
          rods.set(r.id, {
            ...r,
            owner: 'player2',
            position: { boxId: createBoxId(0, 0), slot: 0 },
          });
        }
      }
      state = { ...state, rods, playerRods: { player1: [last.id], player2: [] } };
      state = selectRod(state, last.id);
      const after = placeRod(state, createBoxId(0, 0), 0);
      expect(after.playerRods.player1).toHaveLength(0);
      expect(after.playerRods.player2).toHaveLength(0);
      expect(after.phase).toBe('gameOver');
      expect(after.winner).toBe(winner);
    }
  });

  it('legal non-winning place hands off seat to opponent', () => {
    const rod = createRod('r1', 2);
    let state = forgeState({ player1Rods: [rod] });
    state = selectRod(state, rod.id);
    const after = placeRod(state, createBoxId(0, 0), 0);
    expect(after.phase).toBe('selectingRod');
    expect(after.currentPlayer).toBe('player2');
    expect(after.selectedRod).toBeNull();
    expect(hasValidMoves(after)).toBe(true);
  });
});
