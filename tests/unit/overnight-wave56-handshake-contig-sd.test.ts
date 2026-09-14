/**
 * Wave 56 leftover after #243 — Handshake contig × sum-dominoes residual mounts.
 * Distinct from wave53 contig-only handshake and open #257–#268 slices. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { createInitialState as createContig } from '../../src/games/contig-60/types';
import {
  renderBoard as renderContigBoard,
  renderDice as renderContigDice,
  injectContigStyles,
} from '../../src/games/contig-60/board-ui';
import { createInitialState as createSum } from '../../src/games/sum-dominoes/rules';
import {
  renderBoard as renderSumBoard,
  renderDice as renderSumDice,
  injectSDStyles,
} from '../../src/games/sum-dominoes/board-ui';
import { contig60Tutorial } from '../../src/games/contig-60/tutorial';
import { sumDominoesTutorial } from '../../src/games/sum-dominoes/tutorial';
import { initGame as initContig, newGameVsHuman } from '../../src/games/contig-60/game-controller';
import { initGame as initSum } from '../../src/games/sum-dominoes/game-controller';

afterEach(() => {
  document.body.innerHTML = '';
  document.getElementById('contig-styles')?.remove();
  document.getElementById('sd-styles')?.remove();
});

describe('Wave 56 handshake — contig × sum residual', () => {
  it('mounts leftover chrome for both engines with unique tutorial ids', () => {
    injectContigStyles();
    injectSDStyles();
    const contig = {
      ...createContig(),
      currentDice: [1, 2, 3] as [number, number, number],
      phase: 'calculating' as const,
    };
    expect(renderContigBoard(contig, () => undefined).querySelector('.contig-cell')).toBeTruthy();
    expect(renderContigDice(null, () => undefined, true).querySelector('.contig-roll-btn')).toBeTruthy();
    expect(renderSumBoard(createSum(), () => undefined).querySelector('.sd-board, .sd-cell, .sd-domino')).toBeTruthy();
    expect(renderSumDice(null, () => undefined, true).querySelector('.sd-roll-btn')).toBeTruthy();
    expect(document.getElementById('contig-styles')).toBeTruthy();
    expect(document.getElementById('sd-styles')).toBeTruthy();
    expect(contig60Tutorial.id).not.toBe(sumDominoesTutorial.id);

    const cBoard = document.createElement('div');
    const cStatus = document.createElement('div');
    document.body.append(cBoard, cStatus);
    initContig(cBoard, cStatus);
    newGameVsHuman();
    expect(cBoard.querySelector('.contig-scores, .contig-dice-area')).toBeTruthy();

    const sRoot = document.createElement('div');
    document.body.appendChild(sRoot);
    initSum(sRoot, false);
    expect(sRoot.querySelector('.sd-status, .sd-game-area')).toBeTruthy();
  });
});
