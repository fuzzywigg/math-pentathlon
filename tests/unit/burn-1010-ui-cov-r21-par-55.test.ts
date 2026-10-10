/**
 * q-mp-348 / UI coverage round 21 — par-55 board-ui + controller residuals.
 * Characterization: DOM structure / roles / phase / state fields only.
 * No player-facing copy body asserts. No AI move-choice or timing asserts.
 * Hex Hard 450ms untouched. Skip ai.ts / rules.ts product paths.
 */
import { afterEach, describe, expect, it, vi } from 'vitest';
import { installDomHooks, mountAppShell, mountRoot } from './helpers/dom';
import {
  createInitialState,
  getValidPlacements,
  placeBlock,
  selectBlock,
} from '../../src/games/par-55/rules';
import {
  injectPar55Styles,
  renderBoard,
  renderHand,
  syncBoard,
} from '../../src/games/par-55/board-ui';
import type {
  AttributeBlock,
  GamePhase,
  Par55State,
  Shape,
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

describe('q-mp-348 ui-cov-r21 par-55 board-ui residuals', () => {
  it('delegated base click + keyboard activate; miss arms no-op', () => {
    const onBase = vi.fn();
    const { state, validBaseId } = withSelectedBlock();
    const el = renderBoard(state, onBase);
    const svg = el.querySelector('.par55-svg') as SVGElement;
    const group = el.querySelector(
      `g[data-base-id="${validBaseId}"].par55-base-interactive`
    ) as SVGGElement;
    expect(group).toBeTruthy();
    expect(group.querySelector('.par55-base-hit')).toBeTruthy();

    group
      .querySelector('.par55-base-hit')!
      .dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(onBase).toHaveBeenCalledWith(validBaseId);

    onBase.mockClear();
    group.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Enter', bubbles: true })
    );
    expect(onBase).toHaveBeenCalledWith(validBaseId);

    onBase.mockClear();
    // Click outside interactive group → early return.
    svg.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(onBase).not.toHaveBeenCalled();

    // Non-interactive base: no hit target / no activate wiring.
    const locked = renderBoard(state, onBase, { allowInput: false });
    expect(locked.querySelector('.par55-base-interactive')).toBeNull();
    expect(locked.querySelector('.par55-base-hit')).toBeNull();
  });

  it('syncBoard early-return / missing-group continue / blockHost remove / keys', () => {
    const onBase = vi.fn();
    const { state, validBaseId, blockId } = withSelectedBlock();
    const placed = placeBlock(state, validBaseId);
    expect(placed.moveHistory.length).toBe(1);

    const el = renderBoard(placed, onBase, { allowInput: false });
    expect(
      el.querySelector(`g[data-base-id="${validBaseId}"] .par55-block-host`)
    ).toBeTruthy();

    // Clear the placed block → sync removes blockHost (else-if arm).
    const clearedBases = new Map(placed.bases);
    const occupied = clearedBases.get(validBaseId)!;
    clearedBases.set(validBaseId, {
      ...occupied,
      block: null,
      placedBy: null,
    });
    const cleared: Par55State = {
      ...placed,
      bases: clearedBases,
      lastMoveBaseId: null,
      phase: 'selectingBlock',
      selectedBlock: null,
    };
    syncBoard(el, cleared, onBase, { allowInput: false });
    expect(
      el.querySelector(`g[data-base-id="${validBaseId}"] .par55-block-host`)
    ).toBeNull();

    // Drop one group → continue arm; remaining groups still sync.
    const dropId = createBaseId(0, 0);
    el.querySelector(`g[data-base-id="${dropId}"]`)?.remove();
    syncBoard(el, cleared, onBase);
    expect(el.querySelector(`g[data-base-id="${dropId}"]`)).toBeNull();

    // Re-enter placing with selection → interactive + score preview + keys.
    const reselect = selectBlock(
      { ...cleared, currentPlayer: 'player1' },
      cleared.hands.player1.find((b) => b.id !== blockId)?.id ??
        cleared.hands.player1[0]!.id
    );
    const nextValid = getValidPlacements(reselect)[0];
    if (nextValid) {
      syncBoard(el, reselect, onBase);
      const interactive = el.querySelector(
        `g[data-base-id="${nextValid}"].par55-base-interactive`
      ) as SVGGElement | null;
      expect(interactive).toBeTruthy();
      interactive!.dispatchEvent(
        new KeyboardEvent('keydown', { key: ' ', bubbles: true })
      );
      expect(onBase).toHaveBeenCalledWith(nextValid);
    }

    // Bare container without .par55-svg → early return.
    const bare = document.createElement('div');
    expect(() => {
      syncBoard(bare, cleared, onBase);
    }).not.toThrow();
  });

  it('default shape arm + hand activate + score-preview chrome', () => {
    const onBlock = vi.fn();
    const open = createInitialState();
    const hand = renderHand(open, 'player1', onBlock);
    const tile = hand.querySelector(
      '.par55-hand-block.clickable'
    ) as HTMLElement;
    expect(tile).toBeTruthy();
    tile.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(onBlock).toHaveBeenCalledTimes(1);
    expect(typeof onBlock.mock.calls[0]?.[0]).toBe('string');

    // Unknown shape → default circle arm (cast only; no product edit).
    // renderHand → renderHandBlock → renderBlock hits the switch default.
    const weird: AttributeBlock = {
      id: 'forge-shape',
      shape: 'not-a-shape' as Shape,
      color: 'red',
      size: 'large',
      thickness: 'thick',
    };
    const forged: Par55State = {
      ...open,
      hands: { ...open.hands, player1: [weird] },
      phase: 'selectingBlock',
      selectedBlock: null,
      currentPlayer: 'player1',
    };
    const weirdHand = renderHand(forged, 'player1', () => undefined);
    expect(weirdHand.querySelector('circle')).toBeTruthy();
    expect(weirdHand.querySelector('rect')).toBeTruthy(); // tile bg only

    // Placing with adjacency matches → score-preview text nodes when points > 0.
    const { state } = withSelectedBlock();
    const valids = getValidPlacements(state);
    const previewBoard = renderBoard(state, () => undefined);
    const previews = previewBoard.querySelectorAll('.par55-score-preview');
    // At least one valid seat may score 0; structural: preview class only when >0.
    expect(previews.length).toBeLessThanOrEqual(valids.length);
    expect(previewBoard.querySelector('.par55-valid-base')).toBeTruthy();
    expect(previewBoard.querySelector('[aria-label*="last move"]')).toBeNull();

    // last-move extras arm via forged lastMoveBaseId.
    const lastId = valids[0]!;
    const withLast: Par55State = { ...state, lastMoveBaseId: lastId };
    const lastEl = renderBoard(withLast, () => undefined);
    expect(
      lastEl
        .querySelector(`g[data-base-id="${lastId}"]`)
        ?.getAttribute('aria-label')
    ).toMatch(/last move/i);

    injectPar55Styles();
    expect(document.getElementById('par55-styles')).toBeTruthy();
  });
});

describe('q-mp-348 ui-cov-r21 par-55 controller residuals', () => {
  it('hand/base clicks, clear/pass chrome, newGame, winner banner (structure)', async () => {
    const { newGameVsHuman, destroyGame } =
      await import('../../src/games/par-55/game-controller');

    // No #app → syncOpponentChrome early return.
    const root = mountRoot();
    const ctrl = newGameVsHuman(root);
    expect(root.querySelector('.par55-game-area')).toBeTruthy();
    expect(
      root.querySelector('.par55-status')?.classList.contains('player1')
    ).toBe(true);

    // Hand click → selectingBlock → placingBlock.
    const tile = root.querySelector(
      '.par55-hand-player1 .par55-hand-block.clickable'
    ) as HTMLElement;
    tile.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(ctrl.state.phase).toBe('placingBlock');
    expect(ctrl.state.selectedBlock).toBeTruthy();
    expect(root.querySelector('.par55-btn-secondary')).toBeTruthy();
    expect(root.querySelector('.par55-valid-base')).toBeTruthy();

    // Clear selection chrome (class only — no copy pin).
    const clearBtn = root.querySelector(
      '.par55-controls .par55-btn-secondary'
    ) as HTMLButtonElement;
    clearBtn.click();
    expect(ctrl.state.selectedBlock).toBeNull();
    expect(ctrl.state.phase).toBe('selectingBlock');

    // Place via delegated base click.
    const again = root.querySelector(
      '.par55-hand-player1 .par55-hand-block.clickable'
    ) as HTMLElement;
    again.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    const valid = root.querySelector(
      'g.par55-base-interactive'
    ) as SVGGElement | null;
    expect(valid).toBeTruthy();
    valid!
      .querySelector('.par55-base-hit')!
      .dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(ctrl.state.moveHistory.length).toBe(1);
    expect(root.querySelector('.par55-history')).toBeTruthy();
    expect(ctrl.state.currentPlayer).toBe('player2');

    // Pass Turn when forged empty hand (structure: control button present).
    ctrl.state = {
      ...ctrl.state,
      hands: { ...ctrl.state.hands, player2: [] },
      phase: 'selectingBlock',
      selectedBlock: null,
    };
    ctrl.update();
    const passBtn = root.querySelector(
      '.par55-controls .par55-btn-secondary'
    ) as HTMLButtonElement | null;
    expect(passBtn).toBeTruthy();
    passBtn!.click();
    expect(ctrl.state.currentPlayer).toBe('player1');

    // Winner banner arm (presence / class — not copy body).
    ctrl.state = {
      ...ctrl.state,
      phase: 'gameOver',
      winner: 'player1',
    };
    ctrl.update();
    expect(root.querySelector('.par55-winner-banner')).toBeTruthy();
    expect(
      root.querySelector('.par55-status')?.classList.contains('player1')
    ).toBe(true);

    // Defensive empty statusTextFor arm via forged phase.
    ctrl.state = {
      ...ctrl.state,
      phase: 'bogus' as GamePhase,
      winner: null,
    };
    ctrl.update();
    expect(root.querySelector('.par55-status')).toBeTruthy();

    // newGame resets chrome + generation.
    ctrl.newGame(false);
    expect(ctrl.state.phase).toBe('selectingBlock');
    expect(ctrl.state.moveHistory).toHaveLength(0);
    expect(root.querySelector('.par55-winner-banner')).toBeNull();

    destroyGame();
    expect(root.childNodes.length).toBe(0);
  });

  it('sync board reinsert + history-before-controls + post-destroy paint drop', async () => {
    const { initGame, destroyGame } =
      await import('../../src/games/par-55/game-controller');
    const shell = mountAppShell();
    const ctrl = initGame(shell, false);

    const tile = shell.querySelector(
      '.par55-hand-player1 .par55-hand-block.clickable'
    ) as HTMLElement;
    tile.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    const valid = shell.querySelector(
      'g.par55-base-interactive .par55-base-hit'
    ) as SVGElement;
    valid.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(ctrl.state.moveHistory.length).toBe(1);

    // Force sync path with history + clear-selection controls together.
    const p = ctrl.state.currentPlayer;
    const handBlock = ctrl.state.hands[p][0]!;
    ctrl.state = selectBlock(ctrl.state, handBlock.id);
    ctrl.update();
    expect(shell.querySelector('.par55-history')).toBeTruthy();
    expect(shell.querySelector('.par55-controls')).toBeTruthy();

    // Move board out of mainLayout but keep under game-area so sync reuses it.
    const area = shell.querySelector('.par55-game-area') as HTMLElement;
    const board = shell.querySelector('.par55-board') as HTMLElement;
    area.appendChild(board);
    expect(shell.querySelector('.par55-main-layout .par55-board')).toBeNull();
    ctrl.update();
    expect(shell.querySelector('.par55-main-layout .par55-board')).toBeTruthy();

    // Drop p2 column → appendChild fallback arm inside syncChrome.
    const layout = shell.querySelector('.par55-main-layout') as HTMLElement;
    const board2 = shell.querySelector('.par55-board') as HTMLElement;
    layout.querySelector('.par55-hand-column-player2')?.remove();
    area.appendChild(board2);
    ctrl.update();
    expect(shell.querySelector('.par55-main-layout .par55-board')).toBeTruthy();

    // Full rebuild while placing → renderBoard onBaseClick wiring (line ~372).
    ctrl.state = {
      ...ctrl.state,
      phase: 'gameOver',
      winner: 'player2',
    };
    ctrl.update();
    expect(shell.querySelector('.par55-winner-banner')).toBeTruthy();
    const openPlace = createInitialState();
    ctrl.state = selectBlock(openPlace, openPlace.hands.player1[0]!.id);
    ctrl.update();
    const freshHit = shell.querySelector(
      'g.par55-base-interactive .par55-base-hit'
    ) as SVGElement | null;
    expect(freshHit).toBeTruthy();
    freshHit!.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(ctrl.state.moveHistory.length).toBeGreaterThanOrEqual(1);

    destroyGame();
    expect(() => {
      ctrl.update();
    }).not.toThrow();
    expect(shell.querySelector('.par55-game-area')).toBeNull();
  });

  it('computer-turn input guards + stubbed AI null pass (structure only)', async () => {
    const { newGameVsAI, destroyGame, startTutorial, isTutorialActive } =
      await import('../../src/games/par-55/game-controller');
    const { tutorialManager } = await import('../../src/core/tutorial');

    // startTutorial with no active container → early return.
    startTutorial();
    expect(isTutorialActive()).toBe(false);

    const root = mountAppShell();
    const ctrl = newGameVsAI(root, 'easy');
    expect(root.querySelector('.par55-game-area')).toBeTruthy();

    // Human opens one move so AI seat is pending.
    const tile = root.querySelector(
      '.par55-hand-player1 .par55-hand-block.clickable'
    ) as HTMLElement;
    tile.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    const hit = root.querySelector(
      'g.par55-base-interactive .par55-base-hit'
    ) as SVGElement;
    hit.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(ctrl.state.currentPlayer).toBe('player2');
    expect(root.querySelector('.status-ai-thinking')).toBeTruthy();

    // Stale human handlers: mutate seat without update, then click → guards.
    // Re-select path: force selecting chrome then flip to AI pending.
    ctrl.state = {
      ...ctrl.state,
      currentPlayer: 'player1',
      phase: 'selectingBlock',
      selectedBlock: null,
    };
    ctrl.isAI = false;
    ctrl.aiPlayer = null;
    ctrl.update();
    const humanTile = root.querySelector(
      '.par55-hand-player1 .par55-hand-block.clickable'
    ) as HTMLElement;
    humanTile.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(ctrl.state.phase).toBe('placingBlock');
    const clearBtn = root.querySelector(
      '.par55-controls .par55-btn-secondary'
    ) as HTMLButtonElement;
    expect(clearBtn).toBeTruthy();

    // Flip to AI-pending without re-render so chrome handlers still exist.
    ctrl.isAI = true;
    ctrl.aiPlayer = 'player1';
    clearBtn.click();
    expect(ctrl.state.selectedBlock).not.toBeNull();

    // Pass button guard: forge empty hand + controls, then AI-pending click.
    ctrl.isAI = false;
    ctrl.aiPlayer = null;
    ctrl.state = {
      ...ctrl.state,
      phase: 'selectingBlock',
      selectedBlock: null,
      hands: { ...ctrl.state.hands, player1: [] },
      currentPlayer: 'player1',
    };
    ctrl.update();
    const passBtn = root.querySelector(
      '.par55-controls .par55-btn-secondary'
    ) as HTMLButtonElement;
    expect(passBtn).toBeTruthy();
    ctrl.isAI = true;
    ctrl.aiPlayer = 'player1';
    const beforePassPlayer = ctrl.state.currentPlayer;
    passBtn.click();
    expect(ctrl.state.currentPlayer).toBe(beforePassPlayer);

    // Stub AI null → passTurn soft path (no move-choice / timing assert).
    ctrl.isAI = true;
    ctrl.aiPlayer = 'player2';
    ctrl.state = {
      ...createInitialState(),
      currentPlayer: 'player2',
      phase: 'selectingBlock',
    };
    vi.spyOn(par55Ai, 'getAIMove').mockReturnValue(null);
    ctrl.update();
    expect(root.querySelector('.status-ai-thinking')).toBeTruthy();
    await vi.advanceTimersByTimeAsync(800);
    expect(ctrl.state.currentPlayer).toBe('player1');
    expect(par55Ai.getAIMove).toHaveBeenCalled();

    // fillChrome computerTurn class: wipe area so update rebuilds while AI seat.
    vi.mocked(par55Ai.getAIMove).mockReturnValue(null);
    root.querySelector('.par55-game-area')?.remove();
    ctrl.state = {
      ...createInitialState(),
      currentPlayer: 'player2',
      phase: 'selectingBlock',
    };
    ctrl.aiPlayer = 'player2';
    ctrl.isAI = true;
    ctrl.update();
    expect(root.querySelector('.status-ai-thinking')).toBeTruthy();

    // Stale hand/base click while AI-pending → handle* early returns.
    ctrl.isAI = false;
    ctrl.aiPlayer = null;
    ctrl.state = createInitialState();
    ctrl.update();
    const liveTile = root.querySelector(
      '.par55-hand-player1 .par55-hand-block.clickable'
    ) as HTMLElement;
    liveTile.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    const liveHit = root.querySelector(
      'g.par55-base-interactive .par55-base-hit'
    ) as SVGElement;
    ctrl.isAI = true;
    ctrl.aiPlayer = 'player1';
    const selectedBefore = ctrl.state.selectedBlock;
    liveTile.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(ctrl.state.selectedBlock).toBe(selectedBefore);
    const histBefore = ctrl.state.moveHistory.length;
    liveHit.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(ctrl.state.moveHistory.length).toBe(histBefore);

    // makeAIMove gameOver early return (structure).
    ctrl.state = {
      ...ctrl.state,
      phase: 'gameOver',
      winner: null,
      currentPlayer: 'player2',
    };
    ctrl.aiPlayer = 'player2';
    ctrl.update();
    await vi.advanceTimersByTimeAsync(800);
    expect(ctrl.state.phase).toBe('gameOver');

    // Stubbed non-null AI move → select+place execute arm (structure only).
    const aiOpen = createInitialState();
    const aiBlock = aiOpen.hands.player2[0]!;
    const aiPlace = selectBlock(
      { ...aiOpen, currentPlayer: 'player2' },
      aiBlock.id
    );
    const aiBase = getValidPlacements(aiPlace)[0];
    expect(aiBase).toBeTruthy();
    vi.mocked(par55Ai.getAIMove).mockReturnValue({
      blockId: aiBlock.id,
      baseId: aiBase!,
    });
    ctrl.state = {
      ...aiOpen,
      currentPlayer: 'player2',
      phase: 'selectingBlock',
    };
    ctrl.aiPlayer = 'player2';
    ctrl.isAI = true;
    ctrl.update();
    await vi.advanceTimersByTimeAsync(800);
    expect(ctrl.state.moveHistory.length).toBeGreaterThanOrEqual(1);
    expect(ctrl.state.moveHistory[0]?.player).toBe('player2');

    // Tutorial complete remount arm.
    ctrl.isAI = false;
    ctrl.aiPlayer = null;
    ctrl.state = createInitialState();
    ctrl.update();
    startTutorial();
    expect(isTutorialActive()).toBe(true);
    tutorialManager.complete();
    expect(isTutorialActive()).toBe(false);

    destroyGame();
  });
});
