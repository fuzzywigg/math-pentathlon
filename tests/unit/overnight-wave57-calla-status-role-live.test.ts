/**
 * Wave 57 leftover after #262 — Calla status role + aria-live.
 * Distinct from wave50 live-region soft checks. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/calla/types';
import { renderStatus } from '../../src/games/calla/board-ui';

describe('Wave 57 calla — status role live', () => {
  it('marks status container role=status aria-live=polite', () => {
    const el = document.createElement('div');
    renderStatus(createInitialState(), el);
    expect(el.getAttribute('role')).toBe('status');
    expect(el.getAttribute('aria-live')).toBe('polite');
    expect(el.querySelector('.calla-status')).toBeTruthy();
  });
});
