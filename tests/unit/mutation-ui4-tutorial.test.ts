/**
 * q-mp-144 mutation audit UI wave 4 — kill survivors in core/tutorial.
 * No player-facing copy asserts (titles/messages only drive DOM structure).
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { TutorialManager } from '../../src/core/tutorial';

describe('mutation-ui4 tutorial', () => {
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

  function mountCell(): void {
    cell = document.createElement('div');
    cell.id = 'ui4-tutorial-cell';
    Object.defineProperty(cell, 'getBoundingClientRect', {
      configurable: true,
      value: () => ({
        left: 200,
        top: 200,
        right: 240,
        bottom: 240,
        width: 40,
        height: 40,
        x: 200,
        y: 200,
        toJSON: () => ({}),
      }),
    });
    document.body.appendChild(cell);
  }

  it('getCurrentStep is null while completing (inactive before config cleared)', () => {
    // Survivor: L113 `!config || !isActive` → `&&` returns a step when isActive
    // is false but config is still set (complete() clears config after emit).
    mountCell();
    manager = new TutorialManager();
    const duringComplete: Array<ReturnType<TutorialManager['getCurrentStep']>> =
      [];
    manager.on((event) => {
      if (event.type === 'completed' || event.type === 'exited') {
        duringComplete.push(manager.getCurrentStep());
        expect(manager.getIsActive()).toBe(false);
      }
    });
    manager.start({
      id: 'ui4-inactive',
      name: 'Inactive',
      steps: [
        {
          id: 's1',
          title: 'T1',
          message: 'M1',
          highlightSelector: '#ui4-tutorial-cell',
        },
      ],
    });
    expect(manager.getCurrentStep()).not.toBeNull();
    manager.complete();
    expect(duringComplete).toHaveLength(1);
    expect(duringComplete[0]).toBeNull();
    expect(manager.getCurrentStep()).toBeNull();
  });

  it('restores focus to the control that started the tutorial', async () => {
    // Survivor: L103 remove `!` on `if (!trigger) return` skips focus when trigger exists.
    mountCell();
    const trigger = document.createElement('button');
    trigger.id = 'ui4-tutorial-trigger';
    document.body.appendChild(trigger);
    trigger.focus();
    expect(document.activeElement).toBe(trigger);

    manager = new TutorialManager();
    manager.start({
      id: 'ui4-focus',
      name: 'Focus',
      steps: [
        {
          id: 's1',
          title: 'T1',
          message: 'M1',
          highlightSelector: '#ui4-tutorial-cell',
        },
      ],
    });

    await Promise.resolve();
    const next = document.querySelector(
      '.tutorial-next-btn, .tutorial-exit-btn'
    ) as HTMLElement | null;
    expect(next).toBeTruthy();

    manager.complete();
    await Promise.resolve();
    expect(document.activeElement).toBe(trigger);
    trigger.remove();
  });

  // Pinned: TOOLTIP_AVOID_GAP_PX ±1 is often masked by Math.max(margin=16, gap).
  it.skip('TOOLTIP_AVOID_GAP_PX 12 → 11|13 (pinned; margin masks most paths)', () => {
    expect(true).toBe(true);
  });

  // Pinned: TAP_CUE_AVOID_HEIGHT_PX ±1 needs a razor preferVerticalSide boundary.
  it.skip('TAP_CUE_AVOID_HEIGHT_PX 36 → 35|37 (pinned geometry boundary)', () => {
    expect(true).toBe(true);
  });

  // Pinned: start() `overlay || tooltip` → `&&` needs a half-built overlay state.
  it.skip('start cleanup || vs && when only one overlay node exists (pinned)', () => {
    expect(true).toBe(true);
  });
});
