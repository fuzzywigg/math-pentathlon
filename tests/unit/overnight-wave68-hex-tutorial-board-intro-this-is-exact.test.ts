/**
 * Wave 68 leftover after tip/#334 — Hex board-intro This-is-the-hex-board exact. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { hexTutorial } from '../../src/games/hex/tutorial';

describe('Wave 68 hex — tutorial board intro this is', () => {
  it('board-intro locks This is the hex board sentence exact', () => {
    const step = hexTutorial.steps.find((s) => s.id === 'board-intro');
    expect(step?.message).toContain('This is the hex board.');
    expect(step?.highlightSelector).toBe('.hex-board');
    expect(step?.position).toBe('right');
  });
});
