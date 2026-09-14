/**
 * Overnight HEAVY leftovers after #236 — Handshake contig leftover chrome mounts. Tests-only.
 * Distinct from remainder/sum/fiar #236 and open fab/core/dice drafts.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { createInitialState } from '../../src/games/contig-60/types';
import {
  renderBoard,
  renderDice,
  renderExpressionSelector,
  injectContigStyles,
} from '../../src/games/contig-60/board-ui';

afterEach(() => document.getElementById('contig-styles')?.remove());

describe('Wave 53 handshake — contig leftover mounts', () => {
  it('mounts board grid, roll chrome, and expr header together', () => {
    injectContigStyles();
    const state = {
      ...createInitialState(),
      currentDice: [1, 2, 3] as [number, number, number],
      phase: 'calculating' as const,
    };
    expect(renderBoard(state, () => undefined).querySelector('.contig-cell-valid')).toBeTruthy();
    expect(renderDice(null, () => undefined, true).querySelector('.contig-roll-btn')).toBeTruthy();
    expect(
      renderExpressionSelector(state, () => undefined, () => undefined).querySelector(
        '.contig-expr-header'
      )
    ).toBeTruthy();
    expect(document.getElementById('contig-styles')).toBeTruthy();
  });
});
