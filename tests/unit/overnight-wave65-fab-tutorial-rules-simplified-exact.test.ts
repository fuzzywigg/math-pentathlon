/**
 * Wave 65 leftover after tip/#305 — Fab rules auto-simplify exact.
 * Soft equivalent match existed; lock simplified li leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { fabADiffyTutorial } from '../../src/games/fab-a-diffy/tutorial';

describe('Wave 65 fab — tutorial rules simplified exact', () => {
  it('rules lists automatic simplification', () => {
    const step = fabADiffyTutorial.steps.find((s) => s.id === 'rules');
    expect(step?.message).toContain(
      '<li>Results are automatically simplified</li>'
    );
  });
});
