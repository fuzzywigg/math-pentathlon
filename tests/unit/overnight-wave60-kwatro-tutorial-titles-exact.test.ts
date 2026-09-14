/**
 * Overnight TOKENMAXX HEAVY leftovers after #289 — Kwatro tutorial movement/complete titles.
 * Wave55/56/57 match message needles; deepen exact titles. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { kwatroSinkoTutorial } from '../../src/games/kwatro-sinko/tutorial';

describe('Wave 60 kwatro — tutorial titles exact', () => {
  it('movement-rules and complete titles exact', () => {
    expect(
      kwatroSinkoTutorial.steps.find((s) => s.id === 'movement-rules')?.title
    ).toBe('Movement Rules');
    expect(
      kwatroSinkoTutorial.steps.find((s) => s.id === 'complete')?.title
    ).toBe('Ready to Play!');
    expect(
      kwatroSinkoTutorial.steps.find((s) => s.id === 'winning')?.title
    ).toBe('Winning');
    expect(
      kwatroSinkoTutorial.steps.find((s) => s.id === 'strategy-tips')?.title
    ).toBe('Strategy Tips');
  });
});
