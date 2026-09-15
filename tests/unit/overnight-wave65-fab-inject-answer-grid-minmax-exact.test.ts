/**
 * Wave 65 leftover after tip/#305 — Fab answer-grid display+minmax exact.
 * Soft minmax token existed; lock display:grid + columns leftover. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectFabStyles } from '../../src/games/fab-a-diffy/board-ui';

afterEach(() => {
  document.getElementById('fab-styles')?.remove();
});

describe('Wave 65 fab — inject answer grid minmax exact', () => {
  it('answer-grid is display grid with auto-fill minmax 90px', () => {
    injectFabStyles();
    const css = document.getElementById('fab-styles')!.textContent || '';
    expect(css).toMatch(
      /\.fab-answer-grid\s*\{[\s\S]*?display:\s*grid[\s\S]*?grid-template-columns:\s*repeat\(auto-fill,\s*minmax\(90px,\s*1fr\)\)/
    );
  });
});
