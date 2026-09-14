/**
 * Overnight TOKENMAXX HEAVY leftovers after #256 — Frac Fact op/equals font-size.
 * Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectFracFactStyles } from '../../src/games/frac-fact/board-ui';

afterEach(() => {
  document.getElementById('frac-fact-styles')?.remove();
});

describe('Wave 56 frac inject — op equals fontsize', () => {
  it('operation/equals use font-size 36px leftover', () => {
    injectFracFactStyles();
    const css = document.getElementById('frac-fact-styles')!.textContent || '';
    expect(css).toContain('.frac-operation,');
    expect(css).toContain('.frac-equals');
    expect(css).toMatch(/\.frac-operation,[\s\S]*?\.frac-equals\s*\{[\s\S]*?font-size:\s*36px/);
  });
});
