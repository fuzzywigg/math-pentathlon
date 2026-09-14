/**
 * Wave 49 — Star-track selectChain two buttons. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/star-track/types';
import { renderBoard } from '../../src/games/star-track/board-ui';

describe('Wave 49 star-track — select buttons', () => {
  it('renders two chain buttons', () => {
    const s = {
      ...createInitialState(),
      phase: 'selectChain' as const,
      drawnChains: [
        { length: 2 as const, id: 1 },
        { length: 5 as const, id: 2 },
      ] as [{ length: 2; id: number }, { length: 5; id: number }],
    };
    const box = document.createElement('div');
    renderBoard(s, box, undefined, () => {});
    expect(box.querySelectorAll('.star-track-chain-btn').length).toBe(2);
  });
});
