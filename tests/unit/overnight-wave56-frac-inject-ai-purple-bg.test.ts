/**
 * Overnight TOKENMAXX HEAVY leftovers after #256 — Frac Fact AI purple chrome bg.
 * Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectFracFactStyles } from '../../src/games/frac-fact/board-ui';

afterEach(() => {
  document.getElementById('frac-fact-styles')?.remove();
});

describe('Wave 56 frac inject — AI purple bg', () => {
  it('includes #ede9fe leftover', () => {
    injectFracFactStyles();
    const css = document.getElementById('frac-fact-styles')!.textContent || '';
    expect(css).toContain('#ede9fe');
  });
});
