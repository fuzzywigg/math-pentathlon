/**
 * Wave 60 leftover after #290 (unit-only) — Expr calc-input placeholder exact.
 * Distinct from wave59 calc/check labels leftover. Tests-only.
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

vi.mock('../../src/core/router', () => ({ navigate: vi.fn() }));

import { renderExpressionDemo } from '../../src/demos/expression-demo';
import { mountRoot } from './helpers/dom';

beforeEach(() => {
  document.body.innerHTML = '';
});

afterEach(() => {
  document.body.innerHTML = '';
});

describe('Wave 60 demos — expr calc placeholder', () => {
  it('calc and equation inputs expose exact e.g. placeholders', () => {
    const root = mountRoot();
    renderExpressionDemo(root);
    expect(
      (root.querySelector('#calc-input') as HTMLInputElement).placeholder
    ).toBe('e.g., 2 + 3 * 4');
    expect(
      (root.querySelector('#equation-input') as HTMLInputElement).placeholder
    ).toBe('e.g., 2 + 2 = 4');
  });
});
