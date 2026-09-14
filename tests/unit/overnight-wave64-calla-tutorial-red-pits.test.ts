/**
 * Wave 64 leftover after tip/#301 + open #303 wave63 — Calla board-intro Red's pits.
 * Wave62 locked Blue's pits / #e53935; lock Red row copy. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { callaTutorial } from '../../src/games/calla/tutorial';

describe('Wave 64 calla — tutorial Red pits copy', () => {
  it("locks Red's pits are on the bottom", () => {
    const msg =
      callaTutorial.steps.find((s) => s.id === 'board-intro')?.message ?? '';
    expect(msg).toContain("Red's pits");
    expect(msg).toContain('are on the bottom');
  });
});
