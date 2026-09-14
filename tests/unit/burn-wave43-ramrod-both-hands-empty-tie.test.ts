/**
 * Wave 43 — Ramrod both hands empty equal scores → winner null. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { type Rod } from '../../src/games/ramrod/types';
import {
  createInitialState,
  selectRod,
  placeRod,
  getValidPlacements,
} from '../../src/games/ramrod/rules';

describe('Wave 43 ramrod — both empty equal scores', () => {
  it('last non-capturing place with empty hands and equal scores → null winner', () => {
    const state = createInitialState();
    const box = [...state.boxes.values()].find((b) => b.targetSum === 10)!;
    const finish: Rod = {
      id: 'fin',
      length: 3,
      color: '#222',
      owner: 'player1',
      position: null,
    };
    const rods = new Map(state.rods);
    for (const r of rods.values()) {
      rods.set(r.id, { ...r, owner: 'player2', position: { boxId: 'gone', slot: 0 } });
    }
    rods.set(finish.id, finish);
    const forged = {
      ...state,
      rods,
      playerRods: { player1: [finish.id], player2: [] as string[] },
      scores: { player1: 8, player2: 8 },
    };
    const placing = selectRod(forged, finish.id);
    const p = getValidPlacements(placing, finish.id).find((x) => x.boxId === box.id)!;
    const next = placeRod(placing, p.boxId, p.slot);
    expect(next.scores.player1).toBe(8);
    expect(next.phase).toBe('gameOver');
    expect(next.winner).toBeNull();
  });
});
