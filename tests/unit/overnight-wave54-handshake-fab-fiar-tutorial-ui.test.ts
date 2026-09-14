/**
 * Wave 54 leftover after #240/#241 — fab × fiar tutorial + board-ui handshake. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { fabADiffyTutorial } from '../../src/games/fab-a-diffy/tutorial';
import { fiarTutorial } from '../../src/games/fiar/tutorial';
import { createInitialState as fabInit } from '../../src/games/fab-a-diffy/rules';
import { createInitialState as fiarInit } from '../../src/games/fiar/types';
import { renderFractionBarPool, renderScores } from '../../src/games/fab-a-diffy/board-ui';
import { renderBoard, getPlayerColor } from '../../src/games/fiar/board-ui';

describe('Wave 54 handshake — fab × fiar leftovers', () => {
  it('tutorial ids unique; both engines mount residual chrome', () => {
    expect(fabADiffyTutorial.id).not.toBe(fiarTutorial.id);
    expect(fabADiffyTutorial.steps.length).toBeGreaterThanOrEqual(7);
    expect(fiarTutorial.steps.length).toBeGreaterThanOrEqual(7);
    const pool = renderFractionBarPool(fabInit(), () => undefined);
    const scores = renderScores(fabInit());
    const svg = renderBoard(fiarInit(), () => undefined);
    expect(pool.querySelector('.fab-bar-wrapper')).toBeTruthy();
    expect(scores.querySelector('.fab-score-p1')).toBeTruthy();
    expect(svg.querySelector('[data-node-id]')).toBeTruthy();
    expect(getPlayerColor('player1')).not.toBe(getPlayerColor('player2'));
  });
});
