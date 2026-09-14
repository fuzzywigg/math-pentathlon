/**
 * Wave 33 — injectGraphStyles idempotence + CSS content contracts.
 * Deepens wave 22 single idempotent check. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';

import { injectGraphStyles } from '../../src/core/graph/graph-ui';

afterEach(() => {
  document.querySelectorAll('#graph-styles').forEach((el) => el.remove());
});

describe('Wave 33 graph-ui-styles — inject contracts', () => {
  it('injects exactly one style tag even after many calls', () => {
    for (let i = 0; i < 8; i++) injectGraphStyles();
    expect(document.querySelectorAll('#graph-styles')).toHaveLength(1);
    expect(document.getElementById('graph-styles')?.tagName).toBe('STYLE');
  });

  it('CSS contains required selectors and keyframes', () => {
    injectGraphStyles();
    const css = document.getElementById('graph-styles')?.textContent ?? '';
    for (const needle of [
      '.graph-view',
      '.graph-node',
      '.graph-node:hover',
      '.graph-node.highlighted',
      '@keyframes pulse-node',
      '.edges line',
      '.graph-container',
      'user-select: none',
    ]) {
      expect(css).toContain(needle);
    }
  });

  it('re-inject after manual removal creates a fresh tag', () => {
    injectGraphStyles();
    document.getElementById('graph-styles')?.remove();
    expect(document.getElementById('graph-styles')).toBeNull();
    injectGraphStyles();
    expect(document.getElementById('graph-styles')).toBeTruthy();
  });
});
