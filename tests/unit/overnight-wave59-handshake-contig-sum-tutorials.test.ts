/**
 * Wave 59 Contig/SD residual — Contig × Sum tutorial id handshake. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { contig60Tutorial } from '../../src/games/contig-60/tutorial';
import { sumDominoesTutorial } from '../../src/games/sum-dominoes/tutorial';

describe('Wave 59 handshake — contig × sum tutorials', () => {
  it('unique tutorial ids and shared objective step id', () => {
    expect(contig60Tutorial.id).not.toBe(sumDominoesTutorial.id);
    expect(contig60Tutorial.steps.some((s) => s.id === 'objective')).toBe(true);
    expect(sumDominoesTutorial.steps.some((s) => s.id === 'objective')).toBe(
      true
    );
    const contigIds = contig60Tutorial.steps.map((s) => s.id);
    expect(new Set(contigIds).size).toBe(contigIds.length);
    const sumIds = sumDominoesTutorial.steps.map((s) => s.id);
    expect(new Set(sumIds).size).toBe(sumIds.length);
  });
});
