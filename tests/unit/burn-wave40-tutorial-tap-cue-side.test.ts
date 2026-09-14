/**
 * Wave 40 — tutorial tap cue above/below vs tooltip preferred leftovers.
 * Tests-only.
 */
import { describe, it, expect, afterEach, beforeEach, vi } from 'vitest';

import { TutorialManager } from '../../src/core/tutorial';

describe('Wave 40 tutorial — tap cue side', () => {
  let manager: TutorialManager;
  let cell: HTMLDivElement;

  beforeEach(() => {
    vi.stubGlobal('innerWidth', 1024);
    vi.stubGlobal('innerHeight', 768);
    vi.stubGlobal('visualViewport', {
      width: 1024,
      height: 768,
      offsetLeft: 0,
      offsetTop: 0,
      addEventListener: () => {},
      removeEventListener: () => {},
    });
    Object.defineProperty(HTMLElement.prototype, 'offsetWidth', {
      configurable: true,
      get() {
        return (this as HTMLElement).classList?.contains('tutorial-tooltip')
          ? 280
          : 0;
      },
    });
    Object.defineProperty(HTMLElement.prototype, 'offsetHeight', {
      configurable: true,
      get() {
        return (this as HTMLElement).classList?.contains('tutorial-tooltip')
          ? 120
          : 0;
      },
    });
  });

  afterEach(() => {
    manager?.exit();
    cell?.remove();
    document
      .querySelectorAll(
        '.tutorial-tooltip, .tutorial-overlay, .tutorial-hit-proxy, .tutorial-tap-cue'
      )
      .forEach((el) => el.remove());
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  function mountCell(top: number): void {
    cell = document.createElement('div');
    cell.id = 'w40-cue-cell';
    Object.defineProperty(cell, 'getBoundingClientRect', {
      configurable: true,
      value: () => ({
        left: 400,
        top,
        right: 440,
        bottom: top + 40,
        width: 40,
        height: 40,
        x: 400,
        y: top,
        toJSON: () => ({}),
      }),
    });
    document.body.appendChild(cell);
  }

  it('preferred tooltip top places Tap here cue below', () => {
    mountCell(300);
    manager = new TutorialManager();
    manager.start({
      id: 'w40-cue-top',
      name: 'CueTop',
      steps: [
        {
          id: 'tap',
          title: 'Tap',
          message: 'go',
          highlightSelector: '#w40-cue-cell',
          position: 'top',
          requiredAction: { type: 'click-cell', row: 0, col: 0 },
        },
      ],
    });

    const cue = document.querySelector('.tutorial-tap-cue') as HTMLElement;
    expect(cue).toBeTruthy();
    expect(cue.classList.contains('tutorial-tap-cue--below')).toBe(true);
    expect(cue.classList.contains('tutorial-tap-cue--above')).toBe(false);
  });

  it('preferred tooltip bottom places Tap here cue above', () => {
    mountCell(300);
    manager = new TutorialManager();
    manager.start({
      id: 'w40-cue-bottom',
      name: 'CueBottom',
      steps: [
        {
          id: 'tap',
          title: 'Tap',
          message: 'go',
          highlightSelector: '#w40-cue-cell',
          position: 'bottom',
          requiredAction: { type: 'click-cell', row: 0, col: 0 },
        },
      ],
    });

    const cue = document.querySelector('.tutorial-tap-cue') as HTMLElement;
    expect(cue).toBeTruthy();
    expect(cue.classList.contains('tutorial-tap-cue--above')).toBe(true);
    expect(cue.classList.contains('tutorial-tap-cue--below')).toBe(false);
  });

  it('near-top highlight with non-bottom preferred still cues below', () => {
    mountCell(20);
    manager = new TutorialManager();
    manager.start({
      id: 'w40-cue-near-top',
      name: 'CueNearTop',
      steps: [
        {
          id: 'tap',
          title: 'Tap',
          message: 'go',
          highlightSelector: '#w40-cue-cell',
          position: 'right',
          requiredAction: { type: 'click-cell', row: 0, col: 0 },
        },
      ],
    });

    const cue = document.querySelector('.tutorial-tap-cue') as HTMLElement;
    expect(cue).toBeTruthy();
    // highlightTop (20-24 pad) < 40 → preferBelow when side !== bottom
    expect(cue.classList.contains('tutorial-tap-cue--below')).toBe(true);
  });
});
