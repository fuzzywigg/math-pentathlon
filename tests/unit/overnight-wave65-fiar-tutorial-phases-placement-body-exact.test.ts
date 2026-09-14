/**
 * Wave 65 leftover after tip/#305 — FIAR phases placement body exact.
 * Wave61 strong labels; deepen placing-4-chips body leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { fiarTutorial } from '../../src/games/fiar/tutorial';

describe('Wave 65 fiar — tutorial phases placement body exact', () => {
  it('phases Placement body mentions 4 chips on empty nodes', () => {
    const step = fiarTutorial.steps.find((s) => s.id === 'game-phases');
    expect(step?.message).toContain(
      'Take turns placing 4 chips each on any empty node'
    );
    expect(step?.position).toBe('bottom');
  });
});
