/**
 * Wave 68 leftover after tip/#333 — complete Finish collecting exact.
 * Soft tutorial existed; lock exact leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { callaTutorial } from '../../src/games/calla/tutorial';

describe('Wave 68 calla — tutorial complete finish collecting', () => {
  it('complete locks Finish collecting cubes CTA', () => {
    const step = callaTutorial.steps.find((s) => s.id === 'complete');
    expect(step?.message).toContain('Click <strong>Finish</strong> and start collecting cubes!');
  });
});
