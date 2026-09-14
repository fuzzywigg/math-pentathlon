/**
 * Wave 48 — Ramrod draw replacement from pool after place. Tests-only.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';
import {
  createInitialState,
  selectRod,
  placeRod,
  isValidPlacement,
} from '../../src/games/ramrod/rules';

afterEach(() => vi.restoreAllMocks());

describe('Wave 48 ramrod — draw replacement rod', () => {
  it('hand length conserved when unused pool rods remain', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    const s = createInitialState();
    const before = s.playerRods.player1.length;
    const rodId = s.playerRods.player1[0];
    const selected = selectRod(s, rodId);
    let placed = selected;
    for (const box of selected.boxes.values()) {
      for (const slot of [0, 1] as const) {
        if (isValidPlacement(selected, rodId, box.id, slot)) {
          placed = placeRod(selected, box.id, slot);
          break;
        }
      }
      if (placed !== selected) break;
    }
    expect(placed).not.toBe(selected);
    expect(placed.playerRods.player1).toHaveLength(before);
    expect(placed.playerRods.player1.includes(rodId)).toBe(false);
    const drawn = placed.playerRods.player1.find((id) => id !== rodId);
    expect(drawn).toBeDefined();
    expect(placed.rods.get(drawn!)?.owner).toBe('player1');
  });
});
