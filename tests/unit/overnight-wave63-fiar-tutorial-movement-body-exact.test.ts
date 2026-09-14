/**
 * Overnight TOKENMAXX HEAVY leftovers after #296 — FIAR movement body exacts.
 * Wave54/55 soft-match jump/click; deepen pathways + straight-line leftovers. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { fiarTutorial } from '../../src/games/fiar/tutorial';

describe('Wave 63 fiar — tutorial movement body exact', () => {
  it('movement-rules mentions pathways lines and straight-line distance', () => {
    const step = fiarTutorial.steps.find((s) => s.id === 'movement-rules');
    expect(step?.message).toContain(
      'Chips move along the connected pathways (lines)'
    );
    expect(step?.message).toContain('Move any distance in a straight line');
  });
});
