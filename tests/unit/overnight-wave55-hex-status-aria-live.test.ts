/**
 * Wave 55 leftover after #250 — Hex status live region. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { createInitialState } from '../../src/games/hex/types';
import { renderStatus } from '../../src/games/hex/board-ui';

afterEach(() => {
  document.body.innerHTML = '';
});

describe('Wave 55 hex — status live', () => {
  it('marks status role and aria-live polite', () => {
    const el = document.createElement('div');
    renderStatus(createInitialState(5), el);
    expect(el.getAttribute('role')).toBe('status');
    expect(el.getAttribute('aria-live')).toBe('polite');
  });
});
