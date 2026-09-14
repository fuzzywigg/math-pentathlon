/**
 * Wave 57 leftover after #263 — Kwatro turn-sequence + complete leftovers. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { kwatroSinkoTutorial } from '../../src/games/kwatro-sinko/tutorial';

describe('Wave 57 kwatro — tutorial turn-sequence', () => {
  it('turn-sequence highlights board; complete mentions 4 or 5', () => {
    const turn = kwatroSinkoTutorial.steps.find((s) => s.id === 'turn-sequence');
    expect(turn?.highlightSelector).toBe('.kwa-board');
    expect(turn?.message).toMatch(/Select Chip/);
    expect(turn?.message).toMatch(/Move/);
    const done = kwatroSinkoTutorial.steps.find((s) => s.id === 'complete');
    expect(done?.message).toMatch(/make 4 or 5/);
  });
});
