/**
 * Overnight TOKENMAXX HEAVY — attribute SET reselect + piece info leftovers.
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

function setCardWrappers(root: HTMLElement): HTMLElement[] {
  return [...root.querySelectorAll('#set-grid .set-card')].map(
    (el) => el.parentElement as HTMLElement
  );
}

describe('Overnight demos — attribute reselect leftovers', () => {
  it('deselecting a SET card after a trio clears valid/invalid chrome', () => {
    const root = mount();
    renderAttributeDemo(root);
    const cards = setCardWrappers(root);
    expect(cards.length).toBeGreaterThanOrEqual(3);
    cards[0].click();
    cards[1].click();
    cards[2].click();
    const mid = root.querySelector('#set-result')?.className ?? '';
    expect(mid).toMatch(/valid|invalid/);
    // toggle first card off → size < 3
    cards[0].click();
    const after = root.querySelector('#set-result');
    expect(after?.classList.contains('valid')).toBe(false);
    expect(after?.classList.contains('invalid')).toBe(false);
    expect(after?.textContent).toMatch(/Select.*more/i);
  });

  it('basic piece grid click shows attribute details in selected-info', () => {
    const root = mount();
    renderAttributeDemo(root);
    const pieces = root.querySelectorAll('#piece-grid .piece-wrapper');
    expect(pieces.length).toBeGreaterThan(1);
    (pieces[0] as HTMLElement).click();
    const info1 = root.querySelector('#selected-info')?.textContent ?? '';
    (pieces[1] as HTMLElement).click();
    const info2 = root.querySelector('#selected-info')?.textContent ?? '';
    expect(info1.length).toBeGreaterThan(0);
    expect(info2.length).toBeGreaterThan(0);
  });
});
