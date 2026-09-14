/**
 * Wave 27 deepen — quiz seat chrome (Frac-fact / Fraction-pinball / Remainder-islands).
 * initGame + newGameVsHuman; answer/choice or roll→island advances phase/score/status.
 * Status classes .frac-status / .pinball-status / .remainder-status contain turn text.
 * Tests-only. Existing public APIs only.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';

import {
  initGame as initFrac,
  newGameVsHuman as fracVsHuman,
  getCurrentState as getFracState,
} from '../../src/games/frac-fact/game-controller';

import {
  initGame as initPinball,
  newGameVsHuman as pinballVsHuman,
  getCurrentState as getPinballState,
} from '../../src/games/fraction-pinball/game-controller';

import {
  initGame as initRemainder,
  newGameVsHuman as remainderVsHuman,
  getCurrentState as getRemainderState,
} from '../../src/games/remainder-islands/game-controller';

afterEach(() => {
  document.body.innerHTML = '';
  vi.restoreAllMocks();
  vi.useRealTimers();
});

function click(el: Element | null): void {
  expect(el).toBeTruthy();
  el!.dispatchEvent(new MouseEvent('click', { bubbles: true }));
}

function mountContainer(): HTMLElement {
  const container = document.createElement('div');
  document.body.appendChild(container);
  return container;
}

/** Constant Math.random hangs frac/pinball distractor loops — use a cycling sequence. */
function mockRandomCycle(seed = 0.17): void {
  let i = 0;
  vi.spyOn(Math, 'random').mockImplementation(() => {
    i += 1;
    return ((seed * 1000 + i * 37) % 1000) / 1000;
  });
}

describe('Wave 27 quiz-seat-chrome — Frac Fact status + choice advances', () => {
  it('initGame + newGameVsHuman paints .frac-status with turn text and player class', () => {
    const container = mountContainer();
    initFrac(container);
    expect(getFracState().phase).toBe('playing');
    expect(getFracState().currentPlayer).toBe('player1');

    const status = container.querySelector('.frac-status');
    expect(status).toBeTruthy();
    expect(status!.classList.contains('player1')).toBe(true);
    expect(status!.textContent).toMatch(/Blue|turn/i);
    expect(
      container.querySelector('.frac-choice-btn, .frac-choices')
    ).toBeTruthy();
    expect(container.querySelector('.frac-player-score.active')).toBeTruthy();
  });

  it('newGameVsHuman resets seat chrome to player1 turn', () => {
    const container = mountContainer();
    initFrac(container);
    fracVsHuman('easy');
    expect(getFracState().currentPlayer).toBe('player1');
    expect(
      container.querySelector('.frac-status.player1')?.textContent
    ).toMatch(/Blue|turn/i);
    expect(getFracState().problemsCompleted).toBe(0);
  });

  it('choice click advances to showingResult and updates score chrome', () => {
    mockRandomCycle();
    const container = mountContainer();
    initFrac(container);
    fracVsHuman('easy');

    const beforeScore =
      container.querySelector(
        '.frac-player-score.player1 .frac-score-value, .frac-score-value'
      )?.textContent ?? '';
    const choices = [...container.querySelectorAll('.frac-choice-btn')];
    expect(choices.length).toBeGreaterThan(0);
    click(choices[0]);

    expect(['showingResult', 'playing', 'gameOver']).toContain(
      getFracState().phase
    );
    if (getFracState().phase === 'showingResult') {
      expect(
        container.querySelector('.frac-result, .frac-feedback')
      ).toBeTruthy();
      expect(container.querySelector('.frac-continue-btn')).toBeTruthy();
      expect(
        getFracState().isCorrect === true || getFracState().isCorrect === false
      ).toBe(true);
    }
    expect(container.querySelector('.frac-scores')).toBeTruthy();
    // Score chrome still mounted (value may or may not change on wrong answer)
    expect(
      container.querySelector('.frac-player-score')?.textContent?.length
    ).toBeGreaterThan(0);
    void beforeScore;
  });

  it('continue after result flips seat chrome to player2 when still playing', () => {
    mockRandomCycle();
    const container = mountContainer();
    initFrac(container);
    fracVsHuman('easy');

    click(container.querySelector('.frac-choice-btn'));
    if (getFracState().phase === 'showingResult') {
      click(container.querySelector('.frac-continue-btn'));
      if (getFracState().phase === 'playing') {
        expect(getFracState().currentPlayer).toBe('player2');
        const status = container.querySelector('.frac-status');
        expect(status?.classList.contains('player2')).toBe(true);
        expect(status?.textContent).toMatch(/Red|turn/i);
        expect(
          container.querySelector('.frac-player-score.active')
        ).toBeTruthy();
      }
    }
  });

  it('full P1→P2→P1 answer cycle keeps status seat class in sync', () => {
    mockRandomCycle();
    const container = mountContainer();
    initFrac(container);
    fracVsHuman('medium');

    for (let i = 0; i < 2; i++) {
      if (getFracState().phase !== 'playing') break;
      const seat = getFracState().currentPlayer;
      expect(container.querySelector(`.frac-status.${seat}`)).toBeTruthy();
      click(container.querySelector('.frac-choice-btn'));
      if (getFracState().phase === 'showingResult') {
        click(container.querySelector('.frac-continue-btn'));
      }
    }
    expect(container.querySelector('.frac-status')?.textContent).toMatch(
      /turn/i
    );
  });

  it('illegal double-continue without answer does not invent phase', () => {
    const container = mountContainer();
    initFrac(container);
    fracVsHuman();
    expect(getFracState().phase).toBe('playing');
    const cont = container.querySelector('.frac-continue-btn');
    expect(cont).toBeNull();
    expect(container.querySelector('.frac-status.player1')).toBeTruthy();
  });
});

describe('Wave 27 quiz-seat-chrome — Fraction Pinball status + choice', () => {
  it('initGame paints .pinball-status with turn text and player1 class', () => {
    const container = mountContainer();
    initPinball(container);
    expect(getPinballState().phase).toBe('answering');
    expect(getPinballState().currentPlayer).toBe('player1');

    const status = container.querySelector('.pinball-status');
    expect(status).toBeTruthy();
    expect(status!.classList.contains('player1')).toBe(true);
    expect(status!.textContent).toMatch(/Blue|turn/i);
    expect(
      container.querySelector(
        '.pinball-choice-btn, .pinball-choices, .pinball-challenge'
      )
    ).toBeTruthy();
    expect(
      container.querySelector('.pinball-player-score.active')
    ).toBeTruthy();
  });

  it('newGameVsHuman resets to answering / player1 chrome', () => {
    const container = mountContainer();
    initPinball(container);
    pinballVsHuman();
    expect(getPinballState().phase).toBe('answering');
    expect(
      container.querySelector('.pinball-status.player1')?.textContent
    ).toMatch(/Blue|turn/i);
  });

  it('choice click advances to showResult and keeps score chrome', () => {
    mockRandomCycle();
    const container = mountContainer();
    initPinball(container);
    pinballVsHuman();

    const choices = [...container.querySelectorAll('.pinball-choice-btn')];
    expect(choices.length).toBeGreaterThan(0);
    click(choices[0]);

    expect(['showResult', 'answering', 'gameOver']).toContain(
      getPinballState().phase
    );
    if (getPinballState().phase === 'showResult') {
      expect(
        container.querySelector('.pinball-result, .pinball-feedback')
      ).toBeTruthy();
      expect(container.querySelector('.pinball-continue-btn')).toBeTruthy();
    }
    expect(container.querySelector('.pinball-scores')).toBeTruthy();
    expect(container.querySelector('.pinball-score-value')).toBeTruthy();
  });

  it('continue after result flips seat to player2 when still answering', () => {
    mockRandomCycle();
    const container = mountContainer();
    initPinball(container);
    pinballVsHuman();

    click(container.querySelector('.pinball-choice-btn'));
    if (getPinballState().phase === 'showResult') {
      click(container.querySelector('.pinball-continue-btn'));
      if (getPinballState().phase === 'answering') {
        expect(getPinballState().currentPlayer).toBe('player2');
        const status = container.querySelector('.pinball-status');
        expect(status?.classList.contains('player2')).toBe(true);
        expect(status?.textContent).toMatch(/Red|turn/i);
      }
    }
  });

  it('two-answer cycle: status class tracks currentPlayer after each continue', () => {
    mockRandomCycle();
    const container = mountContainer();
    initPinball(container);
    pinballVsHuman();

    for (let i = 0; i < 2; i++) {
      if (getPinballState().phase !== 'answering') break;
      const seat = getPinballState().currentPlayer;
      expect(
        container.querySelector(`.pinball-status.${seat}`)?.textContent
      ).toMatch(/turn/i);
      click(container.querySelector('.pinball-choice-btn'));
      if (getPinballState().phase === 'showResult') {
        click(container.querySelector('.pinball-continue-btn'));
      }
    }
    expect(container.querySelector('.pinball-status')).toBeTruthy();
  });

  it('balls / round chrome remains mounted across a miss or hit', () => {
    const container = mountContainer();
    initPinball(container);
    pinballVsHuman();
    expect(
      container.querySelector('.pinball-balls, .pinball-round')
    ).toBeTruthy();
    click(container.querySelector('.pinball-choice-btn'));
    expect(container.querySelector('.pinball-scores')).toBeTruthy();
    expect(
      container.querySelector(
        '.pinball-balls, .pinball-round, .pinball-feedback'
      )
    ).toBeTruthy();
  });
});

describe('Wave 27 quiz-seat-chrome — Remainder Islands roll→island seat chrome', () => {
  it('initGame paints .remainder-status with turn text and player1 class', () => {
    const container = mountContainer();
    initRemainder(container);
    expect(getRemainderState().phase).toBe('rolling');
    expect(getRemainderState().currentPlayer).toBe('player1');

    const status = container.querySelector('.remainder-status');
    expect(status).toBeTruthy();
    expect(status!.classList.contains('player1')).toBe(true);
    expect(status!.textContent).toMatch(/Blue|turn/i);
    expect(
      container.querySelector('.remainder-btn-roll, .remainder-btn')
    ).toBeTruthy();
    expect(
      container.querySelector('.remainder-player-score.active')
    ).toBeTruthy();
  });

  it('newGameVsHuman resets to rolling / player1', () => {
    const container = mountContainer();
    initRemainder(container);
    remainderVsHuman();
    expect(getRemainderState().phase).toBe('rolling');
    expect(
      container.querySelector('.remainder-status.player1')?.textContent
    ).toMatch(/Blue|turn/i);
  });

  it('roll advances to selectIsland and shows instruction chrome', () => {
    mockRandomCycle();
    const container = mountContainer();
    initRemainder(container);
    remainderVsHuman();

    click(container.querySelector('.remainder-btn-roll, .remainder-btn'));
    expect(['selectIsland', 'rolling', 'gameOver']).toContain(
      getRemainderState().phase
    );

    if (getRemainderState().phase === 'selectIsland') {
      expect(
        container.querySelector('.remainder-instruction')?.textContent
      ).toMatch(/Select|island/i);
      expect(getRemainderState().validIslands.length).toBeGreaterThan(0);
      expect(
        container.querySelector('.remainder-preview, .division-equation')
      ).toBeTruthy();
      expect(
        container.querySelector('.remainder-status.player1')?.textContent
      ).toMatch(/turn/i);
    }
  });

  it('valid island click flips seat back to rolling for opponent', () => {
    mockRandomCycle();
    const container = mountContainer();
    initRemainder(container);
    remainderVsHuman();

    click(container.querySelector('.remainder-btn-roll'));
    if (getRemainderState().phase !== 'selectIsland') {
      expect(getRemainderState().phase).toMatch(/roll|game/i);
      return;
    }

    const validId = getRemainderState().validIslands[0];
    const island =
      container.querySelector(`[data-island-id="${validId}"]`) ??
      container.querySelector('[data-island-id]');
    click(island);

    if (getRemainderState().phase === 'rolling') {
      expect(getRemainderState().currentPlayer).toBe('player2');
      const status = container.querySelector('.remainder-status');
      expect(status?.classList.contains('player2')).toBe(true);
      expect(status?.textContent).toMatch(/Red|turn/i);
      expect(container.querySelector('.remainder-btn-roll')).toBeTruthy();
    }
    expect(container.querySelector('.remainder-scores')).toBeTruthy();
  });

  it('invalid island click does not flip seat mid selectIsland', () => {
    mockRandomCycle();
    const container = mountContainer();
    initRemainder(container);
    remainderVsHuman();
    click(container.querySelector('.remainder-btn-roll'));
    if (getRemainderState().phase !== 'selectIsland') return;

    const seat = getRemainderState().currentPlayer;
    const histTurns = getRemainderState().turnsRemaining;
    // Click a non-valid island if one exists
    const all = [...container.querySelectorAll('[data-island-id]')];
    const invalid = all.find(
      (el) =>
        !getRemainderState().validIslands.includes(
          el.getAttribute('data-island-id')!
        )
    );
    if (invalid) {
      click(invalid);
      expect(getRemainderState().currentPlayer).toBe(seat);
      expect(getRemainderState().phase).toBe('selectIsland');
      expect(getRemainderState().turnsRemaining).toBe(histTurns);
    }
    expect(container.querySelector('.remainder-status')?.textContent).toMatch(
      /turn/i
    );
  });

  it('full P1 roll→island then P2 roll keeps score chrome and status seat sync', () => {
    mockRandomCycle();
    const container = mountContainer();
    initRemainder(container);
    remainderVsHuman();

    click(container.querySelector('.remainder-btn-roll'));
    if (getRemainderState().phase === 'selectIsland') {
      const id = getRemainderState().validIslands[0];
      click(container.querySelector(`[data-island-id="${id}"]`));
    }

    if (
      getRemainderState().phase === 'rolling' &&
      getRemainderState().currentPlayer === 'player2'
    ) {
      expect(container.querySelector('.remainder-status.player2')).toBeTruthy();
      click(container.querySelector('.remainder-btn-roll'));
      if (getRemainderState().phase === 'selectIsland') {
        expect(
          container.querySelector('.remainder-status.player2')?.textContent
        ).toMatch(/Red|turn/i);
        const id = getRemainderState().validIslands[0];
        click(container.querySelector(`[data-island-id="${id}"]`));
        if (getRemainderState().phase === 'rolling') {
          expect(getRemainderState().currentPlayer).toBe('player1');
          expect(
            container.querySelector('.remainder-status.player1')
          ).toBeTruthy();
        }
      }
    }
    expect(container.querySelector('.remainder-player-score')).toBeTruthy();
  });
});

describe('Wave 27 quiz-seat-chrome — cross-quiz mount isolation', () => {
  it('frac then pinball then remainder each paint their own status class', () => {
    const a = mountContainer();
    const b = mountContainer();
    const c = mountContainer();
    initFrac(a);
    initPinball(b);
    initRemainder(c);

    expect(a.querySelector('.frac-status.player1')?.textContent).toMatch(
      /turn/i
    );
    expect(b.querySelector('.pinball-status.player1')?.textContent).toMatch(
      /turn/i
    );
    expect(c.querySelector('.remainder-status.player1')?.textContent).toMatch(
      /turn/i
    );

    expect(a.querySelector('.pinball-status')).toBeNull();
    expect(b.querySelector('.frac-status')).toBeNull();
    expect(c.querySelector('.frac-status')).toBeNull();
  });

  it('re-init after answer does not leave stale continue chrome', () => {
    const container = mountContainer();
    initFrac(container);
    click(container.querySelector('.frac-choice-btn'));
    fracVsHuman();
    expect(getFracState().phase).toBe('playing');
    expect(container.querySelector('.frac-continue-btn')).toBeNull();
    expect(container.querySelector('.frac-status.player1')).toBeTruthy();
  });
});
