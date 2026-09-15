/**
 * Wave 68 leftover after tip/#336 — Hex-a-Gone bank title Pattern Block Bank. Tests-only.
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { createInitialState } from '../../src/games/hex-a-gone/types';
import { renderBoard } from '../../src/games/hex-a-gone/board-ui';

describe('Wave 68 hexagone — UI bank title exact', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('renderBoard locks Pattern Block Bank title', () => {
    const root = document.createElement('div');
    document.body.appendChild(root);
    renderBoard(createInitialState(), root);
    expect(root.textContent).toContain('Pattern Block Bank');
  });
});
