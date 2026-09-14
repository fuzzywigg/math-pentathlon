/**
 * Wave 63 leftover after #301 — Kings strategy Beginner tips residuals. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { kingsQuadraphagesTutorial } from '../../src/games/kings-quadraphages/tutorial';

describe('Wave 63 kings — tutorial strategy beginner tips', () => {
  it('strategy-tips Beginner tips; cut off escape; Think ahead', () => {
    const tips = kingsQuadraphagesTutorial.steps.find((s) => s.id === 'strategy-tips');
    expect(tips?.message).toMatch(/Beginner tips/);
    expect(tips?.message).toMatch(/cut off escape routes/);
    expect(tips?.message).toMatch(/Think ahead/);
    expect(tips?.position).toBe('center');
  });
});
