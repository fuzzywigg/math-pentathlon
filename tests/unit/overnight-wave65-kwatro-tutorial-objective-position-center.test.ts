/**
 * Wave 65 leftover after tip/#315 — Kwatro objective position center.
 * Title covered; deepen position leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { kwatroSinkoTutorial } from '../../src/games/kwatro-sinko/tutorial';

describe('Wave 65 kwatro — tutorial objective position center', () => {
  it('objective uses center position', () => {
    const objective = kwatroSinkoTutorial.steps.find((s) => s.id === 'objective');
    expect(objective?.position).toBe('center');
  });
});
