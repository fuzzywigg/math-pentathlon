/**
 * Wave 56 leftover after #256 — Hex-a-Gone coverage "cells filled" phrasing. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { createInitialState } from '../../src/games/hex-a-gone/types';
import { renderStatus } from '../../src/games/hex-a-gone/board-ui';

afterEach(() => {
  document.body.innerHTML = '';
});

describe('Wave 56 hexagone — coverage copy', () => {
  it('opening Board: 0/N cells filled exact', () => {
    const s = createInitialState();
    const el = document.createElement('div');
    renderStatus(s, el);
    expect(el.querySelector('.hex-a-gone-coverage')?.textContent).toBe(
      `Board: 0/${s.board.length} cells filled`
    );
  });
});
