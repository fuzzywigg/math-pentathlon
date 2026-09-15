/**
 * Wave 67 leftover after tip/#323/#324 — welcome counting exact.
 * Soft tutorial existed; lock exact leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { callaTutorial } from '../../src/games/calla/tutorial';

describe('Wave 67 calla — tutorial welcome counting exact', () => {
  it('welcome locks fun counting game sentence', () => {
    const step = callaTutorial.steps.find((s) => s.id === 'welcome');
    expect(step?.message).toContain("It's a fun counting game where you move cubes around the board!");
  });
});
