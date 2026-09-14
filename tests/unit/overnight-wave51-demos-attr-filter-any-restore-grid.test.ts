/**
 * Overnight TOKENMAXX HEAVY leftovers after #234 — attribute filter Any restores grid.
 * Distinct from filter-narrow count leftovers. Tests-only.
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

describe('Wave 51 demos — attr filter Any restore', () => {
  it('empty filter value remounts full filtered-grid size', () => {
    const root = mount();
    renderAttributeDemo(root);
    const select = root.querySelector(
      '#filter-controls select'
    ) as HTMLSelectElement;
    const full =
      root.querySelector('#filtered-grid')?.querySelectorAll('.piece-wrapper')
        .length ?? 0;
    expect(full).toBeGreaterThan(0);

    const option = [...select.options].find((o) => o.value !== '');
    expect(option).toBeTruthy();
    select.value = option!.value;
    select.dispatchEvent(new Event('change', { bubbles: true }));
    const narrowed =
      root.querySelector('#filtered-grid')?.querySelectorAll('.piece-wrapper')
        .length ?? 0;
    expect(narrowed).toBeLessThanOrEqual(full);

    select.value = '';
    select.dispatchEvent(new Event('change', { bubbles: true }));
    const restored =
      root.querySelector('#filtered-grid')?.querySelectorAll('.piece-wrapper')
        .length ?? 0;
    expect(restored).toBe(full);
    expect(root.querySelector('#filter-count')?.textContent ?? '').toMatch(
      new RegExp(`Showing:\\s*${full}\\s+of\\s+${full}`)
    );
  });
});
