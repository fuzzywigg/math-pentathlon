/**
 * Overnight TOKENMAXX HEAVY leftovers after #296 — FIAR strategy-tips title exact.
 * Wave54 soft-matches body; deepen title toBe leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { fiarTutorial } from '../../src/games/fiar/tutorial';

describe('Wave 63 fiar — tutorial strategy title exact', () => {
  it('strategy-tips title is exact Strategy Tips', () => {
    const step = fiarTutorial.steps.find((s) => s.id === 'strategy-tips');
    expect(step?.title).toBe('Strategy Tips');
  });
});
