/**
 * Wave 68 leftover after tip/#336 — Kwatro selectable-chip transition 0.15s scoped.
 * Wave63 soft transition; deepen scoped leftover. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectKwaStyles } from '../../src/games/kwatro-sinko/board-ui';

afterEach(() => {
  document.getElementById('kwa-styles')?.remove();
});

describe('Wave 68 kwatro — inject selectable chip transition scoped', () => {
  it('selectable-chip uses transition all 0.15s', () => {
    injectKwaStyles();
    const css = document.getElementById('kwa-styles')!.textContent || '';
    expect(css).toMatch(/\.kwa-selectable-chip\s*\{[\s\S]*?transition:\s*all 0\.15s/);
  });
});
