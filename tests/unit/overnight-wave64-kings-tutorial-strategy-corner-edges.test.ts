/**
 * Wave 64 leftover after tip/#303 — Kings strategy corner/edge tips. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { kingsQuadraphagesTutorial } from '../../src/games/kings-quadraphages/tutorial';

describe('Wave 64 kings — tutorial strategy corner edges', () => {
  it('push toward corner/edge; keep King away from edges', () => {
    const tips = kingsQuadraphagesTutorial.steps.find((s) => s.id === 'strategy-tips');
    expect(tips?.message).toMatch(/push your opponent toward a corner or edge/);
    expect(tips?.message).toMatch(/Keep your own King away from edges/);
    expect(tips?.position).toBe('center');
  });
});
