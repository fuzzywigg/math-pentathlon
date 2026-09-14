/**
 * Wave 56 leftover after #255/#256 — Fab history mounts only with moves. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { newGameVsHuman } from '../../src/games/fab-a-diffy/game-controller';
import type { FabMove } from '../../src/games/fab-a-diffy/types';

afterEach(() => {
  document.body.innerHTML = '';
  document.getElementById('fab-styles')?.remove();
});

describe('Wave 56 fab — history mount gate', () => {
  it('omits history at opening; mounts Move History after synthetic move', () => {
    const container = document.createElement('div');
    document.body.appendChild(container);
    const ctrl = newGameVsHuman(container);
    expect(container.querySelector('.fab-history')).toBeNull();

    const barIds = [...ctrl.state.fractionBars.keys()];
    const answerIds = [...ctrl.state.answerBars.keys()];
    const move: FabMove = {
      player: 'player1',
      bar1Id: barIds[0],
      bar2Id: barIds[1],
      operation: 'add',
      resultId: answerIds[0],
      moveNumber: 1,
    };
    ctrl.state = { ...ctrl.state, moveHistory: [move] };
    ctrl.update();
    expect(container.querySelector('.fab-history')).toBeTruthy();
    expect(
      container.querySelector('.fab-section-header')?.parentElement?.className
    ).toMatch(/fab-history/);
    expect(container.querySelector('.fab-history .fab-section-header')?.textContent).toBe(
      'Move History'
    );
  });
});
