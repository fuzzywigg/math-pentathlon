/**
 * Wave 59 leftover after #272 — Frac Fact inject choice-btn border #ddd.
 * Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectFracFactStyles } from '../../src/games/frac-fact/board-ui';

afterEach(() => {
  document.getElementById('frac-fact-styles')?.remove();
});

describe('Wave 59 frac — inject choice-border-ddd', () => {
  it('locks leftover CSS token', () => {
    injectFracFactStyles();
    const css = document.getElementById('frac-fact-styles')!.textContent || '';
    expect(css).toMatch(/\.frac-choice-btn\s*\{[\s\S]*?border:\s*2px solid #ddd/);
  });
});
