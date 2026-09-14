/**
 * Overnight TOKENMAXX HEAVY — attribute forced Valid SET! / invalid reason leftovers.
 * Distinct from #220 demos45 OR-ish SET + open calla/juggle/ramrod drafts. Tests-only.
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

describe('Overnight demos46 — attr forced SET verdicts', () => {
  it('cards 0,1,2 form a forced Valid SET! with .valid class', () => {
    const root = mount();
    renderAttributeDemo(root);
    const cards = setCardWrappers(root);
    expect(cards.length).toBeGreaterThanOrEqual(3);
    cards[0].click();
    cards[1].click();
    cards[2].click();
    const result = root.querySelector('#set-result');
    expect(result?.classList.contains('valid')).toBe(true);
    expect(result?.textContent).toMatch(/✓\s*Valid SET!/);
  });

  it('cards 0,1,3 force invalid Count reason string', () => {
    const root = mount();
    renderAttributeDemo(root);
    const cards = setCardWrappers(root);
    expect(cards.length).toBeGreaterThanOrEqual(4);
    cards[0].click();
    cards[1].click();
    cards[3].click();
    const result = root.querySelector('#set-result');
    expect(result?.classList.contains('invalid')).toBe(true);
    expect(result?.textContent).toMatch(/Not a valid SET/);
    expect(result?.textContent).toMatch(
      /Count:\s*not all same, not all different/i
    );
  });

  it('math→basic switch clears selection back to placeholder', () => {
    const root = mount();
    renderAttributeDemo(root);
    (
      root.querySelector('.set-btn[data-set="math"]') as HTMLButtonElement
    ).click();
    (root.querySelector('#piece-grid .piece-wrapper') as HTMLElement).click();
    expect(root.querySelector('#selected-info')?.textContent).toMatch(
      /Piece|isPrime|Prime/i
    );

    (
      root.querySelector('.set-btn[data-set="basic"]') as HTMLButtonElement
    ).click();
    expect(root.querySelector('#selected-info')?.textContent).toMatch(
      /Click a piece to see its attributes/i
    );
  });
});
