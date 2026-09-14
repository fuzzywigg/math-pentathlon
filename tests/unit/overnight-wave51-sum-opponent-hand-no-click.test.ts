/**
 * Overnight HEAVY leftovers after #234/#235 — Sum opponent hand ignores clicks. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/sum-dominoes/rules';
import { renderHand } from '../../src/games/sum-dominoes/board-ui';

describe('Wave 51 sum — opponent hand no-click', () => {
  it('does not fire callback for player2 hand on p1 turn', () => {
    const base = createInitialState();
    const state = {
      ...base,
      phase: 'placing' as const,
      currentDice: [2, 5] as [number, number],
    };
    const hits: string[] = [];
    const el = renderHand(state, 'player2', (id) => hits.push(id));
    const first = el.querySelector('.sd-hand-domino') as HTMLElement;
    first.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(hits).toEqual([]);
  });
});
