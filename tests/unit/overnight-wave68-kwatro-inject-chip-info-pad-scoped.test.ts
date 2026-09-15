/**
 * Wave 68 leftover after tip/#336 — Kwatro chip-info pad scoped.
 * Wave63 soft pad; deepen scoped leftover. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectKwaStyles } from '../../src/games/kwatro-sinko/board-ui';

afterEach(() => {
  document.getElementById('kwa-styles')?.remove();
});

describe('Wave 68 kwatro — inject chip info pad scoped', () => {
  it('chip-info uses padding 1rem 2rem', () => {
    injectKwaStyles();
    const css = document.getElementById('kwa-styles')!.textContent || '';
    expect(css).toMatch(/\.kwa-chip-info\s*\{[\s\S]*?padding:\s*1rem 2rem/);
  });
});
