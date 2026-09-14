/**
 * Wave 55 leftover after #250 — Hex-a-Gone opening bank prompt (no selection). Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { createInitialState } from '../../src/games/hex-a-gone/types';
import { renderBoard } from '../../src/games/hex-a-gone/board-ui';

afterEach(() => {
  document.body.innerHTML = '';
});

describe('Wave 55 hexagone — opening bank', () => {
  it('Pattern Block Bank prompt and no confirm', () => {
    const el = document.createElement('div');
    renderBoard(createInitialState(), el);
    expect(el.querySelector('.hex-a-gone-bank-title')?.textContent).toBe(
      'Pattern Block Bank'
    );
    expect(el.querySelector('.hex-a-gone-selection-status')?.textContent).toBe(
      'Select 1-3 different blocks from the bank'
    );
    expect(el.querySelector('.hex-a-gone-confirm-btn')).toBeNull();
  });
});
