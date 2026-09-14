/**
 * Wave 49 — Star-track chain button HTML structure. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/star-track/types';
import { renderBoard } from '../../src/games/star-track/board-ui';

describe('Wave 49 star-track — chain HTML', () => {
  it('includes chain-links and chain-length', () => {
    const s = {
      ...createInitialState(),
      phase: 'selectChain' as const,
      drawnChains: [
        { length: 4 as const, id: 1 },
        { length: 2 as const, id: 2 },
      ] as [{ length: 4; id: number }, { length: 2; id: number }],
    };
    const box = document.createElement('div');
    renderBoard(s, box, undefined, () => {});
    const btn = box.querySelector('.star-track-chain-btn');
    expect(btn?.querySelector('.chain-links')).toBeTruthy();
    expect(btn?.querySelector('.chain-length')?.textContent).toBe('4');
  });
});
