import { describe, it, expect } from 'vitest';
import { contig60Tutorial } from '../../src/games/contig-60/tutorial';

describe('contig60Tutorial requiredAction wiring', () => {
  it('requires clicking Roll Dice on the turn-sequence step', () => {
    const step = contig60Tutorial.steps.find((s) => s.id === 'turn-sequence');
    expect(step?.highlightSelector).toBe('.contig-dice-area');
    expect(step?.requiredAction).toEqual({
      type: 'click',
      selector: '.contig-roll-btn',
    });
  });

  it('does not invent new steps or rewrite other step copy', () => {
    expect(contig60Tutorial.steps.map((s) => s.id)).toEqual([
      'welcome',
      'objective',
      'turn-sequence',
      'scoring',
      'expression-rules',
      'passing',
      'winning',
      'complete',
    ]);
    const turn = contig60Tutorial.steps.find((s) => s.id === 'turn-sequence');
    expect(turn?.message).toContain('<strong>Roll:</strong> Roll three dice');
  });
});
