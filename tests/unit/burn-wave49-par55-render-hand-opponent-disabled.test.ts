/**
 * Wave 49 leftover after #221/#226/#227 — Par55 opponent hand not clickable. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/par-55/rules';
import { renderHand } from '../../src/games/par-55/board-ui';

describe('Wave 49 par55 — opponent hand', () => {
  it('marks opponent blocks aria-disabled', () => {
    const state = createInitialState();
    const el = renderHand(state, 'player2', () => undefined);
    const blocks = el.querySelectorAll('.par55-hand-block');
    expect(blocks.length).toBeGreaterThan(0);
    expect([...blocks].every((b) => b.getAttribute('aria-disabled') === 'true')).toBe(true);
  });
});
