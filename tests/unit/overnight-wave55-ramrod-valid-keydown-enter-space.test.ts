/**
 * Wave 55 leftover after #250 — Ramrod valid slot Enter/Space activate.
 * Shared board-a11y leftover; not contig #243 cell keys. Tests-only.
 */
import { describe, it, expect, vi } from 'vitest';
import { createInitialState, getValidPlacements, selectRod } from '../../src/games/ramrod/rules';
import { renderBoard } from '../../src/games/ramrod/board-ui';

describe('Wave 55 ramrod — valid keydown', () => {
  it('Enter and Space both fire onBoxClick', () => {
    const open = createInitialState();
    const rodId = open.playerRods.player1[0];
    const placing = selectRod(open, rodId);
    expect(getValidPlacements(placing, rodId).length).toBeGreaterThan(0);

    const onClick = vi.fn();
    const el = renderBoard(placing, onClick);
    const slot = el.querySelector('.ramrod-slot.valid') as HTMLElement;
    expect(slot).toBeTruthy();

    slot.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    expect(onClick).toHaveBeenCalledTimes(1);

    slot.dispatchEvent(new KeyboardEvent('keydown', { key: ' ', bubbles: true }));
    expect(onClick).toHaveBeenCalledTimes(2);
    expect(onClick.mock.calls[0][0]).toBe(onClick.mock.calls[1][0]);
  });
});
