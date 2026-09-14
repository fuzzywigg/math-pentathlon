/**
 * Overnight HEAVY leftover after #234 — Ramrod valid slot click callback. Tests-only.
 */
import { describe, it, expect, vi } from 'vitest';
import { createInitialState, selectRod, getValidPlacements } from '../../src/games/ramrod/rules';
import { renderBoard } from '../../src/games/ramrod/board-ui';

describe('Wave 52 ramrod — valid slot click', () => {
  it('fires onBoxClick with boxId and slot for a valid placement', () => {
    const open = createInitialState();
    const rodId = open.playerRods.player1[0];
    const placing = selectRod(open, rodId);
    const [first] = getValidPlacements(placing, rodId);
    const onClick = vi.fn();
    const el = renderBoard(placing, onClick);
    const slot = el.querySelector('.ramrod-slot.valid') as HTMLElement;
    expect(slot).toBeTruthy();
    slot.click();
    expect(onClick).toHaveBeenCalled();
    expect(onClick.mock.calls[0][0]).toBeTruthy();
    expect([0, 1]).toContain(onClick.mock.calls[0][1]);
    void first;
  });
});
