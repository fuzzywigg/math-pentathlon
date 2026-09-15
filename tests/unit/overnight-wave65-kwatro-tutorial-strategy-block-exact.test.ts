/**
 * Wave 65 leftover after tip/#315 — Kwatro strategy Block alignments exact.
 * Wave55 soft /Block your opponent/; deepen full li leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { kwatroSinkoTutorial } from '../../src/games/kwatro-sinko/tutorial';

describe('Wave 65 kwatro — tutorial strategy block exact', () => {
  it('strategy-tips lists Block your opponent alignments', () => {
    const tips = kwatroSinkoTutorial.steps.find((s) => s.id === 'strategy-tips');
    expect(tips?.message).toContain(
      "<li>Block your opponent's alignments</li>"
    );
  });
});
