/**
 * Wave 56 leftover after #256 — Fraction invalid parse exact mixed-number hint.
 * Distinct from soft /Invalid/i leftover. Tests-only.
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

vi.mock('../../src/core/router', () => ({ navigate: vi.fn() }));

import { renderFractionDemo } from '../../src/demos/fraction-demo';
import { mountRoot } from './helpers/dom';

beforeEach(() => {
  document.body.innerHTML = '';
});

afterEach(() => {
  document.body.innerHTML = '';
});

describe('Wave 56 demos — frac invalid format hint', () => {
  it('surfaces Use format like "3/4" or "1 1/2" guidance', () => {
    const root = mountRoot();
    renderFractionDemo(root);
    (root.querySelector('#fraction-a') as HTMLInputElement).value = 'nope';
    (root.querySelector('#fraction-b') as HTMLInputElement).value = '1/2';
    (root.querySelector('#calculate-btn') as HTMLButtonElement).click();
    expect(root.querySelector('#arithmetic-result')?.textContent).toContain(
      'Use format like "3/4" or "1 1/2"'
    );
  });
});
