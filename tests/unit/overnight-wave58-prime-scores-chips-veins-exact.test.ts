/**
 * Wave 58 leftover after #267 — Prime score chips/veins exact templates.
 * Distinct from wave50 soft Blue chips leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/prime-gold/rules';
import { renderScores } from '../../src/games/prime-gold/board-ui';

describe('Wave 58 prime — scores chips veins exact', () => {
  it('opening scores use Blue/Red chips | veins templates', () => {
    const el = renderScores(createInitialState());
    const p1 = el.querySelector('.pg-score.player1')?.textContent ?? '';
    const p2 = el.querySelector('.pg-score.player2')?.textContent ?? '';
    expect(p1).toMatch(/Blue:\s*\d+\s*chips\s*\|\s*\d+\s*veins/);
    expect(p2).toMatch(/Red:\s*\d+\s*chips\s*\|\s*\d+\s*veins/);
  });
});
