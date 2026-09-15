/**
 * Wave 67 leftover after tip/#316 — FIAR movement any-distance exact.
 * Wave63 movement body soft; lock any distance straight-line leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { fiarTutorial } from '../../src/games/fiar/tutorial';

describe('Wave 67 fiar — tutorial movement any distance', () => {
  it('movement-rules lists any distance in a straight line', () => {
    const step = fiarTutorial.steps.find((s) => s.id === 'movement-rules');
    expect(step?.message).toContain(
      'Move any distance in a straight line'
    );
  });
});
