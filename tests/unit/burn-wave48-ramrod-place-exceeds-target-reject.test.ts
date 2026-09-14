/**
 * Wave 48 — Ramrod isValidPlacement rejects rod longer than target. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState, isValidPlacement } from '../../src/games/ramrod/rules';

describe('Wave 48 ramrod — rod exceeds target', () => {
  it('rejects placement when rod.length > box.targetSum', () => {
    const s = createInitialState();
    // box-0-0 has target 5; find a rod of length >=6 in hand or forge
    const longId = [...s.rods.values()].find((r) => r.length >= 6)?.id;
    expect(longId).toBeTruthy();
    const forged = {
      ...s,
      playerRods: { ...s.playerRods, player1: [longId!] },
      rods: new Map(s.rods),
    };
    const rod = { ...forged.rods.get(longId!)!, owner: 'player1' as const };
    forged.rods.set(longId!, rod);
    // Find a box with target < rod length
    const smallBox = [...forged.boxes.values()].find((b) => b.targetSum < rod.length);
    expect(smallBox).toBeTruthy();
    expect(isValidPlacement(forged, longId!, smallBox!.id, 0)).toBe(false);
  });
});
