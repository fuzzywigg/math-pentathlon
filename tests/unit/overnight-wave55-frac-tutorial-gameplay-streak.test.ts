/**
 * Overnight TOKENMAXX HEAVY leftovers after #250 — Frac Fact gameplay streak copy.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { fracFactTutorial } from '../../src/games/frac-fact/tutorial';

describe('Wave 55 frac tutorial — gameplay', () => {
  it('gameplay title lists turns and streaks', () => {
    const step = fracFactTutorial.steps.find((s) => s.id === 'gameplay');
    expect(step?.title).toBe('Gameplay');
    expect(step?.message).toMatch(/take turns/);
    expect(step?.message).toMatch(/streaks for bonus points/i);
  });
});
