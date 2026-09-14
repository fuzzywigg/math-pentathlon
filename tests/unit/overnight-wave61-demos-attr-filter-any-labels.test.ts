/**
 * Wave 61 leftover after #301 (unit-only) — Attribute filter Any + Shape/Color/Size labels.
 * Distinct from wave51 filter Any restore grid leftover. Tests-only.
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

describe('Wave 61 demos — attr filter Any labels', () => {
  it('mounts Shape/Color/Size labels with Any first options', () => {
    const root = mount();
    renderAttributeDemo(root);
    const labels = [
      ...root.querySelectorAll('#filter-controls .filter-group label'),
    ].map((el) => el.textContent ?? '');
    expect(labels).toEqual(['Shape', 'Color', 'Size']);
    const firstOptions = [
      ...root.querySelectorAll('#filter-controls .filter-group select'),
    ].map((sel) => (sel as HTMLSelectElement).options[0]?.textContent ?? '');
    expect(firstOptions).toEqual(['Any', 'Any', 'Any']);
  });
});
