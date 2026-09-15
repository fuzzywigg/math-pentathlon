/**
 * Overnight TOKENMAXX HEAVY leftovers after #306/#316 — Kwatro strategy Block li exact.
 * Wave55 soft-matches Block needle; deepen exact li. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { kwatroSinkoTutorial } from '../../src/games/kwatro-sinko/tutorial';

describe('Wave 66 kwatro — tutorial strategy block li', () => {
  it("strategy-tips includes Block opponent's alignments exact li", () => {
    const tips = kwatroSinkoTutorial.steps.find((s) => s.id === 'strategy-tips');
    expect(tips?.message).toContain(
      "<li>Block your opponent's alignments</li>"
    );
  });
});
