/**
 * Wave 55 leftover after #250 — Stars hand "'s Hand" label + card title attrs. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/stars-bars/rules';
import { renderPlayerHand } from '../../src/games/stars-bars/board-ui';

describe('Wave 55 stars — hand chrome', () => {
  it("Blue's Hand label and attribute title", () => {
    const el = renderPlayerHand(createInitialState(), 'player1', () => undefined);
    expect(el.querySelector('.stars-hand-label.player1')?.textContent).toMatch(
      /Blue's Hand/
    );
    const title = (el.querySelector('.stars-card') as HTMLElement).title;
    expect(title).toMatch(/^(small|large) (thin|thick) \w+ \w+$/);
  });
});
