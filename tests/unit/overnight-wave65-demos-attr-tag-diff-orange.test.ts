/**
 * Wave 65 leftover after tip/#311–#313 (unit-only) — attr-tag.diff orange.
 * Soft match green elsewhere; lock #ef6c00 leftover. Tests-only.
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

vi.mock('../../src/core/router', () => ({ navigate: vi.fn() }));

import { renderAttributeDemo } from '../../src/demos/attribute-demo';

describe('Wave 65 demos — attr-tag diff orange', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });
  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('locks .attr-tag.diff color #ef6c00 leftover', () => {
    const root = document.createElement('div');
    document.body.appendChild(root);
    renderAttributeDemo(root);
    const css = root.querySelector('style')?.textContent ?? '';
    expect(css).toMatch(/\.attr-tag\.diff\s*\{[^}]*color:\s*#ef6c00/);
  });
});
