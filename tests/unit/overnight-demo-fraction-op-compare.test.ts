/**
 * Overnight demos leftover — fraction arithmetic / compare / equiv / denom edges.
 * Existing renderFractionDemo APIs only. Tests-only.
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

vi.mock('../../src/core/router', () => ({
  navigate: vi.fn(),
}));

import { renderFractionDemo } from '../../src/demos/fraction-demo';

function mount(): HTMLElement {
  const root = document.createElement('div');
  document.body.appendChild(root);
  return root;
}

beforeEach(() => {
  document.body.innerHTML = '';
  vi.clearAllMocks();
});

afterEach(() => {
  document.body.innerHTML = '';
  vi.restoreAllMocks();
});

describe('Overnight demos — fraction op/compare edges', () => {
  it('mount auto-calculates default 3/4 + 1/2 with visual bar', () => {
    const root = mount();
    renderFractionDemo(root);
    const result = root.querySelector('#arithmetic-result')?.textContent ?? '';
    expect(result.length).toBeGreaterThan(0);
    expect(root.querySelector('#result-bar')).toBeTruthy();
  });

  it('all four ops produce distinct final-result chrome', () => {
    const root = mount();
    renderFractionDemo(root);
    const a = root.querySelector('#fraction-a') as HTMLInputElement;
    const b = root.querySelector('#fraction-b') as HTMLInputElement;
    a.value = '2/3';
    b.value = '1/4';

    const seen = new Set<string>();
    for (const op of ['add', 'subtract', 'multiply', 'divide'] as const) {
      (
        root.querySelector(`.op-btn[data-op="${op}"]`) as HTMLButtonElement
      ).click();
      (root.querySelector('#calculate-btn') as HTMLButtonElement).click();
      const text =
        root.querySelector('#arithmetic-result .final-result')?.textContent ??
        root.querySelector('#arithmetic-result')?.textContent ??
        '';
      expect(text.length).toBeGreaterThan(0);
      seen.add(text);
    }
    expect(seen.size).toBeGreaterThanOrEqual(3);
  });

  it('invalid arithmetic inputs show red format guidance', () => {
    const root = mount();
    renderFractionDemo(root);
    (root.querySelector('#fraction-a') as HTMLInputElement).value = 'not-a-frac';
    (root.querySelector('#fraction-b') as HTMLInputElement).value = '1/2';
    (root.querySelector('#calculate-btn') as HTMLButtonElement).click();
    expect(root.querySelector('#arithmetic-result')?.textContent).toMatch(
      /Invalid fraction/i
    );
  });

  it('compare equals / less / greater paths', () => {
    const root = mount();
    renderFractionDemo(root);
    const a = root.querySelector('#compare-a') as HTMLInputElement;
    const b = root.querySelector('#compare-b') as HTMLInputElement;
    const btn = root.querySelector('#compare-btn') as HTMLButtonElement;

    a.value = '1/2';
    b.value = '2/4';
    btn.click();
    expect(root.querySelector('#comparison-result')?.textContent).toMatch(
      /equals/i
    );

    a.value = '1/3';
    b.value = '1/2';
    btn.click();
    expect(root.querySelector('#comparison-result')?.textContent).toMatch(
      /less than/i
    );

    a.value = '3/4';
    b.value = '1/2';
    btn.click();
    expect(root.querySelector('#comparison-result')?.textContent).toMatch(
      /greater than/i
    );
  });

  it('invalid compare input shows red error', () => {
    const root = mount();
    renderFractionDemo(root);
    (root.querySelector('#compare-a') as HTMLInputElement).value = 'xx';
    (root.querySelector('#compare-btn') as HTMLButtonElement).click();
    expect(root.querySelector('#comparison-result')?.textContent).toMatch(
      /Invalid/i
    );
  });

  it('equivalent finder lists simplified + /denom items', () => {
    const root = mount();
    renderFractionDemo(root);
    // initial find runs on mount for 1/2
    expect(
      root.querySelectorAll('#equivalent-result .equivalent-item').length
    ).toBeGreaterThan(0);

    (root.querySelector('#equiv-fraction') as HTMLInputElement).value = '2/4';
    (root.querySelector('#find-equiv-btn') as HTMLButtonElement).click();
    const items = root.querySelectorAll(
      '#equivalent-result .equivalent-item'
    );
    expect(items.length).toBeGreaterThan(0);
    expect(root.querySelector('#equivalent-result')?.textContent).toMatch(
      /Simplified|\//i
    );
  });

  it('invalid equiv input shows red error', () => {
    const root = mount();
    renderFractionDemo(root);
    (root.querySelector('#equiv-fraction') as HTMLInputElement).value = 'bad';
    (root.querySelector('#find-equiv-btn') as HTMLButtonElement).click();
    expect(root.querySelector('#equivalent-result')?.textContent).toMatch(
      /Invalid/i
    );
  });

  it('denominator select re-renders interactive bar value', () => {
    const root = mount();
    renderFractionDemo(root);
    const select = root.querySelector(
      '#denominator-select'
    ) as HTMLSelectElement;
    const value = root.querySelector('#interactive-value') as HTMLElement;
    expect(value.textContent).toMatch(/1\/4|1\/\d+/);

    select.value = '8';
    select.dispatchEvent(new Event('change', { bubbles: true }));
    expect(value.textContent).toMatch(/\/8/);
    expect(
      root.querySelector('#interactive-bar')?.children.length
    ).toBeGreaterThan(0);

    select.value = '2';
    select.dispatchEvent(new Event('change', { bubbles: true }));
    expect(value.textContent).toMatch(/\/2/);
  });

  it('gallery mounts common fractions with labels', () => {
    const root = mount();
    renderFractionDemo(root);
    const items = root.querySelectorAll('#fraction-gallery .gallery-item');
    expect(items.length).toBeGreaterThan(0);
    expect(items[0].querySelector('.label')?.textContent?.length).toBeGreaterThan(
      0
    );
  });
});
