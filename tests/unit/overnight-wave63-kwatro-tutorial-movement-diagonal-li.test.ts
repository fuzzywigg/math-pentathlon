/**
 * Overnight TOKENMAXX HEAVY leftovers after #301 — Kwatro movement diagonal li exact.
 * Updated after #391 polish: copy matches live center-3×3 diagonal graph (#355).
 */
import { describe, it, expect } from 'vitest';
import { kwatroSinkoTutorial } from '../../src/games/kwatro-sinko/tutorial';

describe('Wave 63 kwatro — tutorial movement diagonal li', () => {
  it('movement-rules includes Diagonal connections exact li', () => {
    const move = kwatroSinkoTutorial.steps.find((s) => s.id === 'movement-rules');
    expect(move?.message).toContain(
      '<li>Diagonal connections exist in the center 3×3 (including toward numbered spaces)</li>'
    );
  });
});
