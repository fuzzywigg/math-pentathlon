/**
 * Wave 68 leftover after tip/#336 — Kwatro player-info fontsize scoped.
 * Wave63 soft fontsize; deepen scoped leftover. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectKwaStyles } from '../../src/games/kwatro-sinko/board-ui';

afterEach(() => {
  document.getElementById('kwa-styles')?.remove();
});

describe('Wave 68 kwatro — inject player info fontsize scoped', () => {
  it('player-info uses font-size 0.9rem', () => {
    injectKwaStyles();
    const css = document.getElementById('kwa-styles')!.textContent || '';
    expect(css).toMatch(/\.kwa-player-info\s*\{[\s\S]*?font-size:\s*0\.9rem/);
  });
});
