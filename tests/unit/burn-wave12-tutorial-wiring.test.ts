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

describe('Burn wave 12 — Hex / Calla / Contig highlight deepenings', () => {
  it('Hex legend + board selectors stay wired', () => {
    expect(
      hexTutorial.steps.find((s) => s.id === 'players')?.highlightSelector
    ).toBe('.hex-legend');
    expect(
      hexTutorial.steps.find((s) => s.highlightSelector === '.hex-board')
    ).toBeTruthy();
    expect(hexTutorial.steps[0]?.id).toBe('welcome');
  });

  it('Calla board / pit / store selectors', () => {
    expect(
      callaTutorial.steps.find((s) => s.id === 'board-intro')?.highlightSelector
    ).toBe('.calla-board');
    expect(
      callaTutorial.steps.some((s) => s.highlightSelector === '.calla-pit')
    ).toBe(true);
    expect(
      callaTutorial.steps.some((s) => s.highlightSelector === '.calla-store')
    ).toBe(true);
  });

  it('Contig dice + board selectors', () => {
    expect(
      contig60Tutorial.steps.find((s) => s.highlightSelector === '.contig-dice-area')
    ).toBeTruthy();
    expect(
      contig60Tutorial.steps.find((s) => s.highlightSelector === '.contig-board')
    ).toBeTruthy();
    expect(contig60Tutorial.steps.map((s) => s.id)).toContain('complete');
  });
});

describe('Burn wave 12 — Fab / Prime / Ramrod / Pent / Remainder selectors', () => {
  it('Fab pool / answer / scores highlights', () => {
    expect(
      fabADiffyTutorial.steps.find((s) => s.highlightSelector === '.fab-bar-pool')
    ).toBeTruthy();
    expect(
      fabADiffyTutorial.steps.find(
        (s) => s.highlightSelector === '.fab-answer-board'
      )
    ).toBeTruthy();
    expect(
      fabADiffyTutorial.steps.find((s) => s.id === 'winning')?.highlightSelector
    ).toBe('.fab-scores');
  });

  it('Prime board / dice / scores', () => {
    expect(
      primeGoldTutorial.steps.find((s) => s.highlightSelector === '.pg-board')
    ).toBeTruthy();
    expect(
      primeGoldTutorial.steps.find((s) => s.highlightSelector === '.pg-dice-area')
    ).toBeTruthy();
    expect(
      primeGoldTutorial.steps.find((s) => s.highlightSelector === '.pg-scores')
    ).toBeTruthy();
  });

  it('Ramrod / Pent / Remainder highlight contracts', () => {
    expect(
      ramrodTutorial.steps.find(
        (s) => s.highlightSelector === '.ramrod-player-rods'
      )
    ).toBeTruthy();
    expect(
      ramrodTutorial.steps.find((s) => s.highlightSelector === '.ramrod-scores')
    ).toBeTruthy();
    expect(
      pentEmInTutorial.steps.find((s) => s.highlightSelector === '.pent-board')
    ).toBeTruthy();
    expect(
      pentEmInTutorial.steps.find(
        (s) => s.highlightSelector === '.pent-piece-selector'
      )
    ).toBeTruthy();
    expect(
      remainderIslandsTutorial.steps.find(
        (s) => s.highlightSelector === '.remainder-dice'
      )
    ).toBeTruthy();
    expect(
      remainderIslandsTutorial.steps.find(
        (s) => s.highlightSelector === '.remainder-board'
      )
    ).toBeTruthy();
  });
});

describe('Burn wave 12 — Star / Sum / Juggle / Kings step contracts', () => {
  it('Star Track draw + choices selectors', () => {
    expect(
      starTrackTutorial.steps.find(
        (s) => s.highlightSelector === '.star-track-draw-btn'
      )
    ).toBeTruthy();
    expect(
      starTrackTutorial.steps.find(
        (s) => s.highlightSelector === '.star-track-choices'
      )
    ).toBeTruthy();
    expect(
      starTrackTutorial.steps.find(
        (s) => s.highlightSelector === '.star-track-board'
      )
    ).toBeTruthy();
  });

  it('Sum Dominoes board + dice selectors', () => {
    expect(
      sumDominoesTutorial.steps.find((s) => s.highlightSelector === '.sd-board')
    ).toBeTruthy();
    expect(
      sumDominoesTutorial.steps.find(
        (s) => s.highlightSelector === '.sd-dice-area'
      )
    ).toBeTruthy();
  });

  it('Juggle dice area + Kings supplies / history', () => {
    expect(
      juggleTutorial.steps.find(
        (s) => s.highlightSelector === '.juggle-dice-area'
      )
    ).toBeTruthy();
    expect(
      kingsQuadraphagesTutorial.steps.find(
        (s) => s.highlightSelector === '.status-supplies'
      )
    ).toBeTruthy();
    expect(
      kingsQuadraphagesTutorial.steps.find(
        (s) => s.highlightSelector === '#move-history'
      )
    ).toBeTruthy();
  });
});

describe('Burn wave 12 — FIAR / Frac / Pinball / Hex-a-Gone / Kwatro / Par / Queens / Stars', () => {
  it('FIAR / Frac / Pinball highlight selectors', () => {
    expect(
      fiarTutorial.steps.find(
        (s) => s.highlightSelector === '.fiar-board-container'
      )
    ).toBeTruthy();
    expect(
      fracFactTutorial.steps.find((s) => s.highlightSelector === '.frac-problem')
    ).toBeTruthy();
    expect(
      fracFactTutorial.steps.find((s) => s.highlightSelector === '.frac-scores')
    ).toBeTruthy();
    expect(
      fractionPinballTutorial.steps.find(
        (s) => s.highlightSelector === '.pinball-challenge'
      )
    ).toBeTruthy();
    expect(
      fractionPinballTutorial.steps.find(
        (s) => s.highlightSelector === '.pinball-board'
      )
    ).toBeTruthy();
  });

  it('Hex-a-Gone bank/board; Kwatro chip/board; Par hand/board', () => {
    expect(
      hexAGoneTutorial.steps.find(
        (s) => s.highlightSelector === '.hex-a-gone-bank'
      )
    ).toBeTruthy();
    expect(
      hexAGoneTutorial.steps.find(
        (s) => s.highlightSelector === '.hex-a-gone-board'
      )
    ).toBeTruthy();
    expect(
      kwatroSinkoTutorial.steps.find(
        (s) => s.highlightSelector === '.kwa-chip-info'
      )
    ).toBeTruthy();
    expect(
      kwatroSinkoTutorial.steps.find((s) => s.highlightSelector === '.kwa-board')
    ).toBeTruthy();
    expect(
      par55Tutorial.steps.find((s) => s.highlightSelector === '.par55-hand')
    ).toBeTruthy();
    expect(
      par55Tutorial.steps.find((s) => s.highlightSelector === '.par55-board')
    ).toBeTruthy();
  });

  it('Queens / Stars unique ids and attribute/movement selectors', () => {
    const queensIds = queensGuardsTutorial.steps.map((s) => s.id);
    expect(new Set(queensIds).size).toBe(queensIds.length);
    expect(
      queensGuardsTutorial.steps.find((s) => s.id === 'movement-rules')
        ?.highlightSelector
    ).toBe('.qg-board-container');

    const starsIds = starsBarsTutorial.steps.map((s) => s.id);
    expect(new Set(starsIds).size).toBe(starsIds.length);
    expect(
      starsBarsTutorial.steps.find((s) => s.id === 'attribute-cards')
        ?.highlightSelector
    ).toBe('.stars-hand');
    expect(
      starsBarsTutorial.steps.find((s) => s.highlightSelector === '.stars-board')
    ).toBeTruthy();
  });

  it('every tutorial still starts welcome and ends complete', () => {
    for (const tutorial of [
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
    ]) {
      expect(tutorial.steps[0]?.id).toBe('welcome');
      expect(tutorial.steps[tutorial.steps.length - 1]?.id).toBe('complete');
      expect(
        tutorial.steps.find((s) => s.id === 'complete')?.requiredAction
      ).toBeUndefined();
    }
  });
});
