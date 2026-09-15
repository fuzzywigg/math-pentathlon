/**
 * Wave 66 leftover after tip/#316 — Fab answer-board white + shadow scoped.
 * Wave65 locked pool/history/op; deepen answer-board leftover. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectFabStyles } from '../../src/games/fab-a-diffy/board-ui';

afterEach(() => {
  document.getElementById('fab-styles')?.remove();
});

describe('Wave 66 fab — inject answer-board white shadow', () => {
  it('answer-board uses white background and rgba shadow', () => {
    injectFabStyles();
    const css = document.getElementById('fab-styles')!.textContent || '';
    expect(css).toMatch(
      /\.fab-answer-board\s*\{[\s\S]*?background:\s*white[\s\S]*?box-shadow:\s*0 2px 8px rgba\(0,0,0,0\.1\)/
    );
  });
});
