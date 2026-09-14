/**
 * Wave 56 leftover after #256 — Prime inject winner-banner / AI-seat / pulse CSS.
 * Distinct from callable-without-throwing leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { injectPrimeGoldStyles } from '../../src/games/prime-gold/board-ui';

describe('Wave 56 prime — inject winner/AI CSS', () => {
  it('embeds pg-winner-banner, pulse keyframes, AI seat, and valid cursor', () => {
    injectPrimeGoldStyles();
    const css = [...document.querySelectorAll('style')]
      .map((s) => s.textContent ?? '')
      .join('\n');
    expect(css).toMatch(/\.pg-winner-banner/);
    expect(css).toMatch(/@keyframes pulse/);
    expect(css).toMatch(/\[data-opponent="ai"\] \.pg-status\.player2/);
    expect(css).toMatch(/\.pg-cell\.valid/);
    expect(css).toMatch(/cursor:\s*pointer/);
  });
});
