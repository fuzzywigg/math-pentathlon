/**
 * Wave 68 leftover after tip/#336 — Kings select tap Blue King strong. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { kingsQuadraphagesTutorial } from '../../src/games/kings-quadraphages/tutorial';

describe('Wave 68 kings — tutorial select tap Blue King', () => {
  it('select-king locks tap Blue King + glow gold', () => {
    const step = kingsQuadraphagesTutorial.steps.find((s) => s.id === 'select-king');
    expect(step?.message).toContain('<strong>tap your Blue King</strong>');
    expect(step?.message).toContain('glow gold when selected');
    expect(step?.message).toContain('<strong>Tap here</strong>');
  });
});
