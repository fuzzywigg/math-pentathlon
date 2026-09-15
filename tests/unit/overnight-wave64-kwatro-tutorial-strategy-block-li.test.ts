/**
 * Wave 64 leftover after tip/#306 — Kwatro tutorial strategy block-opponent li.
 * Wave60 locked Watch tip; deepen Block your opponent exact leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { kwatroSinkoTutorial } from '../../src/games/kwatro-sinko/tutorial';

describe('Wave 64 kwatro — tutorial strategy block li', () => {
  it("locks Block your opponent's alignments exact li", () => {
    const step = kwatroSinkoTutorial.steps.find((s) => s.id === 'strategy-tips');
    expect(step?.message).toContain(
      "<li>Block your opponent's alignments</li>"
    );
  });
});
