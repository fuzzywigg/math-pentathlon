/**
 * Wave 43 — Ramrod score ≥ TARGET ends mid-place. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { CONFIG, type Rod } from '../../src/games/ramrod/types';
import {
  createInitialState,
  selectRod,
  placeRod,
  getValidPlacements,
} from '../../src/games/ramrod/rules';

describe('Wave 43 ramrod — score threshold win', () => {
  it('forged near-target capture reaches gameOver', () => {
    const state = createInitialState();
    const box = [...state.boxes.values()].find((b) => b.targetSum === 10)!;
    const need = 4;
    const seed: Rod = {
      id: 'seed-rod',
      length: box.targetSum - need,
      color: '#aaa',
      owner: 'player2',
      position: { boxId: box.id, slot: 0 },
    };
    const rods = new Map(state.rods);
    rods.set(seed.id, seed);
    const boxes = new Map(state.boxes);
    boxes.set(box.id, { ...box, rods: [seed, null] });

    const finishId = 'finish-rod';
    const finish: Rod = {
      id: finishId,
      length: need,
      color: '#bbb',
      owner: 'player1',
      position: null,
    };
    rods.set(finishId, finish);
    const forged = {
      ...state,
      boxes,
      rods,
      playerRods: { player1: [finishId], player2: state.playerRods.player2 },
      scores: { player1: CONFIG.TARGET_SCORE - box.targetSum, player2: 0 },
    };
    const placing = selectRod(forged, finishId);
    const placements = getValidPlacements(placing, finishId);
    const slot1 = placements.find((p) => p.boxId === box.id && p.slot === 1);
    expect(slot1).toBeTruthy();
    const next = placeRod(placing, slot1!.boxId, slot1!.slot);
    expect(next.phase).toBe('gameOver');
    expect(next.winner).toBe('player1');
    expect(next.scores.player1).toBeGreaterThanOrEqual(CONFIG.TARGET_SCORE);
  });
});
