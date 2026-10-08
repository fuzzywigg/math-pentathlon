/**
 * Wave 64 leftover after tip/#303 (unit-only) — expr challenge grid minmax.
 * Distinct from wave58–60 demos chrome leftovers. Tests-only.
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

describe('Wave 64 demos — expr challenge-grid minmax', () => {
  it('locks challenge-grid auto-fill minmax(140px, 1fr)', () => {
    const root = mountRoot();
    renderExpressionDemo(root);
    const css = root.querySelector('style')?.textContent ?? '';
    expect(css).toContain(
      'grid-template-columns: repeat(auto-fill, minmax(140px, 1fr))'
    );
  });
});
