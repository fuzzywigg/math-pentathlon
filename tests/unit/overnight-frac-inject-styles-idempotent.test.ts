/**
 * Overnight TOKENMAXX — Frac-Fact inject styles leftover. Tests-only.
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { injectFracFactStyles } from '../../src/games/frac-fact/board-ui';

beforeEach(() => {
  document.getElementById('frac-fact-styles')?.remove();
});

describe('Overnight frac-fact — inject styles', () => {
  it('idempotent single tag', () => {
    injectFracFactStyles();
    injectFracFactStyles();
    expect(document.querySelectorAll('#frac-fact-styles')).toHaveLength(1);
  });
});
