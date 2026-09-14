/**
 * Wave 54 leftover after #240/#241 — FIAR tutorial blocking + complete copy. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { fiarTutorial } from '../../src/games/fiar/tutorial';

describe('Wave 54 fiar — tutorial blocking / complete', () => {
  it('winning mentions adjacent block; complete Finish four-in-a-row', () => {
    const win = fiarTutorial.steps.find((s) => s.id === 'winning');
    expect(win?.message).toMatch(/Blocking/);
    expect(win?.message).toMatch(/adjacent/);
    expect(win?.message).toMatch(/prevents the win/);
    const move = fiarTutorial.steps.find((s) => s.id === 'movement-rules');
    expect(move?.message).toMatch(/Cannot jump over other chips/);
    const complete = fiarTutorial.steps.find((s) => s.id === 'complete');
    expect(complete?.title).toMatch(/Ready to Play/);
    expect(complete?.message).toMatch(/Finish/);
    expect(complete?.message).toMatch(/four in a row/);
  });
});
