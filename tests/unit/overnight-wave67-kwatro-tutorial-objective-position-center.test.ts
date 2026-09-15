/**
 * Wave 67 leftover after tip/#324 — Kwatro objective position center.
 * Soft elsewhere; deepen position leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { kwatroSinkoTutorial } from '../../src/games/kwatro-sinko/tutorial';

describe('Wave 67 kwatro — tutorial objective position center', () => {
  it('objective step is position center', () => {
    const step = kwatroSinkoTutorial.steps.find((s) => s.id === 'objective');
    expect(step?.position).toBe('center');
  });
});
