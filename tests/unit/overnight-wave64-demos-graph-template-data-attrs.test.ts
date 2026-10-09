/**
 * Wave 64 leftover after tip/#303 (unit-only) — graph template data attrs.
 * Distinct from wave58–60 demos chrome leftovers. Tests-only.
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

vi.mock('../../src/core/router', () => ({ navigate: vi.fn() }));

import { renderGraphDemo } from '../../src/demos/graph-demo';
import { mountRoot } from './helpers/dom';

beforeEach(() => {
  document.body.innerHTML = '';
});

afterEach(() => {
  document.body.innerHTML = '';
});

describe('Wave 64 demos — graph template data-template catalog', () => {
  it('locks data-template attrs across template buttons', () => {
    const root = mountRoot();
    renderGraphDemo(root);
    expect(
      [...root.querySelectorAll('.template-btn')].map((b) =>
        b.getAttribute('data-template')
      )
    ).toEqual(['grid', 'circular', 'star', 'hex', 'track', 'complete']);
  });
});
