/**
 * Wave 49 — Kings supply You/AI vs P1/P2. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialGameState } from '../../src/games/kings-quadraphages/game-state';
import { renderStatus } from '../../src/games/kings-quadraphages/board-ui';

describe('Wave 49 kings — supply labels', () => {
  it('switches labels by mode', () => {
    const s = createInitialGameState();
    const ai = document.createElement('div');
    renderStatus(s, ai, 'human-vs-ai');
    expect(ai.querySelector('.supply-p1')?.textContent).toMatch(/You/);
    expect(ai.querySelector('.supply-p2')?.textContent).toMatch(/AI/);
    const hvh = document.createElement('div');
    renderStatus(s, hvh, 'human-vs-human');
    expect(hvh.querySelector('.supply-p1')?.textContent).toMatch(/P1/);
    expect(hvh.querySelector('.supply-p2')?.textContent).toMatch(/P2/);
  });
});
