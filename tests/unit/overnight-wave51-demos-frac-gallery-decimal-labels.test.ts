/**
 * Overnight TOKENMAXX HEAVY leftovers after #234 — fraction gallery .decimal labels.
 * Distinct from gallery count smoke. Tests-only.
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

vi.mock('../../src/core/router', () => ({ navigate: vi.fn() }));

import { renderFractionDemo } from '../../src/demos/fraction-demo';

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

describe('Wave 51 demos — frac gallery decimal labels', () => {
  it('each gallery-item has .label and .decimal to 3 places', () => {
    const root = mount();
    renderFractionDemo(root);
    const items = [...root.querySelectorAll('#fraction-gallery .gallery-item')];
    expect(items.length).toBeGreaterThan(0);
    for (const item of items) {
      expect(item.querySelector('.label')?.textContent?.length).toBeGreaterThan(0);
      expect(item.querySelector('.decimal')?.textContent ?? '').toMatch(/^\d\.\d{3}$/);
    }
  });
});
