/**
 * Wave 39 — renderRollResult empty rolls leftovers after #172/#173.
 * Tests-only.
 */
import { describe, it, expect, beforeEach, afterEach } from 'vitest';

import { renderRollResult, type RollResult } from '../../src/core/dice';

beforeEach(() => {
  document.body.innerHTML = '';
});
afterEach(() => {
  document.body.innerHTML = '';
});

const empty: RollResult = { id: 'empty', rolls: [], total: 0 };

describe('Wave 39 dice-ui — rollresult empty', () => {
  it('empty rolls with showTotal true still paints total 0', () => {
    const root = document.createElement('div');
    document.body.appendChild(root);
    renderRollResult(empty, root, { showTotal: true });
    expect(root.className).toBe('dice-roll-result');
    expect(root.querySelectorAll('.die-wrapper')).toHaveLength(0);
    expect(root.querySelector('.total-value')?.textContent).toBe('0');
  });

  it('empty rolls with showTotal false omits total', () => {
    const root = document.createElement('div');
    document.body.appendChild(root);
    renderRollResult(empty, root, { showTotal: false });
    expect(root.querySelector('.dice-total')).toBeNull();
  });

  it('selectable without onDieClick does not throw', () => {
    const root = document.createElement('div');
    document.body.appendChild(root);
    expect(() =>
      renderRollResult(empty, root, { selectable: true })
    ).not.toThrow();
  });
});
