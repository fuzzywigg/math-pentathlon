/**
 * Wave 64 leftover after tip/#303 — Kings supplies plan carefully / counts shown. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { kingsQuadraphagesTutorial } from '../../src/games/kings-quadraphages/tutorial';

describe('Wave 64 kings — tutorial supplies plan carefully', () => {
  it('supply counts are shown; plan your strategy carefully', () => {
    const supplies = kingsQuadraphagesTutorial.steps.find((s) => s.id === 'supplies');
    expect(supplies?.message).toMatch(/supply counts are shown here/);
    expect(supplies?.message).toMatch(/plan your strategy carefully/);
    expect(supplies?.message).toMatch(/30 Quadraphages/);
  });
});
