/**
 * Overnight TOKENMAXX HEAVY leftovers after #260 — Frac Fact op/equals font-size CSS.
 * Wave52/54 asserted rendered symbols; CSS size never. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectFracFactStyles } from '../../src/games/frac-fact/board-ui';

afterEach(() => {
  document.getElementById('frac-fact-styles')?.remove();
});

describe('Wave 57 frac inject — op equals fontsize', () => {
  it('shares font-size 36px for .frac-operation and .frac-equals leftover', () => {
    injectFracFactStyles();
    const css = document.getElementById('frac-fact-styles')!.textContent || '';
    expect(css).toContain('.frac-operation,');
    expect(css).toContain('.frac-equals');
    expect(css).toContain('font-size: 36px');
  });
});
