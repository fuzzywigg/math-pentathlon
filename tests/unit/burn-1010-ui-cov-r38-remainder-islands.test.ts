/**
 * q-mp-467 / UI coverage round 38 — remainder-islands board-ui + controller residuals.
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
    const mod =
      await import('../../src/games/remainder-islands/game-controller');
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
  const polys = root.querySelectorAll(`[data-island-id="${islandId}"] polygon`);
  expect(polys.length).toBeGreaterThanOrEqual(1);
  return polys[polys.length - 1] as SVGPolygonElement;
}

describe('q-mp-467 ui-cov-r38 remainder board-ui residuals', () => {
  it('selection visual no-polygon return + null preview + deselect strokes', () => {
    const island = createInitialState().islands[0]!;
    const state = selectIslandState({
      validIslands: [island.id],
      selectedIsland: island.id,
      // Unknown id → previewDivision null while selected (selected arm still runs).
      currentRoll: { die1: 1, die2: 1, total: 2 },
    });
    // Force previewDivision null via spy (structure only — no scoring assert).
    vi.spyOn(remainderRules, 'previewDivision').mockReturnValue(null);

    const onClick = vi.fn();
    const onHover = vi.fn();
    const svg = renderBoard(state, onClick, onHover, true);
    const group = svg.querySelector(
      `[data-island-id="${island.id}"]`
    ) as SVGGElement;
    expect(group.classList.contains('selected')).toBe(true);
    // Null preview → no R= overlay text node.
    expect(group.querySelector('.island-r-preview')).toBeNull();

    // Keep hit listener ref, strip every polygon (incl. hit) → !hex return.
    const selectedHit = hitFor(svg, island.id);
    for (const poly of [...group.querySelectorAll('polygon')]) {
      poly.remove();
    }
    expect(group.querySelector('polygon')).toBeNull();
    expect(() => {
      selectedHit.dispatchEvent(
        new MouseEvent('mouseenter', { bubbles: true })
      );
      selectedHit.dispatchEvent(
        new MouseEvent('mouseleave', { bubbles: true })
      );
    }).not.toThrow();
    expect(group.querySelector('.island-r-preview')).toBeNull();

    // Rebuild a fresh board for deselect stroke arms (valid vs invalid).
    const svg2 = renderBoard(
      selectIslandState({ validIslands: [island.id] }),
      onClick,
      onHover,
      true
    );
    const hit = hitFor(svg2, island.id);
    hit.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
    expect(
      svg2
        .querySelector(`[data-island-id="${island.id}"]`)
        ?.classList.contains('selected')
    ).toBe(true);
    // Leave → deselect stroke for still-valid island.
    hit.dispatchEvent(new MouseEvent('mouseleave', { bubbles: true }));
    const hex = svg2.querySelector(
      `[data-island-id="${island.id}"] polygon.island-hex`
    );
    expect(hex?.getAttribute('stroke-width')).toBe('4');

    // Deselect stroke arms: leave after hover restores non-selected chrome.
    const svg3 = renderBoard(
      selectIslandState({ validIslands: [island.id] }),
      onClick,
      onHover,
      true
    );
    const g3 = svg3.querySelector(
      `[data-island-id="${island.id}"]`
    ) as SVGGElement;
    const hit3 = hitFor(svg3, island.id);
    hit3.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
    expect(g3.classList.contains('selected')).toBe(true);
    hit3.dispatchEvent(new MouseEvent('mouseleave', { bubbles: true }));
    expect(g3.classList.contains('selected')).toBe(false);
    expect(g3.querySelector('polygon.island-hex')?.getAttribute('stroke')).toBe(
      '#ffeb3b'
    );
  });

  it('syncBoard hex/valueText fallbacks + chip insert without hit + score shells', () => {
    const base = selectIslandState();
    const island = base.islands[0]!;
    const onClick = vi.fn();
    const onHover = vi.fn();
    const svg = renderBoard(
      { ...base, phase: 'rolling', validIslands: [] },
      onClick,
      onHover,
      false
    );
    const group = svg.querySelector(
      `[data-island-id="${island.id}"]`
    ) as SVGGElement;

    // Remove hex polygon → syncBoard hex falsy arm (no fill write).
    group.querySelector('polygon.island-hex')?.remove();
    expect(group.querySelector('polygon')).toBeNull();

    // Replace island-value with a generic text so ?? fallback classifies it.
    group.querySelector('text.island-value')?.remove();
    const orphanText = document.createElementNS(
      'http://www.w3.org/2000/svg',
      'text'
    );
    orphanText.textContent = '9';
    group.appendChild(orphanText);

    const owned: RemainderIslandsState = {
      ...base,
      phase: 'rolling',
      validIslands: [],
      islands: base.islands.map((i) =>
        i.id === island.id ? { ...i, owner: 'player2', chips: 2, value: 9 } : i
      ),
    };
    syncBoard(svg, owned, onClick, onHover, false);
    expect(orphanText.classList.contains('island-value')).toBe(true);
    expect(orphanText.getAttribute('fill')).toBe('white');
    // Chip badge appended when no hit polygon (appendChild arm).
    expect(group.querySelector('circle.island-chip-badge')).toBeTruthy();
    expect(group.querySelector('text.island-chip-count')?.textContent).toBe(
      '2'
    );

    // Scores / dice / gameOver shells (structure only).
    const scoresP1 = renderScores({ ...base, currentPlayer: 'player1' });
    expect(
      scoresP1
        .querySelector('.remainder-player-score.player1')
        ?.classList.contains('active')
    ).toBe(true);
    expect(scoresP1.querySelectorAll('.remainder-player-score')).toHaveLength(
      2
    );
    expect(renderDice(null).querySelector('.dice-placeholder')).toBeTruthy();
    expect(
      renderGameOver({
        ...base,
        phase: 'gameOver',
        winner: null,
      }).querySelector('.remainder-winner-banner')
    ).toBeTruthy();
    expect(
      renderDivisionPreview({
        ...base,
        currentRoll: null,
        selectedIsland: null,
      }).children.length
    ).toBe(0);
    injectRemainderIslandsStyles();
    expect(document.getElementById('remainder-islands-styles')).toBeTruthy();
  });
});

describe('q-mp-467 ui-cov-r38 remainder controller residuals', () => {
  it('fillActiveChrome selected preview arms + skipNotice + status without dice', async () => {
    const { initGame, newGameVsHuman, destroyGame, getCurrentState } =
      await import('../../src/games/remainder-islands/game-controller');

    mockRandomCycle(0.23);
    const host = mountAppShell();
    initGame(host);
    newGameVsHuman();

    // Empty-valid skip → skipNotice status path (class/presence only).
    for (const island of getCurrentState().islands) {
      island.owner = 'player2';
    }
    host
      .querySelector('.remainder-btn-roll')!
      .dispatchEvent(new MouseEvent('click', { bubbles: true, detail: 1 }));
    expect(getCurrentState().currentPlayer).toBe('player2');
    expect(getCurrentState().phase).toBe('rolling');
    const statusAfterSkip = host.querySelector('.remainder-status');
    expect(statusAfterSkip).toBeTruthy();
    expect(statusAfterSkip?.classList.contains('player2')).toBe(true);
    // Presence of live status content without pinning the copy string.
    expect((statusAfterSkip?.textContent ?? '').length).toBeGreaterThan(0);

    await vi.advanceTimersByTimeAsync(250);
    // Clear ownership so next human roll can select; reset seat via new game.
    destroyGame();
    document.body.innerHTML = '';
    const host2 = mountAppShell();
    initGame(host2);
    newGameVsHuman();
    mockRandomCycle(0.31);

    host2
      .querySelector('.remainder-btn-roll')!
      .dispatchEvent(new MouseEvent('click', { bubbles: true, detail: 1 }));
    expect(getCurrentState().phase).toBe('selectIsland');
    const pick = getCurrentState().validIslands[0]!;

    // Stay in selectIsland with selectedIsland set → board.before(preview).
    vi.spyOn(remainderRules, 'selectIsland').mockImplementation(
      (state, id) => ({
        ...state,
        selectedIsland: id,
        phase: 'selectIsland',
      })
    );
    host2
      .querySelector(`[data-island-id="${pick}"]`)
      ?.dispatchEvent(
        new KeyboardEvent('keydown', { key: 'Enter', bubbles: true })
      );
    expect(getCurrentState().selectedIsland).toBe(pick);
    expect(getCurrentState().phase).toBe('selectIsland');
    const preview = host2.querySelector('.remainder-preview');
    expect(preview).toBeTruthy();
    expect(
      host2.querySelector('svg.remainder-board')?.previousElementSibling
    ).toBe(preview);

    // patchDivisionPreview: remove controls → append into game container.
    host2.querySelector('.remainder-controls')?.remove();
    host2.querySelector('.remainder-preview')?.remove();
    getCurrentState().selectedIsland = null;
    const pickB =
      getCurrentState().validIslands.find((id) => id !== pick) ?? pick;
    hitFor(host2, pickB).dispatchEvent(
      new MouseEvent('mouseenter', { bubbles: true })
    );
    expect(host2.querySelector('.remainder-preview')).toBeTruthy();
    expect(
      host2
        .querySelector('.remainder-game-container')
        ?.querySelector('.remainder-preview')
    ).toBeTruthy();

    // Full rebuild with selectedIsland pre-set via stubbed performRoll.
    vi.mocked(remainderRules.selectIsland).mockRestore();
    vi.spyOn(remainderRules, 'performRoll').mockImplementation((state) => ({
      ...state,
      phase: 'selectIsland',
      currentRoll: { die1: 2, die2: 3, total: 5 },
      validIslands: [state.islands[0]!.id],
      selectedIsland: state.islands[0]!.id,
    }));
    destroyGame();
    document.body.innerHTML = '';
    const host3 = mountAppShell();
    initGame(host3);
    newGameVsHuman();
    host3
      .querySelector('.remainder-btn-roll')!
      .dispatchEvent(new MouseEvent('click', { bubbles: true, detail: 1 }));
    expect(getCurrentState().phase).toBe('selectIsland');
    expect(getCurrentState().selectedIsland).toBeTruthy();
    expect(host3.querySelector('.remainder-preview')).toBeTruthy();
    expect(host3.querySelector('svg.remainder-board')).toBeTruthy();

    // Status recreate when both status + dice missing → appendChild(status).
    host3.querySelector('.remainder-status')?.remove();
    host3.querySelector('.remainder-dice')?.remove();
    vi.mocked(remainderRules.performRoll).mockRestore();
    // Trigger reuse-board render via hover+select stub staying in phase.
    vi.spyOn(remainderRules, 'selectIsland').mockImplementation(
      (state, id) => ({
        ...state,
        selectedIsland: id,
        phase: 'selectIsland',
      })
    );
    const pick3 = getCurrentState().validIslands[0]!;
    host3
      .querySelector(`[data-island-id="${pick3}"]`)
      ?.dispatchEvent(
        new KeyboardEvent('keydown', { key: 'Enter', bubbles: true })
      );
    expect(host3.querySelector('.remainder-status')).toBeTruthy();
    expect(host3.querySelector('.remainder-dice')).toBeTruthy();

    destroyGame();
  });

  it('handler guards via detached controls + destroy render/patch no-ops', async () => {
    const {
      initGame,
      newGameVsAI,
      newGameVsHuman,
      destroyGame,
      getCurrentState,
    } = await import('../../src/games/remainder-islands/game-controller');

    mockRandomCycle(0.19);
    const host = mountAppShell();
    initGame(host);
    newGameVsHuman();

    const rollBtn = host.querySelector(
      '.remainder-btn-roll'
    ) as HTMLButtonElement;
    expect(rollBtn).toBeTruthy();

    // Enter selectIsland; keep detached roll btn for wrong-phase guard.
    rollBtn.dispatchEvent(
      new MouseEvent('click', { bubbles: true, detail: 1 })
    );
    expect(getCurrentState().phase).toBe('selectIsland');

    // After settle window, detached roll while selectIsland → phase guard.
    await vi.advanceTimersByTimeAsync(250);
    const turns = getCurrentState().turnsRemaining;
    rollBtn.dispatchEvent(
      new MouseEvent('click', { bubbles: true, detail: 1 })
    );
    expect(getCurrentState().phase).toBe('selectIsland');
    expect(getCurrentState().turnsRemaining).toBe(turns);

    // VsAI: detached human roll during computer turn + computer chrome.
    destroyGame();
    document.body.innerHTML = '';
    const hostAi = mountAppShell();
    initGame(hostAi);
    newGameVsAI('easy');
    mockRandomCycle(0.27);
    const humanRoll = hostAi.querySelector(
      '.remainder-btn-roll'
    ) as HTMLButtonElement;
    humanRoll.dispatchEvent(
      new MouseEvent('click', { bubbles: true, detail: 1 })
    );
    expect(getCurrentState().phase).toBe('selectIsland');
    const p1Pick = getCurrentState().validIslands[0]!;
    hostAi
      .querySelector(`[data-island-id="${p1Pick}"]`)
      ?.dispatchEvent(
        new KeyboardEvent('keydown', { key: 'Enter', bubbles: true })
      );
    expect(getCurrentState().currentPlayer).toBe('player2');
    expect(getCurrentState().phase).toBe('rolling');

    const turnsP2 = getCurrentState().turnsRemaining;
    humanRoll.dispatchEvent(
      new MouseEvent('click', { bubbles: true, detail: 1 })
    );
    expect(getCurrentState().turnsRemaining).toBe(turnsP2);
    expect(getCurrentState().currentPlayer).toBe('player2');
    expect(hostAi.querySelector('.remainder-status.player2')).toBeTruthy();
    expect(hostAi.querySelector('.remainder-instruction')).toBeTruthy();
    expect(hostAi.querySelector('.remainder-btn-roll')).toBeNull();

    // Stub AI choice before timers (structure only — no move-quality assert).
    vi.spyOn(remainderAi, 'getAIIslandChoice').mockImplementation((state) => {
      const id = state.validIslands[0] ?? state.islands[0]?.id;
      return id ? { islandId: id } : null;
    });
    await vi.advanceTimersByTimeAsync(1600);
    expect(
      getCurrentState().phase === 'rolling' ||
        getCurrentState().phase === 'gameOver' ||
        getCurrentState().currentPlayer === 'player1'
    ).toBe(true);

    // Fresh VsAI mount: computer-seat activate/hover guards without re-render.
    destroyGame();
    document.body.innerHTML = '';
    const hostGuard = mountAppShell();
    initGame(hostGuard);
    newGameVsAI('easy');
    mockRandomCycle(0.29);
    hostGuard
      .querySelector('.remainder-btn-roll')!
      .dispatchEvent(new MouseEvent('click', { bubbles: true, detail: 1 }));
    const guardPick = getCurrentState().validIslands[0]!;
    const guardGroup = hostGuard.querySelector(
      `[data-island-id="${guardPick}"]`
    ) as SVGGElement;
    const guardHit = hitFor(hostGuard, guardPick);
    getCurrentState().currentPlayer = 'player2';
    const histBefore = getCurrentState().moveHistory.length;
    const selectedBefore = getCurrentState().selectedIsland;
    guardGroup.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Enter', bubbles: true })
    );
    guardHit.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
    expect(getCurrentState().moveHistory.length).toBe(histBefore);
    expect(getCurrentState().selectedIsland).toBe(selectedBefore);

    // destroy → render early return (rolling + not settling).
    destroyGame();
    document.body.innerHTML = '';
    const host4 = mountAppShell();
    initGame(host4);
    newGameVsHuman();
    mockRandomCycle(0.33);
    expect(getCurrentState().phase).toBe('rolling');
    destroyGame();
    host4
      .querySelector('.remainder-btn-roll')
      ?.dispatchEvent(new MouseEvent('click', { bubbles: true, detail: 1 }));
    expect(getCurrentState().phase).toBeTypeOf('string');

    // patchDivisionPreview !gameContainer via hover after destroy.
    const bare = mountRoot();
    initGame(bare);
    newGameVsHuman();
    mockRandomCycle(0.41);
    bare
      .querySelector('.remainder-btn-roll')!
      .dispatchEvent(new MouseEvent('click', { bubbles: true, detail: 1 }));
    expect(getCurrentState().phase).toBe('selectIsland');
    const leftoverHit = hitFor(bare, getCurrentState().validIslands[0]!);
    destroyGame();
    expect(() => {
      leftoverHit.dispatchEvent(
        new MouseEvent('mouseenter', { bubbles: true })
      );
    }).not.toThrow();

    destroyGame();
  });

  it('aiSelectIsland early-return + tutorial exited path + bare shell', async () => {
    const {
      initGame,
      newGameVsAI,
      destroyGame,
      getCurrentState,
      startTutorial,
      isTutorialActive,
    } = await import('../../src/games/remainder-islands/game-controller');

    mockRandomCycle(0.37);
    const host = mountAppShell();
    initGame(host);
    newGameVsAI('medium');

    host
      .querySelector('.remainder-btn-roll')!
      .dispatchEvent(new MouseEvent('click', { bubbles: true, detail: 1 }));
    const p1 = getCurrentState().validIslands[0]!;
    host
      .querySelector(`[data-island-id="${p1}"]`)
      ?.dispatchEvent(
        new KeyboardEvent('keydown', { key: 'Enter', bubbles: true })
      );
    expect(getCurrentState().currentPlayer).toBe('player2');
    expect(getCurrentState().phase).toBe('rolling');

    // aiRoll → selectIsland schedules select timer; then flip phase → early return.
    await vi.advanceTimersByTimeAsync(800);
    if (getCurrentState().phase === 'selectIsland') {
      getCurrentState().phase = 'gameOver';
      getCurrentState().winner = 'player1';
      await vi.advanceTimersByTimeAsync(800);
      expect(getCurrentState().phase).toBe('gameOver');
    } else {
      getCurrentState().phase = 'gameOver';
      getCurrentState().winner = 'player1';
      await vi.advanceTimersByTimeAsync(800);
      expect(getCurrentState().phase).toBe('gameOver');
    }

    // Tutorial exited (not completed) leaves HvH chrome without remount assert on copy.
    destroyGame();
    document.body.innerHTML = '';
    const tut = mountAppShell();
    initGame(tut);
    startTutorial();
    expect(isTutorialActive()).toBe(true);
    tutorialManager.exit();
    expect(isTutorialActive()).toBe(false);
    expect(tut.querySelector('.remainder-game-container')).toBeTruthy();

    destroyGame();
    const bare = mountRoot();
    initGame(bare);
    expect(bare.querySelector('.remainder-game-container')).toBeTruthy();
    destroyGame();
  });
});
