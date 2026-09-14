/**
 * Overnight HEAVY leftover after #256 — injectPolyominoStyles selected chrome.
 * Distinct from burn-wave35 pulse-valid / draggable:active pins. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectPolyominoStyles } from '../../src/core/polyomino';

afterEach(() => {
  document.getElementById('polyomino-styles')?.remove();
});

describe('Wave 56 core poly — inject selected css', () => {
  it('selected shape-option rule uses #2196f3 border', () => {
    injectPolyominoStyles();
    const css = document.getElementById('polyomino-styles')?.textContent ?? '';
    expect(css).toContain('.shape-selector .shape-option.selected');
    expect(css).toContain('#2196f3');
    expect(css).toContain('#e3f2fd');
  });
});
