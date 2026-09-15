/**
 * Wave 65 leftover after tip/#315 — Kwatro btn transition scoped.
 * Valid-node transition covered; deepen .kwa-btn leftover. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectKwaStyles } from '../../src/games/kwatro-sinko/board-ui';

afterEach(() => {
  document.getElementById('kwa-styles')?.remove();
});

describe('Wave 65 kwatro — inject btn transition scoped', () => {
  it('kwa-btn uses transition all 0.2s', () => {
    injectKwaStyles();
    const css = document.getElementById('kwa-styles')!.textContent || '';
    expect(css).toMatch(/\.kwa-btn\s*\{[\s\S]*?transition:\s*all 0\.2s/);
  });
});
