/**
 * Wave 64 leftover after tip/#306 — Kwatro tutorial winning satisfy formula li.
 * Wave63 locked Form/Example lis; deepen must-satisfy leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { kwatroSinkoTutorial } from '../../src/games/kwatro-sinko/tutorial';

describe('Wave 64 kwatro — tutorial winning satisfy formula', () => {
  it('locks alignment must satisfy 4 OR 5 li', () => {
    const step = kwatroSinkoTutorial.steps.find((s) => s.id === 'winning');
    expect(step?.message).toContain(
      '<li>The alignment must satisfy: <strong>a + b - c = 4</strong> OR <strong>a + b - c = 5</strong></li>'
    );
  });
});
