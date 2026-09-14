/**
 * Wave 49 — Star-track chain btn calls onSelectChain(index). Tests-only.
 */
import { describe, it, expect, vi } from 'vitest';
import { createInitialState } from '../../src/games/star-track/types';
import { renderBoard } from '../../src/games/star-track/board-ui';

describe('Wave 49 star-track — select index', () => {
  it('second button selects index 1', () => {
    const cb = vi.fn();
    const s = {
      ...createInitialState(),
      phase: 'selectChain' as const,
      drawnChains: [
        { length: 1 as const, id: 10 },
        { length: 3 as const, id: 11 },
      ] as [{ length: 1; id: number }, { length: 3; id: number }],
    };
    const box = document.createElement('div');
    renderBoard(s, box, undefined, cb);
    const btns = box.querySelectorAll('.star-track-chain-btn');
    (btns[1] as HTMLButtonElement).click();
    expect(cb).toHaveBeenCalledWith(1);
  });
});
