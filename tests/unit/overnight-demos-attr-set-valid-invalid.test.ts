/**
 * Overnight TOKENMAXX HEAVY — attribute demo SET valid/invalid leftovers.
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

/** SET cards are SVGs; click listeners live on parent wrappers. */
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

describe('Overnight demos — attribute SET selection', () => {
  it('selecting fewer than 3 cards leaves set-result without valid/invalid class', () => {
    const root = mount();
    renderAttributeDemo(root);
    const cards = setCardWrappers(root);
    expect(cards.length).toBeGreaterThanOrEqual(3);
    cards[0].click();
    cards[1].click();
    const result = root.querySelector('#set-result');
    expect(result?.classList.contains('valid')).toBe(false);
    expect(result?.classList.contains('invalid')).toBe(false);
    expect(result?.textContent).toMatch(/Select.*more/i);
  });

  it('selecting 3 cards marks result valid or invalid with tip chrome', () => {
    const root = mount();
    renderAttributeDemo(root);
    const cards = setCardWrappers(root);
    expect(cards.length).toBeGreaterThanOrEqual(3);
    cards[0].click();
    cards[1].click();
    cards[2].click();
    const result = root.querySelector('#set-result');
    expect(
      result?.classList.contains('valid') || result?.classList.contains('invalid')
    ).toBe(true);
    expect(result?.textContent?.length).toBeGreaterThan(0);
    expect(root.querySelector('#valid-sets-info')?.textContent).toMatch(
      /SET|same|different/i
    );
  });
});
