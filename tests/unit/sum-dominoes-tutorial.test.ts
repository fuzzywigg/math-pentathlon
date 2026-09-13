import { describe, it, expect } from 'vitest';
import { sumDominoesTutorial } from '../../src/games/sum-dominoes/tutorial';

describe('sumDominoesTutorial requiredAction wiring', () => {
  it('requires clicking Roll Dice on the turn-sequence step', () => {
    const step = sumDominoesTutorial.steps.find((s) => s.id === 'turn-sequence');
    expect(step?.highlightSelector).toBe('.sd-dice-area');
    expect(step?.requiredAction).toEqual({
      type: 'click',
      selector: '.sd-roll-btn',
    });
  });

  it('does not invent new steps or rewrite other step copy', () => {
    expect(sumDominoesTutorial.steps.map((s) => s.id)).toEqual([
      'welcome',
      'objective',
      'setup',
      'turn-sequence',
      'matching-rules',
      'passing',
      'strategy-tips',
      'complete',
    ]);
    const turn = sumDominoesTutorial.steps.find((s) => s.id === 'turn-sequence');
    expect(turn?.message).toContain(
      '<strong>Roll Dice:</strong> Roll two dice to get a target sum (2-12)'
    );
  });
});
