/**
 * Wave 65 leftover after tip/#305 — FIAR strategy multiple-threats exact.
 * Soft /multiple winning threats/; lock full li leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { fiarTutorial } from '../../src/games/fiar/tutorial';

describe('Wave 65 fiar — tutorial strategy threats exact', () => {
  it('strategy-tips lists set up multiple winning threats', () => {
    const step = fiarTutorial.steps.find((s) => s.id === 'strategy-tips');
    expect(step?.message).toContain(
      '<li>Set up multiple winning threats</li>'
    );
  });
});
