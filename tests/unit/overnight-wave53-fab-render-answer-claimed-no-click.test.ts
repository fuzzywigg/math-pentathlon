/**
 * Wave 53 leftover after #235 — Fab claimed answer no click. Tests-only.
 */
import { describe, it, expect, vi } from 'vitest';
import { createInitialState } from '../../src/games/fab-a-diffy/rules';
import { renderAnswerBoard } from '../../src/games/fab-a-diffy/board-ui';

describe('Wave 53 fab — claimed answer no-click', () => {
  it('claimed answer does not fire onAnswerClick', () => {
    const base = createInitialState();
    const id = [...base.answerBars.keys()][0];
    const answers = new Map(base.answerBars);
    answers.set(id, { ...answers.get(id)!, claimedBy: 'player1' });
    const onClick = vi.fn();
    const el = renderAnswerBoard({ ...base, answerBars: answers }, onClick);
    (el.querySelector(`[data-answer-id="${id}"]`) as HTMLElement).click();
    expect(onClick).not.toHaveBeenCalled();
  });
});
