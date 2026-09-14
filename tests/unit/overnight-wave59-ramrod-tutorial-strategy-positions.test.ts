/**
 * Wave 59 leftover after #279 — Ramrod tutorial strategy copy + step positions.
 * Distinct from wave58 titles/highlights and wave56 soft White/Orange. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { ramrodTutorial } from '../../src/games/ramrod/tutorial';

describe('Wave 59 ramrod — tutorial strategy positions', () => {
  it('locks strategy fragments and cuisenaire/winning positions', () => {
    const byId = Object.fromEntries(
      ramrodTutorial.steps.map((s) => [s.id, s])
    );
    expect(byId['cuisenaire-rods']?.position).toBe('bottom');
    expect(byId['winning']?.position).toBe('bottom');
    expect(byId['strategy-tips']?.position).toBe('center');
    expect(byId['strategy-tips']?.message).toContain(
      "Block opponent's potential captures"
    );
    expect(byId['strategy-tips']?.message).toContain('Higher value boxes');
  });
});
