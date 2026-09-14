/**
 * Wave 56 leftover after #256 — Juggle tutorial dice/strategy/Finish copy.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { juggleTutorial } from '../../src/games/juggle/tutorial';

describe('Wave 56 juggle — tutorial copy catalog', () => {
  it('documents die→category map, placement rules, strategy, Finish', () => {
    const byId = Object.fromEntries(
      juggleTutorial.steps.map((s) => [s.id, s])
    );
    expect(byId['objective']?.message).toMatch(/9x9 grid/);
    expect(byId['dice-values']?.message).toMatch(/Monomino \(1 cell\)/);
    expect(byId['dice-values']?.message).toMatch(/5-6.*Pentomino/s);
    expect(byId['placement-rules']?.message).toMatch(/rotated and flipped/);
    expect(byId['placement-rules']?.message).toMatch(/cannot overlap/);
    expect(byId['strategy-tips']?.message).toMatch(/Larger shapes fill/);
    expect(byId['strategy-tips']?.message).toMatch(/Save small shapes/);
    expect(byId['complete']?.message).toMatch(/Finish/);
    expect(byId['turn-sequence']?.message).toMatch(/Roll two dice/);
  });
});
