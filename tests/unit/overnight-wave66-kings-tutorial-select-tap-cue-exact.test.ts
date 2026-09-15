/**
 * Wave 66 leftover after tip/#316 — Kings select-king Tap here cue exact.
 * Soft glow gold; lock yellow Tap here leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { kingsQuadraphagesTutorial } from '../../src/games/kings-quadraphages/tutorial';

describe('Wave 66 kings — tutorial select tap cue exact', () => {
  it('select-king yellow Tap here cue paragraph exact', () => {
    const step = kingsQuadraphagesTutorial.steps.find((s) => s.id === 'select-king');
    expect(step?.message).toContain('Look for the yellow <strong>Tap here</strong> cue');
    expect(step?.message).toContain('<strong>tap your Blue King</strong>');
    expect(step?.position).toBe('bottom');
  });
});
