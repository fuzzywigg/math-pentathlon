/**
 * Overnight TOKENMAXX HEAVY — dice demo quick-roll matrix leftovers.
 * Tests-only. No product inventing.
 */
import { describe, it, expect, beforeEach, afterEach } from 'vitest';

import { renderDiceDemo } from '../../src/demos/dice-demo';

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

const QUICK_ROLLS = [
  { dice: 'd6', count: '1' },
  { dice: 'd6', count: '2' },
  { dice: 'd6', count: '3' },
  { dice: 'd20', count: '1' },
  { dice: 'd10', count: '2' },
] as const;

describe('Overnight demos — dice quick-roll matrix', () => {
  it('each quick-roll button replaces placeholder with rendered result', () => {
    const root = mount();
    renderDiceDemo(root);
    const result = root.querySelector('#quick-roll-result') as HTMLElement;

    for (const { dice, count } of QUICK_ROLLS) {
      const btn = root.querySelector(
        `.quick-roll-btn[data-dice="${dice}"][data-count="${count}"]`
      ) as HTMLButtonElement;
      expect(btn).toBeTruthy();
      btn.click();
      expect(result.textContent).not.toMatch(/Click a button/i);
      expect(result.innerHTML.length).toBeGreaterThan(0);
    }
  });

  it('repeated rolls on same button keep a non-empty result area', () => {
    const root = mount();
    renderDiceDemo(root);
    const btn = root.querySelector(
      '.quick-roll-btn[data-dice="d6"][data-count="2"]'
    ) as HTMLButtonElement;
    for (let i = 0; i < 8; i++) btn.click();
    expect(
      (root.querySelector('#quick-roll-result') as HTMLElement).innerHTML.length
    ).toBeGreaterThan(0);
  });
});
