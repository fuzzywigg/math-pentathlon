/**
 * Wave 65 leftover after tip/#305 — FIAR strategy block-paths exact.
 * Soft /Block opponent/ regex; lock full winning-paths li leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { fiarTutorial } from '../../src/games/fiar/tutorial';

describe('Wave 65 fiar — tutorial strategy block paths exact', () => {
  it('strategy-tips lists block opponent potential winning paths', () => {
    const step = fiarTutorial.steps.find((s) => s.id === 'strategy-tips');
    expect(step?.message).toContain(
      "<li>Block opponent's potential winning paths</li>"
    );
  });
});
