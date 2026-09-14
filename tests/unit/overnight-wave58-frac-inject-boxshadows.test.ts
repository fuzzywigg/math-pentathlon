/**
 * Overnight TOKENMAXX HEAVY leftovers after #272 — Frac Fact inject CSS residual.
 * Wave55–57 locked flashier chrome; deepen unsaturated property leftovers. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectFracFactStyles } from '../../src/games/frac-fact/board-ui';

afterEach(() => {
  document.getElementById('frac-fact-styles')?.remove();
});

describe('Wave 58 frac inject — box-shadow catalog', () => {
  it('includes problem / choice-hover / active shadow leftovers', () => {
    injectFracFactStyles();
    const css = document.getElementById('frac-fact-styles')!.textContent || '';
    expect(css).toContain('box-shadow: 0 4px 12px rgba(0,0,0,0.1)');
    expect(css).toContain('box-shadow: 0 4px 8px rgba(0,0,0,0.1)');
    expect(css).toContain('box-shadow: 0 4px 12px rgba(0,0,0,0.15)');
  });
});
