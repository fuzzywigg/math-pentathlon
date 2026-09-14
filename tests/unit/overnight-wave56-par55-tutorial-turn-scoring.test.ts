/**
 * Wave 56 leftover after #256 — Par 55 tutorial turn-sequence + scoring. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { par55Tutorial } from '../../src/games/par-55/tutorial';

describe('Wave 56 par55 — tutorial turn/scoring', () => {
  it('turn-sequence Select Block; scoring max 4; welcome title', () => {
    const turn = par55Tutorial.steps.find((s) => s.id === 'turn-sequence');
    expect(turn?.message).toMatch(/Select Block/);
    expect(turn?.message).toMatch(/5 blocks/);
    expect(turn?.highlightSelector).toBe('.par55-board');
    const scoring = par55Tutorial.steps.find((s) => s.id === 'scoring');
    expect(scoring?.message).toMatch(/max 4 per connection/);
    expect(scoring?.highlightSelector).toBe('.par55-scores');
    expect(par55Tutorial.steps.find((s) => s.id === 'welcome')?.title).toBe(
      'Welcome to Par 55!'
    );
  });
});
