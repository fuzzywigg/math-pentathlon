/**
 * Wave 65 leftover after tip/#315 — Calla strategy Count-ahead exact tip.
 * Wave59 soft Count ahead; lock full tip string. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { callaTutorial } from '../../src/games/calla/tutorial';

describe('Wave 65 calla — tutorial strategy count ahead exact', () => {
  it('locks Count ahead to land in your Calla! tip', () => {
    const step = callaTutorial.steps.find((s) => s.id === 'strategy-tip');
    expect(step?.message).toContain('Count ahead to land in your Calla!');
    expect(step?.title).toBe('Strategy');
  });
});
