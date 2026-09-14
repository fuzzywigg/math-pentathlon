/**
 * Wave 64 leftover after tip/#303 — Hex-a-Gone Pattern Block Bank mount. Tests-only.
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { createInitialState } from '../../src/games/hex-a-gone/types';
import { renderBoard } from '../../src/games/hex-a-gone/board-ui';

describe('Wave 64 hexagone — bank title mount', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('mounts Pattern Block Bank title text', () => {
    const el = document.createElement('div');
    renderBoard(createInitialState(), el, undefined, undefined, () => {});
    const title = el.querySelector('.hex-a-gone-bank-title');
    expect(title?.textContent).toBe('Pattern Block Bank');
  });
});
