/**
 * Wave 68 leftover after tip/#336 — Hex complete Now you know exact. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { hexTutorial } from '../../src/games/hex/tutorial';

describe('Wave 68 hex — tutorial complete know Hex', () => {
  it('complete locks Now you know + Finish strong', () => {
    const step = hexTutorial.steps.find((s) => s.id === 'complete');
    expect(step?.message).toContain('Now you know how to play Hex!');
    expect(step?.message).toContain('<strong>Finish</strong>');
    expect(step?.title).toBe('Ready to Play!');
  });
});
