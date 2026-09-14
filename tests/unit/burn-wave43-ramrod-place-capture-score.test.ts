/**
 * Wave 43 — Ramrod placeRod capture scoring leftover. Tests-only.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';

import {
  createInitialState,
  selectRod,
  placeRod,
  isValidPlacement,
  formatMove,
  passTurn,
  hasValidMoves,
} from '../../src/games/ramrod/rules';

afterEach(() => vi.restoreAllMocks());

describe('Wave 43 ramrod — place capture score', () => {
  it('placeRod on valid slot removes rod and may score', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    const s = createInitialState();
    const rodId = s.playerRods.player1[0];
    const selected = selectRod(s, rodId);
    // find any valid placement
    let placed = selected;
    let found = false;
    for (const box of selected.boxes.values()) {
      for (const slot of [0, 1]) {
        if (isValidPlacement(selected, rodId, box.id, slot)) {
          placed = placeRod(selected, box.id, slot);
          found = true;
          break;
        }
      }
      if (found) break;
    }
    expect(found).toBe(true);
    expect(placed.moveHistory).toHaveLength(1);
    expect(placed.playerRods.player1.includes(rodId)).toBe(false);
    expect(placed.currentPlayer).toBe('player2');
    expect(formatMove(placed.moveHistory[0])).toMatch(/Rod/);
  });

  it('placeRod identity without selection; passTurn flips seat', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    const s = createInitialState();
    expect(placeRod(s, 'box-0-0', 0)).toBe(s);
    const passed = passTurn(s);
    expect(passed.currentPlayer).toBe('player2');
    expect(passed.selectedRod).toBeNull();
    expect(hasValidMoves(s)).toBe(true);
  });
});
