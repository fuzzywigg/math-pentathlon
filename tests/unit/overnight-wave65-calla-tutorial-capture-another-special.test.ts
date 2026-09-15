/**
 * Wave 65 leftover after tip/#315 — Calla capture Another-special-rule markup.
 * Wave64 locked across/ALL; deepen Another special rule leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { callaTutorial } from '../../src/games/calla/tutorial';

describe('Wave 65 calla — tutorial capture another special', () => {
  it('locks Another special rule strong markup', () => {
    const step = callaTutorial.steps.find((s) => s.id === 'capture');
    expect(step?.message).toContain(
      '<strong>Another special rule:</strong>'
    );
    expect(step?.title).toBe('Capturing');
  });
});
