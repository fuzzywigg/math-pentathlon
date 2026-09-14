/**
 * Wave 56 leftover after #256 — Attribute SET Select N more card(s) exact ladder.
 * Distinct from soft /Select.*more/i leftovers. Tests-only.
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

describe('Wave 56 demos — attr select card(s) exact', () => {
  it('ladders Select 2 / Select 1 more card(s) before third pick', () => {
    const root = mount();
    renderAttributeDemo(root);
    const cards = setCardWrappers(root);
    expect(cards.length).toBeGreaterThanOrEqual(3);

    cards[0].click();
    expect(root.querySelector('#set-result')?.textContent).toBe(
      'Select 2 more card(s)'
    );

    cards[1].click();
    expect(root.querySelector('#set-result')?.textContent).toBe(
      'Select 1 more card(s)'
    );
  });
});
