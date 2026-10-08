/**
 * Wave 55 leftover after #250 — Kwatro tutorial identity + winning/movement/strategy. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { kwatroSinkoTutorial } from '../../src/games/kwatro-sinko/tutorial';

describe('Wave 55 kwatro — tutorial catalog', () => {
  it('id/name and copy needles', () => {
    expect(kwatroSinkoTutorial.id).toBe('kwatro-sinko-basics');
    expect(kwatroSinkoTutorial.name).toBe('Learn Kwatro-Sinko');
    expect(kwatroSinkoTutorial.steps.find((s) => s.id === 'complete')?.message).toMatch(
      /make 4 or 5/
    );
    const winning = kwatroSinkoTutorial.steps.find((s) => s.id === 'winning');
    expect(winning?.message).toMatch(/All 5 of your chips must be off/);
    expect(winning?.message).toMatch(/6 \+ 2 - 3 = 5/);
    expect(winning?.message).toMatch(/9 \+ 1 - 6 = 4/);
    expect(winning?.message).toMatch(/like \+ like/);
    expect(
      kwatroSinkoTutorial.steps.find((s) => s.id === 'movement-rules')?.message
    ).toMatch(
      /Diagonal connections exist in the center 3×3 \(including toward numbered spaces\)/
    );
    const tips = kwatroSinkoTutorial.steps.find((s) => s.id === 'strategy-tips');
    expect(tips?.message).toMatch(/Control the center/);
    expect(tips?.message).toMatch(/Block your opponent's alignments/);
  });
});
