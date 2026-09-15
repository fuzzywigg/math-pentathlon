/**
 * Wave 65 leftover after tip/#315 — Juggle complete fill-your-grid copy.
 * Wave63 locked know-Juggle; deepen Finish fill-grid leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { juggleTutorial } from '../../src/games/juggle/tutorial';

describe('Wave 65 juggle — tutorial complete fill grid', () => {
  it('locks Finish and fill your grid fragment', () => {
    const step = juggleTutorial.steps.find((s) => s.id === 'complete');
    expect(step?.title).toBe('Ready to Play!');
    expect(step?.message).toContain('fill your grid!');
    expect(step?.message).toContain('<strong>Finish</strong>');
  });
});
