/**
 * FIAR — AI-seat aria honesty + touch / reduced-motion keepers (board UI).
 * Mirrors Hex #383 / Kings #409: no selectable / valid-placement chrome while
 * the computer seat acts. Complements #404's human-turn selectable pin and
 * avoids #396's controller/draw-recovery files.
 */
import { describe, it, expect, afterEach, vi } from 'vitest';
import { createInitialState, CONFIG } from '../../src/games/fiar/types';
import { renderBoard, injectFiarStyles } from '../../src/games/fiar/board-ui';
import { getSelectableNodes, getValidMoves } from '../../src/games/fiar/rules';
import {
  applyGameModeChrome,
  clearGameModeChrome,
} from '../../src/ui/player-colors';

function forgeMovementState(currentPlayer: 'player1' | 'player2' = 'player1') {
  const base = createInitialState();
  for (const [id, n] of base.board.nodes) {
    base.board.nodes.set(id, { ...n, chip: null, chipKind: undefined });
  }
  const place = (id: string, chip: 'player1' | 'player2') => {
    const n = base.board.nodes.get(id)!;
    base.board.nodes.set(id, { ...n, chip, chipKind: 'plain' as const });
  };
  place('c2r1', 'player1');
  place('c6r1', 'player1');
  place('c2r3', 'player1');
  place('c6r3', 'player1');
  place('c2r5', 'player2');
  place('c6r5', 'player2');
  place('c4r1', 'player2');
  place('c4r5', 'player2');
  return {
    ...base,
    phase: 'movement' as const,
    chipsPlaced: {
      player1: CONFIG.CHIPS_PER_PLAYER,
      player2: CONFIG.CHIPS_PER_PLAYER,
    },
    currentPlayer,
    selectedNode: null,
    winner: null,
  };
}

afterEach(() => {
  document.body.innerHTML = '';
  document.getElementById('fiar-styles')?.remove();
  vi.restoreAllMocks();
});

describe('FIAR a11y during AI seat', () => {
  it('omits valid placement aria on empty cells while it is the AI seat', () => {
    const app = document.createElement('div');
    app.id = 'app';
    document.body.appendChild(app);
    applyGameModeChrome(app, 'human-vs-ai', 'player2');

    const state = {
      ...createInitialState(),
      currentPlayer: 'player2' as const,
    };
    const svg = renderBoard(state, () => undefined);
    const empty = svg.querySelector('[data-node-id="c3r3"]');
    const label = empty?.getAttribute('aria-label') ?? '';
    expect(label).toMatch(/empty/);
    expect(label).not.toMatch(/valid placement/);
    expect((empty as SVGElement | null)?.style.cursor).not.toBe('pointer');

    clearGameModeChrome(app);
  });

  it('still announces valid placement on the human turn vs AI', () => {
    const app = document.createElement('div');
    app.id = 'app';
    document.body.appendChild(app);
    applyGameModeChrome(app, 'human-vs-ai', 'player2');

    const state = createInitialState();
    expect(state.currentPlayer).toBe('player1');
    const svg = renderBoard(state, () => undefined);
    const label =
      svg.querySelector('[data-node-id="c3r3"]')?.getAttribute('aria-label') ??
      '';
    expect(label).toMatch(/valid placement/);

    clearGameModeChrome(app);
  });

  it('omits selectable aria and pulse highlights on the AI seat (movement)', () => {
    const app = document.createElement('div');
    app.id = 'app';
    document.body.appendChild(app);
    applyGameModeChrome(app, 'human-vs-ai', 'player2');

    const state = forgeMovementState('player2');
    const selectable = getSelectableNodes(state);
    expect(selectable.length).toBeGreaterThan(0);

    const svg = renderBoard(state, () => undefined);
    expect(svg.querySelector('[aria-label*="selectable"]')).toBeNull();
    expect(svg.querySelectorAll('.pulse-highlight')).toHaveLength(0);

    clearGameModeChrome(app);
  });

  it('still announces selectable on the human movement turn vs AI', () => {
    const app = document.createElement('div');
    app.id = 'app';
    document.body.appendChild(app);
    applyGameModeChrome(app, 'human-vs-ai', 'player2');

    const state = forgeMovementState('player1');
    const selectable = getSelectableNodes(state);
    expect(selectable.length).toBeGreaterThan(0);

    const svg = renderBoard(state, () => undefined);
    for (const id of selectable) {
      const label =
        svg
          .querySelector(`[data-node-id="${id}"]`)!
          .getAttribute('aria-label') || '';
      expect(label).toMatch(/selectable/);
    }
    expect(svg.querySelectorAll('.pulse-highlight').length).toBeGreaterThan(0);

    clearGameModeChrome(app);
  });

  it('omits valid-move aria when a chip is selected on the AI seat', () => {
    const app = document.createElement('div');
    app.id = 'app';
    document.body.appendChild(app);
    applyGameModeChrome(app, 'human-vs-ai', 'player2');

    const base = forgeMovementState('player2');
    const pick = getSelectableNodes(base)[0]!;
    const moves = getValidMoves({ ...base, selectedNode: pick }, pick);
    expect(moves.length).toBeGreaterThan(0);

    const svg = renderBoard({ ...base, selectedNode: pick }, () => undefined);
    expect(svg.querySelector('[aria-label*="valid move"]')).toBeNull();

    clearGameModeChrome(app);
  });
});

describe('FIAR AI-turn input guard', () => {
  it('ignores human node clicks while the computer seat is pending', async () => {
    vi.useFakeTimers();
    const fiarAiClient = await import('../../src/games/fiar/ai-client');
    vi.spyOn(Math, 'random').mockReturnValue(0.1); // human starts
    vi.spyOn(fiarAiClient, 'getAIMoveAsync').mockResolvedValue({
      type: 'place',
      nodeId: 'c2r1',
      chipKind: 'plain',
    });

    const {
      initGame,
      newGameVsAI,
      getCurrentState,
      destroyGame,
    } = await import('../../src/games/fiar/game-controller');

    const app = document.createElement('div');
    app.id = 'app';
    const board = document.createElement('div');
    const status = document.createElement('div');
    document.body.append(app, board, status);

    initGame(board, status);
    newGameVsAI('easy');

    board
      .querySelector('[data-node-id="c3r3"]')!
      .dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(getCurrentState().currentPlayer).toBe('player2');
    expect(getCurrentState().chipsPlaced.player1).toBe(1);

    // During AI pause: no valid-placement aria; clicks must not place for Red.
    expect(board.querySelector('[aria-label*="valid placement"]')).toBeNull();
    board
      .querySelector('[data-node-id="c5r3"]')!
      .dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(getCurrentState().chipsPlaced.player2).toBe(0);
    expect(getCurrentState().board.nodes.get('c5r3')?.chip).toBeNull();

    await vi.advanceTimersByTimeAsync(500);
    await Promise.resolve();
    expect(getCurrentState().chipsPlaced.player2).toBe(1);

    destroyGame();
    vi.useRealTimers();
  });
});

describe('FIAR touch + reduced-motion keepers', () => {
  it('chip-kind buttons meet 44px min-height; pulse respects reduced-motion', () => {
    injectFiarStyles();
    const css = document.getElementById('fiar-styles')!.textContent || '';
    expect(css).toMatch(
      /\.fiar-chip-kind-btn\s*\{[\s\S]*?min-height:\s*44px/
    );
    expect(css).toMatch(
      /@media\s*\(prefers-reduced-motion:\s*reduce\)\s*\{[\s\S]*?\.pulse-highlight/
    );
    expect(css).toMatch(
      /@media\s*\(prefers-reduced-motion:\s*reduce\)\s*\{[\s\S]*?\.fiar-winner-banner/
    );
  });
});
