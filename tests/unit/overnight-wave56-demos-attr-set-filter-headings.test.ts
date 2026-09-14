/**
 * Wave 56 leftover after #256 — Attribute demo set/filter heading chrome.
 * Distinct from wave51 filter-any restore leftover. Tests-only.
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

describe('Wave 56 demos — attr set/filter headings', () => {
  it('exposes Basic/Math set labels, Filtering h2, and SET tip copy', () => {
    const root = mount();
    renderAttributeDemo(root);
    expect(
      root.querySelector('.set-btn[data-set="basic"]')?.textContent
    ).toMatch(/Basic \(Shape\/Color\/Size\)/);
    expect(
      root.querySelector('.set-btn[data-set="math"]')?.textContent
    ).toMatch(/Math Properties/);
    expect(
      [...root.querySelectorAll('h2')].some((h) =>
        /Attribute Filtering/.test(h.textContent ?? '')
      )
    ).toBe(true);
    expect(root.querySelector('#valid-sets-info')?.textContent ?? '').toMatch(
      /ALL the same or ALL different/
    );
  });
});
