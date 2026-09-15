/**
 * Wave 66 leftover after tip/#316 — Fab main-layout columns+gap scoped.
 * Wave55/59 soft 1fr 300px + 1.5rem; lock selector leftover. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectFabStyles } from '../../src/games/fab-a-diffy/board-ui';

afterEach(() => {
  document.getElementById('fab-styles')?.remove();
});

describe('Wave 66 fab — inject main-layout columns gap scoped', () => {
  it('main-layout is 1fr 300px with 1.5rem gap', () => {
    injectFabStyles();
    const css = document.getElementById('fab-styles')!.textContent || '';
    expect(css).toMatch(
      /\.fab-main-layout\s*\{[\s\S]*?grid-template-columns:\s*1fr 300px[\s\S]*?gap:\s*1\.5rem/
    );
  });
});
