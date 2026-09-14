/**
 * Wave 56 leftover after #256 — Calla strategy + your-calla teaching copy.
 * Distinct from wave50 title/capture/free-turn fragments. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { callaTutorial } from '../../src/games/calla/tutorial';

describe('Wave 56 calla — tutorial strategy / your-calla', () => {
  it('keeps strategy tips, skip-opponent calla, and Finish good-luck copy', () => {
    const byId = Object.fromEntries(
      callaTutorial.steps.map((s) => [s.id, s])
    );
    expect(byId['strategy-tip']?.title).toBe('Strategy');
    expect(byId['strategy-tip']?.message).toMatch(/Count ahead to land in your Calla/i);
    expect(byId['strategy-tip']?.message).toMatch(/capture opportunities/i);
    expect(byId['strategy-tip']?.message).toMatch(/Watch your opponent/i);
    expect(byId['your-calla']?.title).toBe('Your Calla');
    expect(byId['your-calla']?.message).toMatch(/skip over your opponent's Calla/i);
    expect(byId['your-calla']?.message).toMatch(/that's your score/i);
    expect(byId['complete']?.message).toMatch(/Finish/);
    expect(byId['complete']?.message).toMatch(/Good luck/);
  });
});
