/**
 * Wave 68 leftover after tip/#336 — Kings supplies 30 Quadraphages strong. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { kingsQuadraphagesTutorial } from '../../src/games/kings-quadraphages/tutorial';

describe('Wave 68 kings — tutorial supplies 30 exact', () => {
  it('supplies locks 30 Quadraphages strong + plan carefully', () => {
    const step = kingsQuadraphagesTutorial.steps.find((s) => s.id === 'supplies');
    expect(step?.message).toContain('<strong>30 Quadraphages</strong>');
    expect(step?.message).toContain('plan your strategy carefully');
    expect(step?.highlightSelector).toBe('.status-supplies');
  });
});
