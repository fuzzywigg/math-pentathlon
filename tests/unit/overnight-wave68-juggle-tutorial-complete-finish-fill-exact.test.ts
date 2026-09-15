/**
 * Wave 68 leftover after tip/#333 — complete Finish fill exact.
 * Soft tutorial existed; lock exact leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { juggleTutorial } from '../../src/games/juggle/tutorial';

describe('Wave 68 juggle — tutorial complete finish fill exact', () => {
  it('complete locks Finish fill-grid CTA', () => {
    const step = juggleTutorial.steps.find((s) => s.id === 'complete');
    expect(step?.message).toContain('Click <strong>Finish</strong> and fill your grid!');
  });
});
