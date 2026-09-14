/**
 * Overnight HEAVY — Frac Fact injectFracFactStyles idempotent.
 * Distinct leftover board-ui cold path. Tests-only.
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { injectFracFactStyles } from '../../src/games/frac-fact/board-ui';

beforeEach(() => {
  document.getElementById('frac-fact-styles')?.remove();
});

describe('Overnight frac — inject styles', () => {
  it('injects once and second call is no-op', () => {
    injectFracFactStyles();
    expect(document.getElementById('frac-fact-styles')).not.toBeNull();
    const countBefore = document.querySelectorAll('#frac-fact-styles').length;
    injectFracFactStyles();
    expect(document.querySelectorAll('#frac-fact-styles').length).toBe(
      countBefore
    );
  });
});
