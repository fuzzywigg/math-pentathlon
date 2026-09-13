import { describe, it, expect } from 'vitest';
import { contig60Tutorial } from '../../src/games/contig-60/tutorial';
import { fiarTutorial } from '../../src/games/fiar/tutorial';
import { fracFactTutorial } from '../../src/games/frac-fact/tutorial';
import { fractionPinballTutorial } from '../../src/games/fraction-pinball/tutorial';
import { hexAGoneTutorial } from '../../src/games/hex-a-gone/tutorial';
import { kwatroSinkoTutorial } from '../../src/games/kwatro-sinko/tutorial';
import { par55Tutorial } from '../../src/games/par-55/tutorial';
import { queensGuardsTutorial } from '../../src/games/queens-guards/tutorial';
import { starsBarsTutorial } from '../../src/games/stars-bars/tutorial';

describe('contig60Tutorial highlightSelector wiring', () => {
  it('wires dice area / board selectors', () => {
    expect(contig60Tutorial.steps[0]?.id).toBe('welcome');
    expect(
      contig60Tutorial.steps.find((s) => s.id === 'turn-sequence')
        ?.highlightSelector
    ).toBe('.contig-dice-area');
    expect(
      contig60Tutorial.steps.find((s) => s.id === 'scoring')?.highlightSelector
    ).toBe('.contig-board');
  });
});

describe('fiarTutorial highlightSelector wiring', () => {
  it('wires board-container for phases and movement', () => {
    expect(
      fiarTutorial.steps.find((s) => s.id === 'game-phases')?.highlightSelector
    ).toBe('.fiar-board-container');
    expect(
      fiarTutorial.steps.find((s) => s.id === 'movement-rules')
        ?.highlightSelector
    ).toBe('.fiar-board-container');
    expect(fiarTutorial.steps.map((s) => s.id)).toContain('complete');
  });
});

describe('fracFactTutorial highlightSelector wiring', () => {
  it('wires problem / scores selectors', () => {
    expect(
      fracFactTutorial.steps.find((s) => s.id === 'gameplay')?.highlightSelector
    ).toBe('.frac-problem');
    expect(
      fracFactTutorial.steps.find((s) => s.id === 'scoring')?.highlightSelector
    ).toBe('.frac-scores');
  });
});

describe('fractionPinballTutorial highlightSelector wiring', () => {
  it('wires challenge / board / scores selectors', () => {
    expect(
      fractionPinballTutorial.steps.find((s) => s.id === 'gameplay')
        ?.highlightSelector
    ).toBe('.pinball-challenge');
    expect(
      fractionPinballTutorial.steps.find((s) => s.id === 'scoring')
        ?.highlightSelector
    ).toBe('.pinball-board');
    expect(
      fractionPinballTutorial.steps.find((s) => s.id === 'winning')
        ?.highlightSelector
    ).toBe('.pinball-scores');
  });
});

describe('hexAGoneTutorial highlightSelector wiring', () => {
  it('wires board / bank selectors', () => {
    expect(
      hexAGoneTutorial.steps.find((s) => s.id === 'board-intro')
        ?.highlightSelector
    ).toBe('.hex-a-gone-board');
    expect(
      hexAGoneTutorial.steps.find((s) => s.id === 'select-shapes')
        ?.highlightSelector
    ).toBe('.hex-a-gone-bank');
    expect(
      hexAGoneTutorial.steps.find((s) => s.id === 'place-shapes')
        ?.highlightSelector
    ).toBe('.hex-a-gone-board');
  });
});

describe('kwatroSinkoTutorial highlightSelector wiring', () => {
  it('wires chip-info / board selectors', () => {
    expect(
      kwatroSinkoTutorial.steps.find((s) => s.id === 'setup')?.highlightSelector
    ).toBe('.kwa-chip-info');
    expect(
      kwatroSinkoTutorial.steps.find((s) => s.id === 'turn-sequence')
        ?.highlightSelector
    ).toBe('.kwa-board');
    expect(
      kwatroSinkoTutorial.steps.find((s) => s.id === 'movement-rules')
        ?.highlightSelector
    ).toBe('.kwa-board');
  });
});

describe('par55Tutorial highlightSelector wiring', () => {
  it('wires hand / board / scores selectors', () => {
    expect(
      par55Tutorial.steps.find((s) => s.id === 'attribute-blocks')
        ?.highlightSelector
    ).toBe('.par55-hand');
    expect(
      par55Tutorial.steps.find((s) => s.id === 'turn-sequence')
        ?.highlightSelector
    ).toBe('.par55-board');
    expect(
      par55Tutorial.steps.find((s) => s.id === 'scoring')?.highlightSelector
    ).toBe('.par55-scores');
  });
});

describe('queensGuardsTutorial highlightSelector wiring', () => {
  it('wires board-container for setup and movement', () => {
    expect(
      queensGuardsTutorial.steps.find((s) => s.id === 'setup')
        ?.highlightSelector
    ).toBe('.qg-board-container');
    expect(
      queensGuardsTutorial.steps.find((s) => s.id === 'movement-rules')
        ?.highlightSelector
    ).toBe('.qg-board-container');
    expect(queensGuardsTutorial.steps[0]?.id).toBe('welcome');
  });
});

describe('starsBarsTutorial highlightSelector wiring', () => {
  it('wires hand / board selectors', () => {
    expect(
      starsBarsTutorial.steps.find((s) => s.id === 'attribute-cards')
        ?.highlightSelector
    ).toBe('.stars-hand');
    expect(
      starsBarsTutorial.steps.find((s) => s.id === 'scoring')?.highlightSelector
    ).toBe('.stars-board');
    expect(
      starsBarsTutorial.steps.find((s) => s.id === 'turn-sequence')
        ?.highlightSelector
    ).toBe('.stars-board');
  });
});
