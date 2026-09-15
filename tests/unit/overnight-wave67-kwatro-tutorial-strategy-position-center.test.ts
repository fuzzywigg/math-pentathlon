/**
 * Wave 67 leftover after tip/#324 — Kwatro strategy position center.
 * Soft elsewhere; deepen position leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { kwatroSinkoTutorial } from '../../src/games/kwatro-sinko/tutorial';

describe('Wave 67 kwatro — tutorial strategy position center', () => {
  it('strategy step is position center', () => {
    const step = kwatroSinkoTutorial.steps.find((s) => s.id === 'strategy-tips');
    expect(step?.position).toBe('center');
  });
});
