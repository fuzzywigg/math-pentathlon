/**
 * Wave 66 leftover after tip/#316 — Calla welcome strong Calla exact.
 * Soft welcome title existed; lock strong tag leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { callaTutorial } from '../../src/games/calla/tutorial';

describe('Wave 66 calla — tutorial welcome strong calla', () => {
  it('welcome strong-marks Calla in learn sentence', () => {
    const step = callaTutorial.steps.find((s) => s.id === 'welcome');
    expect(step?.title).toBe('Welcome to Calla!');
    expect(step?.message).toContain("Let's learn how to play <strong>Calla</strong>!");
    expect(step?.position).toBe('center');
  });
});
