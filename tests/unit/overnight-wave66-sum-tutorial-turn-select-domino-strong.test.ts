/**
 * Wave 66 leftover after tip/#316 — Sum turn Select Domino strong exact.
 * Soft Select Domino regex existed; lock full strong li leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { sumDominoesTutorial } from '../../src/games/sum-dominoes/tutorial';

describe('Wave 66 sum — tutorial turn select domino strong', () => {
  it('turn-sequence locks Select Domino strong exact li', () => {
    const step = sumDominoesTutorial.steps.find((s) => s.id === 'turn-sequence');
    expect(step?.message).toContain(
      '<strong>Select Domino:</strong> Choose a domino from your hand'
    );
    expect(step?.position).toBe('bottom');
  });
});
