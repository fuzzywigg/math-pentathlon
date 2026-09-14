/**
 * Wave 53 leftover after #235 — Fab board-ui opening mounts handshake. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/fab-a-diffy/rules';
import {
  renderFractionBarPool,
  renderAnswerBoard,
  renderOperationSelector,
  renderScores,
  renderMoveHistory,
} from '../../src/games/fab-a-diffy/board-ui';

describe('Wave 53 handshake — fab mounts', () => {
  it('mounts pool / answers / empty op / scores / history', () => {
    const s = createInitialState();
    expect(renderFractionBarPool(s, () => undefined).querySelectorAll('.fab-bar-wrapper').length).toBeGreaterThan(0);
    expect(renderAnswerBoard(s, () => undefined).querySelectorAll('.fab-answer-wrapper').length).toBeGreaterThan(0);
    expect(renderOperationSelector(s, () => undefined).querySelectorAll('.fab-op-btn').length).toBe(0);
    expect(renderScores(s).querySelectorAll('.fab-score').length).toBe(2);
    expect(renderMoveHistory(s).querySelector('.fab-history-list')).toBeTruthy();
  });
});
