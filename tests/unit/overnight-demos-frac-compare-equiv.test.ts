/**
 * Overnight TOKENMAXX HEAVY — fraction demo compare / equiv / interactive leftovers.
 * Distinct from #192 puzzle fixtures and frac-fact engines. Tests-only.
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

describe('Overnight demos — fraction compare / equiv / interactive', () => {
  it('compare less / greater / equal text paths', () => {
    const root = mount();
    renderFractionDemo(root);
    const a = root.querySelector('#compare-a') as HTMLInputElement;
    const b = root.querySelector('#compare-b') as HTMLInputElement;
    const btn = root.querySelector('#compare-btn') as HTMLButtonElement;

    a.value = '1/4';
    b.value = '3/4';
    btn.click();
    expect(root.querySelector('#comparison-result')?.textContent).toMatch(/less than/i);

    a.value = '5/6';
    b.value = '1/3';
    btn.click();
    expect(root.querySelector('#comparison-result')?.textContent).toMatch(/greater than/i);

    a.value = '2/4';
    b.value = '1/2';
    btn.click();
    expect(root.querySelector('#comparison-result')?.textContent).toMatch(/equals/i);
  });

  it('equivalent finder lists simplified + equivalents; invalid rejects', () => {
    const root = mount();
    renderFractionDemo(root);
    const input = root.querySelector('#equiv-fraction') as HTMLInputElement;
    const btn = root.querySelector('#find-equiv-btn') as HTMLButtonElement;

    input.value = '4/8';
    btn.click();
    expect(root.querySelectorAll('#equivalent-result .equivalent-item').length).toBeGreaterThan(
      0
    );
    expect(root.querySelector('#equivalent-result')?.textContent).toMatch(/Simplified/i);

    input.value = '@@@';
    btn.click();
    expect(root.querySelector('#equivalent-result')?.textContent).toMatch(/Invalid/i);
  });

  it('denominator select re-renders interactive bar; gallery has COMMON items', () => {
    const root = mount();
    renderFractionDemo(root);
    const select = root.querySelector('#denominator-select') as HTMLSelectElement;
    expect(select).toBeTruthy();
    select.value = '8';
    select.dispatchEvent(new Event('change', { bubbles: true }));
    expect(root.querySelector('#interactive-bar')?.children.length).toBeGreaterThan(0);
    expect(root.querySelector('#interactive-value')?.textContent?.length).toBeGreaterThan(0);
    expect(
      (root.querySelector('#fraction-gallery')?.querySelectorAll('.gallery-item').length ?? 0) > 0
    ).toBe(true);
  });
});
