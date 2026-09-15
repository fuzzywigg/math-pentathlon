/**
 * Wave 67 leftover after tip/#316 — Sum matching connect-existing exact.
 * Soft connect regex + face-touching existed; lock full connect li. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { sumDominoesTutorial } from '../../src/games/sum-dominoes/tutorial';

describe('Wave 67 sum — tutorial connect existing exact', () => {
  it('matching-rules locks connect to existing domino exact', () => {
    const step = sumDominoesTutorial.steps.find((s) => s.id === 'matching-rules');
    expect(step?.message).toContain(
      'Your domino must connect to an existing domino on the board'
    );
    expect(step?.title).toBe('Matching Rules');
  });
});
