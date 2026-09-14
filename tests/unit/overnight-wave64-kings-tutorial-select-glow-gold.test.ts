/**
 * Wave 64 leftover after tip/#303 — Kings select-king glow gold exact. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { kingsQuadraphagesTutorial } from '../../src/games/kings-quadraphages/tutorial';

describe('Wave 64 kings — tutorial select glow gold', () => {
  it('glow gold when selected; tap your Blue King', () => {
    const select = kingsQuadraphagesTutorial.steps.find((s) => s.id === 'select-king');
    expect(select?.message).toMatch(/glow gold when selected/);
    expect(select?.message).toMatch(/tap your Blue King/);
    expect(select?.title).toBe('Step 1: Select Your King');
  });
});
