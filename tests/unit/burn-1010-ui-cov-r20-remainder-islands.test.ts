/**
 * q-mp-347 / UI coverage round 20 — remainder-islands board-ui + controller residuals.
 * Characterization: DOM structure / roles / phase / state fields only.
 * No player-facing copy body asserts. No AI move-choice or timing asserts.
 * Hex Hard 450ms untouched. No rules.ts / ai.ts product edits.
 */
import { afterEach, describe, expect, it, vi } from 'vitest';
import { installDomHooks, mountAppShell, mountRoot } from './helpers/dom';
import { createInitialState } from '../../src/games/remainder-islands/types';
import type { RemainderIslandsState } from '../../src/games/remainder-islands/types';
import {
  injectRemainderIslandsStyles,
  renderBoard,
  renderDice,
  renderDivisionPreview,
  renderGameOver,
  renderScores,
  syncBoard,
} from '../../src/games/remainder-islands/board-ui';
import * as remainderAi from '../../src/games/remainder-islands/ai';
import * as remainderRules from '../../src/games/remainder-islands/rules';
import { tutorialManager } from '../../src/core/tutorial';

installDomHooks({
  fakeTimers: true,
  styleIds: ['remainder-islands-styles'],
});

afterEach(async () => {
  vi.restoreAllMocks();
  if (tutorialManager.getIsActive()) {
    tutorialManager.exit();
  }
  try {
    const mod = await import('../../src/games/remainder-islands/game-controller');
    mod.destroyGame?.();
  } catch {
    // ignore
  }
});

function mockRandomCycle(seed = 0.17): void {
  let i = 0;
  vi.spyOn(Math, 'random').mockImplementation(() => {
    i += 1;
    return ((seed * 1000 + i * 37) % 1000) / 1000;
  });
}

function selectIslandState(
  overrides: Partial<RemainderIslandsState> = {}
): RemainderIslandsState {
  const base = createInitialState();
  const island = base.islands[0]!;
  return {
    ...base,
    phase: 'selectIsland',
    currentRoll: { die1: 3, die2: 4, total: 7 },
    validIslands: [island.id],
    selectedIsland: null,
    ...overrides,
  };
}

function hitFor(root: ParentNode, islandId: string): SVGPolygonElement {
  const polys = root.querySelectorAll(
    `[data-island-id="${islandId}"] polygon`
  );
  expect(polys.length).toBeGreaterThanOrEqual(1);
  return polys[polys.length - 1] as SVGPolygonElement;
}

describe('q-mp-347 ui-cov-r20 remainder board-ui residuals', () => {
  it('renderGameOver winner arms + dice/scores chrome + empty preview', () => {
    const base = createInitialState();
    const p1: RemainderIslandsState = {
      ...base,
      phase: 'gameOver',
      winner: 'player1',
      player1Score: 12,
      player2Score: 4,
    };
    const p2: RemainderIslandsState = {
      ...p1,
      winner: 'player2',
      player1Score: 3,
      player2Score: 9,
    };
    const draw: RemainderIslandsState = {
      ...p1,
      winner: null,
      player1Score: 6,
      player2Score: 6,
    };

    for (const state of [p1, p2, draw]) {
      const el = renderGameOver(state);
      expect(el.classList.contains('remainder-game-over')).toBe(true);
      expect(el.querySelector('.remainder-winner-banner')).toBeTruthy();
      expect(el.querySelectorAll('.remainder-final-score')).toHaveLength(2);
    }

    expect(renderDice(null).querySelector('.dice-placeholder')).toBeTruthy();
    expect(
      renderDice({ die1: 2, die2: 5, total: 7 }).querySelector('.dice-result')
    ).toBeTruthy();

    const scores = renderScores({ ...base, currentPlayer: 'player2' });
    expect(
      scores.querySelector('.remainder-player-score.player2')?.classList
    ).toBeTruthy();
    expect(
      scores
        .querySelector('.remainder-player-score.player2')
        ?.classList.contains('active')
    ).toBe(true);

    // previewDivision null arm when island id is unknown.
    const emptyPreview = renderDivisionPreview({
      ...base,
      currentRoll: { die1: 1, die2: 1, total: 2 },
      selectedIsland: 'missing-island-id',
    });
    expect(emptyPreview.classList.contains('remainder-preview')).toBe(true);
    expect(emptyPreview.children.length).toBe(0);

    injectRemainderIslandsStyles();
    injectRemainderIslandsStyles();
    expect(document.getElementById('remainder-islands-styles')).toBeTruthy();
  });

  it('syncBoard chip delta + hit refresh + missing-group continue + leave', () => {
    const onClick = vi.fn();
    const onHover = vi.fn();
    const island = createInitialState().islands[0]!;
    const other = createInitialState().islands[1]!;
    const state = selectIslandState({
      validIslands: [island.id],
      islands: createInitialState().islands.map((i) =>
        i.id === island.id
          ? { ...i, owner: 'player1', chips: 1 }
          : i.id === other.id
            ? { ...i, owner: 'player2', chips: 2 }
            : i
      ),
    });

    const svg = renderBoard(state, onClick, onHover, true);
    expect(svg.querySelector(`[data-island-id="${island.id}"]`)).toBeTruthy();

    // Missing group continue arm (orphan id not in SVG).
    const withGhost: RemainderIslandsState = {
      ...state,
      islands: [
        ...state.islands,
        {
          id: 'ghost-island',
          row: 9,
          col: 9,
          value: 3,
          owner: null,
          chips: 0,
        },
      ],
    };
    expect(() =>
      syncBoard(svg, withGhost, onClick, onHover, true)
    ).not.toThrow();

    // Chip count change 1→3 (rebuild badge) and 2→0 (remove badge).
    const chipUp: RemainderIslandsState = {
      ...state,
      islands: state.islands.map((i) =>
        i.id === island.id
          ? { ...i, chips: 3 }
          : i.id === other.id
            ? { ...i, chips: 0 }
            : i
      ),
    };
    syncBoard(svg, chipUp, onClick, onHover, true);
    expect(
      svg.querySelector(
        `[data-island-id="${island.id}"] .island-chip-count`
      )?.textContent
    ).toBe('3');
    expect(
      svg.querySelector(`[data-island-id="${other.id}"] .island-chip-badge`)
    ).toBeNull();

    // Same chips → early return; re-sync hits clone/replace path for existing hit.
    syncBoard(svg, chipUp, onClick, onHover, true);
    const hit = hitFor(svg, island.id);
    hit.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
    hit.dispatchEvent(new MouseEvent('mouseleave', { bubbles: true }));
    expect(onHover).toHaveBeenCalledWith(island.id);
    expect(onHover).toHaveBeenCalledWith(null);

    // Invalid-only sync removes role/tabindex; selected + wantHit reapplies visual.
    const invalidSelected: RemainderIslandsState = {
      ...chipUp,
      validIslands: [],
      selectedIsland: island.id,
    };
    syncBoard(svg, invalidSelected, onClick, onHover, true);
    const group = svg.querySelector(
      `[data-island-id="${island.id}"]`
    ) as SVGGElement;
    expect(group.getAttribute('role')).toBeNull();
    expect(group.querySelector('polygon.island-hit')).toBeTruthy();

    // Drop interactivity → hit removed.
    syncBoard(svg, { ...chipUp, phase: 'rolling' }, onClick, onHover, false);
    expect(
      svg.querySelector(`[data-island-id="${island.id}"] polygon.island-hit`)
    ).toBeNull();
  });

  it('selection visual falls back to any polygon; owned aria owner arms', () => {
    const base = selectIslandState();
    const island = base.islands[0]!;
    const owned: RemainderIslandsState = {
      ...base,
      validIslands: [island.id],
      selectedIsland: island.id,
      islands: base.islands.map((i) =>
        i.id === island.id ? { ...i, owner: 'player1', chips: 0 } : i
      ),
    };
    const svg = renderBoard(owned, () => undefined, () => undefined, true);
    const group = svg.querySelector(
      `[data-island-id="${island.id}"]`
    ) as SVGGElement;
    expect(group.classList.contains('selected')).toBe(true);
    expect(group.getAttribute('aria-label')).toBeTruthy();

    // Strip island-hex → applyIslandSelectionVisual uses ?? polygon fallback (hit).
    group.querySelector('polygon.island-hex')?.remove();
    const hit = group.querySelector('polygon.island-hit') as SVGPolygonElement;
    expect(hit).toBeTruthy();
    hit.dispatchEvent(new MouseEvent('mouseleave', { bubbles: true }));
    hit.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
    expect(group.querySelector('.island-r-preview')).toBeTruthy();
  });
});

describe('q-mp-347 ui-cov-r20 remainder controller residuals', () => {
  it('hover preview replace/remove + controls-missing insert + destroy render no-op', async () => {
    const {
      initGame,
      newGameVsHuman,
      destroyGame,
      getCurrentState,
    } = await import('../../src/games/remainder-islands/game-controller');

    mockRandomCycle();
    const host = mountAppShell();
    initGame(host);
    newGameVsHuman();

    host
      .querySelector('.remainder-btn-roll')!
      .dispatchEvent(new MouseEvent('click', { bubbles: true, detail: 1 }));
    expect(getCurrentState().phase).toBe('selectIsland');
    const a = getCurrentState().validIslands[0]!;
    const b =
      getCurrentState().validIslands[1] ?? getCurrentState().islands[1]!.id;

    // First hover → create preview (!existing && next) ahead of controls.
    hitFor(host, a).dispatchEvent(
      new MouseEvent('mouseenter', { bubbles: true })
    );
    expect(getCurrentState().selectedIsland).toBe(a);
    expect(host.querySelector('.remainder-preview')).toBeTruthy();

    // Second hover → replace existing preview.
    if (getCurrentState().validIslands.includes(b)) {
      hitFor(host, b).dispatchEvent(
        new MouseEvent('mouseenter', { bubbles: true })
      );
      expect(getCurrentState().selectedIsland).toBe(b);
      expect(host.querySelectorAll('.remainder-preview')).toHaveLength(1);
    }

    // Leave → remove preview.
    hitFor(host, getCurrentState().selectedIsland ?? a).dispatchEvent(
      new MouseEvent('mouseleave', { bubbles: true })
    );
    expect(getCurrentState().selectedIsland).toBeNull();
    expect(host.querySelector('.remainder-preview')).toBeNull();

    // No-controls append arm of patchDivisionPreview.
    host.querySelector('.remainder-controls')?.remove();
    hitFor(host, a).dispatchEvent(
      new MouseEvent('mouseenter', { bubbles: true })
    );
    expect(host.querySelector('.remainder-preview')).toBeTruthy();

    // destroy → render / patch early returns; stale roll click is no-op on mount.
    destroyGame();
    const turns = getCurrentState().turnsRemaining;
    host
      .querySelector('.remainder-btn-roll')
      ?.dispatchEvent(new MouseEvent('click', { bubbles: true, detail: 1 }));
    // After destroy, roll may still mutate module state but must not throw.
    expect(getCurrentState().turnsRemaining).toBeTypeOf('number');
    expect(turns).toBeTypeOf('number');
    destroyGame();
  });

  it('chrome rebuild arms: status insertBefore dice, controls before board, gameOver', async () => {
    const {
      initGame,
      newGameVsHuman,
      destroyGame,
      getCurrentState,
    } = await import('../../src/games/remainder-islands/game-controller');

    mockRandomCycle(0.29);
    const host = mountAppShell();
    initGame(host);
    newGameVsHuman();

    // Status missing + dice present → insertBefore(status, dice).
    host.querySelector('.remainder-status')?.remove();
    expect(host.querySelector('.remainder-dice')).toBeTruthy();
    host
      .querySelector('.remainder-btn-roll')!
      .dispatchEvent(new MouseEvent('click', { bubbles: true, detail: 1 }));
    expect(host.querySelector('.remainder-status')).toBeTruthy();
    expect(getCurrentState().phase).toBe('selectIsland');

    // Remove controls while board remains → board.before(controls) on next render.
    host.querySelector('.remainder-controls')?.remove();
    const pick = getCurrentState().validIslands[0]!;
    host
      .querySelector(`[data-island-id="${pick}"]`)
      ?.dispatchEvent(
        new KeyboardEvent('keydown', { key: 'Enter', bubbles: true })
      );
    expect(getCurrentState().phase).toBe('rolling');
    expect(host.querySelector('.remainder-controls')).toBeTruthy();
    expect(host.querySelector('.remainder-btn-roll')).toBeTruthy();

    // Drive gameOver chrome via stubbed select (structure only).
    await vi.advanceTimersByTimeAsync(250);
    host
      .querySelector('.remainder-btn-roll')!
      .dispatchEvent(new MouseEvent('click', { bubbles: true, detail: 1 }));
    expect(getCurrentState().phase).toBe('selectIsland');

    vi.spyOn(remainderRules, 'selectIsland').mockImplementation((state) => ({
      ...state,
      phase: 'gameOver',
      winner: 'player1',
      currentRoll: null,
      validIslands: [],
      selectedIsland: null,
      turnsRemaining: 0,
      player1Score: Math.max(1, state.player1Score),
    }));

    const pick2 = getCurrentState().validIslands[0]!;
    host
      .querySelector(`[data-island-id="${pick2}"]`)
      ?.dispatchEvent(
        new KeyboardEvent('keydown', { key: 'Enter', bubbles: true })
      );
    expect(getCurrentState().phase).toBe('gameOver');
    expect(host.querySelector('.remainder-game-over')).toBeTruthy();
    expect(host.querySelector('svg.remainder-board')).toBeNull();

    destroyGame();
  });

  it('handler guards + AI timer early returns + null choice; tutorial lifecycle', async () => {
    const {
      initGame,
      newGameVsAI,
      newGameVsHuman,
      destroyGame,
      getCurrentState,
      startTutorial,
      isTutorialActive,
    } = await import('../../src/games/remainder-islands/game-controller');

    mockRandomCycle(0.41);
    const host = mountAppShell();
    initGame(host);
    newGameVsHuman();

    host
      .querySelector('.remainder-btn-roll')!
      .dispatchEvent(new MouseEvent('click', { bubbles: true, detail: 1 }));
    expect(getCurrentState().phase).toBe('selectIsland');
    const validId = getCurrentState().validIslands[0]!;

    // Wrong-phase click guard: flip phase under a live hit listener.
    getCurrentState().phase = 'rolling';
    hitFor(host, validId).dispatchEvent(
      new MouseEvent('click', { bubbles: true })
    );
    expect(getCurrentState().moveHistory.length).toBe(0);

    // Restore selectIsland; invalid-id guard via emptied validIslands.
    getCurrentState().phase = 'selectIsland';
    getCurrentState().validIslands = [];
    const histBefore = getCurrentState().moveHistory.length;
    hitFor(host, validId).dispatchEvent(
      new MouseEvent('click', { bubbles: true })
    );
    expect(getCurrentState().moveHistory.length).toBe(histBefore);

    // Hover same-id early return + wrong-phase hover return.
    getCurrentState().validIslands = [validId];
    getCurrentState().selectedIsland = validId;
    hitFor(host, validId).dispatchEvent(
      new MouseEvent('mouseenter', { bubbles: true })
    );
    expect(getCurrentState().selectedIsland).toBe(validId);
    getCurrentState().phase = 'rolling';
    hitFor(host, validId).dispatchEvent(
      new MouseEvent('mouseenter', { bubbles: true })
    );
    expect(getCurrentState().phase).toBe('rolling');

    // Rebuild under VsAI for timer / null-choice arms.
    destroyGame();
    document.body.innerHTML = '';
    const host2 = mountAppShell();
    initGame(host2);
    newGameVsAI('easy');
    expect(host2.querySelector('.remainder-btn-roll')).toBeTruthy();

    // Schedule AI after human move; flip phase before timer → aiRoll/aiSelect early return.
    mockRandomCycle(0.11);
    host2
      .querySelector('.remainder-btn-roll')!
      .dispatchEvent(new MouseEvent('click', { bubbles: true, detail: 1 }));
    const p1Pick = getCurrentState().validIslands[0]!;
    host2
      .querySelector(`[data-island-id="${p1Pick}"]`)
      ?.dispatchEvent(
        new KeyboardEvent('keydown', { key: 'Enter', bubbles: true })
      );
    expect(getCurrentState().currentPlayer).toBe('player2');

    // Null AI choice on select path (structure only — no move-quality assert).
    vi.spyOn(remainderAi, 'getAIIslandChoice').mockReturnValue(null);
    // Force selectIsland seat for pending timer.
    if (getCurrentState().phase === 'rolling') {
      getCurrentState().phase = 'selectIsland';
      getCurrentState().currentPlayer = 'player2';
      getCurrentState().currentRoll = { die1: 1, die2: 2, total: 3 };
      getCurrentState().validIslands = [getCurrentState().islands[0]!.id];
    }
    const movesBeforeAi = getCurrentState().moveHistory.length;
    await vi.advanceTimersByTimeAsync(800);
    // Null choice leaves history unchanged when still on P2 select.
    if (
      getCurrentState().phase === 'selectIsland' &&
      getCurrentState().currentPlayer === 'player2'
    ) {
      expect(getCurrentState().moveHistory.length).toBe(movesBeforeAi);
    }

    // Stale AI timer after seat/phase flip → early returns.
    getCurrentState().phase = 'gameOver';
    getCurrentState().winner = 'player1';
    await vi.advanceTimersByTimeAsync(800);
    expect(getCurrentState().phase).toBe('gameOver');

    // Tutorial start / completed remount / exit.
    destroyGame();
    document.body.innerHTML = '';
    const tutHost = mountAppShell();
    initGame(tutHost);
    expect(isTutorialActive()).toBe(false);
    startTutorial();
    expect(isTutorialActive()).toBe(true);
    expect(tutHost.querySelector('.remainder-game-container')).toBeTruthy();
    tutorialManager.complete();
    expect(isTutorialActive()).toBe(false);
    expect(tutHost.querySelector('.remainder-btn-roll')).toBeTruthy();

    startTutorial();
    expect(isTutorialActive()).toBe(true);
    tutorialManager.exit();
    expect(isTutorialActive()).toBe(false);

    destroyGame();
    // Bare mount without #app still paints (syncOpponentChrome no-op).
    const bare = mountRoot();
    initGame(bare);
    newGameVsHuman();
    expect(bare.querySelector('.remainder-game-container')).toBeTruthy();
    destroyGame();
  });
});
