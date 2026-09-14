/**
 * Wave 63 leftover after #301 — Hex complete Now you know residual. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { hexTutorial } from '../../src/games/hex/tutorial';

describe('Wave 63 hex — tutorial complete know-how', () => {
  it('complete Now you know how to play Hex; Finish CTA', () => {
    const complete = hexTutorial.steps.find((s) => s.id === 'complete');
    expect(complete?.message).toMatch(/Now you know how to play Hex/);
    expect(complete?.message).toMatch(/Finish/);
  });
});
