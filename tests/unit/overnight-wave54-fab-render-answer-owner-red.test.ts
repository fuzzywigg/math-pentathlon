/**
 * Wave 54 leftover after #240 — Fab claimed player2 aria Red (wave53 Blue). Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/fab-a-diffy/rules';
import { renderAnswerBoard } from '../../src/games/fab-a-diffy/board-ui';

describe('Wave 54 fab — answer owner Red', () => {
  it('claimed player2 aria-label includes Red', () => {
    const base = createInitialState();
    const id = [...base.answerBars.keys()][0]!;
    const answers = new Map(base.answerBars);
    answers.set(id, { ...answers.get(id)!, claimedBy: 'player2' });
    const el = renderAnswerBoard({ ...base, answerBars: answers }, () => undefined);
    const label =
      (el.querySelector(`[data-answer-id="${id}"]`) as HTMLElement).getAttribute(
        'aria-label'
      ) || '';
    expect(label).toMatch(/Red/);
  });
});
