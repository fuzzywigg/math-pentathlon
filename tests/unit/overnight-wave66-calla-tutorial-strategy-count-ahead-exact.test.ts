/**
 * Wave 66 leftover after tip/#316 — Calla strategy count-ahead exact li.
 * Soft Count ahead existed; lock full tip leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { callaTutorial } from '../../src/games/calla/tutorial';

describe('Wave 66 calla — tutorial strategy count ahead exact', () => {
  it('strategy tips include count-ahead Calla li', () => {
    const step = callaTutorial.steps.find((s) => s.id === 'strategy-tip');
    expect(step?.title).toBe('Strategy');
    expect(step?.message).toContain('<li>Count ahead to land in your Calla!</li>');
  });
});
