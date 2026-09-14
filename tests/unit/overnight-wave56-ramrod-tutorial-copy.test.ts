/**
 * Wave 56 leftover after #256 — Ramrod tutorial copy leftovers.
 * Distinct from highlightSelector burn coverage. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { ramrodTutorial } from '../../src/games/ramrod/tutorial';

describe('Wave 56 ramrod — tutorial copy', () => {
  it('keeps 24 cm / White-Orange / Finish teaching fragments', () => {
    const byId = Object.fromEntries(
      ramrodTutorial.steps.map((s) => [s.id, s])
    );
    expect(byId['welcome']?.message).toMatch(/24 cm/);
    expect(byId['objective']?.message).toMatch(/24 cm/);
    expect(byId['winning']?.message).toMatch(/24 cm/);
    expect(byId['cuisenaire-rods']?.message).toMatch(/White/);
    expect(byId['cuisenaire-rods']?.message).toMatch(/Orange/);
    expect(byId['complete']?.message).toMatch(/Finish/);
  });
});
