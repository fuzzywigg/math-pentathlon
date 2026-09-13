import { describe, it, expect } from 'vitest';
import { hexTutorial } from '../../src/games/hex/tutorial';
import { callaTutorial } from '../../src/games/calla/tutorial';
import { fabADiffyTutorial } from '../../src/games/fab-a-diffy/tutorial';
import { primeGoldTutorial } from '../../src/games/prime-gold/tutorial';
import { ramrodTutorial } from '../../src/games/ramrod/tutorial';
import { pentEmInTutorial } from '../../src/games/pent-em-in/tutorial';
import { remainderIslandsTutorial } from '../../src/games/remainder-islands/tutorial';
import { juggleTutorial } from '../../src/games/juggle/tutorial';

describe('hexTutorial highlightSelector wiring', () => {
  it('keeps known step ids and board/legend selectors', () => {
    const ids = hexTutorial.steps.map((s) => s.id);
    expect(ids[0]).toBe('welcome');
    expect(ids).toContain('board-intro');
    expect(ids).toContain('complete');
    expect(
      hexTutorial.steps.find((s) => s.id === 'players')?.highlightSelector
    ).toBe('.hex-legend');
    expect(
      hexTutorial.steps.find((s) => s.id === 'board-intro')?.highlightSelector
    ).toBe('.hex-board');
    expect(
      hexTutorial.steps.find((s) => s.id === 'gameplay')?.highlightSelector
    ).toBe('.hex-board');
  });
});

describe('callaTutorial highlightSelector wiring', () => {
  it('highlights board / pits / store without inventing steps', () => {
    expect(callaTutorial.steps.map((s) => s.id)).toEqual([
      'welcome',
      'goal',
      'board-intro',
      'pits-explained',
      'how-to-move',
      'your-calla',
      'free-turn',
      'capture',
      'strategy-tip',
      'complete',
    ]);
    expect(
      callaTutorial.steps.find((s) => s.id === 'board-intro')?.highlightSelector
    ).toBe('.calla-board');
    expect(
      callaTutorial.steps.find((s) => s.id === 'pits-explained')
        ?.highlightSelector
    ).toBe('.calla-pit');
    expect(
      callaTutorial.steps.find((s) => s.id === 'your-calla')?.highlightSelector
    ).toBe('.calla-store');
  });
});

describe('fabADiffyTutorial highlightSelector wiring', () => {
  it('wires pool / answer board / scores selectors', () => {
    expect(
      fabADiffyTutorial.steps.find((s) => s.id === 'turn-sequence')
        ?.highlightSelector
    ).toBe('.fab-bar-pool');
    expect(
      fabADiffyTutorial.steps.find((s) => s.id === 'rules')?.highlightSelector
    ).toBe('.fab-answer-board');
    expect(
      fabADiffyTutorial.steps.find((s) => s.id === 'winning')?.highlightSelector
    ).toBe('.fab-scores');
    expect(fabADiffyTutorial.steps[0]?.id).toBe('welcome');
  });
});

describe('primeGoldTutorial highlightSelector wiring', () => {
  it('wires board / dice / scores selectors', () => {
    expect(
      primeGoldTutorial.steps.find((s) => s.id === 'the-board')
        ?.highlightSelector
    ).toBe('.pg-board');
    expect(
      primeGoldTutorial.steps.find((s) => s.id === 'turn-sequence')
        ?.highlightSelector
    ).toBe('.pg-dice-area');
    expect(
      primeGoldTutorial.steps.find((s) => s.id === 'prime-veins')
        ?.highlightSelector
    ).toBe('.pg-scores');
  });
});

describe('ramrod / pent / remainder / juggle tutorial selectors', () => {
  it('Ramrod highlights rods / board / scores', () => {
    expect(
      ramrodTutorial.steps.find((s) => s.id === 'cuisenaire-rods')
        ?.highlightSelector
    ).toBe('.ramrod-player-rods');
    expect(
      ramrodTutorial.steps.find((s) => s.id === 'turn-sequence')
        ?.highlightSelector
    ).toBe('.ramrod-board');
    expect(
      ramrodTutorial.steps.find((s) => s.id === 'winning')?.highlightSelector
    ).toBe('.ramrod-scores');
  });

  it("Pent'Em In highlights board / piece selector", () => {
    expect(
      pentEmInTutorial.steps.find((s) => s.id === 'setup')?.highlightSelector
    ).toBe('.pent-board');
    expect(
      pentEmInTutorial.steps.find((s) => s.id === 'turn-sequence')
        ?.highlightSelector
    ).toBe('.pent-piece-selector');
  });

  it('Remainder Islands highlights dice / board / scores', () => {
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

  it('Juggle highlights dice / boards', () => {
    expect(
      juggleTutorial.steps.find((s) => s.id === 'turn-sequence')
        ?.highlightSelector
    ).toBe('.juggle-dice-area');
    expect(
      juggleTutorial.steps.find((s) => s.id === 'placement-rules')
        ?.highlightSelector
    ).toBe('.juggle-boards');
  });
});
