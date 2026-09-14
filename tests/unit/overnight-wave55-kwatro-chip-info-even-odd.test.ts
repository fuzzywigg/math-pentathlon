/**
 * Wave 55 leftover after #250 — Kwatro chip info exact Even/Odd lists. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/kwatro-sinko/rules';
import { renderChipInfo } from '../../src/games/kwatro-sinko/board-ui';

describe('Wave 55 kwatro — chip info', () => {
  it('Blue Even and Red Odd full lists', () => {
    const el = renderChipInfo(createInitialState());
    expect(el.querySelector('.kwa-player-info.player1')?.textContent).toMatch(
      /Blue \(Even\):/
    );
    expect(el.querySelector('.kwa-player-info.player1')?.textContent).toMatch(
      /0, 2, 4, 6, 8/
    );
    expect(el.querySelector('.kwa-player-info.player2')?.textContent).toMatch(
      /Red \(Odd\):/
    );
    expect(el.querySelector('.kwa-player-info.player2')?.textContent).toMatch(
      /1, 3, 5, 7, 9/
    );
  });
});
