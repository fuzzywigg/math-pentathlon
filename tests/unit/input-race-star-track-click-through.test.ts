/**
 * Star Track — rapid double-click/tap must not click-through Draw↔Select
 * controls that sync-rebuild under the cursor (HvH).
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import {
  initGame,
  newGameVsHuman,
  destroyGame,
  getGameState,
} from '../../src/games/star-track/game-controller';

describe('Star Track input-race — Draw/Select click-through', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    vi.useFakeTimers();
  });

  afterEach(() => {
    destroyGame();
    vi.useRealTimers();
    document.body.innerHTML = '';
    vi.restoreAllMocks();
  });

  function mount(): { board: HTMLElement; status: HTMLElement } {
    const board = document.createElement('div');
    const status = document.createElement('div');
    document.body.append(board, status);
    initGame(board, status);
    newGameVsHuman();
    return { board, status };
  }

  it('rejects detail>1 chain click after Draw (double-click click-through)', () => {
    const { board } = mount();
    expect(getGameState().phase).toBe('drawChains');

    board
      .querySelector('.star-track-draw-btn')!
      .dispatchEvent(new MouseEvent('click', { bubbles: true, detail: 1 }));
    expect(getGameState().phase).toBe('selectChain');
    expect(getGameState().currentPlayer).toBe('player1');

    const chain = board.querySelector('.star-track-chain-btn')!;
    chain.dispatchEvent(new MouseEvent('click', { bubbles: true, detail: 2 }));
    // Still selecting — second half of double-click must not commit a chain
    expect(getGameState().phase).toBe('selectChain');
    expect(getGameState().currentPlayer).toBe('player1');

    chain.dispatchEvent(new MouseEvent('click', { bubbles: true, detail: 1 }));
    expect(getGameState().phase).toBe('drawChains');
    expect(getGameState().currentPlayer).toBe('player2');
  });

  it('seat-settle blocks immediate Draw for the opponent after Select', async () => {
    const { board } = mount();

    board
      .querySelector('.star-track-draw-btn')!
      .dispatchEvent(new MouseEvent('click', { bubbles: true, detail: 1 }));
    board
      .querySelector('.star-track-chain-btn')!
      .dispatchEvent(new MouseEvent('click', { bubbles: true, detail: 1 }));
    expect(getGameState().currentPlayer).toBe('player2');
    expect(getGameState().phase).toBe('drawChains');

    // Immediate click-through (touch double-tap often has detail=1)
    board
      .querySelector('.star-track-draw-btn')!
      .dispatchEvent(new MouseEvent('click', { bubbles: true, detail: 1 }));
    expect(getGameState().phase).toBe('drawChains');
    expect(getGameState().drawnChains).toBeNull();
    expect(getGameState().currentPlayer).toBe('player2');

    await vi.advanceTimersByTimeAsync(250);
    board
      .querySelector('.star-track-draw-btn')!
      .dispatchEvent(new MouseEvent('click', { bubbles: true, detail: 1 }));
    expect(getGameState().phase).toBe('selectChain');
    expect(getGameState().currentPlayer).toBe('player2');
  });

  it('rejects detail>1 Draw after Select (mouse double-click)', async () => {
    const { board } = mount();

    board
      .querySelector('.star-track-draw-btn')!
      .dispatchEvent(new MouseEvent('click', { bubbles: true, detail: 1 }));
    board
      .querySelector('.star-track-chain-btn')!
      .dispatchEvent(new MouseEvent('click', { bubbles: true, detail: 1 }));
    expect(getGameState().currentPlayer).toBe('player2');

    await vi.advanceTimersByTimeAsync(250);
    board
      .querySelector('.star-track-draw-btn')!
      .dispatchEvent(new MouseEvent('click', { bubbles: true, detail: 2 }));
    expect(getGameState().phase).toBe('drawChains');
    expect(getGameState().drawnChains).toBeNull();
  });
});
