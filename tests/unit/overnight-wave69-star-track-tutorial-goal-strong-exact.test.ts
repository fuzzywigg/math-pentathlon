/**
 * Wave 69 leftover after tip/#350 — Star Track goal win strong exact.
 * Soft tutorial wiring existed; lock center-star strong. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { starTrackTutorial } from '../../src/games/star-track/tutorial';

describe('Wave 69 star-track — tutorial goal strong', () => {
  it('goal pins reach-the-star strong and How to Win title', () => {
    const step = starTrackTutorial.steps.find((s) => s.id === 'goal');
    expect(step?.title).toBe('How to Win');
    expect(step?.message).toContain(
      '<strong>reach the star in the center first!</strong>'
    );
    expect(step?.position).toBe('center');
  });
});
