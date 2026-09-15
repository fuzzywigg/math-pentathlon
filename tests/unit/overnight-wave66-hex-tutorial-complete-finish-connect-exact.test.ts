/**
 * Wave 66 leftover after tip/#316 — Hex complete Finish connect exact.
 * Soft know-how; lock Finish CTA leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { hexTutorial } from '../../src/games/hex/tutorial';

describe('Wave 66 hex — tutorial complete finish connect exact', () => {
  it('complete Finish strong + connect your sides exact', () => {
    const step = hexTutorial.steps.find((s) => s.id === 'complete');
    expect(step?.message).toContain(
      'Click <strong>Finish</strong> and connect your sides!'
    );
    expect(step?.message).toContain('<p>Now you know how to play Hex!</p>');
  });
});
