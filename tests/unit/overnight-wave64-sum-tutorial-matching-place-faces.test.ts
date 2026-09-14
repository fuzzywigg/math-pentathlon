/**
 * Wave 64 leftover after tip/#303 — Sum matching place-faces exact.
 * Soft connect/face-touching existed; lock Place it so faces. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { sumDominoesTutorial } from '../../src/games/sum-dominoes/tutorial';

describe('Wave 64 sum — tutorial matching place faces', () => {
  it('locks Place it so one of its faces Match & Place fragment', () => {
    const turn = sumDominoesTutorial.steps.find((s) => s.id === 'turn-sequence');
    expect(turn?.message).toContain(
      '<strong>Match & Place:</strong> Place it so one of its faces + an adjacent face on the board = your dice sum'
    );
  });
});
