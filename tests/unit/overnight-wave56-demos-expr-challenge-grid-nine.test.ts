/**
 * Wave 56 leftover after #256 — Expression challenge grid catalogs 9 cards.
 * Distinct from soft length>0 challenge leftovers. Tests-only.
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

describe('Wave 56 demos — expr challenge grid nine', () => {
  it('mounts exactly 9 challenge cards (5 make-ten + 4 twenty-four)', () => {
    const root = mountRoot();
    renderExpressionDemo(root);
    expect(root.querySelectorAll('#challenge-grid .challenge-card').length).toBe(
      9
    );
  });
});
