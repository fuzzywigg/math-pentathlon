/**
 * Overnight HEAVY leftovers after #234 — Sum Dominoes hand click callback. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/sum-dominoes/rules';
import { renderHand } from '../../src/games/sum-dominoes/board-ui';

describe('Wave 51 sum — hand click', () => {
  it('fires onDominoClick for current player in placing phase', () => {
    const base = createInitialState();
    const state = {
      ...base,
      phase: 'placing' as const,
      currentDice: [3, 4] as [number, number],
    };
    const hits: string[] = [];
    const el = renderHand(state, 'player1', (id) => hits.push(id));
    const first = el.querySelector('.sd-hand-domino') as HTMLElement;
    expect(first).toBeTruthy();
    first.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(hits).toEqual([state.hands.player1[0]!.id]);
  });
});
