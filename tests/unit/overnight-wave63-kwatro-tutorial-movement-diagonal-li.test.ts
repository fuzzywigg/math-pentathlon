/**
 * Overnight TOKENMAXX HEAVY leftovers after #301 — Kwatro movement diagonal li exact.
 * Wave60 locks pathway/empty-adjacent; deepen Diagonal connections li. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { kwatroSinkoTutorial } from '../../src/games/kwatro-sinko/tutorial';

describe('Wave 63 kwatro — tutorial movement diagonal li', () => {
  it('movement-rules includes Diagonal connections exact li', () => {
    const move = kwatroSinkoTutorial.steps.find((s) => s.id === 'movement-rules');
    expect(move?.message).toContain(
      '<li>Diagonal connections exist on numbered spaces</li>'
    );
  });
});
