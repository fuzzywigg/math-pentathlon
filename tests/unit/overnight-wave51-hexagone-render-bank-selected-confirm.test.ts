/**
 * Wave 51 leftover after #233 — Hex-a-Gone selected + Confirm CTA. Tests-only.
 */
import { describe, it, expect, vi } from 'vitest';
import { createInitialState } from '../../src/games/hex-a-gone/types';
import { selectBlock } from '../../src/games/hex-a-gone/rules';
import { renderBoard } from '../../src/games/hex-a-gone/board-ui';

describe('Wave 51 hexagone — selected confirm', () => {
  it('marks selected bank btn and wires Confirm CTA', () => {
    const state = selectBlock(createInitialState(), 'triangle');
    const onConfirm = vi.fn();
    const container = document.createElement('div');
    renderBoard(state, container, undefined, undefined, onConfirm);
    expect(
      container.querySelector('.hex-a-gone-block-btn[data-shape="triangle"]')?.classList.contains(
        'selected'
      )
    ).toBe(true);
    const btn = container.querySelector('.hex-a-gone-confirm-btn') as HTMLButtonElement;
    expect(btn?.textContent).toBe('Confirm (1 block)');
    btn.click();
    expect(onConfirm).toHaveBeenCalled();
  });
});
