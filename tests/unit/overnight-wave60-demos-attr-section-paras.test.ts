/**
 * Wave 60 leftover after #290 (unit-only) — Attribute section support paragraphs.
 * Distinct from wave59 h2 catalog leftovers. Tests-only.
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

describe('Wave 60 demos — attr section paras', () => {
  it('exposes exact attribute section support paragraphs', () => {
    const root = mount();
    renderAttributeDemo(root);
    const paras = [...root.querySelectorAll('.demo-section > p')].map(
      (el) => el.textContent ?? ''
    );
    expect(paras).toContain(
      'Click pieces to select them and see their attributes'
    );
    expect(paras).toContain('Select 3 cards to check if they form a valid SET');
    expect(paras).toContain(
      'Select two pieces to compare their attributes'
    );
    expect(paras).toContain('Filter pieces by attribute values');
  });
});
