/**
 * Remainder Islands — double-click/tap on Roll after an empty-valid skip
 * must not operate the opponent's newly painted Roll button.
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import {
  initGame,
  newGameVsHuman,
  destroyGame,
  getCurrentState,
} from '../../src/games/remainder-islands/game-controller';

describe('Remainder Islands input-race — Roll double-click after skip', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    document.getElementById('remainder-islands-styles')?.remove();
    vi.useFakeTimers();
  });

  afterEach(() => {
    destroyGame();
    vi.useRealTimers();
    document.body.innerHTML = '';
    document.getElementById('remainder-islands-styles')?.remove();
    vi.restoreAllMocks();
  });

  function mount(): HTMLElement {
    const host = document.createElement('div');
    document.body.appendChild(host);
    initGame(host);
    newGameVsHuman();
    return host;
  }

  /** Force every island owned by player2 so player1's roll always skips. */
  function ownAllIslandsForPlayer2(): void {
    const state = getCurrentState();
    for (const island of state.islands) {
      island.owner = 'player2';
    }
  }

  it('rejects detail>1 Roll after empty-valid skip', () => {
    const host = mount();
    ownAllIslandsForPlayer2();
    expect(getCurrentState().currentPlayer).toBe('player1');
    expect(getCurrentState().phase).toBe('rolling');
    const turnsBefore = getCurrentState().turnsRemaining;

    const rollBtn = () => host.querySelector('.remainder-btn-roll');
    rollBtn()!.dispatchEvent(
      new MouseEvent('click', { bubbles: true, detail: 1 })
    );
    expect(getCurrentState().currentPlayer).toBe('player2');
    expect(getCurrentState().phase).toBe('rolling');
    expect(getCurrentState().turnsRemaining).toBe(turnsBefore - 1);

    const turnsAfterSkip = getCurrentState().turnsRemaining;
    rollBtn()!.dispatchEvent(
      new MouseEvent('click', { bubbles: true, detail: 2 })
    );
    expect(getCurrentState().currentPlayer).toBe('player2');
    expect(getCurrentState().phase).toBe('rolling');
    expect(getCurrentState().turnsRemaining).toBe(turnsAfterSkip);
    expect(getCurrentState().currentRoll).toBeTruthy(); // skip left a roll
  });

  it('seat-settle blocks immediate Roll for the opponent after skip', async () => {
    const host = mount();
    ownAllIslandsForPlayer2();

    host
      .querySelector('.remainder-btn-roll')!
      .dispatchEvent(new MouseEvent('click', { bubbles: true, detail: 1 }));
    expect(getCurrentState().currentPlayer).toBe('player2');
    expect(getCurrentState().phase).toBe('rolling');
    const turnsAfterSkip = getCurrentState().turnsRemaining;

    // Touch double-tap often arrives with detail=1 on the new button
    host
      .querySelector('.remainder-btn-roll')!
      .dispatchEvent(new MouseEvent('click', { bubbles: true, detail: 1 }));
    expect(getCurrentState().currentPlayer).toBe('player2');
    expect(getCurrentState().phase).toBe('rolling');
    expect(getCurrentState().turnsRemaining).toBe(turnsAfterSkip);

    await vi.advanceTimersByTimeAsync(250);
    host
      .querySelector('.remainder-btn-roll')!
      .dispatchEvent(new MouseEvent('click', { bubbles: true, detail: 1 }));
    // Player2 owns every island, so their roll finds valids → selectIsland.
    expect(getCurrentState().currentPlayer).toBe('player2');
    expect(getCurrentState().phase).toBe('selectIsland');
    expect(getCurrentState().validIslands.length).toBeGreaterThan(0);
  });
});
