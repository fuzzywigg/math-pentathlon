/**
 * q-mp-547 — engine coverage round 19: post-r18 residual characterization.
 *
 * Themes: cold NON-RULES leftovers preferred by backlog after tip-folded r18
 * (#988 / q-mp-526) pinned storage createProfile ?? + tutorial/graph smoke:
 *   - expressions/expression-ui interactive remove-slot + Clear All re-render
 *   - attributes/attribute-ui SET soft defaults + selected mouseleave guard
 *   - owl/ollie-inspect-map empty-shape / missing-player fallthrough + docs
 *   - game-route-mounts hot smoke only (soft-fail → q-mp-549; mutation → 548)
 *
 * Explicitly deferred (sibling ownership):
 *   - game-route-mounts soft-fail / catch / stale-gen → q-mp-549 (+ mutation 548)
 *   - expression-ui / ollie-inspect-map / mounts mutation scores → q-mp-548
 *   - storage.ts catch soft-fail → #909 / q-mp-420
 *   - graph/algorithms L110/L131/L184 → q-mp-524
 *   - polyomino/transform → #990 / q-mp-525
 *   - dice-selector / board-a11y / pointer-hygiene soft-fail → #981/#986/#984
 *
 * Pins CURRENT behavior only. No engine / rules.ts / AI / scoring / copy
 * edits. Hex Hard stays 450ms. No Stars & Bars history cap.
 *
 * Baseline rank (tip post949 @ 68f1548f, coverage-engine-r19-baseline2,
 * preferred-host suites + r12 attribute pins + mounts soft-fail/happy):
 *   game-route-mounts.ts       75.57% branch (164/217)  ← soft-fail → 549
 *   attribute-ui.ts            95.71% branch (67/70)    ← r19 SET || defaults
 *   ollie-inspect-map.ts       95.58% branch (65/68)    ← r19 fallthrough pins
 *   expression-ui.ts           96.87% branch (93/96)    ← r19 interactive pins
 *   storage createProfile / tutorial / algorithms       ← r18 / deferred
 */
import { afterEach, describe, expect, it, vi } from 'vitest';

import {
  createPieceGrid,
  renderSetCard,
} from '../../src/core/attributes/attribute-ui';
import { BASIC_ATTRIBUTES, createPiece } from '../../src/core/attributes/types';
import { createInteractiveBuilder } from '../../src/core/expressions/expression-ui';
import {
  createNumberCard,
  createOperatorCard,
} from '../../src/core/expressions/types';
import {
  inspectDropSpeech,
  resolveInspectTarget,
  stubNarrationFor,
} from '../../src/core/owl/ollie-inspect-map';
import {
  initGameMountDeps,
  mountGameById,
} from '../../src/ui/game-route-mounts';

// Note: game-route-mounts module deps are process-global. unit-shared pool may
// retain deps from prior mount suites — do not call mountGameById / clear deps
// here (soft-fail + deps lifecycle owned by q-mp-549 / burn-1007).

afterEach(() => {
  document.body.innerHTML = '';
  vi.restoreAllMocks();
});

// =============================================================================
// 1. expressions/expression-ui — interactive remove + Clear All residuals
// =============================================================================

describe('engine-coverage-round-19 — expression-ui interactive residuals', () => {
  it('clicking a filled unlocked slot removes the card and returns it to the tray', () => {
    // L675–677: onSlotClick remove arm (usedCardIds.delete + slot.card = null).
    const host = document.createElement('div');
    document.body.appendChild(host);
    const api = createInteractiveBuilder(host, {
      slotCount: 3,
      availableCards: [
        createNumberCard(2, 'n2'),
        createOperatorCard('+', 'op'),
        createNumberCard(3, 'n3'),
      ],
      targetValue: 5,
    });

    const trayCards = () =>
      Array.from(host.querySelectorAll('.card-tray .expression-card'));
    const slots = () =>
      Array.from(host.querySelectorAll('.expression-slot')) as HTMLElement[];

    expect(trayCards()).toHaveLength(3);
    (trayCards()[0] as HTMLElement).click();
    slots()[0]!.click();
    expect(api.getExpression()).toBe('2');
    expect(trayCards()).toHaveLength(2);

    // Filled slots wire onClick on the inner card (not the slot host).
    const filledCard = slots()[0]!.querySelector(
      '.expression-card'
    ) as HTMLElement;
    expect(filledCard).toBeTruthy();
    filledCard.click();
    expect(api.getExpression()).toBe('');
    expect(trayCards()).toHaveLength(3);
    expect(host.querySelector('.expression-slot.filled')).toBeNull();
  });

  it('Clear All button resets slots and re-renders the empty builder', () => {
    // L725–726: resetBtn click → reset() + render() (API reset alone skips DOM).
    const host = document.createElement('div');
    document.body.appendChild(host);
    const api = createInteractiveBuilder(host, {
      slotCount: 3,
      availableCards: [
        createNumberCard(4, 'n4'),
        createOperatorCard('+', 'op'),
        createNumberCard(6, 'n6'),
      ],
      targetValue: 10,
    });

    const trayCards = () =>
      Array.from(host.querySelectorAll('.card-tray .expression-card'));
    const slots = () =>
      Array.from(host.querySelectorAll('.expression-slot')) as HTMLElement[];

    (trayCards()[0] as HTMLElement).click();
    slots()[0]!.click();
    expect(api.getExpression()).toBe('4');
    expect(trayCards()).toHaveLength(2);

    // Structural: interactive builder appends exactly one <button> (reset).
    const buttons = host.querySelectorAll('button');
    expect(buttons).toHaveLength(1);
    (buttons[0] as HTMLButtonElement).click();

    expect(api.getExpression()).toBe('');
    expect(api.getResult()).toBeNull();
    expect(trayCards()).toHaveLength(3);
    expect(host.querySelectorAll('.expression-slot.filled')).toHaveLength(0);
  });
});

// =============================================================================
// 2. attributes/attribute-ui — SET soft defaults + selected mouseleave
// =============================================================================

describe('engine-coverage-round-19 — attribute-ui SET soft defaults', () => {
  it('falsy SET shape/color coerce via || to oval / red defaults', () => {
    // L267 / L269: (shape as string) || 'oval'; (color as string) || 'red'.
    const svg = renderSetCard(
      createPiece('soft-default', {
        number: 1,
        shape: '',
        shading: 'solid',
        color: '',
      })
    );
    const oval = svg.querySelector('ellipse');
    expect(oval).toBeTruthy();
    // Default color 'red' → #f44336 fill on solid shading.
    expect(oval?.getAttribute('fill')).toBe('#f44336');
    expect(oval?.getAttribute('stroke')).toBe('#f44336');
    // Empty shape must not take diamond/squiggle paths.
    expect(svg.querySelector('polygon')).toBeNull();
    expect(svg.querySelector('path')).toBeNull();
  });

  it('selected wrapper mouseleave leaves selected border untouched', () => {
    // L453 false arm: mouseleave when selectedIds.has(id) skips transparent wipe.
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

    const selected = wrappers[0]!;
    const before = selected.style.borderColor;
    selected.dispatchEvent(new Event('mouseleave'));
    expect(selected.style.borderColor).toBe(before);
    // Unselected leave still clears (r12 already pins; keep orthogonal smoke).
    const open = wrappers[1]!;
    open.dispatchEvent(new Event('mouseenter'));
    expect(open.style.borderColor).toBe('rgb(144, 202, 249)');
    open.dispatchEvent(new Event('mouseleave'));
    expect(open.style.borderColor).toBe('transparent');
  });
});

// =============================================================================
// 3. owl/ollie-inspect-map — fallthrough residuals + never-default docs
// =============================================================================

describe('engine-coverage-round-19 — ollie-inspect-map fallthrough residuals', () => {
  it('empty data-shape bank attr falls through instead of hex-a-gone-bank', () => {
    // L39: if (shape) — empty string is falsy → continue walk.
    const bank = document.createElement('button');
    bank.setAttribute('data-shape', '');
    document.body.appendChild(bank);
    expect(resolveInspectTarget(bank)).toEqual({ kind: 'unknown' });
    expect(inspectDropSpeech(bank).startsWith('[STUB inspect]')).toBe(true);
  });

  it('finite star-space with missing data-player defaults player to unknown', () => {
    // L65: getAttribute('data-player') || 'unknown' when space is finite.
    const space = document.createElementNS(
      'http://www.w3.org/2000/svg',
      'circle'
    );
    space.setAttribute('class', 'star-track-space');
    space.setAttribute('data-space', '7');
    // intentionally omit data-player
    document.body.appendChild(space);
    expect(resolveInspectTarget(space)).toEqual({
      kind: 'star-space',
      space: 7,
      player: 'unknown',
    });
  });

  it('unknown-chrome stub narration stays wired via public stubNarrationFor', () => {
    // Structural kind/chrome only — no player-facing copy body pin.
    const line = stubNarrationFor({
      kind: 'chrome',
      chrome: 'unknown-chrome',
    });
    expect(line.startsWith('[STUB inspect]')).toBe(true);
    expect(line.length).toBeGreaterThan(20);
  });

  it('documents exhaustive never defaults as unreachable without forged kinds', () => {
    // L148–149 / L171–172: TypeScript never arms — no public API can construct
    // an out-of-union InspectTarget / InspectChrome without casting past the
    // type system. Characterization leaves them documented (wave40 + overnight
    // already cover every live kind/chrome).
    expect(resolveInspectTarget(null)).toEqual({ kind: 'unknown' });
  });
});

// =============================================================================
// 4. game-route-mounts — hot smoke only (soft-fail → q-mp-549)
// =============================================================================

describe('engine-coverage-round-19 — game-route-mounts hot smoke (soft-fail deferred)', () => {
  it('documents soft-fail residual ownership deferred to q-mp-549 / 548', () => {
    // Tip preferred-host remeasure (post-r18): game-route-mounts 75.57% branch
    // (164/217) with burn-1007 + q-mp-353 suites — densest cold surface after
    // r18. Soft-fail characterization is owned by q-mp-549; mutation wave 19
    // by q-mp-548. Engine r19 keeps this host as hot-smoke / docs only —
    // do not call mountGameById / initGameMountDeps here (module deps are
    // process-global and unit-shared pool may retain prior suite state).
    expect(typeof initGameMountDeps).toBe('function');
    expect(typeof mountGameById).toBe('function');
    expect(mountGameById.length).toBe(2);
  });
});

// =============================================================================
// 5. carry-forward docs — r18 residuals still deferred / unreachable
// =============================================================================

describe('engine-coverage-round-19 — carry-forward deferred / unreachable docs', () => {
  it('documents storage getToday/Yesterday ?? and algorithms L110/131/184 ownership', () => {
    // Carry-forward after r18:
    //   storage L291/L297 ?? '' → documented unreachable (split[0] always set)
    //   graph/algorithms L110/L131/L184 → soft-fail char q-mp-524
    //   polyomino/transform soft-fail → #990 / q-mp-525
    //   evaluator buildExpression([]) / paren early → r9–r18 docs
    //   placement reason|| / rowCells falsy → r8/r11 docs
    //   fraction-bar-ui L407 → r11 docs
    expect(true).toBe(true);
  });
});
