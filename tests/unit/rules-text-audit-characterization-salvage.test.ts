/**
 * Salvaged from #492 (compliant slice only).
 * Characterizes engine facts + tip's CURRENT tutorial/help wording.
 * Does NOT change tutorial.ts, help HTML, registry blurbs, or wiki copy.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { DEFAULT_MAX_PROBLEMS } from '../../src/games/frac-fact/types';
import { CONFIG as PrimeGoldConfig } from '../../src/games/prime-gold/types';
import { generateExpressions } from '../../src/games/prime-gold/types';
import {
  getValidPlacements as starsValidPlacements,
  createInitialState as createStarsState,
} from '../../src/games/stars-bars/rules';
import { fracFactTutorial } from '../../src/games/frac-fact/tutorial';
import { primeGoldTutorial } from '../../src/games/prime-gold/tutorial';
import { starsBarsTutorial } from '../../src/games/stars-bars/tutorial';
import { fabADiffyTutorial } from '../../src/games/fab-a-diffy/tutorial';

const root = join(import.meta.dirname, '../..');

describe('Rules-text audit characterization — engine facts (tip)', () => {
  it('Frac Fact: maxProblems is 10 total (seats alternate)', () => {
    expect(DEFAULT_MAX_PROBLEMS).toBe(10);
  });

  it('Prime Gold: board results stay ≤49; 5! is not placeable', () => {
    expect(PrimeGoldConfig.BOARD_SIZE).toBe(7);
    const withFive = generateExpressions(5, 1, 1);
    expect(withFive.some((e) => e.value === 120)).toBe(false);
    const withFour = generateExpressions(4, 1, 1);
    expect(withFour.some((e) => e.expr === '4!' && e.value === 24)).toBe(true);
  });

  it('Stars & Bars: empty board allows any cell', () => {
    const state = createStarsState();
    expect(starsValidPlacements(state).length).toBe(25);
  });
});

describe('Rules-text audit characterization — tip copy still mismatched', () => {
  it('Frac Fact tutorial still says “10 problems each” (unfixed on tip)', () => {
    const winning = fracFactTutorial.steps.find((s) => s.id === 'winning');
    expect(winning?.message).toMatch(/10 problems each/);
    expect(winning?.message).not.toMatch(/10 problems total/);
  });

  it('Prime Gold strategy tip still cites 5!=120 (unfixed; engine caps ≤49)', () => {
    const tip = primeGoldTutorial.steps.find((s) => s.id === 'strategy-tips');
    expect(tip?.message).toMatch(/5!\s*=\s*120/);
  });

  it('Stars & Bars turn copy still omits first-card-anywhere exception', () => {
    const turn = starsBarsTutorial.steps.find((s) => s.id === 'turn-sequence');
    expect(turn?.message).toBeTruthy();
    expect(turn?.message ?? '').not.toMatch(/First card may go anywhere/i);
  });

  it('Fab-a-Diffy tutorial still says “your pool” (engine uses shared pool)', () => {
    const turn = fabADiffyTutorial.steps.find((s) => s.id === 'turn-sequence');
    expect(turn?.message).toMatch(/your pool/i);
    expect(turn?.message).not.toMatch(/shared pool/i);
  });

  it('audit salvage doc exists under docs/dev (no player-facing edits)', () => {
    const doc = readFileSync(
      join(root, 'docs/dev/violation-salvage-2026-10-08.md'),
      'utf8'
    );
    expect(doc).toMatch(/#492/);
    expect(doc).toMatch(/Hard rule: No player-facing copy or rules-text changes/);
  });
});
