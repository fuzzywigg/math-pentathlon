/**
 * Overnight TOKENMAXX HEAVY leftovers after #306/#316 — Kwatro winning formula OR exact.
 * Wave55 soft-matches a+b-c=4; deepen strong OR pair. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { kwatroSinkoTutorial } from '../../src/games/kwatro-sinko/tutorial';

describe('Wave 66 kwatro — tutorial winning formula OR', () => {
  it('winning lists a+b-c=4 OR a+b-c=5 strong pair', () => {
    const winning = kwatroSinkoTutorial.steps.find((s) => s.id === 'winning');
    expect(winning?.message).toContain(
      '<strong>a + b - c = 4</strong> OR <strong>a + b - c = 5</strong>'
    );
  });
});
