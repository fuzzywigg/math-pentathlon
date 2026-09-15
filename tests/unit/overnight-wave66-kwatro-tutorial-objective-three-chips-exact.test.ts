/**
 * Overnight TOKENMAXX HEAVY leftovers after #306/#316 — Kwatro objective three-chips exact.
 * Wave63 locks Objective title; deepen Create an alignment of three chips p. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { kwatroSinkoTutorial } from '../../src/games/kwatro-sinko/tutorial';

describe('Wave 66 kwatro — tutorial objective three chips', () => {
  it('objective message is Create an alignment of three chips formula p', () => {
    const objective = kwatroSinkoTutorial.steps.find((s) => s.id === 'objective');
    expect(objective?.position).toBe('center');
    expect(objective?.message).toContain(
      '<p>Create an alignment of three chips where <strong>a + b - c = 4 or 5</strong></p>'
    );
  });
});
