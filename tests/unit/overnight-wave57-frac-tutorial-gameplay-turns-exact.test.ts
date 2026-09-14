/**
 * Overnight TOKENMAXX HEAVY leftovers after #260 — Frac Fact gameplay turns bullet exact.
 * Wave55 matched /take turns/ only. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { fracFactTutorial } from '../../src/games/frac-fact/tutorial';

describe('Wave 57 frac tutorial — gameplay turns', () => {
  it('lists Players take turns solving fraction arithmetic problems leftover', () => {
    const step = fracFactTutorial.steps.find((s) => s.id === 'gameplay');
    expect(step?.message).toContain(
      'Players take turns solving fraction arithmetic problems'
    );
  });
});
