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

describe('TutorialManager click-cell tap target', () => {
  let manager: TutorialManager;
  let cell: HTMLElement;

  beforeEach(() => {
    manager = new TutorialManager();
    cell = document.createElement('div');
    cell.className = 'cell';
    cell.dataset.row = '1';
    cell.dataset.col = '5';
    Object.defineProperty(cell, 'getBoundingClientRect', {
      configurable: true,
      value: () => ({
        left: 160,
        top: 80,
        right: 200,
        bottom: 120,
        width: 40,
        height: 40,
        x: 160,
        y: 80,
        toJSON: () => ({}),
      }),
    });
    document.body.appendChild(cell);
  });

  afterEach(() => {
    manager.exit();
    cell.remove();
    document
      .querySelectorAll('.tutorial-tooltip, .tutorial-overlay, .tutorial-hit-proxy, .tutorial-tap-cue')
      .forEach((el) => el.remove());
  });

  it('adds enlarged hit proxy, Tap here cue, and stable action ring for click-cell steps', () => {
    const config: TutorialConfig = {
      id: 'kings-tap-target',
      name: 'Kings Tap',
      steps: [
        {
          id: 'select-king',
          title: 'Select Your King',
          message: 'Tap your King',
          highlightSelector: '.cell[data-row="1"][data-col="5"]',
          position: 'left',
          requiredAction: { type: 'click-cell', row: 1, col: 5 },
        },
      ],
    };

    manager.start(config);

    const ring = document.querySelector('.tutorial-highlight-ring') as HTMLElement;
    expect(ring.classList.contains('tutorial-highlight-ring--action')).toBe(true);
    // 40px cell + 24px padding each side = 88
    expect(parseFloat(ring.style.width)).toBe(88);
    expect(parseFloat(ring.style.height)).toBe(88);

    expect(cell.classList.contains('tutorial-tap-target')).toBe(true);

    const cue = document.querySelector('.tutorial-tap-cue') as HTMLElement;
    expect(cue).toBeTruthy();
    expect(cue.textContent).toBe('Tap here');

    const proxy = document.querySelector('.tutorial-hit-proxy') as HTMLButtonElement;
    expect(proxy).toBeTruthy();
    expect(proxy.getAttribute('aria-label')).toBe('Tap here');
    expect(parseFloat(proxy.style.width)).toBeGreaterThanOrEqual(56);
    expect(parseFloat(proxy.style.height)).toBeGreaterThanOrEqual(56);
  });

  it('does not add hit proxy for highlight-only steps', () => {
    const config: TutorialConfig = {
      id: 'highlight-only',
      name: 'Highlight Only',
      steps: [
        {
          id: 'look',
          title: 'Look',
          message: 'See the king',
          highlightSelector: '.cell[data-row="1"][data-col="5"]',
          position: 'left',
        },
      ],
    };

    manager.start(config);

    const ring = document.querySelector('.tutorial-highlight-ring') as HTMLElement;
    expect(ring.classList.contains('tutorial-highlight-ring--action')).toBe(false);
    expect(parseFloat(ring.style.width)).toBe(56); // 40 + 8*2
    expect(document.querySelector('.tutorial-hit-proxy')).toBeNull();
    expect(document.querySelector('.tutorial-tap-cue')).toBeNull();
    expect(cell.classList.contains('tutorial-tap-target')).toBe(false);
  });

  it('forwards hit-proxy clicks to the target cell', () => {
    const clickSpy = vi.fn();
    cell.addEventListener('click', clickSpy);

    const config: TutorialConfig = {
      id: 'proxy-forward',
      name: 'Proxy Forward',
      steps: [
        {
          id: 'select-king',
          title: 'Select',
          message: 'Tap',
          highlightSelector: '.cell[data-row="1"][data-col="5"]',
          requiredAction: { type: 'click-cell', row: 1, col: 5 },
        },
        {
          id: 'done',
          title: 'Done',
          message: 'Done',
          position: 'center',
        },
      ],
    };

    manager.start(config);

    const proxy = document.querySelector('.tutorial-hit-proxy') as HTMLButtonElement;
    proxy.click();

    expect(clickSpy).toHaveBeenCalled();
  });

  it('keeps tooltip clear of Blue King highlight + Tap here at 390px (select-king)', () => {
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

    // Top-center board cell (Player 1 King) — preferred position is "left" which cannot fit
    Object.defineProperty(cell, 'getBoundingClientRect', {
      configurable: true,
      value: () => ({
        left: 175,
        top: 168,
        right: 215,
        bottom: 208,
        width: 40,
        height: 40,
        x: 175,
        y: 168,
        toJSON: () => ({}),
      }),
    });

    const config: TutorialConfig = {
      id: 'kings-select-no-occlude',
      name: 'Select King Mobile',
      steps: [
        {
          id: 'select-king',
          title: 'Step 1: Select Your King',
          message:
            '<p>Look for the yellow <strong>Tap here</strong> cue and tap your Blue King.</p>',
          highlightSelector: '.cell[data-row="1"][data-col="5"]',
          position: 'left',
          requiredAction: { type: 'click-cell', row: 1, col: 5 },
        },
      ],
    };

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
        return (this as HTMLElement).classList?.contains('tutorial-tooltip') ? 260 : 0;
      },
    });

    try {
      manager.start(config);

      const tooltip = document.querySelector('.tutorial-tooltip') as HTMLElement;
      const cue = document.querySelector('.tutorial-tap-cue') as HTMLElement;
      const proxy = document.querySelector('.tutorial-hit-proxy') as HTMLElement;
      const ring = document.querySelector('.tutorial-highlight-ring') as HTMLElement;

      expect(cue).toBeTruthy();
      expect(proxy).toBeTruthy();
      // Option 1: must be body siblings of tooltip — not trapped under overlay stacking
      expect(proxy.parentElement).toBe(document.body);
      expect(cue.parentElement).toBe(document.body);
      expect(document.querySelector('.tutorial-overlay')?.contains(proxy)).toBe(false);

      const tipLeft = parseFloat(tooltip.style.left);
      const tipTop = parseFloat(tooltip.style.top);
      const tipW = 358;
      const tipH = 260;
      const tipRight = tipLeft + tipW;
      const tipBottom = tipTop + tipH;

      // Highlight cutout: cell ± 24px padding → 151..239 x 144..232
      const avoidLeft = 175 - 24;
      const avoidTop = 168 - 24 - 36; // cue above
      const avoidRight = 215 + 24;
      const avoidBottom = 208 + 24;
      const gap = 12;

      const overlaps =
        !(
          tipRight + gap <= avoidLeft ||
          tipLeft >= avoidRight + gap ||
          tipBottom + gap <= avoidTop ||
          tipTop >= avoidBottom + gap
        );

      expect(overlaps).toBe(false);
      // Prefer flipping below the top king rather than covering it
      expect(tipTop).toBeGreaterThanOrEqual(avoidBottom + gap);
      expect(parseFloat(ring.style.top)).toBe(168 - 24);
    } finally {
      if (widthDesc) Object.defineProperty(HTMLElement.prototype, 'offsetWidth', widthDesc);
      if (heightDesc) Object.defineProperty(HTMLElement.prototype, 'offsetHeight', heightDesc);
      vi.unstubAllGlobals();
    }
  });

  it('keeps preferred left placement on desktop when there is room beside the target', () => {
    vi.stubGlobal('innerWidth', 1280);
    vi.stubGlobal('innerHeight', 800);
    vi.stubGlobal('visualViewport', {
      width: 1280,
      height: 800,
      offsetLeft: 0,
      offsetTop: 0,
      addEventListener: () => {},
      removeEventListener: () => {},
    });

    Object.defineProperty(cell, 'getBoundingClientRect', {
      configurable: true,
      value: () => ({
        left: 520,
        top: 160,
        right: 560,
        bottom: 200,
        width: 40,
        height: 40,
        x: 520,
        y: 160,
        toJSON: () => ({}),
      }),
    });

    const widthDesc = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'offsetWidth');
    const heightDesc = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'offsetHeight');
    Object.defineProperty(HTMLElement.prototype, 'offsetWidth', {
      configurable: true,
      get() {
        return (this as HTMLElement).classList?.contains('tutorial-tooltip') ? 360 : 0;
      },
    });
    Object.defineProperty(HTMLElement.prototype, 'offsetHeight', {
      configurable: true,
      get() {
        return (this as HTMLElement).classList?.contains('tutorial-tooltip') ? 220 : 0;
      },
    });

    try {
      manager.start({
        id: 'desktop-left',
        name: 'Desktop Left',
        steps: [
          {
            id: 'select-king',
            title: 'Select Your King',
            message: 'Tap your King',
            highlightSelector: '.cell[data-row="1"][data-col="5"]',
            position: 'left',
            requiredAction: { type: 'click-cell', row: 1, col: 5 },
          },
        ],
      });

      const tooltip = document.querySelector('.tutorial-tooltip') as HTMLElement;
      const tipLeft = parseFloat(tooltip.style.left);
      const tipRight = tipLeft + 360;
      // Avoid left edge of padded highlight: 520 - 24 = 496
      expect(tipRight).toBeLessThanOrEqual(496 - 12);
    } finally {
      if (widthDesc) Object.defineProperty(HTMLElement.prototype, 'offsetWidth', widthDesc);
      if (heightDesc) Object.defineProperty(HTMLElement.prototype, 'offsetHeight', heightDesc);
      vi.unstubAllGlobals();
    }
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
