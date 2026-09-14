/**
 * Wave 40 — tutorial click-cell hit proxy min size leftovers.
 * Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';

import { TutorialManager } from '../../src/core/tutorial';

describe('Wave 40 tutorial — hit proxy min size', () => {
  let manager: TutorialManager;
  let cell: HTMLDivElement;

  afterEach(() => {
    manager?.exit();
    cell?.remove();
    document
      .querySelectorAll(
        '.tutorial-tooltip, .tutorial-overlay, .tutorial-hit-proxy, .tutorial-tap-cue'
      )
      .forEach((el) => el.remove());
  });

  it('tiny click-cell highlight still yields hit proxy ≥56px', () => {
    cell = document.createElement('div');
    cell.id = 'w40-tiny-cell';
    Object.defineProperty(cell, 'getBoundingClientRect', {
      configurable: true,
      value: () => ({
        left: 80,
        top: 80,
        right: 90,
        bottom: 90,
        width: 10,
        height: 10,
        x: 80,
        y: 80,
        toJSON: () => ({}),
      }),
    });
    document.body.appendChild(cell);

    manager = new TutorialManager();
    manager.start({
      id: 'w40-hit',
      name: 'Hit',
      steps: [
        {
          id: 'tap',
          title: 'Tap',
          message: 'cell',
          highlightSelector: '#w40-tiny-cell',
          requiredAction: { type: 'click-cell', row: 0, col: 0 },
        },
      ],
    });

    const proxy = document.querySelector(
      '.tutorial-hit-proxy'
    ) as HTMLButtonElement;
    expect(proxy).toBeTruthy();
    expect(proxy.getAttribute('aria-label')).toBe('Tap here');
    // 10px cell + 24px pad*2 = 58 highlight → max(58, 56) = 58
    expect(parseFloat(proxy.style.width)).toBeGreaterThanOrEqual(56);
    expect(parseFloat(proxy.style.height)).toBeGreaterThanOrEqual(56);
    expect(parseFloat(proxy.style.width)).toBe(58);
    expect(parseFloat(proxy.style.height)).toBe(58);
  });

  it('sub-min padded highlight clamps exactly to 56', () => {
    cell = document.createElement('div');
    cell.id = 'w40-nano-cell';
    Object.defineProperty(cell, 'getBoundingClientRect', {
      configurable: true,
      value: () => ({
        left: 50,
        top: 50,
        right: 54,
        bottom: 54,
        width: 4,
        height: 4,
        x: 50,
        y: 50,
        toJSON: () => ({}),
      }),
    });
    document.body.appendChild(cell);

    manager = new TutorialManager();
    manager.start({
      id: 'w40-nano',
      name: 'Nano',
      steps: [
        {
          id: 'tap',
          title: 'Tap',
          message: 'nano',
          highlightSelector: '#w40-nano-cell',
          requiredAction: { type: 'click-cell', row: 1, col: 1 },
        },
      ],
    });

    const proxy = document.querySelector(
      '.tutorial-hit-proxy'
    ) as HTMLButtonElement;
    // 4 + 48 pad = 52 → clamp to 56
    expect(parseFloat(proxy.style.width)).toBe(56);
    expect(parseFloat(proxy.style.height)).toBe(56);
  });
});
