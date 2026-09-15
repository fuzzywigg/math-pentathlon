/**
 * Wave 67 leftover after tip/#316 — Calla welcome counting-game exact sentence.
 * Wave63 soft-matched fun counting; lock full sentence leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { callaTutorial } from '../../src/games/calla/tutorial';

describe('Wave 67 calla — tutorial welcome counting exact', () => {
  it('welcome locks full counting-game sentence', () => {
    const step = callaTutorial.steps.find((s) => s.id === 'welcome');
    expect(step?.message).toContain(
      "It's a fun counting game where you move cubes around the board!"
    );
  });
});
