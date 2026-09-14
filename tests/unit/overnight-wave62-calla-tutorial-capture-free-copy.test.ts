/**
 * Wave 62 leftover after #293 — Calla capture/free-turn/board-intro copy leftovers.
 * Distinct from wave50 soft matches and wave60 skip-opponent. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { callaTutorial } from '../../src/games/calla/tutorial';

describe('Wave 62 calla — tutorial capture free copy', () => {
  it('locks Special rule / empty pit / Blue pits color fragments', () => {
    const byId = Object.fromEntries(
      callaTutorial.steps.map((s) => [s.id, s])
    );
    expect(byId['free-turn']?.message).toContain(
      'If your last cube lands in your Calla'
    );
    expect(byId['capture']?.message).toContain('Another special rule');
    expect(byId['capture']?.message).toContain('empty pit on YOUR side');
    expect(byId['board-intro']?.message).toContain('color: #2196F3');
    expect(byId['board-intro']?.message).toContain("Blue's pits");
    expect(byId['board-intro']?.message).toContain('color: #e53935');
  });
});
