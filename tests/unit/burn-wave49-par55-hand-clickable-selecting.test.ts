/**
 * Wave 49 — Par55 hand clickable in selectingBlock leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/par-55/rules';
import { renderHand } from '../../src/games/par-55/board-ui';

describe('Wave 49 par55 — hand clickable', () => {
  it('marks current seat blocks clickable when selecting', () => {
    const s = createInitialState();
    expect(s.phase).toBe('selectingBlock');
    expect(s.currentPlayer).toBe('player1');
    const el = renderHand(s, 'player1', () => undefined);
    const blocks = el.querySelectorAll('.par55-hand-block');
    expect(blocks.length).toBe(s.hands.player1.length);
    expect([...blocks].every((b) => b.classList.contains('clickable'))).toBe(true);
    expect([...blocks].every((b) => b.getAttribute('aria-disabled') !== 'true')).toBe(true);
  });
});
