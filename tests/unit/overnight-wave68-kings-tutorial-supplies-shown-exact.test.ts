/**
 * Wave 68 leftover after tip/#334 — Kings supplies counts-shown exact. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { kingsQuadraphagesTutorial } from '../../src/games/kings-quadraphages/tutorial';

describe('Wave 68 kings — tutorial supplies shown', () => {
  it('supplies locks supply-counts-shown sentence exact', () => {
    const step = kingsQuadraphagesTutorial.steps.find((s) => s.id === 'supplies');
    expect(step?.message).toContain('The supply counts are shown here');
    expect(step?.highlightSelector).toBe('.status-supplies');
    expect(step?.position).toBe('bottom');
  });
});
