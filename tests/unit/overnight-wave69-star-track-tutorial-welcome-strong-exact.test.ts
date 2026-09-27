/**
 * Wave 69 leftover after tip/#350 — Star Track welcome strong name exact.
 * Soft step-id list existed; lock <strong>Star Track</strong>. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { starTrackTutorial } from '../../src/games/star-track/tutorial';

describe('Wave 69 star-track — tutorial welcome strong', () => {
  it('welcome uses exact strong Star Track markup', () => {
    const step = starTrackTutorial.steps.find((s) => s.id === 'welcome');
    expect(step?.title).toBe('Welcome to Star Track!');
    expect(step?.message).toContain('<strong>Star Track</strong>');
    expect(step?.message).toContain("Let's learn how to play");
    expect(step?.position).toBe('center');
  });
});
