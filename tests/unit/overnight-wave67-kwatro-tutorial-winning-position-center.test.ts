/**
 * Wave 67 leftover after tip/#324 — Kwatro winning position center.
 * Bullets covered; deepen position leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { kwatroSinkoTutorial } from '../../src/games/kwatro-sinko/tutorial';

describe('Wave 67 kwatro — tutorial winning position center', () => {
  it('winning uses center position', () => {
    const winning = kwatroSinkoTutorial.steps.find((s) => s.id === 'winning');
    expect(winning?.position).toBe('center');
  });
});
