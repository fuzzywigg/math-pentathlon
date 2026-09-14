/**
 * Wave 57 leftover after #262 — Juggle tutorial highlight selectors.
 * Distinct from wave56 tutorial ids/copy. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { juggleTutorial } from '../../src/games/juggle/tutorial';

describe('Wave 57 juggle — tutorial highlights', () => {
  it('highlights dice-area and boards on sequence/placement steps', () => {
    const byId = Object.fromEntries(
      juggleTutorial.steps.map((s) => [s.id, s])
    );
    expect(byId['turn-sequence']?.highlightSelector).toBe('.juggle-dice-area');
    expect(byId['placement-rules']?.highlightSelector).toBe('.juggle-boards');
  });
});
