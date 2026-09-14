/**
 * Overnight TOKENMAXX HEAVY leftovers after #296 — FIAR movement-rules title exact.
 * Wave55 soft-matches movement body; deepen title toBe leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { fiarTutorial } from '../../src/games/fiar/tutorial';

describe('Wave 63 fiar — tutorial movement title exact', () => {
  it('movement-rules title is exact Movement Rules', () => {
    const step = fiarTutorial.steps.find((s) => s.id === 'movement-rules');
    expect(step?.title).toBe('Movement Rules');
  });
});
