/**
 * Wave 56 leftover after #256 — Pent inject winner-banner + AI-seat CSS body.
 * Distinct from inject idempotent leftover. Tests-only.
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { injectPentEmInStyles } from '../../src/games/pent-em-in/board-ui';

describe('Wave 56 pent — inject winner/AI CSS', () => {
  beforeEach(() => {
    document.getElementById('pent-em-in-styles')?.remove();
  });

  it('embeds winner-banner, rotate purple, flip cyan, and AI seat remaps', () => {
    injectPentEmInStyles();
    const css = document.getElementById('pent-em-in-styles')?.textContent ?? '';
    expect(css).toMatch(/\.pent-winner-banner/);
    expect(css).toMatch(/\.pent-btn-rotate/);
    expect(css).toMatch(/#7c4dff/);
    expect(css).toMatch(/\.pent-btn-flip/);
    expect(css).toMatch(/#00bcd4/);
    expect(css).toMatch(/\[data-opponent="ai"\] \.pent-status\.player2/);
  });
});
