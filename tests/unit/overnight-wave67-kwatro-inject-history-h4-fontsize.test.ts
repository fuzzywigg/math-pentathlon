/**
 * Wave 67 leftover after tip/#324 — Kwatro inject history h4 font-size.
 * Wave63 locked margin/color; deepen 0.9rem leftover. Tests-only.
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { injectKwaStyles } from '../../src/games/kwatro-sinko/board-ui';

describe('Wave 67 kwatro — inject history h4 fontsize', () => {
  beforeEach(() => {
    document.getElementById('kwa-styles')?.remove();
  });

  it('injects .kwa-history h4 font-size 0.9rem', () => {
    injectKwaStyles();
    const css = document.getElementById('kwa-styles')?.textContent ?? '';
    expect(css).toMatch(/\.kwa-history h4\s*\{[^}]*font-size:\s*0\.9rem/);
  });
});
