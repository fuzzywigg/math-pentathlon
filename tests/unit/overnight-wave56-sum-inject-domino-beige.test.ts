/**
 * Overnight TOKENMAXX HEAVY leftovers after #256 — Sum domino beige CSS. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectSDStyles } from '../../src/games/sum-dominoes/board-ui';

afterEach(() => document.getElementById('sd-styles')?.remove());

describe('Wave 56 sum — inject domino beige', () => {
  it('domino beige face + pip + shadow leftover', () => {
    injectSDStyles();
    const css = document.getElementById('sd-styles')?.textContent ?? '';
    expect(css).toContain('#f5f5dc');
    expect(css).toContain('#111');
    expect(css).toContain('box-shadow: 1px 1px 3px rgba(0,0,0,0.2)');
  });
});
