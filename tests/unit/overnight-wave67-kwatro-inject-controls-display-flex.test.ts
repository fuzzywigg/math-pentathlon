/**
 * Wave 67 leftover after tip/#324 — Kwatro controls display flex.
 * Wave63 locks gap/center; deepen display:flex leftover. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectKwaStyles } from '../../src/games/kwatro-sinko/board-ui';

afterEach(() => {
  document.getElementById('kwa-styles')?.remove();
});

describe('Wave 67 kwatro — inject controls display flex', () => {
  it('controls uses display flex', () => {
    injectKwaStyles();
    const css = document.getElementById('kwa-styles')!.textContent || '';
    expect(css).toMatch(/\.kwa-controls\s*\{[\s\S]*?display:\s*flex/);
  });
});
