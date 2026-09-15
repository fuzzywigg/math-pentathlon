/**
 * Wave 65 leftover after tip/#305 — FIAR welcome pathways sentence exact.
 * Soft FIAR strong existed; lock pathways welcome p leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { fiarTutorial } from '../../src/games/fiar/tutorial';

describe('Wave 65 fiar — tutorial welcome pathways exact', () => {
  it('welcome includes pathways goal paragraph', () => {
    const step = fiarTutorial.steps.find((s) => s.id === 'welcome');
    expect(step?.message).toContain(
      '<p>Get four of your chips in a row along connected pathways!</p>'
    );
    expect(step?.message).toContain(
      '<strong>FIAR (Four In A Row)</strong>'
    );
  });
});
