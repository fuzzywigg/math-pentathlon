/**
 * Wave 56 leftover after #256 — Par 55 tutorial welcome + turn-sequence. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { par55Tutorial } from '../../src/games/par-55/tutorial';

describe('Wave 56 par55 — tutorial welcome/turn', () => {
  it('welcome title and turn-sequence highlight', () => {
    expect(par55Tutorial.steps.find((s) => s.id === 'welcome')?.title).toBe(
      'Welcome to Par 55!'
    );
    const turn = par55Tutorial.steps.find((s) => s.id === 'turn-sequence');
    expect(turn?.title).toBe('Turn Sequence');
    expect(turn?.highlightSelector).toBe('.par55-board');
    expect(turn?.message).toMatch(/Select Block/);
    expect(turn?.message).toMatch(/Place Block/);
  });
});
