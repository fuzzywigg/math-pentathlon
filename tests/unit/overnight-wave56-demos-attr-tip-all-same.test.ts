/**
 * Wave 56 leftover after #256 — Attribute tip ALL the same / ALL different copy.
 * Distinct from soft SET|same|different leftover. Tests-only.
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

describe('Wave 56 demos — attr tip ALL same', () => {
  it('mounts Tip with ALL the same or ALL different wording', () => {
    const root = mount();
    renderAttributeDemo(root);
    const tip = root.querySelector('#valid-sets-info')?.textContent ?? '';
    expect(tip).toMatch(/Tip:/);
    expect(tip).toMatch(/ALL the same or ALL different/);
  });
});
