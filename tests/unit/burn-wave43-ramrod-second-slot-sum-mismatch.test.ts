/**
 * Wave 43 — Ramrod second-slot sum mismatch reject. Tests-only.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';

import {
  createInitialState,
  isValidPlacement,
} from '../../src/games/ramrod/rules';
import { createBoxId, type Rod } from '../../src/games/ramrod/types';

afterEach(() => vi.restoreAllMocks());

describe('Wave 43 ramrod — second slot sum mismatch', () => {
  it('rejects completing rod that does not hit targetSum', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    const s = createInitialState();
    const boxId = createBoxId(0, 0); // target 5
    const box = s.boxes.get(boxId)!;
    const rod3: Rod = {
      id: 'forge-3',
      length: 3,
      color: '#fff',
      owner: 'player1',
      position: { boxId, slot: 0 },
    };
    const forgedBoxes = new Map(s.boxes);
    forgedBoxes.set(boxId, { ...box, rods: [rod3, null] });
    // put a length-1 rod in hand as selected candidate — 3+1=4 !== 5
    const rod1Id = [...s.rods.values()].find((r) => r.length === 1 && s.playerRods.player1.includes(r.id))?.id
      ?? [...s.rods.values()].find((r) => r.length === 1)?.id;
    // ensure rod1 is in player hand map
    let rods = new Map(s.rods);
    let playerRods = { ...s.playerRods, player1: [...s.playerRods.player1] };
    if (rod1Id && !playerRods.player1.includes(rod1Id)) {
      const r = rods.get(rod1Id)!;
      rods.set(rod1Id, { ...r, owner: 'player1' });
      playerRods.player1.push(rod1Id);
    }
    const forged = { ...s, boxes: forgedBoxes, rods, playerRods };
    if (rod1Id) {
      expect(isValidPlacement(forged, rod1Id, boxId, 1)).toBe(false);
      // length 2 would complete 5
      const rod2 = [...forged.rods.values()].find((r) => r.length === 2);
      if (rod2) {
        if (!forged.playerRods.player1.includes(rod2.id)) {
          forged.playerRods.player1.push(rod2.id);
          forged.rods.set(rod2.id, { ...rod2, owner: 'player1' });
        }
        expect(isValidPlacement(forged, rod2.id, boxId, 1)).toBe(true);
      }
    }
  });
});
