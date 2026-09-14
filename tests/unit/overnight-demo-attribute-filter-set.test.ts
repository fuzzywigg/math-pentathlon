/**
 * Overnight demos leftover — attribute set / compare / filter control matrix.
 * Existing renderAttributeDemo APIs only. Tests-only.
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

vi.mock('../../src/core/router', () => ({
  navigate: vi.fn(),
}));

import { renderAttributeDemo } from '../../src/demos/attribute-demo';

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

describe('Overnight demos — attribute filter/set', () => {
  it('basic↔math set switch remounts piece grid with exclusive selected', () => {
    const root = mount();
    renderAttributeDemo(root);
    const basic = root.querySelector(
      '.set-btn[data-set="basic"]'
    ) as HTMLButtonElement;
    const math = root.querySelector(
      '.set-btn[data-set="math"]'
    ) as HTMLButtonElement;

    const before = root.querySelector('#piece-grid')?.children.length ?? 0;
    expect(before).toBeGreaterThan(0);

    math.click();
    expect(math.classList.contains('selected')).toBe(true);
    expect(basic.classList.contains('selected')).toBe(false);
    expect(
      (root.querySelector('#piece-grid')?.children.length ?? 0) > 0
    ).toBe(true);

    basic.click();
    expect(basic.classList.contains('selected')).toBe(true);
    expect(root.querySelectorAll('.attribute-set-selector .set-btn.selected')).toHaveLength(
      1
    );
  });

  it('piece click fills selected-info; second click still paints', () => {
    const root = mount();
    renderAttributeDemo(root);
    const pieces = root.querySelectorAll('#piece-grid .piece-wrapper');
    expect(pieces.length).toBeGreaterThanOrEqual(2);
    (pieces[0] as HTMLElement).click();
    const first = root.querySelector('#selected-info')?.textContent ?? '';
    expect(first).toMatch(/Piece/i);
    (pieces[1] as HTMLElement).click();
    const second = root.querySelector('#selected-info')?.textContent ?? '';
    expect(second).toMatch(/Piece/i);
    expect(second.length).toBeGreaterThan(0);
  });

  it('SET grid prompts for more cards then validates selection', () => {
    const root = mount();
    renderAttributeDemo(root);
    // SET cards are custom wrappers (not .piece-wrapper) holding SVGs
    const cards = root.querySelectorAll('#set-grid > div > div');
    expect(cards.length).toBeGreaterThanOrEqual(3);

    (cards[0] as HTMLElement).click();
    expect(root.querySelector('#set-result')?.textContent).toMatch(
      /Select .* more/i
    );

    (cards[1] as HTMLElement).click();
    expect(root.querySelector('#set-result')?.textContent).toMatch(
      /Select .* more/i
    );

    (cards[2] as HTMLElement).click();
    const verdict = root.querySelector('#set-result')?.textContent ?? '';
    expect(verdict).toMatch(/Valid SET|Not a valid SET/i);
  });

  it('compare slots fill after two piece picks and show match score', () => {
    const root = mount();
    renderAttributeDemo(root);
    const pieces = root.querySelectorAll('#compare-grid .piece-wrapper');
    expect(pieces.length).toBeGreaterThanOrEqual(2);

    expect(root.querySelector('#comparison-results')?.textContent).toMatch(
      /Select pieces to compare/i
    );

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

  it('third compare click resets slot2 and starts new pair', () => {
    const root = mount();
    renderAttributeDemo(root);
    const pieces = root.querySelectorAll('#compare-grid .piece-wrapper');
    (pieces[0] as HTMLElement).click();
    (pieces[1] as HTMLElement).click();
    expect(
      root.querySelector('#compare-piece-2')?.classList.contains('filled')
    ).toBe(true);

    (pieces[2] as HTMLElement).click();
    expect(
      root.querySelector('#compare-piece-1')?.classList.contains('filled')
    ).toBe(true);
    expect(
      root.querySelector('#compare-piece-2')?.classList.contains('filled')
    ).toBe(false);
    expect(root.querySelector('#comparison-results')?.textContent).toMatch(
      /Select two pieces|Select pieces to compare/i
    );
  });

  it('filter selects narrow showing count below full deck', () => {
    const root = mount();
    renderAttributeDemo(root);
    const countEl = root.querySelector('#filter-count') as HTMLElement;
    expect(countEl.textContent).toMatch(/Showing:\s*\d+ of \d+/);
    const fullMatch = countEl.textContent!.match(/Showing:\s*(\d+) of (\d+)/);
    expect(fullMatch).toBeTruthy();
    const full = Number(fullMatch![2]);
    expect(Number(fullMatch![1])).toBe(full);

    const selects = root.querySelectorAll(
      '#filter-controls select'
    ) as NodeListOf<HTMLSelectElement>;
    expect(selects.length).toBeGreaterThan(0);
    const select = selects[0];
    const option = Array.from(select.options).find((o) => o.value !== '');
    expect(option).toBeTruthy();
    select.value = option!.value;
    select.dispatchEvent(new Event('change', { bubbles: true }));

    const after = countEl.textContent!.match(/Showing:\s*(\d+) of (\d+)/);
    expect(after).toBeTruthy();
    expect(Number(after![1])).toBeLessThanOrEqual(full);
    expect(Number(after![1])).toBeGreaterThan(0);
  });

  it('clearing filter select restores full showing count', () => {
    const root = mount();
    renderAttributeDemo(root);
    const select = root.querySelector(
      '#filter-controls select'
    ) as HTMLSelectElement;
    const option = Array.from(select.options).find((o) => o.value !== '')!;
    select.value = option.value;
    select.dispatchEvent(new Event('change', { bubbles: true }));

    select.value = '';
    select.dispatchEvent(new Event('change', { bubbles: true }));
    const match = root
      .querySelector('#filter-count')!
      .textContent!.match(/Showing:\s*(\d+) of (\d+)/)!;
    expect(Number(match[1])).toBe(Number(match[2]));
  });
});
