/**
 * Wave 64 leftover after tip/#303 (unit-only) — expr data expr catalog.
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

describe('Wave 64 demos — expr data-expr catalog', () => {
  it('locks exact data-expr attrs on example buttons', () => {
    const root = mountRoot();
    renderExpressionDemo(root);
    expect(
      [...root.querySelectorAll('.example-btn')].map((b) =>
        b.getAttribute('data-expr')
      )
    ).toEqual(['2 + 3 * 4', '(2 + 3) * 4', '10 / 2 - 3', '2 ^ 3 + 1']);
  });
});
