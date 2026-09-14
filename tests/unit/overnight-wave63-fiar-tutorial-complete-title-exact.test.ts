/**
 * Overnight TOKENMAXX HEAVY leftovers after #296 — FIAR complete title exact.
 * Wave54 toMatch Ready to Play; deepen exact Ready to Play! leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { fiarTutorial } from '../../src/games/fiar/tutorial';

describe('Wave 63 fiar — tutorial complete title exact', () => {
  it('complete title is exact Ready to Play!', () => {
    const step = fiarTutorial.steps.find((s) => s.id === 'complete');
    expect(step?.title).toBe('Ready to Play!');
  });
});
