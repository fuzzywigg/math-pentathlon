/**
 * Wave 59 leftover after #279 — Calla strategy/complete tutorial body leftovers.
 * Distinct from wave58 titles and wave50 step ids. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { callaTutorial } from '../../src/games/calla/tutorial';

describe('Wave 59 calla — tutorial strategy complete copy', () => {
  it('locks Count ahead / Good luck / ice-cube fragments', () => {
    const byId = Object.fromEntries(
      callaTutorial.steps.map((s) => [s.id, s])
    );
    expect(byId['strategy-tip']?.message).toContain('Count ahead');
    expect(byId['strategy-tip']?.position).toBe('center');
    expect(byId['complete']?.message).toContain('Good luck');
    expect(byId['complete']?.message).toContain('🧊');
    expect(byId['complete']?.position).toBe('center');
  });
});
