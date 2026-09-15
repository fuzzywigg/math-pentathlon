/**
 * Wave 66 leftover after tip/#316 — Kwatro strategy Block alignments exact li.
 * Wave60 locks Watch tip; deepen Block leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { kwatroSinkoTutorial } from '../../src/games/kwatro-sinko/tutorial';

describe('Wave 66 kwatro — tutorial strategy block exact', () => {
  it('strategy lists Block opponent alignments li', () => {
    const tips = kwatroSinkoTutorial.steps.find((s) => s.id === 'strategy-tips');
    expect(tips?.message).toContain(
      "<li>Block your opponent's alignments</li>"
    );
  });
});
