/**
 * Wave 59 leftover after #272 — Frac Fact inject answer-box minsize.
 * Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectFracFactStyles } from '../../src/games/frac-fact/board-ui';

afterEach(() => {
  document.getElementById('frac-fact-styles')?.remove();
});

describe('Wave 59 frac — inject answer-box-minsize', () => {
  it('locks leftover CSS token', () => {
    injectFracFactStyles();
    const css = document.getElementById('frac-fact-styles')!.textContent || '';
    expect(css).toMatch(/\.frac-answer-box\s*\{[\s\S]*?min-width:\s*80px/);
    expect(css).toMatch(/\.frac-answer-box\s*\{[\s\S]*?min-height:\s*90px/);
  });
});
