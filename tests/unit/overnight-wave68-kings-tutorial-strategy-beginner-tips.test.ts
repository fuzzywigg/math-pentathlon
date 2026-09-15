/**
 * Wave 68 leftover after tip/#336 — Kings strategy Beginner tips LIs. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { kingsQuadraphagesTutorial } from '../../src/games/kings-quadraphages/tutorial';

describe('Wave 68 kings — tutorial strategy beginner tips', () => {
  it('strategy-tips locks Beginner tips + corner/escape/edges', () => {
    const step = kingsQuadraphagesTutorial.steps.find((s) => s.id === 'strategy-tips');
    expect(step?.message).toContain('<strong>Beginner tips:</strong>');
    expect(step?.message).toContain('push your opponent toward a corner or edge');
    expect(step?.message).toContain('cut off escape routes');
    expect(step?.message).toContain('Keep your own King away from edges');
  });
});
