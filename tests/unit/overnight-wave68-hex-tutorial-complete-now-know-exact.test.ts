/**
 * Wave 68 leftover after tip/#334 — Hex complete Now-you-know exact. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { hexTutorial } from '../../src/games/hex/tutorial';

describe('Wave 68 hex — tutorial complete now know', () => {
  it('complete locks Now you know how to play Hex exact', () => {
    const step = hexTutorial.steps.find((s) => s.id === 'complete');
    expect(step?.message).toContain('Now you know how to play Hex!');
    expect(step?.title).toBe('Ready to Play!');
    expect(step?.position).toBe('center');
  });
});
