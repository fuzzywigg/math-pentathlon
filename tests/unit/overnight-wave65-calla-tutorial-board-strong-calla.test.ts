/**
 * Wave 65 leftover after tip/#315 — Calla board-intro strong Calla cup.
 * Wave64 locked Red pits / two-rows; strong Calla leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { callaTutorial } from '../../src/games/calla/tutorial';

describe('Wave 65 calla — tutorial board strong Calla', () => {
  it('locks Each player has a strong Calla big cup', () => {
    const step = callaTutorial.steps.find((s) => s.id === 'board-intro');
    expect(step?.title).toBe('The Game Board');
    expect(step?.message).toContain(
      'Each player has a <strong>Calla</strong> (big cup)'
    );
  });
});
