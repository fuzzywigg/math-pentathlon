/**
 * Wave 67 leftover after tip/#324 — Kwatro welcome create-alignment exact.
 * Wave63 locks Let's learn; deepen second welcome p leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { kwatroSinkoTutorial } from '../../src/games/kwatro-sinko/tutorial';

describe('Wave 67 kwatro — tutorial welcome create alignment exact', () => {
  it('welcome second p locks create-alignment strong formula', () => {
    const welcome = kwatroSinkoTutorial.steps.find((s) => s.id === 'welcome');
    expect(welcome?.message).toContain(
      '<p>Create an alignment of three chips where <strong>a + b - c = 4 or 5</strong></p>'
    );
  });
});
