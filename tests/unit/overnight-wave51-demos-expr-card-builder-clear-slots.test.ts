/**
 * Overnight TOKENMAXX HEAVY leftovers after #234 — card-builder Clear All slot wipe.
 * Distinct from challenge Clear All / mount-only leftovers. Tests-only.
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

describe('Wave 51 demos — expr card-builder Clear All', () => {
  it('placed card returns to tray after Clear All', () => {
    const root = mount();
    renderExpressionDemo(root);
    const area = root.querySelector('#card-builder-area') as HTMLElement;
    expect(area).toBeTruthy();

    const trayBefore = area.querySelectorAll('.card-tray .expression-card').length;
    const card = area.querySelector('.card-tray .expression-card') as HTMLElement;
    const slot = area.querySelector('.expression-slot') as HTMLElement;
    expect(card && slot).toBeTruthy();
    card.click();
    slot.click();
    expect(area.querySelectorAll('.expression-slot .expression-card').length).toBe(
      1
    );
    expect(area.querySelectorAll('.card-tray .expression-card').length).toBe(
      trayBefore - 1
    );

    const clear = [...area.querySelectorAll('button')].find((b) =>
      /Clear All/i.test(b.textContent ?? '')
    ) as HTMLButtonElement;
    expect(clear).toBeTruthy();
    clear.click();
    expect(area.querySelectorAll('.expression-slot .expression-card').length).toBe(
      0
    );
    expect(area.querySelectorAll('.card-tray .expression-card').length).toBe(
      trayBefore
    );
  });
});
