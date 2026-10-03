/**
 * Wave 58 leftover after #267 (unit-only; #277 closed RED e2e) — Attribute Logic Demo h1.
 * Distinct from set-btn label leftovers. Tests-only.
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

describe('Wave 58 demos — attr h1 exact', () => {
  it('exposes exact Attribute Logic Demo h1', () => {
    const root = mount();
    renderAttributeDemo(root);
    expect(root.querySelector('h1')?.textContent).toBe('Attribute Logic Demo');
  });
});
