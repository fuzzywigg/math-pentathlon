/**
 * Wave 65 leftover after tip/#315 — Calla complete Good luck ice-cube exact.
 * Wave59 soft Good luck / emoji; lock combined exact. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { callaTutorial } from '../../src/games/calla/tutorial';

describe('Wave 65 calla — tutorial complete good luck cube', () => {
  it('locks Good luck ice-cube paragraph', () => {
    const step = callaTutorial.steps.find((s) => s.id === 'complete');
    expect(step?.title).toBe('Ready to Play!');
    expect(step?.message).toContain('<p>Good luck! 🧊</p>');
  });
});
