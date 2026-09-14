/**
 * Wave 57 leftover after #263 — Hex HvA status-mode vs AI. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { createInitialState } from '../../src/games/hex/types';
import { renderStatus } from '../../src/games/hex/board-ui';

afterEach(() => {
  document.body.innerHTML = '';
});

describe('Wave 57 hex — vs AI mode', () => {
  it('HvA renderStatus shows status-mode vs AI', () => {
    const el = document.createElement('div');
    renderStatus(createInitialState(5), el, 'human-vs-ai');
    expect(el.querySelector('.status-mode')?.textContent).toBe('vs AI');
  });
});
