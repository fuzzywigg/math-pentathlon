/**
 * Rules-text audit — characterization of help/tutorial vs engine.
 * Docs: docs/rules-text-audit.md. Docs-and-tests-only; no engine changes.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { DEFAULT_MAX_PROBLEMS } from '../../src/games/frac-fact/types';
import { CONFIG as PrimeGoldConfig } from '../../src/games/prime-gold/types';
import { generateExpressions } from '../../src/games/prime-gold/types';
import {
  checkTrioForWin,
  allChipsOffNumbered,
  createInitialState as createKwaState,
} from '../../src/games/kwatro-sinko/rules';
import {
  getValidPlacements as starsValidPlacements,
  createInitialState as createStarsState,
} from '../../src/games/stars-bars/rules';
import { fracFactTutorial } from '../../src/games/frac-fact/tutorial';
import { primeGoldTutorial } from '../../src/games/prime-gold/tutorial';
import { starsBarsTutorial } from '../../src/games/stars-bars/tutorial';
import { fabADiffyTutorial } from '../../src/games/fab-a-diffy/tutorial';
import { contig60Tutorial } from '../../src/games/contig-60/tutorial';
import { kwatroSinkoTutorial } from '../../src/games/kwatro-sinko/tutorial';
import { callaTutorial } from '../../src/games/calla/tutorial';

const root = join(import.meta.dirname, '../..');
const mainTs = readFileSync(join(root, 'src/main.ts'), 'utf8');

function helpSection(titleSubstring: string): string {
  const idx = mainTs.indexOf(`helpTitle: '${titleSubstring}'`);
  const alt = mainTs.indexOf(`helpTitle: "${titleSubstring}"`);
  const start = idx >= 0 ? idx : alt;
  expect(start).toBeGreaterThanOrEqual(0);
  const htmlStart = mainTs.indexOf('helpContentHtml:', start);
  const tick = mainTs.indexOf('`', htmlStart);
  const tickEnd = mainTs.indexOf('`', tick + 1);
  return mainTs.slice(tick + 1, tickEnd);
}

describe('Rules-text audit — fixed wording aligns with engine', () => {
  it('Frac Fact: maxProblems is total (not per seat); copy says total', () => {
    expect(DEFAULT_MAX_PROBLEMS).toBe(10);
    const winning = fracFactTutorial.steps.find((s) => s.id === 'winning');
    expect(winning?.message).toMatch(/10 problems total/);
    expect(winning?.message).not.toMatch(/10 problems each/);
    expect(helpSection('How to Play Frac Fact')).toMatch(/10 problems total/);
  });

  it('Prime Gold: 5! is not a placeable board value; tip uses 4!=24', () => {
    expect(PrimeGoldConfig.BOARD_SIZE).toBe(7);
    const withFive = generateExpressions(5, 1, 1);
    expect(withFive.some((e) => e.value === 120)).toBe(false);
    const withFour = generateExpressions(4, 1, 1);
    expect(withFour.some((e) => e.expr === '4!' && e.value === 24)).toBe(true);
    const tip = primeGoldTutorial.steps.find((s) => s.id === 'strategy-tips');
    expect(tip?.message).toMatch(/4!=24/);
    expect(tip?.message).not.toMatch(/5!=120/);
    expect(helpSection('How to Play Prime Gold')).not.toMatch(/5!=120/);
  });

  it('Stars & Bars: empty board allows any cell; copy notes first-card exception', () => {
    const state = createStarsState();
    expect(starsValidPlacements(state).length).toBe(25);
    const turn = starsBarsTutorial.steps.find((s) => s.id === 'turn-sequence');
    expect(turn?.message).toMatch(/First card may go anywhere/i);
    expect(helpSection('How to Play Stars & Bars')).toMatch(
      /First card may go anywhere/i
    );
  });

  it('Fab-a-Diffy tutorial refers to shared pool', () => {
    const turn = fabADiffyTutorial.steps.find((s) => s.id === 'turn-sequence');
    expect(turn?.message).toMatch(/shared pool/i);
    expect(helpSection('How to Play Fab-a-Diffy')).toMatch(/shared pool/i);
  });

  it('Contig 60 tutorial scoring notes points do not decide winner', () => {
    const scoring = contig60Tutorial.steps.find((s) => s.id === 'scoring');
    expect(scoring?.message).toMatch(/do not decide the winner/);
  });

  it('Calla help capture requires nonempty opposite', () => {
    const help = helpSection('How to Play Calla');
    expect(help).toMatch(/opposite shield has cubes/i);
  });

  it('Kwatro help winning matches engine like+like−opposite + all off numbered', () => {
    const help = helpSection('How to Play Kwatro-Sinko');
    expect(help).toMatch(/All 5 of your chips must be off the numbered/);
    expect(help).toMatch(/like \+ like/);
    expect(help).toMatch(/6 \+ 2 - 3 = 5/);
    expect(help).not.toMatch(/6 \+ 3 - 5 = 4/);

    // Engine rejects the old help examples under ownership rule
    const node = (id: string) => ({
      id,
      chip: null as null,
      connections: [] as string[],
      isNumbered: false,
      row: 0,
      col: 0,
    });
    const chip = (
      id: string,
      value: number,
      owner: 'player1' | 'player2',
      position: string
    ) => ({ id, value, owner, position });

    const badOld = checkTrioForWin([
      {
        node: node('a'),
        chip: chip('c6', 6, 'player1', 'a'),
      },
      {
        node: node('b'),
        chip: chip('c3', 3, 'player2', 'b'),
      },
      {
        node: node('c'),
        chip: chip('c5', 5, 'player2', 'c'),
      },
    ]);
    expect(badOld).toBeNull();

    const good = checkTrioForWin([
      {
        node: node('a'),
        chip: chip('c6', 6, 'player1', 'a'),
      },
      {
        node: node('b'),
        chip: chip('c2', 2, 'player1', 'b'),
      },
      {
        node: node('c'),
        chip: chip('c3', 3, 'player2', 'c'),
      },
    ]);
    expect(good?.result).toBe(5);
  });

  it('Kwatro tutorial winning already states conjunctive official goal', () => {
    const winning = kwatroSinkoTutorial.steps.find((s) => s.id === 'winning');
    expect(winning?.message).toMatch(/All 5 of your chips must be off/);
    expect(winning?.message).toMatch(/like \+ like/);
    const state = createKwaState();
    expect(
      typeof allChipsOffNumbered(state.nodes, state.chips, 'player1')
    ).toBe('boolean');
  });
});

describe('Rules-text audit — follow-up fixed wording', () => {
  it('Kings help documents place-if-supply and exhaustion tie', () => {
    const help = helpSection('How to Play Kings & Quadraphages');
    expect(help).toMatch(/if you still have one/i);
    expect(help).toMatch(/ends in a tie/i);
  });

  it('Star Track help does not claim two different lengths', () => {
    expect(helpSection('How to Play Star Track')).toMatch(/might match/i);
    expect(helpSection('How to Play Star Track')).not.toMatch(
      /two different lengths/
    );
  });

  it('Sum Dominoes and Contig mention draw on mutual-pass settlement', () => {
    expect(helpSection('How to Play Sum Dominoes & Dice')).toMatch(
      /equal pips is a draw/i
    );
    expect(helpSection('How to Play Contig 60')).toMatch(/or a draw/i);
  });

  it('Calla help mentions tie; tutorial seating matches Red-top board', () => {
    expect(helpSection('How to Play Calla')).toMatch(/equal Callas is a tie/i);
    const intro = callaTutorial.steps.find((s) => s.id === 'board-intro');
    expect(intro?.message).toMatch(/Red's pits[\s\S]*on top/i);
    expect(intro?.message).toMatch(/Blue's pits[\s\S]*on the bottom/i);
  });

  it('Juggle placement notes rotate/flip when shape allows', () => {
    expect(helpSection('How to Play Juggle')).toMatch(/when that shape allows/i);
  });
});

describe('Rules-text audit — open decisions (skipped until owner decides)', () => {
  it.skip('OPEN: Kwatro welcome/objective still use bare a+b-c slogan vs conjunctive engine', () => {
    const welcome = kwatroSinkoTutorial.steps.find((s) => s.id === 'welcome');
    expect(welcome?.message).not.toMatch(/a \+ b - c = 4 or 5/);
  });

  it.skip('OPEN: Kwatro diagonal-on-numbered claim vs center-only engine graph', () => {
    expect(helpSection('How to Play Kwatro-Sinko')).not.toMatch(
      /Diagonal connections exist on numbered/
    );
  });

  it.skip('OPEN: Star Track help should document bucket-exhaustion end', () => {
    expect(helpSection('How to Play Star Track')).toMatch(
      /fewer than two chains|bucket/i
    );
  });

  it.skip('OPEN: Juggle stuck / cannot-place end rule undecided', () => {
    expect(helpSection('How to Play Juggle')).toMatch(
      /cannot place|must pass|opponent wins/i
    );
  });

  it.skip('OPEN: Par 55 help tie-break vs engine nullable winner', () => {
    expect(helpSection('How to Play Par 55')).not.toMatch(
      /reaches 55 first wins/i
    );
  });

  it.skip('OPEN: Par 55 hand refill vs start-with-5-only', () => {
    expect(helpSection('How to Play Par 55')).toMatch(/start with 5|draw back/i);
  });

  it.skip('OPEN: Fab-a-Diffy end / equal-claims handling', () => {
    expect(helpSection('How to Play Fab-a-Diffy')).toMatch(
      /draw|tie|one bar remains/i
    );
  });

  it.skip('OPEN: Prime Gold help should mention 20 chips + exhaustion veins', () => {
    expect(helpSection('How to Play Prime Gold')).toMatch(/20 chips|exhaust/i);
  });

  it.skip('OPEN: Fraction Pinball both-out-of-balls early end', () => {
    expect(helpSection('How to Play Fraction Pinball')).toMatch(
      /balls remaining|out of balls/i
    );
  });

  it.skip('OPEN: Hex-a-Gone multi-cell help art vs one-cell engine footprints', () => {
    expect(helpSection('How to Play Hex-a-Gone')).toMatch(
      /one empty hex cell/i
    );
  });

  it.skip('OPEN: Frac Fact streak bonus flat +5 vs streak_before × 5', () => {
    expect(helpSection('How to Play Frac Fact')).toMatch(/streak before|× your/i);
  });
});
