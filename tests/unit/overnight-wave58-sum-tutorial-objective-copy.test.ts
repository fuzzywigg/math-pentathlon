/**
 * Wave 58 Contig/SD residual — Sum tutorial objective copy. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { sumDominoesTutorial } from '../../src/games/sum-dominoes/tutorial';

describe('Wave 58 sum — tutorial objective', () => {
  it('pins objective title, center, win copy', () => {
    const step = sumDominoesTutorial.steps.find((s) => s.id === 'objective');
    expect(step?.title).toBe('Objective');
    expect(step?.position).toBe('center');
    expect(step?.message).toMatch(/get rid of all your dominoes/);
  });
});
