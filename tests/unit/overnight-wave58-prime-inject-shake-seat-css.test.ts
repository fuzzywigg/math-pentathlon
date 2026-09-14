/**
 * Wave 58 leftover after #267 (unit-only; #277 closed RED e2e) — Prime inject shake + primary + AI seat CSS.
 * Distinct from wave56 winner/AI player2 leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { injectPrimeGoldStyles } from '../../src/games/prime-gold/board-ui';

describe('Wave 58 prime — inject shake/seat CSS', () => {
  it('embeds shake keyframes, .pg-btn-primary, and AI seat player1', () => {
    injectPrimeGoldStyles();
    const css = [...document.querySelectorAll('style')]
      .map((s) => s.textContent ?? '')
      .join('\n');
    expect(css).toMatch(/@keyframes shake/);
    expect(css).toMatch(/\.pg-btn-primary/);
    expect(css).toMatch(
      /\[data-ai-seat="player1"\] \.pg-status\.player1/
    );
  });
});
