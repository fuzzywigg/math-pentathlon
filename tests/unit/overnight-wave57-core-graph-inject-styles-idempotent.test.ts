/**
 * Overnight HEAVY leftover after #264 — injectGraphStyles idempotent + CSS content.
 * Distinct from wave56 poly inject; overnight-core inject without content assert. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectGraphStyles } from '../../src/core/graph';

afterEach(() => {
  document.getElementById('graph-styles')?.remove();
});

describe('Wave 57 core graph-ui — inject styles', () => {
  it('inject twice leaves one style tag with .graph-node rule', () => {
    injectGraphStyles();
    injectGraphStyles();
    const tags = document.querySelectorAll('#graph-styles');
    expect(tags).toHaveLength(1);
    expect(tags[0].textContent).toMatch(/\.graph-node/);
  });
});
