/**
 * Overnight TOKENMAXX HEAVY leftovers after #260 — Frac Fact .frac-btn-primary fill.
 * Wave54 asserted class selector only. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectFracFactStyles } from '../../src/games/frac-fact/board-ui';

afterEach(() => {
  document.getElementById('frac-fact-styles')?.remove();
});

describe('Wave 57 frac inject — btn primary fill', () => {
  it('includes .frac-btn-primary background #2196F3 leftover', () => {
    injectFracFactStyles();
    const css = document.getElementById('frac-fact-styles')!.textContent || '';
    expect(css).toContain('.frac-btn-primary');
    expect(css).toMatch(/\.frac-btn-primary\s*\{[\s\S]*?background:\s*#2196F3/);
  });
});
