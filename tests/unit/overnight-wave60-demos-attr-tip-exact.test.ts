/**
 * Wave 60 leftover after #290 (unit-only) — Attribute tip exact full sentence.
 * Distinct from wave56 Tip:/ALL the same soft match. Tests-only.
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

describe('Wave 60 demos — attr tip exact', () => {
  it('mounts exact Tip full sentence on valid-sets-info', () => {
    const root = mount();
    renderAttributeDemo(root);
    expect(root.querySelector('#valid-sets-info')?.textContent).toBe(
      'Tip: A valid SET requires each attribute to be either ALL the same or ALL different across the 3 cards.'
    );
  });
});
