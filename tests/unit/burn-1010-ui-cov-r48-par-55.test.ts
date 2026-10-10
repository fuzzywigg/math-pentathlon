/**
 * q-mp-517 / UI coverage round 48 — par-55 board-ui + controller residuals.
 * Characterization: DOM structure / roles / phase / state fields only.
 * No player-facing copy body asserts. No AI move-choice or timing asserts.
 * Stub AI. Hex Hard 450ms untouched. Zero src product edits.
 * Skip ai.ts / rules.ts product paths.
 */
import { afterEach, describe, expect, it, vi } from 'vitest';
import { installDomHooks, mountAppShell, mountRoot } from './helpers/dom';
import {
  createInitialState,
  getValidPlacements,
  placeBlock,
  selectBlock,
} from '../../src/games/par-55/rules';
import * as par55Rules from '../../src/games/par-55/rules';
import {
  renderBoard,
  renderHand,
  renderMoveHistory,
  renderScores,
  syncBoard,
} from '../../src/games/par-55/board-ui';
import type {
  AttributeBlock,
  Par55State,
  Shape,
  Size,
  Thickness,
} from '../../src/games/par-55/types';
import { createBaseId } from '../../src/games/par-55/types';
import * as par55Ai from '../../src/games/par-55/ai';

installDomHooks({
  styleIds: ['par55-styles'],
  fakeTimers: true,
});

afterEach(async () => {
  vi.restoreAllMocks();
  try {
    const mod = await import('../../src/games/par-55/game-controller');
    mod.destroyGame?.();
  } catch {
    // ignore
  }
  try {
    const { tutorialManager } = await import('../../src/core/tutorial');
    if (tutorialManager.getIsActive()) {
      tutorialManager.exit();
    }
  } catch {
    // ignore
  }
});

function withSelectedBlock(): {
  state: Par55State;
  blockId: string;
  validBaseId: string;
} {
  const base = createInitialState();
  const blockId = base.hands.player1[0]!.id;
  const state = selectBlock(base, blockId);
  const validBaseId = getValidPlacements(state)[0]!;
  expect(validBaseId).toBeTruthy();
  return { state, blockId, validBaseId };
}

function forgeBlock(
  overrides: Partial<AttributeBlock> & Pick<AttributeBlock, 'id' | 'shape'>
): AttributeBlock {
  return {
    color: 'red',
    size: 'large',
    thickness: 'thick',
    ...overrides,
  };
}

describe('q-mp-517 ui-cov-r48 par-55 board-ui residuals', () => {
  it('delegated click without data-base-id + bare-polygon sync fallback', () => {
    const onBase = vi.fn();
    const { state, validBaseId } = withSelectedBlock();
    const el = renderBoard(state, onBase);
    const group = el.querySelector(
      `g[data-base-id="${validBaseId}"].par55-base-interactive`
    ) as SVGGElement;
    expect(group).toBeTruthy();

    // Empty data-base-id still matches [data-base-id] selector → falsy baseId arm.
    group.setAttribute('data-base-id', '');
    group
      .querySelector('.par55-base-hit')!
      .dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(onBase).not.toHaveBeenCalled();

    // Restore id for sync; strip pent class so query falls back to bare polygon.
    group.setAttribute('data-base-id', validBaseId);
    const pent = group.querySelector('polygon.par55-base-pent');
    expect(pent).toBeTruthy();
    pent!.classList.remove('par55-base-pent');
    syncBoard(el, state, onBase);
    expect(group.querySelector('polygon.par55-base-pent')).toBeTruthy();
    expect(group.classList.contains('par55-base-interactive')).toBe(true);
  });

  it('zero-point valid base skips score-preview text arm', () => {
    // Stub score total only — exercises UI preview skip; not a scoring assert.
    vi.spyOn(par55Rules, 'calculateScore').mockReturnValue({
      totalPoints: 0,
      matchDetails: [],
    });
    const { state, validBaseId } = withSelectedBlock();
    const el = renderBoard(state, () => undefined);
    expect(
      el.querySelector(
        `g[data-base-id="${validBaseId}"].par55-base-interactive`
      )
    ).toBeTruthy();
    expect(el.querySelector('.par55-score-preview')).toBeNull();
    syncBoard(el, state, () => undefined);
    expect(el.querySelector('.par55-score-preview')).toBeNull();
  });

  it('selectedBlock missing from hand skips score-preview on render + sync', () => {
    const { state, validBaseId } = withSelectedBlock();
    // Keep phase/selection chrome but drop the selected id from the hand.
    const orphan: Par55State = {
      ...state,
      hands: {
        ...state.hands,
        player1: state.hands.player1.filter(
          (b) => b.id !== state.selectedBlock
        ),
      },
    };
    expect(orphan.selectedBlock).toBeTruthy();
    expect(
      orphan.hands.player1.find((b) => b.id === orphan.selectedBlock)
    ).toBeUndefined();

    const el = renderBoard(orphan, () => undefined);
    expect(el.querySelector('.par55-score-preview')).toBeNull();
    // Valid markers still arm from placement set (structure only).
    expect(
      el.querySelector(
        `g[data-base-id="${validBaseId}"].par55-base-interactive`
      )
    ).toBeTruthy();

    syncBoard(el, orphan, () => undefined);
    expect(el.querySelector('.par55-score-preview')).toBeNull();
    expect(
      el.querySelector(
        `g[data-base-id="${validBaseId}"].par55-base-interactive`
      )
    ).toBeTruthy();
  });

  it('keyboard activate with stripped data-base-id no-ops (render + sync bind)', () => {
    const onBase = vi.fn();
    const { state, validBaseId } = withSelectedBlock();
    const el = renderBoard(state, onBase);
    const group = el.querySelector(
      `g[data-base-id="${validBaseId}"].par55-base-interactive`
    ) as SVGGElement;
    // Empty id keeps [data-base-id] match for closest(), but falsy getAttribute.
    group.setAttribute('data-base-id', '');
    group.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Enter', bubbles: true })
    );
    expect(onBase).not.toHaveBeenCalled();

    // Restore id so sync can clear interactive markers.
    group.setAttribute('data-base-id', validBaseId);
    const cleared: Par55State = {
      ...createInitialState(),
      phase: 'selectingBlock',
      selectedBlock: null,
    };
    syncBoard(el, cleared, onBase, { allowInput: false });
    expect(el.querySelector('.par55-base-interactive')).toBeNull();

    // Fresh board rendered locked (no key bind) → first sync binds keys (:248–256).
    const locked = renderBoard(cleared, onBase, { allowInput: false });
    const placing = withSelectedBlock();
    syncBoard(locked, placing.state, onBase);
    const live = locked.querySelector(
      `g[data-base-id="${placing.validBaseId}"].par55-base-interactive`
    ) as SVGGElement;
    expect(live).toBeTruthy();
    live.setAttribute('data-base-id', '');
    live.dispatchEvent(
      new KeyboardEvent('keydown', { key: ' ', bubbles: true })
    );
    expect(onBase).not.toHaveBeenCalled();
  });

  it('shape arms + label fallback + scores/history chrome without copy pins', () => {
    const shapes: Shape[] = [
      'circle',
      'square',
      'triangle',
      'rectangle',
      'hexagon',
    ];
    const open = createInitialState();
    const forgedHand = shapes.map((shape, i) =>
      forgeBlock({
        id: `shape-${i}`,
        shape,
        size: i % 2 === 0 ? 'small' : 'large',
        thickness: i % 2 === 0 ? 'thin' : 'thick',
        color: (['red', 'blue', 'yellow'] as const)[i % 3]!,
      })
    );
    // Empty size/thickness → label ternary fallback arm (structure: label node).
    forgedHand.push(
      forgeBlock({
        id: 'label-fallback',
        shape: 'circle',
        size: '' as Size,
        thickness: '' as Thickness,
      })
    );
    const forged: Par55State = {
      ...open,
      hands: { ...open.hands, player1: forgedHand },
    };
    const hand = renderHand(forged, 'player1', () => undefined);
    expect(hand.querySelectorAll('.par55-hand-block')).toHaveLength(
      forgedHand.length
    );
    expect(hand.querySelector('circle')).toBeTruthy();
    expect(hand.querySelector('rect')).toBeTruthy();
    expect(hand.querySelector('polygon')).toBeTruthy();
    expect(
      hand.querySelectorAll('.par55-block-label').length
    ).toBeGreaterThanOrEqual(forgedHand.length);

    // Hand keyboard activate (structural wiring — not copy).
    const onBlock = vi.fn();
    const liveHand = renderHand(open, 'player1', onBlock);
    const tile = liveHand.querySelector(
      '.par55-hand-block.clickable'
    ) as HTMLElement;
    tile.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Enter', bubbles: true })
    );
    expect(onBlock).toHaveBeenCalledTimes(1);
    expect(typeof onBlock.mock.calls[0]?.[0]).toBe('string');

    // Scores + history modules (class chrome only).
    const scores = renderScores(open);
    expect(scores.classList.contains('par55-scores')).toBe(true);
    expect(scores.querySelector('.par55-score.player1')).toBeTruthy();
    expect(scores.querySelector('.par55-score.player2')).toBeTruthy();
    expect(scores.querySelector('.par55-target')).toBeTruthy();

    const { state, validBaseId } = withSelectedBlock();
    const placed = placeBlock(state, validBaseId);
    const history = renderMoveHistory(placed);
    expect(history.classList.contains('par55-history')).toBe(true);
    expect(history.querySelector('.par55-history-list')).toBeTruthy();
    expect(history.querySelector('.par55-history-move')).toBeTruthy();
  });

  it('syncBoard blockKey rewrite + hit remove/add arms', () => {
    const onBase = vi.fn();
    const { state, validBaseId } = withSelectedBlock();
    const placed = placeBlock(state, validBaseId);
    const el = renderBoard(placed, onBase, { allowInput: false });
    const host = el.querySelector(
      `g[data-base-id="${validBaseId}"] .par55-block-host`
    ) as SVGGElement;
    expect(host).toBeTruthy();
    const keyBefore = host.dataset.blockKey;
    expect(keyBefore).toBeTruthy();

    // Same presence, new ownership/attrs → blockKey rewrite arm.
    const bases = new Map(placed.bases);
    const seat = bases.get(validBaseId)!;
    const swappedBlock = forgeBlock({
      id: seat.block!.id,
      shape: seat.block!.shape === 'circle' ? 'square' : 'circle',
      color: 'yellow',
      size: 'small',
      thickness: 'thin',
    });
    bases.set(validBaseId, {
      ...seat,
      block: swappedBlock,
      placedBy: 'player2',
    });
    const rewritten: Par55State = {
      ...placed,
      bases,
      phase: 'selectingBlock',
      selectedBlock: null,
    };
    syncBoard(el, rewritten, onBase, { allowInput: false });
    const hostAfter = el.querySelector(
      `g[data-base-id="${validBaseId}"] .par55-block-host`
    ) as SVGGElement;
    expect(hostAfter.dataset.blockKey).not.toBe(keyBefore);
    expect(hostAfter.querySelector('circle,rect,polygon')).toBeTruthy();

    // Re-enter placing → hit target re-added; leave placing → hit removed.
    const reselect = selectBlock(
      { ...rewritten, currentPlayer: 'player1' },
      rewritten.hands.player1[0]!.id
    );
    const nextValid = getValidPlacements(reselect)[0];
    expect(nextValid).toBeTruthy();
    syncBoard(el, reselect, onBase);
    expect(
      el.querySelector(
        `g[data-base-id="${nextValid}"].par55-base-interactive .par55-base-hit`
      )
    ).toBeTruthy();
    syncBoard(el, rewritten, onBase, { allowInput: false });
    expect(el.querySelector('.par55-base-hit')).toBeNull();
    expect(el.querySelector('.par55-base-interactive')).toBeNull();

    // Odd-row position path via known base id (structural presence).
    const oddId = createBaseId(1, 0);
    expect(el.querySelector(`g[data-base-id="${oddId}"]`)).toBeTruthy();
  });
});

describe('q-mp-517 ui-cov-r48 par-55 controller residuals', () => {
  it('newGame(true) AI seat + tie banner + sync without status/mainLayout', async () => {
    const { initGame, destroyGame } =
      await import('../../src/games/par-55/game-controller');
    vi.spyOn(par55Ai, 'getAIMove').mockReturnValue(null);

    const shell = mountAppShell();
    const ctrl = initGame(shell, false);
    expect(ctrl.isAI).toBe(false);
    expect(ctrl.aiPlayer).toBeNull();

    // newGame(true) → aiPlayer ternary consequent arm.
    ctrl.newGame(true, 'easy');
    expect(ctrl.isAI).toBe(true);
    expect(ctrl.aiPlayer).toBe('player2');
    expect(shell.querySelector('.par55-game-area')).toBeTruthy();

    // Tie banner arm (winner null + gameOver) — class presence only.
    ctrl.state = {
      ...ctrl.state,
      phase: 'gameOver',
      winner: null,
    };
    ctrl.update();
    expect(shell.querySelector('.par55-winner-banner')).toBeTruthy();

    // Fresh open so sync path can reuse board (not gameOver rebuild).
    ctrl.newGame(false);
    expect(ctrl.aiPlayer).toBeNull();
    const area = shell.querySelector('.par55-game-area') as HTMLElement;
    const board = area.querySelector('.par55-board') as HTMLElement;
    expect(board).toBeTruthy();
    // Keep board under game-area; drop status + mainLayout → syncChrome false arms.
    area.appendChild(board);
    area.querySelector('.par55-status')?.remove();
    area.querySelector('.par55-main-layout')?.remove();
    ctrl.state = selectBlock(ctrl.state, ctrl.state.hands.player1[0]!.id);
    expect(() => {
      ctrl.update();
    }).not.toThrow();
    expect(area.querySelector('.par55-scores')).toBeTruthy();
    expect(area.querySelector('.par55-board')).toBeTruthy();
    // Status/mainLayout stay absent (sync does not recreate them).
    expect(area.querySelector('.par55-status')).toBeNull();
    expect(area.querySelector('.par55-main-layout')).toBeNull();

    destroyGame();
  });

  it('tutorial exited arm + makeAIMove !aiPlayer guard (structure)', async () => {
    const { newGameVsAI, destroyGame, startTutorial, isTutorialActive } =
      await import('../../src/games/par-55/game-controller');
    const { tutorialManager } = await import('../../src/core/tutorial');

    const root = mountAppShell();
    vi.spyOn(par55Ai, 'getAIMove').mockReturnValue(null);
    const ctrl = newGameVsAI(root, 'easy');

    // Tutorial exit → exited listener arm (unsubscribe; no remount).
    startTutorial();
    expect(isTutorialActive()).toBe(true);
    tutorialManager.exit();
    expect(isTutorialActive()).toBe(false);
    expect(root.querySelector('.par55-game-area')).toBeTruthy();

    // makeAIMove !aiPlayer guard: AI seat pending but aiPlayer cleared.
    ctrl.isAI = true;
    ctrl.aiPlayer = null;
    ctrl.state = {
      ...createInitialState(),
      currentPlayer: 'player2',
      phase: 'selectingBlock',
    };
    // Force schedule path by setting aiPlayer for schedule, then clear before fire.
    ctrl.aiPlayer = 'player2';
    ctrl.update();
    expect(root.querySelector('.status-ai-thinking')).toBeTruthy();
    ctrl.aiPlayer = null;
    await vi.advanceTimersByTimeAsync(800);
    // No pass / no place — phase stays selecting; seat unchanged structurally.
    expect(ctrl.state.phase).toBe('selectingBlock');
    expect(ctrl.state.currentPlayer).toBe('player2');
    expect(ctrl.state.moveHistory).toHaveLength(0);

    destroyGame();
  });

  it('history insert-before-controls + completed remount after exit cycle', async () => {
    const { newGameVsHuman, destroyGame, startTutorial, isTutorialActive } =
      await import('../../src/games/par-55/game-controller');
    const { tutorialManager } = await import('../../src/core/tutorial');

    const root = mountRoot();
    const ctrl = newGameVsHuman(root);

    // Build controls (clear selection) then place so history inserts before controls.
    const tile = root.querySelector(
      '.par55-hand-player1 .par55-hand-block.clickable'
    ) as HTMLElement;
    tile.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(root.querySelector('.par55-controls')).toBeTruthy();
    const hit = root.querySelector(
      'g.par55-base-interactive .par55-base-hit'
    ) as SVGElement;
    hit.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(ctrl.state.moveHistory.length).toBe(1);
    const history = root.querySelector('.par55-history');
    const controls = root.querySelector('.par55-controls');
    // After place, controls may be absent (no selection / has moves); history present.
    expect(history).toBeTruthy();
    expect(controls === null || history !== null).toBe(true);

    // Keep selection + history together → insertBefore(history, controls) arm.
    const p = ctrl.state.currentPlayer;
    ctrl.state = selectBlock(ctrl.state, ctrl.state.hands[p][0]!.id);
    ctrl.update();
    expect(root.querySelector('.par55-history')).toBeTruthy();
    expect(root.querySelector('.par55-controls')).toBeTruthy();
    const histEl = root.querySelector('.par55-history') as HTMLElement;
    const ctrlEl = root.querySelector('.par55-controls') as HTMLElement;
    expect(
      histEl.compareDocumentPosition(ctrlEl) & Node.DOCUMENT_POSITION_FOLLOWING
    ).toBeTruthy();

    // completed arm remounts via newGameVsHuman(activeContainer) — DOM fresh.
    startTutorial();
    expect(isTutorialActive()).toBe(true);
    tutorialManager.complete();
    expect(isTutorialActive()).toBe(false);
    expect(root.querySelector('.par55-game-area')).toBeTruthy();
    expect(root.querySelector('.par55-history')).toBeNull();
    expect(root.querySelector('.par55-winner-banner')).toBeNull();
    expect(
      root.querySelectorAll('.par55-hand-player1 .par55-hand-block').length
    ).toBeGreaterThan(0);

    destroyGame();
  });
});
