/**
 * Wave 64 leftover after tip/#303 — Hex board-intro This is the hex board. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { hexTutorial } from '../../src/games/hex/tutorial';

describe('Wave 64 hex — tutorial board intro exact', () => {
  it('This is the hex board; Blue/Red connect axes', () => {
    const intro = hexTutorial.steps.find((s) => s.id === 'board-intro');
    expect(intro?.title).toBe('The Game Board');
    expect(intro?.message).toMatch(/This is the hex board/);
    expect(intro?.message).toMatch(/top to bottom/);
    expect(intro?.message).toMatch(/left to right/);
    expect(intro?.highlightSelector).toBe('.hex-board');
  });
});
