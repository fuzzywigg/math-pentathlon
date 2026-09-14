/**
 * Overnight HEAVY leftovers after #234 — Stars valid cell + preview title. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState, selectCard } from '../../src/games/stars-bars/rules';
import { renderBoard } from '../../src/games/stars-bars/board-ui';

describe('Wave 51 stars — valid preview title', () => {
  it('marks valid cells and sets +N points title when card selected', () => {
    const base = createInitialState();
    const card = base.playerHands.player1[0]!;
    const state = selectCard(base, card.id);
    const el = renderBoard(state, () => undefined);
    const valids = el.querySelectorAll('.stars-cell.valid');
    expect(valids.length).toBeGreaterThan(0);
    const titled = [...valids].filter((c) =>
      (c as HTMLElement).title.includes('points')
    );
    expect(titled.length).toBe(valids.length);
    expect((titled[0] as HTMLElement).title).toMatch(/^\+\d+ points$/);
  });
});
