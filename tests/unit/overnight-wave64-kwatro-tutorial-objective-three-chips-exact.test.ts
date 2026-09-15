/**
 * Wave 64 leftover after tip/#306 — Kwatro tutorial objective exact paragraph.
 * Wave63 locked Objective title; deepen three-chips + formula leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { kwatroSinkoTutorial } from '../../src/games/kwatro-sinko/tutorial';

describe('Wave 64 kwatro — tutorial objective three chips exact', () => {
  it('locks objective message + center position', () => {
    const step = kwatroSinkoTutorial.steps.find((s) => s.id === 'objective');
    expect(step?.position).toBe('center');
    expect(step?.message).toContain(
      '<p>Create an alignment of three chips where <strong>a + b - c = 4 or 5</strong></p>'
    );
  });
});
