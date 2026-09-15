/**
 * Wave 66 leftover after tip/#316 — Kings move-king one-square-down exact.
 * Soft requiredAction coords; lock cue copy leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { kingsQuadraphagesTutorial } from '../../src/games/kings-quadraphages/tutorial';

describe('Wave 66 kings — tutorial move-king down exact', () => {
  it('move-king Tap here green cell + one square down', () => {
    const step = kingsQuadraphagesTutorial.steps.find((s) => s.id === 'move-king');
    expect(step?.title).toBe('Move Your King');
    expect(step?.message).toContain('<strong>Tap here</strong> and tap the green cell');
    expect(step?.message).toContain('That moves your King one square down.');
    expect(step?.highlightSelector).toBe('.cell[data-row="2"][data-col="5"]');
  });
});
