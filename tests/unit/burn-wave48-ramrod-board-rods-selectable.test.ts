/**
 * Wave 48 — Ramrod renderPlayerRods selectable current seat. Tests-only.
 */
import { describe, it, expect, vi } from 'vitest';
import { createInitialState } from '../../src/games/ramrod/rules';
import { renderPlayerRods } from '../../src/games/ramrod/board-ui';

describe('Wave 48 ramrod — player rods', () => {
  it('current seat rods selectable; opponent not', () => {
    const s = createInitialState();
    const onClick = vi.fn();
    const p1 = renderPlayerRods(s, 'player1', onClick);
    expect(p1.querySelectorAll('.selectable').length).toBe(s.playerRods.player1.length);
    const first = p1.querySelector('.selectable') as HTMLElement;
    first.click();
    expect(onClick).toHaveBeenCalled();
    const p2 = renderPlayerRods(s, 'player2', onClick);
    expect(p2.querySelectorAll('.selectable').length).toBe(0);
  });
});
