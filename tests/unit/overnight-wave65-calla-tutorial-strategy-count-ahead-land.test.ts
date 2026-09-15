/**
 * Wave 65 leftover after tip/#315 — Calla strategy Count ahead to land tip.
 * Wave59 soft Count ahead; lock full land-in-Calla tip. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { callaTutorial } from '../../src/games/calla/tutorial';

describe('Wave 65 calla — tutorial strategy count ahead land', () => {
  it('locks Count ahead to land in your Calla tip', () => {
    const step = callaTutorial.steps.find((s) => s.id === 'strategy-tip');
    expect(step?.title).toBe('Strategy');
    expect(step?.message).toContain('Count ahead to land in your Calla!');
  });
});
