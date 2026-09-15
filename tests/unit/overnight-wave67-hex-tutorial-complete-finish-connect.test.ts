/**
 * Wave 67 leftover after tip/#324 — Hex complete Finish + connect sides. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { hexTutorial } from '../../src/games/hex/tutorial';

describe('Wave 67 hex — tutorial complete finish connect', () => {
  it('complete locks Finish strong + connect your sides', () => {
    const step = hexTutorial.steps.find((s) => s.id === 'complete');
    expect(step?.message).toContain('<strong>Finish</strong>');
    expect(step?.message).toContain('connect your sides');
    expect(step?.title).toBe('Ready to Play!');
  });
});
