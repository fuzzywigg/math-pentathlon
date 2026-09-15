/**
 * Wave 64 leftover after #305 — FIAR objective pathways sentence exact.
 * Wave56 soft four/pathways; deepen full Get four leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { fiarTutorial } from '../../src/games/fiar/tutorial';

describe('Wave 64 fiar — tutorial objective pathways exact', () => {
  it('objective locks Get four chips along connected pathways', () => {
    const step = fiarTutorial.steps.find((s) => s.id === 'objective');
    expect(step?.message).toContain(
      'Get four of your chips in a row along connected pathways!'
    );
  });
});
