/**
 * Wave 64 leftover after tip/#303 — Calla complete know-how-to-play copy.
 * Wave63 locked Finish collecting; deepen know-Calla leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { callaTutorial } from '../../src/games/calla/tutorial';

describe('Wave 64 calla — tutorial complete know calla', () => {
  it('locks Now you know how to play Calla fragment', () => {
    const step = callaTutorial.steps.find((s) => s.id === 'complete');
    expect(step?.title).toBe('Ready to Play!');
    expect(step?.message).toContain('Now you know how to play Calla!');
    expect(step?.position).toBe('center');
  });
});
