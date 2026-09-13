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

const ALL_TUTORIALS = [
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

describe('Burn wave 13 — Contig / Star / Sum / Kings requiredAction contracts', () => {
  it('Contig roll requiredAction click + selector', () => {
    const step = contig60Tutorial.steps.find((s) => s.id === 'turn-sequence');
    expect(step?.requiredAction).toEqual({
      type: 'click',
      selector: '.contig-roll-btn',
    });
    expect(step?.highlightSelector).toBe('.contig-dice-area');
  });

  it('Star Track draw + choose-chain requiredActions', () => {
    const draw = starTrackTutorial.steps.find((s) => s.id === 'draw-button');
    expect(draw?.requiredAction).toEqual({
      type: 'click',
      selector: '.star-track-draw-btn',
    });
    const choose = starTrackTutorial.steps.find((s) => s.id === 'choose-chain');
    expect(choose?.requiredAction).toEqual({
      type: 'click',
      selector: '.star-track-choices',
    });
  });

  it('Sum Dominoes dice requiredAction', () => {
    const step = sumDominoesTutorial.steps.find(
      (s) => s.id === 'turn-sequence'
    );
    expect(step?.requiredAction?.type).toBe('click');
    expect(step?.requiredAction?.selector).toBe('.sd-roll-btn');
    expect(step?.highlightSelector).toBe('.sd-dice-area');
  });

  it('Kings select-king / move-king click-cell actions', () => {
    const select = kingsQuadraphagesTutorial.steps.find(
      (s) => s.id === 'select-king'
    );
    expect(select?.requiredAction?.type).toBe('click-cell');
    expect(select?.highlightSelector).toContain('data-row="1"');
    const move = kingsQuadraphagesTutorial.steps.find(
      (s) => s.id === 'move-king'
    );
    expect(move?.requiredAction?.type).toBe('click-cell');
    expect(move?.highlightSelector).toContain('data-row="2"');
  });
});

describe('Burn wave 13 — Calla capture / free-turn / store', () => {
  it('capture + free-turn ids; store highlight', () => {
    expect(callaTutorial.steps.find((s) => s.id === 'capture')).toBeTruthy();
    expect(callaTutorial.steps.find((s) => s.id === 'free-turn')).toBeTruthy();
    expect(
      callaTutorial.steps.find((s) => s.highlightSelector === '.calla-store')
    ).toBeTruthy();
  });
});

describe('Burn wave 13 — Juggle boards + Par/Remainder/Pinball scores', () => {
  it('Juggle placement-rules highlights .juggle-boards', () => {
    expect(
      juggleTutorial.steps.find((s) => s.id === 'placement-rules')
        ?.highlightSelector
    ).toBe('.juggle-boards');
  });

  it('Par / Remainder / Pinball scoring highlights', () => {
    expect(
      par55Tutorial.steps.find((s) => s.id === 'scoring')?.highlightSelector
    ).toBe('.par55-scores');
    expect(
      remainderIslandsTutorial.steps.find((s) => s.id === 'winning')
        ?.highlightSelector
    ).toBe('.remainder-scores');
    expect(
      fractionPinballTutorial.steps.find((s) => s.id === 'winning')
        ?.highlightSelector
    ).toBe('.pinball-scores');
  });
});

describe('Burn wave 13 — Queens / FIAR / Kwatro / Fab mid-step ids', () => {
  it('Queens capturing; FIAR winning; Kwatro movement; Fab operations', () => {
    expect(
      queensGuardsTutorial.steps.find((s) => s.id === 'capturing')
    ).toBeTruthy();
    expect(fiarTutorial.steps.find((s) => s.id === 'winning')).toBeTruthy();
    expect(
      kwatroSinkoTutorial.steps.find((s) => s.id === 'movement-rules')
        ?.highlightSelector
    ).toBe('.kwa-board');
    expect(
      fabADiffyTutorial.steps.find((s) => s.id === 'operations')
    ).toBeTruthy();
  });
});

describe('Burn wave 13 — Hex / Pent / Stars mid-list contracts', () => {
  it('Hex winning + strategy-tips; Pent rules/winning; Stars examples/turn-sequence', () => {
    expect(hexTutorial.steps.find((s) => s.id === 'winning')).toBeTruthy();
    expect(
      hexTutorial.steps.find((s) => s.id === 'strategy-tips')
    ).toBeTruthy();
    expect(
      pentEmInTutorial.steps.find((s) => s.id === 'rules')?.highlightSelector
    ).toBe('.pent-board');
    expect(pentEmInTutorial.steps.find((s) => s.id === 'winning')).toBeTruthy();
    expect(
      starsBarsTutorial.steps.find((s) => s.id === 'examples')
    ).toBeTruthy();
    expect(
      starsBarsTutorial.steps.find((s) => s.id === 'turn-sequence')
        ?.highlightSelector
    ).toBe('.stars-board');
  });
});

describe('Burn wave 13 — Frac / Prime / Ramrod / Hex-a-Gone mid steps', () => {
  it('Frac scoring; Prime operations; Ramrod capturing; HAG place-shapes', () => {
    expect(
      fracFactTutorial.steps.find((s) => s.id === 'scoring')?.highlightSelector
    ).toBe('.frac-scores');
    expect(
      primeGoldTutorial.steps.find((s) => s.id === 'operations')
    ).toBeTruthy();
    expect(
      ramrodTutorial.steps.find((s) => s.id === 'capturing-rules')
        ?.highlightSelector
    ).toBe('.ramrod-board');
    expect(
      hexAGoneTutorial.steps.find((s) => s.id === 'place-shapes')
        ?.highlightSelector
    ).toBe('.hex-a-gone-board');
  });
});

describe('Burn wave 13 — all tutorials title/content + unique ids', () => {
  it('every step has nonempty title + message; ids unique per tutorial', () => {
    for (const tutorial of ALL_TUTORIALS) {
      const ids = tutorial.steps.map((s) => s.id);
      expect(new Set(ids).size).toBe(ids.length);
      for (const step of tutorial.steps) {
        expect(step.title?.trim().length).toBeGreaterThan(0);
        expect(step.message?.trim().length).toBeGreaterThan(0);
      }
      expect(tutorial.steps[0]?.id).toBe('welcome');
      expect(tutorial.steps[tutorial.steps.length - 1]?.id).toBe('complete');
    }
  });
});
