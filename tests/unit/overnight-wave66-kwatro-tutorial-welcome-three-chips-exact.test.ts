/**
 * Overnight TOKENMAXX HEAVY leftovers after #306/#316 — Kwatro welcome three-chips exact.
 * Wave63 locks Let's learn strong; deepen Create an alignment of three chips p. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { kwatroSinkoTutorial } from '../../src/games/kwatro-sinko/tutorial';

describe('Wave 66 kwatro — tutorial welcome three chips', () => {
  it('welcome second p is Create an alignment of three chips formula', () => {
    const welcome = kwatroSinkoTutorial.steps.find((s) => s.id === 'welcome');
    expect(welcome?.message).toContain(
      '<p>Create an alignment of three chips where <strong>a + b - c = 4 or 5</strong></p>'
    );
  });
});
