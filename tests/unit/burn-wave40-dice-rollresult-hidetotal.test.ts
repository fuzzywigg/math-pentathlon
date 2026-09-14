/**
 * Wave 40 — renderRollResult showTotal:false leftovers after #176.
 * Tests-only.
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

import { rollMultiple, renderRollResult } from '../../src/core/dice';

beforeEach(() => {
  document.body.innerHTML = '';
  vi.spyOn(Math, 'random').mockReturnValue(0.4);
});
afterEach(() => vi.restoreAllMocks());

describe('Wave 40 dice — rollResult hide total', () => {
  it('showTotal false omits .dice-total; default includes it', () => {
    const result = rollMultiple('d6', 2);
    const hide = document.createElement('div');
    const show = document.createElement('div');
    renderRollResult(result, hide, { showTotal: false });
    renderRollResult(result, show, { showTotal: true });
    expect(hide.querySelector('.dice-total')).toBeNull();
    expect(show.querySelector('.dice-total')).toBeTruthy();
    expect(hide.querySelectorAll('.die-wrapper, .die').length).toBeGreaterThan(0);
  });
});
