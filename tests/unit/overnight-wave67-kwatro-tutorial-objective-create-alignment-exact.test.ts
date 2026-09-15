/**
 * Wave 67 leftover after tip/#324 — Kwatro objective create-alignment exact.
 * Wave56 soft /a + b - c = 4 or 5/; deepen full p leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { kwatroSinkoTutorial } from '../../src/games/kwatro-sinko/tutorial';

describe('Wave 67 kwatro — tutorial objective create alignment exact', () => {
  it('objective paragraph locks create-alignment strong formula', () => {
    const objective = kwatroSinkoTutorial.steps.find((s) => s.id === 'objective');
    expect(objective?.message).toContain(
      '<p>Create an alignment of three chips where <strong>a + b - c = 4 or 5</strong></p>'
    );
  });
});
