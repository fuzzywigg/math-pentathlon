/**
 * Wave 65 leftover after tip/#311–#313 (unit-only) — attr compare-slot dashed border.
 * Soft set-result / data-attrs in #311; lock dashed #ccc leftover. Tests-only.
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

vi.mock('../../src/core/router', () => ({ navigate: vi.fn() }));

import { renderAttributeDemo } from '../../src/demos/attribute-demo';

describe('Wave 65 demos — attr compare dashed', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });
  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('locks .compare-slot 2px dashed #ccc leftover', () => {
    const root = document.createElement('div');
    document.body.appendChild(root);
    renderAttributeDemo(root);
    const css = root.querySelector('style')?.textContent ?? '';
    expect(css).toMatch(/\.compare-slot\s*\{[^}]*border:\s*2px dashed #ccc/);
  });
});
