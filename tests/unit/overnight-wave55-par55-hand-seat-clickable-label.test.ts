/**
 * Wave 55 leftover after #250 — Par 55 hand seat class, clickable gate, S/T labels. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState, selectBlock } from '../../src/games/par-55/rules';
import { renderHand } from '../../src/games/par-55/board-ui';

describe('Wave 55 par55 — hand chrome', () => {
  it('player1 seat, opening clickable, placing none, ST labels', () => {
    const s = createInitialState();
    const p1 = renderHand(s, 'player1', () => undefined);
    expect(p1.classList.contains('par55-hand-player1')).toBe(true);
    expect(p1.querySelectorAll('.clickable').length).toBe(s.hands.player1.length);
    const p2 = renderHand(s, 'player2', () => undefined);
    expect(p2.classList.contains('par55-hand-player2')).toBe(true);
    const placing = selectBlock(s, s.hands.player1[0]!.id);
    const after = renderHand(placing, 'player1', () => undefined);
    expect(after.querySelectorAll('.clickable')).toHaveLength(0);
    const label = p1.querySelector('.par55-block-label')?.textContent ?? '';
    const b = s.hands.player1[0]!;
    expect(label).toBe(`${b.size[0].toUpperCase()}/${b.thickness[0].toUpperCase()}`);
  });
});
