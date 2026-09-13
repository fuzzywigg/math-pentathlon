import { describe, it, expect } from 'vitest';
import { contig60Tutorial } from '../../src/games/contig-60/tutorial';
import { starTrackTutorial } from '../../src/games/star-track/tutorial';
import { sumDominoesTutorial } from '../../src/games/sum-dominoes/tutorial';
import { queensGuardsTutorial } from '../../src/games/queens-guards/tutorial';
import { hexAGoneTutorial } from '../../src/games/hex-a-gone/tutorial';
import { remainderIslandsTutorial } from '../../src/games/remainder-islands/tutorial';
import { kingsQuadraphagesTutorial } from '../../src/games/kings-quadraphages/tutorial';
import { hexTutorial } from '../../src/games/hex/tutorial';
import { callaTutorial } from '../../src/games/calla/tutorial';
import { juggleTutorial } from '../../src/games/juggle/tutorial';
import { fabADiffyTutorial } from '../../src/games/fab-a-diffy/tutorial';
import { primeGoldTutorial } from '../../src/games/prime-gold/tutorial';
import { ramrodTutorial } from '../../src/games/ramrod/tutorial';
import { pentEmInTutorial } from '../../src/games/pent-em-in/tutorial';
import { fiarTutorial } from '../../src/games/fiar/tutorial';
import { fracFactTutorial } from '../../src/games/frac-fact/tutorial';
import { fractionPinballTutorial } from '../../src/games/fraction-pinball/tutorial';
import { kwatroSinkoTutorial } from '../../src/games/kwatro-sinko/tutorial';
import { par55Tutorial } from '../../src/games/par-55/tutorial';
import { starsBarsTutorial } from '../../src/games/stars-bars/tutorial';

const FOCUS = [
  contig60Tutorial,
  starTrackTutorial,
  sumDominoesTutorial,
  queensGuardsTutorial,
  hexAGoneTutorial,
  remainderIslandsTutorial,
  kingsQuadraphagesTutorial,
] as const;

describe('Burn wave 13 — focus-slice tutorial ids + welcome→complete', () => {
  it('each focus tutorial has welcome first and complete last', () => {
    for (const tutorial of FOCUS) {
      expect(tutorial.steps.length).toBeGreaterThanOrEqual(4);
      expect(tutorial.steps[0]?.id).toBe('welcome');
      expect(tutorial.steps[tutorial.steps.length - 1]?.id).toBe('complete');
      expect(tutorial.steps.every((s) => s.title && s.message)).toBe(true);
      expect(tutorial.id.length).toBeGreaterThan(0);
    }
  });

  it('Contig step ids + dice/board selectors', () => {
    const ids = contig60Tutorial.steps.map((s) => s.id);
    expect(ids).toEqual(
      expect.arrayContaining([
        'welcome',
        'objective',
        'turn-sequence',
        'scoring',
        'passing',
        'winning',
        'complete',
      ])
    );
    expect(
      contig60Tutorial.steps.find((s) => s.id === 'turn-sequence')
        ?.highlightSelector
    ).toBe('.contig-dice-area');
    expect(
      contig60Tutorial.steps.find((s) => s.id === 'scoring')?.highlightSelector
    ).toBe('.contig-board');
  });

  it('Star Track goal / draw / choose contracts', () => {
    const ids = starTrackTutorial.steps.map((s) => s.id);
    expect(ids).toContain('goal');
    expect(ids).toContain('draw-button');
    expect(ids).toContain('choose-chain');
    expect(
      starTrackTutorial.steps.find((s) => s.id === 'draw-button')
        ?.highlightSelector
    ).toBe('.star-track-draw-btn');
    expect(
      starTrackTutorial.steps.find((s) => s.id === 'choose-chain')
        ?.highlightSelector
    ).toBe('.star-track-choices');
    expect(
      starTrackTutorial.steps.find((s) => s.id === 'track-intro')
        ?.highlightSelector
    ).toBe('.star-track-board');
  });

  it('Sum Dominoes setup / matching / passing', () => {
    const ids = sumDominoesTutorial.steps.map((s) => s.id);
    expect(ids).toEqual(
      expect.arrayContaining([
        'setup',
        'turn-sequence',
        'matching-rules',
        'passing',
        'complete',
      ])
    );
    expect(
      sumDominoesTutorial.steps.find((s) => s.id === 'setup')?.highlightSelector
    ).toBe('.sd-board');
    expect(
      sumDominoesTutorial.steps.find((s) => s.id === 'turn-sequence')
        ?.highlightSelector
    ).toBe('.sd-dice-area');
  });
});

describe('Burn wave 13 — Queens / Hex-a-Gone / Remainder / Kings step contracts', () => {
  it('Queens movement + board container', () => {
    expect(
      queensGuardsTutorial.steps.map((s) => s.id)
    ).toEqual(
      expect.arrayContaining([
        'objective',
        'setup',
        'movement-rules',
        'capturing',
        'winning',
        'complete',
      ])
    );
    expect(
      queensGuardsTutorial.steps.find((s) => s.id === 'setup')
        ?.highlightSelector
    ).toBe('.qg-board-container');
    expect(
      queensGuardsTutorial.steps.find((s) => s.id === 'movement-rules')
        ?.highlightSelector
    ).toBe('.qg-board-container');
  });

  it('Hex-a-Gone bank/board step ids', () => {
    expect(hexAGoneTutorial.steps.map((s) => s.id)).toEqual(
      expect.arrayContaining([
        'goal',
        'board-intro',
        'shapes-intro',
        'select-shapes',
        'place-shapes',
        'complete',
      ])
    );
    expect(
      hexAGoneTutorial.steps.find((s) => s.id === 'select-shapes')
        ?.highlightSelector
    ).toBe('.hex-a-gone-bank');
    expect(
      hexAGoneTutorial.steps.find((s) => s.id === 'place-shapes')
        ?.highlightSelector
    ).toBe('.hex-a-gone-board');
  });

  it('Remainder dice / board / scores', () => {
    expect(remainderIslandsTutorial.steps.map((s) => s.id)).toEqual(
      expect.arrayContaining([
        'gameplay',
        'example',
        'winning',
        'complete',
      ])
    );
    expect(
      remainderIslandsTutorial.steps.find((s) => s.id === 'gameplay')
        ?.highlightSelector
    ).toBe('.remainder-dice');
    expect(
      remainderIslandsTutorial.steps.find((s) => s.id === 'example')
        ?.highlightSelector
    ).toBe('.remainder-board');
    expect(
      remainderIslandsTutorial.steps.find((s) => s.id === 'winning')
        ?.highlightSelector
    ).toBe('.remainder-scores');
  });

  it('Kings supplies / history / king cells', () => {
    const ids = kingsQuadraphagesTutorial.steps.map((s) => s.id);
    expect(ids).toEqual(
      expect.arrayContaining([
        'your-king',
        'opponent-king',
        'supplies',
        'move-history',
        'winning',
        'complete',
      ])
    );
    expect(
      kingsQuadraphagesTutorial.steps.find((s) => s.id === 'supplies')
        ?.highlightSelector
    ).toBe('.status-supplies');
    expect(
      kingsQuadraphagesTutorial.steps.find((s) => s.id === 'move-history')
        ?.highlightSelector
    ).toBe('#move-history');
    expect(
      kingsQuadraphagesTutorial.steps.find((s) => s.id === 'your-king')
        ?.highlightSelector
    ).toMatch(/\.cell\[data-row=/);
  });
});

describe('Burn wave 13 — all 20 tutorials still bookend + have titles', () => {
  const ALL = [
    hexTutorial,
    callaTutorial,
    juggleTutorial,
    fabADiffyTutorial,
    primeGoldTutorial,
    ramrodTutorial,
    pentEmInTutorial,
    remainderIslandsTutorial,
    contig60Tutorial,
    starTrackTutorial,
    sumDominoesTutorial,
    kingsQuadraphagesTutorial,
    fiarTutorial,
    fracFactTutorial,
    fractionPinballTutorial,
    hexAGoneTutorial,
    kwatroSinkoTutorial,
    par55Tutorial,
    queensGuardsTutorial,
    starsBarsTutorial,
  ];

  it('welcome→complete and unique step ids per tutorial', () => {
    expect(ALL).toHaveLength(20);
    for (const tutorial of ALL) {
      expect(tutorial.steps[0]?.id).toBe('welcome');
      expect(tutorial.steps.at(-1)?.id).toBe('complete');
      const ids = tutorial.steps.map((s) => s.id);
      expect(new Set(ids).size).toBe(ids.length);
      expect(tutorial.steps.every((s) => (s.title?.length ?? 0) > 0)).toBe(
        true
      );
    }
  });
});
