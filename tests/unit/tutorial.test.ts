import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { TutorialManager, type TutorialConfig } from '../../src/core/tutorial';

describe('TutorialManager highlight ring', () => {
  let manager: TutorialManager;
  let target: HTMLElement;

  beforeEach(() => {
    manager = new TutorialManager();
    target = document.createElement('button');
    target.className = 'draw-btn';
    document.body.appendChild(target);
  });

  afterEach(() => {
    manager.exit();
    target.remove();
    document.querySelector('.missing-target')?.remove();
  });

  it('clears the highlight ring when the next step selector is missing from the DOM', () => {
    const config: TutorialConfig = {
      id: 'stale-ring-repro',
      name: 'Stale Ring',
      steps: [
        {
          id: 'draw',
          title: 'Drawing Chains',
          message: 'Click draw',
          highlightSelector: '.draw-btn',
          position: 'bottom',
        },
        {
          id: 'choose-chain',
          title: 'Choosing Your Chain',
          message: 'Pick a chain',
          highlightSelector: '.star-track-choices',
          position: 'bottom',
        },
      ],
    };

    manager.start(config);

    const ring = document.querySelector('.tutorial-highlight-ring') as HTMLElement;
    expect(ring).toBeTruthy();
    expect(ring.style.display).toBe('block');

    manager.nextStep();

    expect(manager.getCurrentStep()?.id).toBe('choose-chain');
    expect(document.querySelector('.star-track-choices')).toBeNull();
    expect(ring.style.display).toBe('none');
  });

  it('rings the target when the highlight selector is present', () => {
    const choices = document.createElement('div');
    choices.className = 'star-track-choices';
    document.body.appendChild(choices);

    const config: TutorialConfig = {
      id: 'present-target',
      name: 'Present Target',
      steps: [
        {
          id: 'choose-chain',
          title: 'Choosing Your Chain',
          message: 'Pick a chain',
          highlightSelector: '.star-track-choices',
          position: 'bottom',
        },
      ],
    };

    manager.start(config);

    const ring = document.querySelector('.tutorial-highlight-ring') as HTMLElement;
    expect(ring.style.display).toBe('block');

    choices.remove();
  });
});
