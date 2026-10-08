/**
 * Wave 65 leftover after tip/#305 — FIAR objective pathways sentence exact.
 * Soft four/pathways regex; lock full objective p leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { fiarTutorial } from '../../src/games/fiar/tutorial';

describe('Wave 65 fiar — tutorial objective pathways exact', () => {
  it('objective locks four chips along connected pathways sentence', () => {
    const step = fiarTutorial.steps.find((s) => s.id === 'objective');
    expect(step?.message).toContain(
      'Identify four (or more) chips of the same color along a straight line'
    );
  });
});
