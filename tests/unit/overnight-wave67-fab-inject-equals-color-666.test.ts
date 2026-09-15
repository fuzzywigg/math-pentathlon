/**
 * Wave 67 leftover after tip/#336 — Fab equals color #666.
 * Wave59 placeholder/equals soft; lock .fab-equals leftover. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectFabStyles } from '../../src/games/fab-a-diffy/board-ui';

afterEach(() => {
  document.getElementById('fab-styles')?.remove();
});

describe('Wave 67 fab — inject equals color 666', () => {
  it('equals uses #666', () => {
    injectFabStyles();
    const css = document.getElementById('fab-styles')!.textContent || '';
    expect(css).toMatch(/\.fab-equals\s*\{[\s\S]*?color:\s*#666/);
  });
});
