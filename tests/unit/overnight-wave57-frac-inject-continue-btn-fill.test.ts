/**
 * Overnight TOKENMAXX HEAVY leftovers after #260 — Frac Fact continue button fill CSS.
 * Wave55 covered hover; base #2196F3 fill unasserted. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectFracFactStyles } from '../../src/games/frac-fact/board-ui';

afterEach(() => {
  document.getElementById('frac-fact-styles')?.remove();
});

describe('Wave 57 frac inject — continue btn fill', () => {
  it('includes .frac-continue-btn background #2196F3 leftover', () => {
    injectFracFactStyles();
    const css = document.getElementById('frac-fact-styles')!.textContent || '';
    expect(css).toContain('.frac-continue-btn');
    expect(css).toMatch(
      /\.frac-continue-btn\s*\{[\s\S]*?background:\s*#2196F3/
    );
  });
});
