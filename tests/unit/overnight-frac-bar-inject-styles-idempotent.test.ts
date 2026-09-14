/**
 * Overnight TOKENMAXX HEAVY — injectFractionBarStyles idempotency leftover.
 * After #214/#215. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectFractionBarStyles } from '../../src/core/fractions/fraction-bar-ui';

afterEach(() => {
  document.getElementById('fraction-bar-styles')?.remove();
});

describe('Overnight frac-bar — inject styles idempotent', () => {
  it('second inject does not duplicate style node', () => {
    injectFractionBarStyles();
    injectFractionBarStyles();
    expect(document.querySelectorAll('#fraction-bar-styles')).toHaveLength(1);
    expect(document.getElementById('fraction-bar-styles')?.textContent).toContain(
      'fraction-bar-piece'
    );
  });
});
