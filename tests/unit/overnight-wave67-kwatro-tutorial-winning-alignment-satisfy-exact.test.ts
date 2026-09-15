/**
 * Wave 67 leftover after tip/#324 — Kwatro winning alignment-must-satisfy exact.
 * Wave63 locks Form/examples; deepen OR strong pair leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { kwatroSinkoTutorial } from '../../src/games/kwatro-sinko/tutorial';

describe('Wave 67 kwatro — tutorial winning alignment satisfy exact', () => {
  it('winning lists alignment must satisfy 4 OR 5 strong', () => {
    const winning = kwatroSinkoTutorial.steps.find((s) => s.id === 'winning');
    expect(winning?.message).toContain(
      '<li>The alignment must satisfy: <strong>a + b - c = 4</strong> OR <strong>a + b - c = 5</strong></li>'
    );
  });
});
