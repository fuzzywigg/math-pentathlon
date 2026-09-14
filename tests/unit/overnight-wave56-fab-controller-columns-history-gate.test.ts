/**
 * Wave 56 leftover after #255/#256 — Fab columns + history omit gate. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { newGameVsHuman } from '../../src/games/fab-a-diffy/game-controller';

afterEach(() => {
  document.body.innerHTML = '';
  document.getElementById('fab-styles')?.remove();
});

describe('Wave 56 fab — controller columns history gate', () => {
  it('mounts left/right columns; omits history until moveHistory non-empty', () => {
    const container = document.createElement('div');
    document.body.appendChild(container);
    const ctrl = newGameVsHuman(container);

    expect(container.querySelector('.fab-left-column')).toBeTruthy();
    expect(container.querySelector('.fab-right-column')).toBeTruthy();
    expect(container.querySelector('.fab-history')).toBeNull();

    const [b1, b2] = [...ctrl.state.fractionBars.keys()];
    const [a1] = [...ctrl.state.answerBars.keys()];
    ctrl.state = {
      ...ctrl.state,
      moveHistory: [
        {
          player: 'player1',
          bar1Id: b1,
          bar2Id: b2,
          operation: 'add',
          resultId: a1,
          moveNumber: 1,
        },
      ],
    };
    ctrl.update();
    expect(container.querySelector('.fab-history')).toBeTruthy();
    expect(container.querySelector('.fab-history-move')).toBeTruthy();
  });
});
