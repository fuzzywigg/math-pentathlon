/**
 * Overnight TOKENMAXX HEAVY leftovers after #260 — Frac Fact correct feedback CSS colors.
 * Wave56 locked incorrect feedback; correct #e8f5e9/#2e7d32 unasserted. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectFracFactStyles } from '../../src/games/frac-fact/board-ui';

afterEach(() => {
  document.getElementById('frac-fact-styles')?.remove();
});

describe('Wave 57 frac inject — feedback correct css', () => {
  it('includes .frac-feedback.correct green leftover', () => {
    injectFracFactStyles();
    const css = document.getElementById('frac-fact-styles')!.textContent || '';
    expect(css).toContain('.frac-feedback.correct');
    expect(css).toContain('background: #e8f5e9');
    expect(css).toContain('color: #2e7d32');
  });
});
