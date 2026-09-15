/**
 * Wave 67 leftover after tip/#316 — Calla strategy capture/watch exact lis.
 * Wave66 locked count-ahead li; lock remaining exact lis leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { callaTutorial } from '../../src/games/calla/tutorial';

describe('Wave 67 calla — tutorial strategy lis exact', () => {
  it('strategy-tip locks capture and watch-opponent exact lis', () => {
    const step = callaTutorial.steps.find((s) => s.id === 'strategy-tip');
    expect(step?.message).toContain(
      '<li>Look for capture opportunities</li>'
    );
    expect(step?.message).toContain(
      "<li>Watch your opponent's side too!</li>"
    );
  });
});
