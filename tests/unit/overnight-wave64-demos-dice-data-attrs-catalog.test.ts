/**
 * Wave 64 leftover after tip/#303 (unit-only) — dice data attrs catalog.
 * Distinct from wave58–60 demos chrome leftovers. Tests-only.
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

describe('Wave 64 demos — dice data-dice/count catalog', () => {
  it('locks data-dice + data-count attrs on quick-roll buttons', () => {
    const root = mount();
    renderDiceDemo(root);
    const btns = [...root.querySelectorAll('.quick-roll-btn')];
    expect(
      btns.map((b) => [
        b.getAttribute('data-dice'),
        b.getAttribute('data-count'),
      ])
    ).toEqual([
      ['d6', '1'],
      ['d6', '2'],
      ['d6', '3'],
      ['d20', '1'],
      ['d10', '2'],
    ]);
  });
});
