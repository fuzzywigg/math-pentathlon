/**
 * q-mp-372 — engine coverage round 12: post-r11 residual characterization.
 *
 * Themes: cold NON-RULES core helpers after r10/r11. Prefer
 * src/core/attributes/ + src/core/dice/ leftovers (not rules.ts, not scoring
 * logic). Pins CURRENT behavior only.
 *
 * Parallel with q-mp-349 (engine r11): r11 owns polyomino / fractions / graph;
 * this round owns attributes + dice (+ tutorial exit helper leftover).
 * Does not change engine / rules.ts / AI source.
 *
 * Baseline rank (tip post830 @ 97487de6, coverage-engine-r12-detail,
 * unit-shared+unit-node excl. AI/bench):
 *   attributes/attribute-ui.ts  92.85% branches (65/70)  lines 50,403
 *   dice/dice-ui.ts             94.82% branches (55/58)  lines 360,424
 *   attributes/logic.ts         100%
 *   dice/roller.ts + selector   100%
 */
import { afterEach, describe, expect, it, vi } from 'vitest';

import {
  renderAttributePiece,
  renderSetCard,
  createPieceGrid,
} from '../../src/core/attributes/attribute-ui';
import {
  BASIC_ATTRIBUTES,
  createPiece,
  type AttributeDefinition,
} from '../../src/core/attributes/types';
import { animateRoll } from '../../src/core/dice/dice-ui';
import type { DieRoll, RollResult } from '../../src/core/dice/types';
import {
  exitTutorialIfActive,
  tutorialManager,
  type TutorialConfig,
} from '../../src/core/tutorial';
import {
  resetSettingsFlagsForTests,
  setUserReducedMotionFlag,
} from '../../src/core/settings-flags';

function makeDie(
  partial: Partial<DieRoll> & Pick<DieRoll, 'id' | 'diceType' | 'value'>
): DieRoll {
  return {
    isSelected: false,
    isLocked: false,
    timestamp: 1,
    ...partial,
  };
}

afterEach(() => {
  document.body.innerHTML = '';
  if (tutorialManager.getIsActive()) {
    tutorialManager.exit();
  }
  resetSettingsFlagsForTests();
  vi.useRealTimers();
  vi.restoreAllMocks();
});

// =============================================================================
// 1. attributes/attribute-ui.ts — preferred host (missing-attr + shading default)
// =============================================================================

describe('engine-coverage-round-12 — attributes/attribute-ui', () => {
  it('skips definitions whose attribute is absent on the piece', () => {
    // L50: value === undefined → continue while walking definitions.
    const defs: AttributeDefinition[] = [
      {
        name: 'color',
        possibleValues: ['red', 'blue'],
        colorMap: { red: '#f00', blue: '#00f' },
      },
      {
        name: 'shape',
        possibleValues: ['circle', 'square'],
        colorMap: { circle: '#111', square: '#222' },
      },
      {
        // Present in definitions but intentionally missing on the piece.
        name: 'size',
        possibleValues: ['small', 'large'],
        colorMap: { small: '#aaa', large: '#bbb' },
      },
    ];
    const piece = createPiece('sparse', { color: 'red', shape: 'circle' });
    const svg = renderAttributePiece(piece, defs, {
      shape: 'card',
      showLabels: false,
    });
    expect(svg.dataset.pieceId).toBe('sparse');
    // Color still applied from the present attr; missing size must not throw.
    expect(svg.querySelector('rect')?.getAttribute('fill')).toBe('#f00');
  });

  it('unknown SET shading falls through default (no fill/stroke mutation)', () => {
    // L403: shading switch default break — leaves element attrs unset until
    // the shared stroke-width append.
    const svg = renderSetCard(
      createPiece('shade-x', {
        number: 1,
        shape: 'oval',
        shading: 'glossy',
        color: 'red',
      })
    );
    const oval = svg.querySelector('ellipse');
    expect(oval).toBeTruthy();
    // Default branch does not set fill/stroke; only stroke-width is applied.
    expect(oval?.getAttribute('fill')).toBeNull();
    expect(oval?.getAttribute('stroke')).toBeNull();
    expect(oval?.getAttribute('stroke-width')).toBe('2');
  });

  it('forged piece shape config falls back to card renderer', () => {
    // shape switch default → renderCard (defensive; public union is closed).
    const piece = createPiece('p', {
      shape: 'circle',
      color: 'blue',
      size: 'small',
    });
    const svg = renderAttributePiece(piece, BASIC_ATTRIBUTES, {
      // 'custom' is in the public union but has no dedicated case → default card.
      shape: 'custom',
      showLabels: false,
    });
    expect(svg.querySelector('rect')).toBeTruthy();
    expect(svg.querySelector('circle')).toBeNull();
  });

  it('createPieceGrid hover paints border only for unselected wrappers', () => {
    const pieces = [
      createPiece('sel', { shape: 'circle', color: 'red', size: 'small' }),
      createPiece('open', { shape: 'square', color: 'blue', size: 'large' }),
    ];
    const grid = createPieceGrid(
      pieces,
      BASIC_ATTRIBUTES,
      () => undefined,
      new Set(['sel'])
    );
    document.body.appendChild(grid);
    const wrappers = [
      ...grid.querySelectorAll('.piece-wrapper'),
    ] as HTMLElement[];
    expect(wrappers).toHaveLength(2);

    // Selected wrapper: mouseenter must NOT repaint border (guard short-circuit).
    const selectedBorder = wrappers[0]!.style.borderColor;
    wrappers[0]!.dispatchEvent(new Event('mouseenter'));
    expect(wrappers[0]!.style.borderColor).toBe(selectedBorder);

    // Unselected: mouseenter → #90caf9, mouseleave → transparent.
    wrappers[1]!.dispatchEvent(new Event('mouseenter'));
    expect(wrappers[1]!.style.borderColor).toBe('rgb(144, 202, 249)');
    wrappers[1]!.dispatchEvent(new Event('mouseleave'));
    expect(wrappers[1]!.style.borderColor).toBe('transparent');
  });
});

// =============================================================================
// 2. dice/dice-ui.ts — preferred host (animateRoll cancel arms)
// =============================================================================

describe('engine-coverage-round-12 — dice/dice-ui animateRoll cancel', () => {
  it('cancel mid-tumble prevents onComplete and leaves host without settled chrome', () => {
    // L424: animate() early-return when cancelled (timer may still be queued
    // if cancel races a clearElement during the tumble update).
    setUserReducedMotionFlag(false);
    vi.useFakeTimers();
    const host = document.createElement('div');
    document.body.appendChild(host);
    const result: RollResult = {
      id: 'cancel-mid',
      total: 5,
      rolls: [makeDie({ id: 'a', diceType: 'd6', value: 5 })],
    };
    const done = vi.fn();

    let cancel: (() => void) | null = null;
    let clears = 0;
    const origReplace = Element.prototype.replaceChildren;
    Element.prototype.replaceChildren = function replaceChildrenSpy(
      this: Element,
      ...nodes: Node[]
    ) {
      const ret = origReplace.apply(this, nodes as never);
      // First clearElement is the initial container wipe; subsequent clears are
      // per-die tumble updates — cancel there so the just-scheduled timeout
      // still fires into animate()'s cancelled guard.
      clears += 1;
      if (clears >= 2 && cancel) {
        cancel();
        cancel = null;
      }
      return ret;
    };

    try {
      cancel = animateRoll(host, result, {
        duration: 200,
        dieSize: 40,
        onComplete: done,
      });
      expect(host.classList.contains('rolling')).toBe(true);
      vi.advanceTimersByTime(250);
      expect(done).not.toHaveBeenCalled();
      expect(host.querySelectorAll('.die-wrapper.settled')).toHaveLength(0);
    } finally {
      Element.prototype.replaceChildren = origReplace;
    }
  });

  it('documents finish() cancelled-guard as public-API unreachable', () => {
    // L360: `if (cancelled) return` inside finish().
    // Public cancel() clears the tumble timer before finish can run, and the
    // duration<=0 path calls finish() synchronously while cancelled is still
    // false. No public interleaving sets cancelled=true before finish entry.
    setUserReducedMotionFlag(true);
    vi.useFakeTimers();
    const host = document.createElement('div');
    document.body.appendChild(host);
    const done = vi.fn();
    const cancel = animateRoll(
      host,
      {
        id: 'instant',
        total: 3,
        rolls: [makeDie({ id: 'x', diceType: 'd6', value: 3 })],
      },
      { duration: 1000, onComplete: done }
    );
    expect(done).toHaveBeenCalledTimes(1);
    cancel();
    vi.advanceTimersByTime(50);
    expect(done).toHaveBeenCalledTimes(1);
    expect(true).toBe(true);
  });
});

// =============================================================================
// 3. tutorial leftover — exitTutorialIfActive (not r11 polyomino/fractions/graph)
// =============================================================================

describe('engine-coverage-round-12 — tutorial exitTutorialIfActive', () => {
  it('exits an active tutorial and no-ops when inactive', () => {
    // L1036–1037: guarded exit when getIsActive().
    const config: TutorialConfig = {
      id: 'r12-exit',
      name: 'r12',
      steps: [
        { id: 's1', title: 'One', message: 'hello' },
        { id: 's2', title: 'Two', message: 'world' },
      ],
    };
    expect(tutorialManager.getIsActive()).toBe(false);
    exitTutorialIfActive();
    expect(tutorialManager.getIsActive()).toBe(false);

    tutorialManager.start(config);
    expect(tutorialManager.getIsActive()).toBe(true);
    exitTutorialIfActive();
    expect(tutorialManager.getIsActive()).toBe(false);
  });
});
