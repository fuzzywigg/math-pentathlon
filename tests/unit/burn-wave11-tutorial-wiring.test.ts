import { describe, it, expect } from 'vitest';
import { hexTutorial } from '../../src/games/hex/tutorial';
import { callaTutorial } from '../../src/games/calla/tutorial';
import { juggleTutorial } from '../../src/games/juggle/tutorial';
import { fabADiffyTutorial } from '../../src/games/fab-a-diffy/tutorial';
import { primeGoldTutorial } from '../../src/games/prime-gold/tutorial';
import { ramrodTutorial } from '../../src/games/ramrod/tutorial';
import { pentEmInTutorial } from '../../src/games/pent-em-in/tutorial';
import { remainderIslandsTutorial } from '../../src/games/remainder-islands/tutorial';
import { contig60Tutorial } from '../../src/games/contig-60/tutorial';
import { starTrackTutorial } from '../../src/games/star-track/tutorial';
import { sumDominoesTutorial } from '../../src/games/sum-dominoes/tutorial';
import { kingsQuadraphagesTutorial } from '../../src/games/kings-quadraphages/tutorial';
import { fiarTutorial } from '../../src/games/fiar/tutorial';
import { fracFactTutorial } from '../../src/games/frac-fact/tutorial';
import { fractionPinballTutorial } from '../../src/games/fraction-pinball/tutorial';
import { hexAGoneTutorial } from '../../src/games/hex-a-gone/tutorial';
import { kwatroSinkoTutorial } from '../../src/games/kwatro-sinko/tutorial';
import { par55Tutorial } from '../../src/games/par-55/tutorial';
import { queensGuardsTutorial } from '../../src/games/queens-guards/tutorial';
import { starsBarsTutorial } from '../../src/games/stars-bars/tutorial';

describe('Burn wave 11 — complete / welcome contracts (Hex / Calla / Juggle)', () => {
  it('Hex welcome first; complete Ready to Play', () => {
    expect(hexTutorial.steps[0]?.id).toBe('welcome');
    const complete = hexTutorial.steps.find((s) => s.id === 'complete');
    expect(complete?.title).toMatch(/Ready to Play/i);
    expect(complete?.message).toMatch(/Hex/i);
    expect(complete?.requiredAction).toBeUndefined();
  });

  it('Calla complete Ready; strategy-tip before complete', () => {
    const ids = callaTutorial.steps.map((s) => s.id);
    expect(ids[0]).toBe('welcome');
    expect(ids[ids.length - 1]).toBe('complete');
    expect(ids).toContain('strategy-tip');
    expect(callaTutorial.steps.find((s) => s.id === 'complete')?.title).toMatch(
      /Ready to Play/i
    );
  });

  it('Juggle complete Ready; placement-rules wired', () => {
    expect(juggleTutorial.steps[0]?.id).toBe('welcome');
    expect(
      juggleTutorial.steps.find((s) => s.id === 'complete')?.message
    ).toMatch(/Juggle/i);
    expect(
      juggleTutorial.steps.find((s) => s.id === 'placement-rules')
        ?.highlightSelector
    ).toBe('.juggle-boards');
  });
});

describe('Burn wave 11 — Fab / Prime / Ramrod / Pent / Remainder step lists', () => {
  it('Fab-a-Diffy keeps welcome→complete and winning highlight', () => {
    const ids = fabADiffyTutorial.steps.map((s) => s.id);
    expect(ids[0]).toBe('welcome');
    expect(ids).toContain('complete');
    expect(
      fabADiffyTutorial.steps.find((s) => s.id === 'winning')?.highlightSelector
    ).toBe('.fab-scores');
    expect(
      fabADiffyTutorial.steps.find((s) => s.id === 'complete')?.requiredAction
    ).toBeUndefined();
  });

  it('Prime Gold complete after prime-veins', () => {
    const ids = primeGoldTutorial.steps.map((s) => s.id);
    expect(ids[0]).toBe('welcome');
    expect(ids[ids.length - 1]).toBe('complete');
    expect(ids.indexOf('prime-veins')).toBeLessThan(ids.indexOf('complete'));
  });

  it('Ramrod / Pent / Remainder complete titles', () => {
    expect(
      ramrodTutorial.steps.find((s) => s.id === 'complete')?.title
    ).toMatch(/Ready|Play|Complete/i);
    expect(
      pentEmInTutorial.steps.find((s) => s.id === 'complete')?.title
    ).toMatch(/Ready|Play|Complete/i);
    expect(
      remainderIslandsTutorial.steps.find((s) => s.id === 'complete')?.title
    ).toMatch(/Ready|Play|Complete/i);
    expect(remainderIslandsTutorial.steps.map((s) => s.id)).toContain(
      'winning'
    );
  });
});

describe('Burn wave 11 — requiredAction tutorials have no action on complete', () => {
  it('Contig / Star / Sum / Kings complete steps omit requiredAction', () => {
    for (const tutorial of [
      contig60Tutorial,
      starTrackTutorial,
      sumDominoesTutorial,
      kingsQuadraphagesTutorial,
    ]) {
      const complete = tutorial.steps.find((s) => s.id === 'complete');
      expect(complete).toBeTruthy();
      expect(complete?.requiredAction).toBeUndefined();
      expect(tutorial.steps[0]?.id).toBe('welcome');
    }
  });

  it('Kings welcome has no requiredAction; select-king still click-cell', () => {
    expect(kingsQuadraphagesTutorial.steps[0]?.requiredAction).toBeUndefined();
    expect(
      kingsQuadraphagesTutorial.steps.find((s) => s.id === 'select-king')
        ?.requiredAction?.type
    ).toBe('click-cell');
  });
});

describe('Burn wave 11 — FIAR / Frac / Pinball / Hex-a-Gone / Kwatro / Par / Queens / Stars', () => {
  it('FIAR / Frac / Pinball end on complete with Ready titles', () => {
    for (const tutorial of [
      fiarTutorial,
      fracFactTutorial,
      fractionPinballTutorial,
    ]) {
      const ids = tutorial.steps.map((s) => s.id);
      expect(ids[0]).toBe('welcome');
      expect(ids[ids.length - 1]).toBe('complete');
      expect(tutorial.steps.find((s) => s.id === 'complete')?.title).toMatch(
        /Ready|Play|Complete/i
      );
    }
  });

  it('Hex-a-Gone / Kwatro / Par / Queens / Stars unique step ids', () => {
    for (const tutorial of [
      hexAGoneTutorial,
      kwatroSinkoTutorial,
      par55Tutorial,
      queensGuardsTutorial,
      starsBarsTutorial,
    ]) {
      const ids = tutorial.steps.map((s) => s.id);
      expect(new Set(ids).size).toBe(ids.length);
      expect(ids[0]).toBe('welcome');
      expect(ids).toContain('complete');
      expect(
        tutorial.steps.find((s) => s.id === 'complete')?.requiredAction
      ).toBeUndefined();
    }
  });

  it('Par scoring and Queens movement selectors stay wired', () => {
    expect(
      par55Tutorial.steps.find((s) => s.id === 'scoring')?.highlightSelector
    ).toBe('.par55-scores');
    expect(
      queensGuardsTutorial.steps.find((s) => s.id === 'movement-rules')
        ?.highlightSelector
    ).toBe('.qg-board-container');
    expect(
      starsBarsTutorial.steps.find((s) => s.id === 'attribute-cards')
        ?.highlightSelector
    ).toBe('.stars-hand');
  });
});
