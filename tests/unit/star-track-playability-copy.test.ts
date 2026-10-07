/**
 * Playability — mode-aware turn / winner copy (no rules or scoring changes).
 */
import { describe, it, expect, afterEach } from 'vitest';
import { createInitialState, TRACK_LENGTH } from '../../src/games/star-track/types';
import {
  formatPhaseStatusMessage,
  fillChainArea,
  renderStatus,
} from '../../src/games/star-track/board-ui';
import { getPhaseMessage } from '../../src/games/star-track/rules';

afterEach(() => {
  document.body.innerHTML = '';
});

describe('Star Track playability copy', () => {
  it('HvA status uses Your turn / You: not Blue', () => {
    const draw = createInitialState();
    expect(getPhaseMessage(draw)).toMatch(/Blue/);
    expect(formatPhaseStatusMessage(draw, 'human-vs-ai')).toMatch(/^Your turn/);
    expect(formatPhaseStatusMessage(draw, 'human-vs-ai')).not.toMatch(/Blue/);

    const select = { ...draw, phase: 'selectChain' as const };
    expect(formatPhaseStatusMessage(select, 'human-vs-ai')).toMatch(/^You:/);
    expect(formatPhaseStatusMessage(select, 'human-vs-human')).toMatch(/^Blue:/);
  });

  it('renderStatus HvA mid-turn shows Your turn', () => {
    const el = document.createElement('div');
    renderStatus(createInitialState(), el, 'human-vs-ai', false);
    expect(el.querySelector('.status-turn')?.textContent).toMatch(/Your turn/);
    expect(el.textContent).not.toMatch(/Blue's turn/);
  });

  it('game-over banner uses You/AI labels in HvA', () => {
    const host = document.createElement('div');
    fillChainArea(
      host,
      {
        ...createInitialState(),
        phase: 'gameOver',
        winner: 'player1',
        player1Position: TRACK_LENGTH,
      },
      undefined,
      undefined,
      undefined,
      { gameMode: 'human-vs-ai' }
    );
    expect(host.textContent).toMatch(/You reach the star/);
    expect(host.textContent).not.toMatch(/Blue reaches/);
  });
});
