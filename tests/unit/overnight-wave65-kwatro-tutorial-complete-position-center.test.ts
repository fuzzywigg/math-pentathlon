/**
 * Wave 65 leftover after tip/#315 — Kwatro complete position center.
 * Finish copy covered; deepen position leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { kwatroSinkoTutorial } from '../../src/games/kwatro-sinko/tutorial';

describe('Wave 65 kwatro — tutorial complete position center', () => {
  it('complete uses center position', () => {
    const done = kwatroSinkoTutorial.steps.find((s) => s.id === 'complete');
    expect(done?.position).toBe('center');
  });
});
