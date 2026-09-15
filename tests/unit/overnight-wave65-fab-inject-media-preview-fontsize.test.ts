/**
 * Wave 65 leftover after tip/#305 — Fab mobile preview font-size 1.2rem.
 * Soft @media 768 + 1fr; lock operation-preview font leftover. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectFabStyles } from '../../src/games/fab-a-diffy/board-ui';

afterEach(() => {
  document.getElementById('fab-styles')?.remove();
});

describe('Wave 65 fab — inject media preview fontsize', () => {
  it('mobile media shrinks operation-preview to 1.2rem', () => {
    injectFabStyles();
    const css = document.getElementById('fab-styles')!.textContent || '';
    expect(css).toMatch(
      /@media \(max-width: 768px\)\s*\{[\s\S]*?\.fab-operation-preview\s*\{[\s\S]*?font-size:\s*1\.2rem/
    );
  });
});
