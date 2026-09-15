/**
 * Wave 67 leftover after tip/#316 — FIAR objective title exact.
 * Wave65 pathways body; lock Objective title leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { fiarTutorial } from '../../src/games/fiar/tutorial';

describe('Wave 67 fiar — tutorial objective title', () => {
  it('objective step title is Objective', () => {
    const step = fiarTutorial.steps.find((s) => s.id === 'objective');
    expect(step?.title).toBe('Objective');
  });
});
