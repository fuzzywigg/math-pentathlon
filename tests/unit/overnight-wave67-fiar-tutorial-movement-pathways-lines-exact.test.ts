/**
 * Wave 67 leftover after tip/#336 — FIAR movement pathways (lines) exact.
 * Wave65 pathways objective; lock connected pathways (lines) leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { fiarTutorial } from '../../src/games/fiar/tutorial';

describe('Wave 67 fiar — tutorial movement pathways lines', () => {
  it('movement-rules cites connected pathways (lines)', () => {
    const step = fiarTutorial.steps.find((s) => s.id === 'movement-rules');
    expect(step?.message).toContain(
      'Chips move along the connected pathways (lines)'
    );
  });
});
