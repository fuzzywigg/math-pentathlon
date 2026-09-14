/**
 * Wave 64 leftover after tip/#303 (unit-only) — attr select 3 more idle deselect.
 * Distinct from wave58–60 demos chrome leftovers. Tests-only.
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

describe('Wave 64 demos — attr Select 3 more after deselect', () => {
  it('deselecting sole SET card restores Select 3 more card(s)', () => {
    const root = mount();
    renderAttributeDemo(root);
    const cards = [
      ...root.querySelectorAll('#set-grid > div > div'),
    ] as HTMLElement[];
    expect(cards.length).toBeGreaterThan(0);
    cards[0].click();
    expect(root.querySelector('#set-result')?.textContent).toBe(
      'Select 2 more card(s)'
    );
    cards[0].click();
    expect(root.querySelector('#set-result')?.textContent).toBe(
      'Select 3 more card(s)'
    );
  });
});
