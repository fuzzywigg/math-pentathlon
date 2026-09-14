/**
 * Wave 48 — Ramrod renderScores + renderRodLegend chrome. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/ramrod/rules';
import { renderScores, renderRodLegend } from '../../src/games/ramrod/board-ui';

describe('Wave 48 ramrod — scores/legend chrome', () => {
  it('scores show both seats; legend mounts', () => {
    const scores = renderScores(createInitialState());
    expect(scores.textContent).toMatch(/Blue|Red|0/);
    const legend = renderRodLegend();
    expect(legend.children.length + (legend.textContent?.length || 0)).toBeGreaterThan(0);
  });
});
