/**
 * Wave 68 leftover after tip/#336 — Kwatro movement-rules position top.
 * Bullets covered; deepen position leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { kwatroSinkoTutorial } from '../../src/games/kwatro-sinko/tutorial';

describe('Wave 68 kwatro — tutorial movement position top', () => {
  it('movement-rules uses position top', () => {
    const step = kwatroSinkoTutorial.steps.find((s) => s.id === 'movement-rules');
    expect(step?.position).toBe('top');
  });
});
