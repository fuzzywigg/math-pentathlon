/**
 * Wave 61 leftover after #301 (unit-only) — Dice idle roll span exact style attr.
 * Distinct from wave56 Click a button to roll text leftover. Tests-only.
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

vi.mock('../../src/core/router', () => ({ navigate: vi.fn() }));

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

describe('Wave 61 demos — dice idle italic style', () => {
  it('idle quick-roll span locks exact color + italic style attr', () => {
    const root = mount();
    renderDiceDemo(root);
    const span = root.querySelector('#quick-roll-result span') as HTMLElement;
    expect(span?.getAttribute('style')).toBe('color: #999; font-style: italic;');
    expect(span?.textContent).toBe('Click a button to roll');
  });
});
