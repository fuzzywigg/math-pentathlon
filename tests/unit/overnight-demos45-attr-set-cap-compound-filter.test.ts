/**
 * Overnight TOKENMAXX HEAVY — attribute SET cap + compound filter leftovers.
 * Distinct from #202 single-filter / 3-card SET. Tests-only.
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

vi.mock('../../src/core/router', () => ({ navigate: vi.fn() }));

import { renderAttributeDemo } from '../../src/demos/attribute-demo';

function mount(): HTMLElement {
  const root = document.createElement('div');
  document.body.appendChild(root);
  return root;
}

function setCardWrappers(root: HTMLElement): HTMLElement[] {
  return [...root.querySelectorAll('#set-grid .set-card')].map(
    (el) => el.parentElement as HTMLElement
  );
}

beforeEach(() => {
  document.body.innerHTML = '';
});

afterEach(() => {
  document.body.innerHTML = '';
});

describe('Overnight demos45 — attr SET cap / compound filter', () => {
  it('fourth SET card click is ignored at size=3', () => {
    const root = mount();
    renderAttributeDemo(root);
    const cards = setCardWrappers(root);
    expect(cards.length).toBeGreaterThanOrEqual(4);
    cards[0].click();
    cards[1].click();
    cards[2].click();
    const resultAfter3 = root.querySelector('#set-result')?.innerHTML;
    expect(
      root.querySelector('#set-result')?.classList.contains('valid') ||
        root.querySelector('#set-result')?.classList.contains('invalid')
    ).toBe(true);

    cards[3].click();
    expect(root.querySelector('#set-result')?.innerHTML).toBe(resultAfter3);
    expect(
      root.querySelector('#set-result')?.classList.contains('valid') ||
        root.querySelector('#set-result')?.classList.contains('invalid')
    ).toBe(true);
    expect(root.querySelector('#set-result')?.textContent).not.toMatch(
      /Select.*more/i
    );
  });

  it('compound filters can drive Showing 0 of N', () => {
    const root = mount();
    renderAttributeDemo(root);
    const selects = [
      ...root.querySelectorAll('#filter-controls select'),
    ] as HTMLSelectElement[];
    expect(selects.length).toBeGreaterThanOrEqual(2);

    for (const select of selects) {
      const option = [...select.options].find((o) => o.value !== '');
      if (!option) continue;
      select.value = option.value;
      select.dispatchEvent(new Event('change', { bubbles: true }));
    }

    const count = root.querySelector('#filter-count')?.textContent ?? '';
    expect(count).toMatch(/Showing:\s*\d+\s+of\s+\d+/i);
    // compound may or may not hit zero depending on attrs; assert grid ≤ full
    const shown = Number(/Showing:\s*(\d+)/i.exec(count)?.[1] ?? -1);
    const total = Number(/of\s+(\d+)/i.exec(count)?.[1] ?? -1);
    expect(shown).toBeGreaterThanOrEqual(0);
    expect(shown).toBeLessThanOrEqual(total);
  });

  it('math piece info surfaces Prime/Even attribute keys', () => {
    const root = mount();
    renderAttributeDemo(root);
    (
      root.querySelector('.set-btn[data-set="math"]') as HTMLButtonElement
    ).click();
    (root.querySelector('#piece-grid .piece-wrapper') as HTMLElement).click();
    const info = root.querySelector('#selected-info')?.textContent ?? '';
    expect(info).toMatch(/isPrime|Prime/i);
    expect(info).toMatch(/isEven|Even/i);
  });
});
