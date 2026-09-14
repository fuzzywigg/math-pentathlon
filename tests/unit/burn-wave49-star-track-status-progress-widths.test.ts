/**
 * Wave 49 — Star-track progress fill widths. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState, TRACK_LENGTH } from '../../src/games/star-track/types';
import { renderStatus } from '../../src/games/star-track/board-ui';
import { getProgress } from '../../src/games/star-track/rules';

describe('Wave 49 star-track — progress widths', () => {
  it('matches getProgress percentages', () => {
    const s = { ...createInitialState(), player1Position: 6, player2Position: 3 };
    const box = document.createElement('div');
    renderStatus(s, box);
    const fills = box.querySelectorAll('.progress-fill');
    expect((fills[0] as HTMLElement).style.width).toBe(`${getProgress(s, 'player1')}%`);
    expect((fills[1] as HTMLElement).style.width).toBe(`${getProgress(s, 'player2')}%`);
    expect(box.textContent).toContain(`6/${TRACK_LENGTH}`);
  });
});
