/**
 * Wave 61 leftover after #301 (unit-only) — Attribute visible ← Back button text.
 * Distinct from wave56 back-btn aria-label matrix leftover. Tests-only.
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

vi.mock('../../src/core/router', () => ({ navigate: vi.fn() }));

import { renderAttributeDemo } from '../../src/demos/attribute-demo';

function mount(): HTMLElement {
  const root = document.createElement('div');
  document.body.appendChild(root);
  return root;
}

beforeEach(() => {
  document.body.innerHTML = '';
});

afterEach(() => {
  document.body.innerHTML = '';
});

describe('Wave 61 demos — attr back-btn text', () => {
  it('mounts exact ← Back visible label on #back-btn', () => {
    const root = mount();
    renderAttributeDemo(root);
    expect(root.querySelector('#back-btn')?.textContent).toBe('← Back');
  });
});
