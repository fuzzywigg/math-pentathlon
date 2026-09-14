/**
 * Overnight TOKENMAXX HEAVY — expression demo challenge pick + card builder leftovers.
 * Tests-only. No product inventing.
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

vi.mock('../../src/core/router', () => ({ navigate: vi.fn() }));

import { renderExpressionDemo } from '../../src/demos/expression-demo';

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

describe('Overnight demos — expression challenges + builder', () => {
  it('challenge-grid cards reveal active-challenge target + builder', () => {
    const root = mount();
    renderExpressionDemo(root);
    const cards = root.querySelectorAll('#challenge-grid .challenge-card');
    expect(cards.length).toBeGreaterThanOrEqual(4);
    const active = root.querySelector('#active-challenge') as HTMLElement;
    expect(active.style.display).toBe('none');

    (cards[0] as HTMLElement).click();
    expect(active.style.display).toBe('block');
    expect(
      (root.querySelector('#challenge-target')?.innerHTML.length ?? 0) > 0
    ).toBe(true);
    expect(root.querySelector('#expression-builder .expression-builder, #expression-builder .card-tray')).toBeTruthy();

    (cards[1] as HTMLElement).click();
    expect(active.style.display).toBe('block');
  });

  it('card-builder-area mounts interactive tray slots', () => {
    const root = mount();
    renderExpressionDemo(root);
    const area = root.querySelector('#card-builder-area') as HTMLElement;
    expect(area.children.length).toBeGreaterThan(0);
    expect(area.querySelector('.card-tray, .expression-builder, .expression-slot')).toBeTruthy();
  });
});
