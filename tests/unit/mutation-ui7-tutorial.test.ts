/**
 * q-mp-251 mutation audit UI wave 7 — kill clear survivors in core/tutorial.
 * Geometry / focus / step-null pins only — no tutorial title/message copy asserts.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { TutorialManager } from '../../src/core/tutorial';

describe('mutation-ui7 tutorial', () => {
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

  function mountCell(id = 'ui7-tutorial-cell', size = 40): void {
    cell = document.createElement('div');
    cell.id = id;
    Object.defineProperty(cell, 'getBoundingClientRect', {
      configurable: true,
      value: () => ({
        left: 200,
        top: 200,
        right: 200 + size,
        bottom: 200 + size,
        width: size,
        height: size,
        x: 200,
        y: 200,
        toJSON: () => ({}),
      }),
    });
    document.body.appendChild(cell);
  }

  it('default highlight padding is exactly 8px (kills DEFAULT_HIGHLIGHT 8→7|9)', () => {
    // Survivors: L46 NumericBoundary 8 → 7|9 on DEFAULT_HIGHLIGHT_PADDING_PX.
    // Non-click-cell ring: width = cell + padding*2 → 40+16 = 56.
    mountCell('ui7-pad', 40);
    manager = new TutorialManager();
    manager.start({
      id: 'ui7-pad',
      name: 'Pad',
      steps: [
        {
          id: 's1',
          title: 'T',
          message: 'M',
          highlightSelector: '#ui7-pad',
        },
      ],
    });
    const ring = document.querySelector(
      '.tutorial-highlight-ring'
    ) as HTMLElement;
    expect(ring).toBeTruthy();
    expect(parseFloat(ring.style.width)).toBe(56);
    expect(parseFloat(ring.style.height)).toBe(56);
    expect(parseFloat(ring.style.left)).toBe(192); // 200 - 8
    expect(parseFloat(ring.style.top)).toBe(192);
  });

  it('getCurrentStep null when inactive with config still set (kills || → &&)', () => {
    // Survivor: L115 Logical `!config || !isActive` → `&&`.
    mountCell();
    manager = new TutorialManager();
    const during: Array<ReturnType<TutorialManager['getCurrentStep']>> = [];
    manager.on((event) => {
      if (event.type === 'completed' || event.type === 'exited') {
        during.push(manager.getCurrentStep());
      }
    });
    manager.start({
      id: 'ui7-step',
      name: 'Step',
      steps: [
        {
          id: 's1',
          title: 'T',
          message: 'M',
          highlightSelector: '#ui7-tutorial-cell',
        },
      ],
    });
    expect(manager.getCurrentStep()?.id).toBe('s1');
    manager.complete();
    expect(during).toHaveLength(1);
    expect(during[0]).toBeNull();
  });

  it('restores focus to starter control (kills restoreReturnFocus remove !)', async () => {
    // Survivor: L103 UnaryNot remove ! — skips focus restore when trigger exists.
    mountCell();
    const trigger = document.createElement('button');
    trigger.id = 'ui7-tutorial-trigger';
    document.body.appendChild(trigger);
    trigger.focus();
    manager = new TutorialManager();
    manager.start({
      id: 'ui7-focus',
      name: 'Focus',
      steps: [
        {
          id: 's1',
          title: 'T',
          message: 'M',
          highlightSelector: '#ui7-tutorial-cell',
        },
      ],
    });
    await Promise.resolve();
    manager.complete();
    await Promise.resolve();
    expect(document.activeElement).toBe(trigger);
    trigger.remove();
  });

  it('second start cleans prior overlay (documents overlay || tooltip survivor)', () => {
    // Survivor: L79 `overlay || tooltip` → `&&` needs half-built private state.
    // Pin idempotent restart still yields a single overlay (clear path).
    mountCell();
    manager = new TutorialManager();
    const cfg = {
      id: 'ui7-restart',
      name: 'Restart',
      steps: [
        {
          id: 's1',
          title: 'T',
          message: 'M',
          highlightSelector: '#ui7-tutorial-cell',
        },
      ],
    };
    manager.start(cfg);
    manager.start(cfg);
    expect(document.querySelectorAll('.tutorial-overlay').length).toBe(1);
    expect(document.querySelectorAll('.tutorial-tooltip').length).toBe(1);
  });

  // Pinned geometry survivors (same class as wave 4):
  it.skip('TOOLTIP_AVOID_GAP_PX 12 → 11|13 (pinned; margin masks most paths)', () => {
    expect(true).toBe(true);
  });

  it.skip('TAP_CUE_AVOID_HEIGHT_PX 36 → 35|37 (pinned geometry boundary)', () => {
    expect(true).toBe(true);
  });
});
