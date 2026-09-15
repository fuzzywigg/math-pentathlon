/**
 * Wave 68 leftover after tip/#336 — Hex board-intro exact. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { hexTutorial } from '../../src/games/hex/tutorial';

describe('Wave 68 hex — tutorial board intro exact', () => {
  it('board-intro locks This is the hex board + connect sides', () => {
    const step = hexTutorial.steps.find((s) => s.id === 'board-intro');
    expect(step?.message).toContain('This is the hex board.');
    expect(step?.message).toContain('<strong>Blue</strong> connects <strong>top to bottom</strong>');
    expect(step?.highlightSelector).toBe('.hex-board');
  });
});
