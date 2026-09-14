/**
 * Wave 61 leftover after #301 (unit-only) — Dice quick-roll italic gray placeholder style.
 * Distinct from wave56 quickroll placeholder text leftover. Tests-only.
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

describe('Wave 61 demos — dice quickroll placeholder style', () => {
  it('idle quick-roll span uses color #999 italic inline style', () => {
    const root = mount();
    renderDiceDemo(root);
    const span = root.querySelector('#quick-roll-result span') as HTMLElement;
    expect(span?.textContent).toBe('Click a button to roll');
    expect(span?.getAttribute('style') ?? '').toContain('color: #999');
    expect(span?.getAttribute('style') ?? '').toContain('font-style: italic');
  });
});
