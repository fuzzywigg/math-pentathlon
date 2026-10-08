/**
 * Wave 59 leftover after #281 (unit-only) — Expression Find Solutions button label.
 * Distinct from wave56 No solutions found leftovers. Tests-only.
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

describe('Wave 59 demos — expr Find Solutions label', () => {
  it('exposes exact Find Solutions button text', () => {
    const root = mountRoot();
    renderExpressionDemo(root);
    expect(root.querySelector('#solve-btn')?.textContent).toBe('Find Solutions');
  });
});
