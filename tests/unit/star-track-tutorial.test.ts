import { describe, it, expect } from 'vitest';
import { starTrackTutorial } from '../../src/games/star-track/tutorial';

describe('starTrackTutorial requiredAction wiring', () => {
  it('requires clicking Draw Chains on the draw-button step', () => {
    const step = starTrackTutorial.steps.find((s) => s.id === 'draw-button');
    expect(step?.highlightSelector).toBe('.star-track-draw-btn');
    expect(step?.requiredAction).toEqual({
      type: 'click',
      selector: '.star-track-draw-btn',
    });
  });

  it('requires clicking a chain choice on the choose-chain step', () => {
    const step = starTrackTutorial.steps.find((s) => s.id === 'choose-chain');
    expect(step?.highlightSelector).toBe('.star-track-choices');
    expect(step?.requiredAction).toEqual({
      type: 'click',
      selector: '.star-track-choices',
    });
  });

  it('does not invent new steps or rewrite other step copy', () => {
    expect(starTrackTutorial.steps.map((s) => s.id)).toEqual([
      'welcome',
      'goal',
      'track-intro',
      'chains-intro',
      'how-turn-works',
      'draw-button',
      'choose-chain',
      'strategy-tip',
      'complete',
    ]);
    const draw = starTrackTutorial.steps.find((s) => s.id === 'draw-button');
    expect(draw?.message).toContain('"Draw Chains"');
    const choose = starTrackTutorial.steps.find((s) => s.id === 'choose-chain');
    expect(choose?.message).toContain('Click on the chain you want to use!');
  });
});
