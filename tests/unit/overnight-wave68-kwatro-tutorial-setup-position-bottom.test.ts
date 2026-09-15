/**
 * Wave 68 leftover after tip/#336 — Kwatro setup position bottom.
 * Highlight covered; deepen position leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { kwatroSinkoTutorial } from '../../src/games/kwatro-sinko/tutorial';

describe('Wave 68 kwatro — tutorial setup position bottom', () => {
  it('setup uses position bottom', () => {
    const setup = kwatroSinkoTutorial.steps.find((s) => s.id === 'setup');
    expect(setup?.position).toBe('bottom');
  });
});
