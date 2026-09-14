/**
 * Wave 49 — Par55 disabled hand ignores click leftover. Tests-only.
 */
import { describe, it, expect, vi } from 'vitest';
import { createInitialState } from '../../src/games/par-55/rules';
import { renderHand } from '../../src/games/par-55/board-ui';

describe('Wave 49 par55 — disabled click noop', () => {
  it('does not fire callback for opponent hand', () => {
    const s = createInitialState();
    const onClick = vi.fn();
    const el = renderHand(s, 'player2', onClick);
    el.querySelector('.par55-hand-block')!.dispatchEvent(
      new MouseEvent('click', { bubbles: true })
    );
    expect(onClick).not.toHaveBeenCalled();
  });
});
