/**
 * Overnight TOKENMAXX HEAVY — attribute demo compare slots + filter leftovers.
 * Tests-only. No product inventing.
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

describe('Overnight demos — attribute compare + filter', () => {
  it('two compare-grid picks fill slots and show match score', () => {
    const root = mount();
    renderAttributeDemo(root);
    const pieces = root.querySelectorAll('#compare-grid .piece-wrapper');
    expect(pieces.length).toBeGreaterThanOrEqual(2);
    (pieces[0] as HTMLElement).click();
    expect(root.querySelector('#compare-piece-1')?.classList.contains('filled')).toBe(
      true
    );
    (pieces[1] as HTMLElement).click();
    expect(root.querySelector('#compare-piece-2')?.classList.contains('filled')).toBe(
      true
    );
    const results = root.querySelector('#comparison-results')?.textContent ?? '';
    expect(results).toMatch(/Match Score/i);
    expect(results).toMatch(/Same:|Different:/i);
  });

  it('filter select narrows filtered-grid and updates count', () => {
    const root = mount();
    renderAttributeDemo(root);
    const before =
      root.querySelector('#filtered-grid')?.querySelectorAll('.piece-wrapper').length ?? 0;
    expect(before).toBeGreaterThan(0);

    const select = root.querySelector(
      '#filter-controls select'
    ) as HTMLSelectElement;
    expect(select).toBeTruthy();
    const option = [...select.options].find((o) => o.value !== '');
    expect(option).toBeTruthy();
    select.value = option!.value;
    select.dispatchEvent(new Event('change', { bubbles: true }));

    const after =
      root.querySelector('#filtered-grid')?.querySelectorAll('.piece-wrapper').length ?? 0;
    expect(after).toBeLessThanOrEqual(before);
    expect(root.querySelector('#filter-count')?.textContent).toMatch(/\d+/);
  });

  it('math set switch refreshes piece-grid without crashing', () => {
    const root = mount();
    renderAttributeDemo(root);
    (root.querySelector('.set-btn[data-set="math"]') as HTMLButtonElement).click();
    expect(root.querySelector('.set-btn[data-set="math"]')?.classList.contains('selected')).toBe(
      true
    );
    expect(
      (root.querySelector('#piece-grid')?.querySelectorAll('.piece-wrapper').length ?? 0) > 0
    ).toBe(true);
    (root.querySelector('#piece-grid .piece-wrapper') as HTMLElement).click();
    expect(root.querySelector('#selected-info')?.textContent).toMatch(/Piece|attr|color|shape|size|value/i);
  });
});
