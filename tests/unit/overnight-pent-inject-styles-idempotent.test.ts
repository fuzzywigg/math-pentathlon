/**
 * Overnight HEAVY — Pent injectPentEmInStyles idempotent.
 * Distinct leftover board-ui cold path. Tests-only.
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { injectPentEmInStyles } from '../../src/games/pent-em-in/board-ui';

beforeEach(() => {
  document.getElementById('pent-em-in-styles')?.remove();
});

describe('Overnight pent — inject styles', () => {
  it('injects once; second call keeps single style tag', () => {
    injectPentEmInStyles();
    expect(document.getElementById('pent-em-in-styles')).not.toBeNull();
    injectPentEmInStyles();
    expect(document.querySelectorAll('#pent-em-in-styles').length).toBe(1);
  });
});
