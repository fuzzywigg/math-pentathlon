/**
 * Wave 68 leftover after tip/#336 — Kwatro btn pad scoped.
 * Wave63 soft pad; deepen scoped leftover. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectKwaStyles } from '../../src/games/kwatro-sinko/board-ui';

afterEach(() => {
  document.getElementById('kwa-styles')?.remove();
});

describe('Wave 68 kwatro — inject btn pad scoped', () => {
  it('btn uses padding 0.75rem 1.5rem', () => {
    injectKwaStyles();
    const css = document.getElementById('kwa-styles')!.textContent || '';
    expect(css).toMatch(/\.kwa-btn\s*\{[\s\S]*?padding:\s*0\.75rem 1\.5rem/);
  });
});
