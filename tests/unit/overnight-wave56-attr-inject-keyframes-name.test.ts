/**
 * Overnight TOKENMAXX HEAVY leftovers after #256 — Attr inject keyframes. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectAttributeStyles } from '../../src/core/attributes/attribute-ui';

afterEach(() => document.getElementById('attribute-styles')?.remove());

describe('Wave 56 attr — inject keyframes name', () => {
  it('highlight-piece 0%/100% scale(1) leftover', () => {
    injectAttributeStyles();
    const css = document.getElementById('attribute-styles')?.textContent ?? '';
    expect(css).toContain('@keyframes highlight-piece');
    expect(css).toContain('0%, 100% { transform: scale(1); }');
  });
});
