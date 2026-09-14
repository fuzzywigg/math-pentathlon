/**
 * Wave 49 — Par55 hand click callback leftover. Tests-only.
 */
import { describe, it, expect, vi } from 'vitest';
import { createInitialState } from '../../src/games/par-55/rules';
import { renderHand } from '../../src/games/par-55/board-ui';

describe('Wave 49 par55 — hand click', () => {
  it('forwards block id when selecting', () => {
    const s = createInitialState();
    const onClick = vi.fn();
    const el = renderHand(s, 'player1', onClick);
    const first = el.querySelector('.par55-hand-block')!;
    first.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(onClick).toHaveBeenCalledWith(s.hands.player1[0]!.id);
  });
});
