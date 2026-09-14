/**
 * Wave 64 leftover after tip/#303 — Hex-a-Gone complete know + last standing. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { hexAGoneTutorial } from '../../src/games/hex-a-gone/tutorial';

describe('Wave 64 hexagone — tutorial complete know standing', () => {
  it('Now you know Hex-a-Gone; last player standing', () => {
    const complete = hexAGoneTutorial.steps.find((s) => s.id === 'complete');
    expect(complete?.message).toMatch(/Now you know how to play Hex-a-Gone!/);
    expect(complete?.message).toMatch(/last player standing/);
    expect(complete?.title).toBe('Ready to Play!');
    expect(hexAGoneTutorial.id).toBe('hex-a-gone-basics');
    expect(hexAGoneTutorial.name).toBe('Learn Hex-a-Gone!');
  });
});
