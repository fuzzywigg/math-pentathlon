/**
 * Overnight TOKENMAXX HEAVY leftovers after #296 — FIAR game-phases title exact.
 * Wave55 soft-matches phase copy; deepen title toBe leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { fiarTutorial } from '../../src/games/fiar/tutorial';

describe('Wave 63 fiar — tutorial phases title exact', () => {
  it('game-phases title is exact Game Phases', () => {
    const step = fiarTutorial.steps.find((s) => s.id === 'game-phases');
    expect(step?.title).toBe('Game Phases');
  });
});
