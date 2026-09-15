/**
 * Wave 68 leftover after tip/#336 — Kwatro valid-node transition scoped.
 * Wave63 soft transition; deepen scoped leftover. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectKwaStyles } from '../../src/games/kwatro-sinko/board-ui';

afterEach(() => {
  document.getElementById('kwa-styles')?.remove();
});

describe('Wave 68 kwatro — inject valid node transition scoped', () => {
  it('valid-node uses transition all 0.2s', () => {
    injectKwaStyles();
    const css = document.getElementById('kwa-styles')!.textContent || '';
    expect(css).toMatch(/\.kwa-valid-node\s*\{[\s\S]*?transition:\s*all 0\.2s/);
  });
});
