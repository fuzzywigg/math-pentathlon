/**
 * Wave 58 leftover after #262 (retry #273 RED) — Ramrod tutorial highlight selectors.
 * Distinct from wave56 tutorial copy fragments. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { ramrodTutorial } from '../../src/games/ramrod/tutorial';

describe('Wave 58 ramrod — tutorial highlights', () => {
  it('highlights rods, board, and scores on matching steps', () => {
    const byId = Object.fromEntries(
      ramrodTutorial.steps.map((s) => [s.id, s])
    );
    expect(byId['cuisenaire-rods']?.highlightSelector).toBe(
      '.ramrod-player-rods'
    );
    expect(byId['turn-sequence']?.highlightSelector).toBe('.ramrod-board');
    expect(byId['capturing-rules']?.highlightSelector).toBe('.ramrod-board');
    expect(byId['winning']?.highlightSelector).toBe('.ramrod-scores');
  });
});
