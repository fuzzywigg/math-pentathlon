/**
 * Overnight HEAVY leftover after #234 — injectFracFactStyles AI chrome CSS content.
 * Idempotent id tests only; CSS content never sampled. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectFracFactStyles } from '../../src/games/frac-fact/board-ui';

afterEach(() => {
  document.getElementById('frac-fact-styles')?.remove();
});

describe('Wave 52 frac — inject AI chrome CSS', () => {
  it('includes data-opponent=ai and data-ai-seat selectors', () => {
    injectFracFactStyles();
    const css = document.getElementById('frac-fact-styles')?.textContent ?? '';
    expect(css).toContain('[data-opponent="ai"]');
    expect(css).toContain('data-ai-seat');
  });
});
