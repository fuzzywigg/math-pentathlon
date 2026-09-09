import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
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

describe('TutorialManager tooltip viewport clamp', () => {
  let manager: TutorialManager;
  let board: HTMLElement;

  beforeEach(() => {
    manager = new TutorialManager();
    board = document.createElement('div');
    board.className = 'star-track-board';
    // Wide board whose center would place a 300px+ tooltip past the left edge
    Object.defineProperty(board, 'getBoundingClientRect', {
      value: () => ({
        left: -80,
        top: 120,
        right: 420,
        bottom: 420,
        width: 500,
        height: 300,
        x: -80,
        y: 120,
        toJSON: () => ({}),
      }),
    });
    document.body.appendChild(board);

    vi.stubGlobal('innerWidth', 390);
    vi.stubGlobal('innerHeight', 844);
    vi.stubGlobal('visualViewport', {
      width: 390,
      height: 844,
      offsetLeft: 0,
      offsetTop: 0,
      addEventListener: () => {},
      removeEventListener: () => {},
    });
  });

  afterEach(() => {
    manager.exit();
    board.remove();
    vi.unstubAllGlobals();
    document.querySelectorAll('.tutorial-tooltip, .tutorial-overlay').forEach((el) => el.remove());
  });

  it('keeps tooltip fully inside a 390px viewport after center → anchored step', () => {
    const config: TutorialConfig = {
      id: 'mobile-clip-repro',
      name: 'Mobile Clip',
      steps: [
        {
          id: 'welcome',
          title: 'Welcome',
          message: '<p>Intro</p>',
          position: 'center',
        },
        {
          id: 'board',
          title: 'The Game Board',
          message: '<p>See the path of circles?</p>',
          highlightSelector: '.star-track-board',
          position: 'bottom',
        },
      ],
    };

    manager.start(config);

    const tooltip = document.querySelector('.tutorial-tooltip') as HTMLElement;
    expect(tooltip).toBeTruthy();

    // Simulate laid-out size (jsdom often reports 0 without CSS)
    Object.defineProperty(tooltip, 'offsetWidth', { configurable: true, get: () => 358 });
    Object.defineProperty(tooltip, 'offsetHeight', { configurable: true, get: () => 220 });

    manager.nextStep();

    expect(manager.getCurrentStep()?.id).toBe('board');
    expect(tooltip.style.transform).toBe('none');
    expect(tooltip.style.margin).toBe('0px');

    const left = parseFloat(tooltip.style.left);
    const top = parseFloat(tooltip.style.top);
    expect(left).toBeGreaterThanOrEqual(16);
    expect(top).toBeGreaterThanOrEqual(16);
    expect(left + 358).toBeLessThanOrEqual(390 - 16 + 0.5);
    // Must not read as mid-word clip ("ep 3 of 9" / "he Game Board")
    expect(left).toBeLessThan(50);
  });

  it('pins centered tooltips with absolute coords instead of translate(-50%)', () => {
    const widthDesc = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'offsetWidth');
    const heightDesc = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'offsetHeight');
    Object.defineProperty(HTMLElement.prototype, 'offsetWidth', {
      configurable: true,
      get() {
        return (this as HTMLElement).classList?.contains('tutorial-tooltip') ? 358 : 0;
      },
    });
    Object.defineProperty(HTMLElement.prototype, 'offsetHeight', {
      configurable: true,
      get() {
        return (this as HTMLElement).classList?.contains('tutorial-tooltip') ? 200 : 0;
      },
    });

    try {
      const config: TutorialConfig = {
        id: 'center-absolute',
        name: 'Center Absolute',
        steps: [
          {
            id: 'welcome',
            title: 'Welcome to Star Track!',
            message: '<p>Intro</p>',
            position: 'center',
          },
        ],
      };

      manager.start(config);

      const tooltip = document.querySelector('.tutorial-tooltip') as HTMLElement;
      expect(tooltip.style.transform).toBe('none');
      expect(tooltip.style.left).not.toBe('50%');
      const left = parseFloat(tooltip.style.left);
      // (390 - 358) / 2 = 16
      expect(left).toBe(16);
    } finally {
      if (widthDesc) Object.defineProperty(HTMLElement.prototype, 'offsetWidth', widthDesc);
      if (heightDesc) Object.defineProperty(HTMLElement.prototype, 'offsetHeight', heightDesc);
    }
  });
});
