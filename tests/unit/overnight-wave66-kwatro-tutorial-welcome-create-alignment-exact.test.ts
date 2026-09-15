/**
 * Wave 66 leftover after tip/#316 — Kwatro welcome create-alignment strong exact.
 * Wave63 soft Learn/formula; deepen three-chips strong leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { kwatroSinkoTutorial } from '../../src/games/kwatro-sinko/tutorial';

describe('Wave 66 kwatro — tutorial welcome create-alignment exact', () => {
  it('welcome lists create-alignment strong formula', () => {
    const welcome = kwatroSinkoTutorial.steps.find((s) => s.id === 'welcome');
    expect(welcome?.message).toContain(
      'Create an alignment of three chips where <strong>a + b - c = 4 or 5</strong>'
    );
  });
});
