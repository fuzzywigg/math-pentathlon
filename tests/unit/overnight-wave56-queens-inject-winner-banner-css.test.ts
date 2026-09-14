/**
 * Wave 56 leftover after #256 — Queens inject winner-banner / glow CSS body.
 * Distinct from wave49 inject idempotent length-only leftover. Tests-only.
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { injectQGStyles } from '../../src/games/queens-guards/board-ui';

describe('Wave 56 queens — inject winner-banner CSS', () => {
  beforeEach(() => {
    document.getElementById('qg-styles')?.remove();
  });

  it('embeds .qg-winner-banner, qg-glow, and drop-shadow', () => {
    injectQGStyles();
    const css = document.getElementById('qg-styles')?.textContent ?? '';
    expect(css).toMatch(/\.qg-winner-banner/);
    expect(css).toMatch(/@keyframes qg-glow/);
    expect(css).toMatch(/drop-shadow/);
  });
});
