/**
 * Wave 66 leftover after tip/#316 — Kwatro complete position center.
 * Soft elsewhere; deepen position leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { kwatroSinkoTutorial } from '../../src/games/kwatro-sinko/tutorial';

describe('Wave 66 kwatro — tutorial complete position center', () => {
  it('complete step is position center', () => {
    const step = kwatroSinkoTutorial.steps.find((s) => s.id === 'complete');
    expect(step?.position).toBe('center');
  });
});
