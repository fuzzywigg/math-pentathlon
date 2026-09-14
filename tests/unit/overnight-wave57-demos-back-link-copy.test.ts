/**
 * Wave 57 leftover after #267 — Demo back-link exact copy.
 * Distinct from wave56 back-btn aria matrix leftover. Tests-only.
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

vi.mock('../../src/core/router', () => ({ navigate: vi.fn() }));

import { renderDiceDemo } from '../../src/demos/dice-demo';
import { renderAlignmentDemo } from '../../src/demos/alignment-demo';

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

describe('Wave 57 demos — back-link copy', () => {
  it('dice and align back-links read Back to Games', () => {
    const dice = mount();
    renderDiceDemo(dice);
    expect(dice.querySelector('.back-link')?.textContent ?? '').toMatch(
      /Back to Games/
    );

    document.body.innerHTML = '';
    const align = mount();
    renderAlignmentDemo(align);
    expect(align.querySelector('.back-link')?.textContent ?? '').toMatch(
      /Back to Games/
    );
  });
});
