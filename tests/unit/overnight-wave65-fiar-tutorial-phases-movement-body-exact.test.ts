/**
 * Wave 65 leftover after tip/#305 — FIAR phases movement body exact.
 * Wave61 Movement Phase strong; deepen pathways body leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { fiarTutorial } from '../../src/games/fiar/tutorial';

describe('Wave 65 fiar — tutorial phases movement body exact', () => {
  it('phases Movement body mentions moving chips along pathways', () => {
    const step = fiarTutorial.steps.find((s) => s.id === 'game-phases');
    expect(step?.message).toContain(
      'Take turns moving your chips along pathways'
    );
  });
});
