/**
 * Overnight TOKENMAXX HEAVY leftovers after #260 — Frac Fact complete Finish strong.
 * Wave54/55 matched /Finish/ and /solve those fractions/i separately. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { fracFactTutorial } from '../../src/games/frac-fact/tutorial';

describe('Wave 57 frac tutorial — complete finish strong', () => {
  it('complete step keeps Now you know + Finish strong leftover', () => {
    const step = fracFactTutorial.steps.find((s) => s.id === 'complete');
    expect(step?.message).toContain('Now you know how to play Frac Fact!');
    expect(step?.message).toContain(
      'Click <strong>Finish</strong> and solve those fractions!'
    );
  });
});
