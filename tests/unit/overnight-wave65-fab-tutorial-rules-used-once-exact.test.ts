/**
 * Wave 65 leftover after tip/#305 — Fab rules used-once exact.
 * Soft /used once/ existed; lock full li leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { fabADiffyTutorial } from '../../src/games/fab-a-diffy/tutorial';

describe('Wave 65 fab — tutorial rules used once exact', () => {
  it('rules lists each fraction bar used once', () => {
    const step = fabADiffyTutorial.steps.find((s) => s.id === 'rules');
    expect(step?.message).toContain(
      '<li>Each fraction bar can only be used once</li>'
    );
  });
});
