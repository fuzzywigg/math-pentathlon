/**
 * Wave 63 leftover after tip/#301 — Calla welcome counting-game copy.
 * Distinct from welcome title lock. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { callaTutorial } from '../../src/games/calla/tutorial';

describe('Wave 63 calla — tutorial welcome counting', () => {
  it('locks fun counting game + Learn Calla name/id', () => {
    const step = callaTutorial.steps.find((s) => s.id === 'welcome');
    expect(step?.message).toContain('fun counting game');
    expect(step?.message).toContain('move cubes around the board');
    expect(callaTutorial.id).toBe('calla-basics');
    expect(callaTutorial.name).toBe('Learn Calla');
  });
});
