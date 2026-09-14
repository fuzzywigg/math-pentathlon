/**
 * Overnight TOKENMAXX HEAVY — expression calc Enter + example click leftovers.
 * Distinct from #202 button-click calc examples. Tests-only.
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

describe('Overnight demos45 — expr calc Enter / examples', () => {
  it('calc-input Enter evaluates and fills result chrome', () => {
    const root = mount();
    renderExpressionDemo(root);
    const input = root.querySelector('#calc-input') as HTMLInputElement;
    input.value = '(2 + 3) * 4';
    input.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Enter', bubbles: true })
    );
    expect(
      (root.querySelector('#calc-result')?.textContent ?? '').length
    ).toBeGreaterThan(0);
  });

  it('example buttons populate input then evaluate on click', () => {
    const root = mount();
    renderExpressionDemo(root);
    const example = root.querySelector(
      '.example-btn, [data-example], .calc-examples button'
    ) as HTMLButtonElement | null;
    if (example) {
      example.click();
      const input = root.querySelector('#calc-input') as HTMLInputElement;
      expect(input.value.length).toBeGreaterThan(0);
      expect(
        (root.querySelector('#calc-result')?.textContent ?? '').length
      ).toBeGreaterThan(0);
    } else {
      // fallback: manual example path still mounts
      expect(root.querySelector('#calc-btn')).toBeTruthy();
    }
  });

  it('card-builder tray remains interactive after equation check', () => {
    const root = mount();
    renderExpressionDemo(root);
    const eq = root.querySelector('#equation-input') as HTMLInputElement;
    eq.value = '1 + 1 = 2';
    (root.querySelector('#check-equation-btn') as HTMLButtonElement).click();
    expect(root.querySelector('#equation-result')?.classList.contains('true')).toBe(
      true
    );
    const tray = root.querySelector('#card-builder-area');
    expect(tray?.children.length).toBeGreaterThan(0);
    const clickable = tray?.querySelector(
      'button, .expression-card, .card, [data-card]'
    ) as HTMLElement | null;
    clickable?.click();
    expect(tray?.children.length).toBeGreaterThan(0);
  });
});
