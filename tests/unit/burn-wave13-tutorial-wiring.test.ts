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

describe('Burn wave 13 — requiredAction contracts', () => {
  it('Contig / Star / Sum / Kings gated steps keep requiredAction', () => {
    expect(
      contig60Tutorial.steps.find((s) => s.id === 'turn-sequence')
        ?.requiredAction
    ).toBeTruthy();
    expect(
      starTrackTutorial.steps.find((s) => s.id === 'draw-button')
        ?.requiredAction
    ).toBeTruthy();
    expect(
      starTrackTutorial.steps.find((s) => s.id === 'choose-chain')
        ?.requiredAction
    ).toBeTruthy();
    expect(
      sumDominoesTutorial.steps.find((s) => s.id === 'turn-sequence')
        ?.requiredAction
    ).toBeTruthy();
    const selectKing = kingsQuadraphagesTutorial.steps.find(
      (s) => s.id === 'select-king'
    );
    expect(selectKing?.requiredAction?.type).toBe('click-cell');
    const moveKing = kingsQuadraphagesTutorial.steps.find(
      (s) => s.id === 'move-king'
    );
    expect(moveKing?.requiredAction?.type).toBe('click-cell');
    expect(
      contig60Tutorial.steps.find((s) => s.id === 'complete')?.requiredAction
    ).toBeUndefined();
  });
});

describe('Burn wave 13 — step titles (Calla / Frac / Pinball / Hex)', () => {
  it('Calla capture / free-turn titles', () => {
    expect(
      callaTutorial.steps.find((s) => s.id === 'capture')?.title
    ).toMatch(/Captur/i);
    expect(
      callaTutorial.steps.find((s) => s.id === 'free-turn')?.title
    ).toMatch(/Free/i);
  });

  it('Frac difficulty + scoring; Pinball conversions + winning', () => {
    expect(
      fracFactTutorial.steps.find((s) => s.id === 'difficulty-levels')?.title
    ).toMatch(/Difficulty/i);
    expect(
      fracFactTutorial.steps.find((s) => s.id === 'scoring')?.title
    ).toMatch(/Scor/i);
    expect(
      fractionPinballTutorial.steps.find((s) => s.id === 'common-conversions')
        ?.title
    ).toMatch(/Conversion/i);
    expect(
      fractionPinballTutorial.steps.find((s) => s.id === 'winning')
        ?.highlightSelector
    ).toBe('.pinball-scores');
  });

  it('Hex winning / strategy titles', () => {
    expect(hexTutorial.steps.find((s) => s.id === 'winning')?.title).toMatch(
      /Win/i
    );
    expect(
      hexTutorial.steps.find((s) => s.id === 'strategy-tips')?.title
    ).toMatch(/Strateg/i);
  });
});

describe('Burn wave 13 — step titles (Fab / Prime / Par / Queens / Stars)', () => {
  it('Fab ops / Prime veins / Par attributes / Queens capturing / Stars examples', () => {
    expect(
      fabADiffyTutorial.steps.find((s) => s.id === 'operations')?.title
    ).toMatch(/Operat/i);
    expect(
      fabADiffyTutorial.steps.find((s) => s.id === 'strategy-tips')?.title
    ).toMatch(/Strateg/i);
    expect(
      primeGoldTutorial.steps.find((s) => s.id === 'prime-veins')?.title
    ).toMatch(/Vein|Prime/i);
    expect(
      primeGoldTutorial.steps.find((s) => s.id === 'operations')?.title
    ).toMatch(/Operat/i);
    expect(
      par55Tutorial.steps.find((s) => s.id === 'attribute-blocks')?.title
    ).toMatch(/Attribute/i);
    expect(
      par55Tutorial.steps.find((s) => s.id === 'scoring')?.highlightSelector
    ).toBe('.par55-scores');
    expect(
      queensGuardsTutorial.steps.find((s) => s.id === 'capturing')?.title
    ).toMatch(/Captur/i);
    expect(
      starsBarsTutorial.steps.find((s) => s.id === 'examples')?.title
    ).toMatch(/Example/i);
    expect(
      starsBarsTutorial.steps.find((s) => s.id === 'scoring')?.title
    ).toMatch(/Scor/i);
  });
});

describe('Burn wave 13 — step titles (Juggle / Hex-a-Gone / Remainder / Pent / Ramrod / Kwatro / FIAR / Contig / Kings)', () => {
  it('mid-step titles and selectors', () => {
    expect(
      juggleTutorial.steps.find((s) => s.id === 'dice-values')?.title
    ).toMatch(/Dice/i);
    expect(
      juggleTutorial.steps.find((s) => s.id === 'placement-rules')
        ?.highlightSelector
    ).toBe('.juggle-boards');
    expect(
      hexAGoneTutorial.steps.find((s) => s.id === 'shapes-intro')?.title
    ).toMatch(/Pattern|Block|Shape/i);
    expect(
      hexAGoneTutorial.steps.find((s) => s.id === 'select-shapes')?.title
    ).toMatch(/Select|Shape/i);
    expect(
      remainderIslandsTutorial.steps.find((s) => s.id === 'example')?.title
    ).toMatch(/Example/i);
    expect(
      remainderIslandsTutorial.steps.find((s) => s.id === 'winning')
        ?.highlightSelector
    ).toBe('.remainder-scores');
    expect(
      pentEmInTutorial.steps.find((s) => s.id === 'rules')?.title
    ).toMatch(/Rule/i);
    expect(
      pentEmInTutorial.steps.find((s) => s.id === 'winning')?.title
    ).toMatch(/Win/i);
    expect(
      ramrodTutorial.steps.find((s) => s.id === 'capturing-rules')?.title
    ).toMatch(/Captur/i);
    expect(
      ramrodTutorial.steps.find((s) => s.id === 'cuisenaire-rods')?.title
    ).toMatch(/Cuisenaire|Rod/i);
    expect(
      kwatroSinkoTutorial.steps.find((s) => s.id === 'movement-rules')?.title
    ).toMatch(/Mov/i);
    expect(
      kwatroSinkoTutorial.steps.find((s) => s.id === 'winning')?.title
    ).toMatch(/Win/i);
    expect(
      fiarTutorial.steps.find((s) => s.id === 'winning')?.title
    ).toMatch(/Win/i);
    expect(
      fiarTutorial.steps.find((s) => s.id === 'movement-rules')?.title
    ).toMatch(/Mov/i);
    expect(
      contig60Tutorial.steps.find((s) => s.id === 'passing')?.title
    ).toMatch(/Pass/i);
    expect(
      contig60Tutorial.steps.find((s) => s.id === 'winning')?.title
    ).toMatch(/Win/i);
    expect(
      kingsQuadraphagesTutorial.steps.find((s) => s.id === 'your-king')
        ?.highlightSelector
    ).toBe('.cell[data-row="1"][data-col="5"]');
  });
});

describe('Burn wave 13 — unique step ids (Sum / Star / Kings / Ramrod / Pent / Remainder / Juggle / Contig)', () => {
  it('tutorials keep unique step ids', () => {
    for (const tutorial of [
      sumDominoesTutorial,
      starTrackTutorial,
      kingsQuadraphagesTutorial,
      ramrodTutorial,
      pentEmInTutorial,
      remainderIslandsTutorial,
      juggleTutorial,
      contig60Tutorial,
      hexTutorial,
      callaTutorial,
      fabADiffyTutorial,
      primeGoldTutorial,
    ]) {
      const ids = tutorial.steps.map((s) => s.id);
      expect(new Set(ids).size).toBe(ids.length);
    }
  });
});
