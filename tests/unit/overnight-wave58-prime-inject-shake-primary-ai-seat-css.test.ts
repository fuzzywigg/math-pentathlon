/**
 * Wave 58 leftover after #267 — Prime shake/primary/AI-seat-p1 inject CSS.
 * Distinct from wave56 winner/pulse/AI-p2 leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { injectPrimeGoldStyles } from '../../src/games/prime-gold/board-ui';

describe('Wave 58 prime — inject shake/primary/AI seat CSS', () => {
  it('embeds rolling shake, primary green, AI seat player1 status', () => {
    injectPrimeGoldStyles();
    const css = [...document.querySelectorAll('style')]
      .map((s) => s.textContent ?? '')
      .join('\n');
    expect(css).toMatch(/\.pg-die\.rolling/);
    expect(css).toMatch(/@keyframes shake/);
    expect(css).toMatch(/\.pg-btn-primary/);
    expect(css).toMatch(/background:\s*#4caf50/);
    expect(css).toMatch(
      /\[data-opponent="ai"\]\[data-ai-seat="player1"\] \.pg-status\.player1/
    );
  });
});
