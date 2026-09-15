/**
 * Wave 67 leftover after tip/#336 — Fab answer-board white + shadow.
 * Wave65 pool/history white; lock answer-board chrome leftover. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectFabStyles } from '../../src/games/fab-a-diffy/board-ui';

afterEach(() => {
  document.getElementById('fab-styles')?.remove();
});

describe('Wave 67 fab — inject answer-board white shadow', () => {
  it('answer-board is white with 0 2px 8px shadow', () => {
    injectFabStyles();
    const css = document.getElementById('fab-styles')!.textContent || '';
    expect(css).toMatch(
      /\.fab-answer-board\s*\{[\s\S]*?background:\s*white[\s\S]*?box-shadow:\s*0 2px 8px rgba\(0,0,0,0\.1\)/
    );
  });
});
