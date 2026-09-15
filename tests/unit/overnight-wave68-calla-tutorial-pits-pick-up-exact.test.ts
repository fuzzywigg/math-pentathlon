/**
 * Wave 68 leftover after tip/#333 — pits pick-up exact sentence.
 * Soft tutorial existed; lock exact leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { callaTutorial } from '../../src/games/calla/tutorial';

describe('Wave 68 calla — tutorial pits pick up exact', () => {
  it('pits-explained locks pick-up sentence', () => {
    const step = callaTutorial.steps.find((s) => s.id === 'pits-explained');
    expect(step?.message).toContain("You'll pick up cubes from YOUR pits and drop them around the board!");
  });
});
