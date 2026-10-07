/**
 * Soft-lock / a11y / reduced-motion polish for Remainder Islands
 * (follow-up to #373/#374 playability).
 */
import { describe, it, expect, afterEach, vi } from 'vitest';
import {
  initGame,
  newGameVsHuman,
  getCurrentState,
} from '../../src/games/remainder-islands/game-controller';
import { createInitialState } from '../../src/games/remainder-islands/types';
import {
  injectRemainderIslandsStyles,
  renderBoard,
} from '../../src/games/remainder-islands/board-ui';

afterEach(() => {
  vi.restoreAllMocks();
  document.body.innerHTML = '';
  document.getElementById('remainder-islands-styles')?.remove();
});

function mount(): HTMLElement {
  const app = document.createElement('div');
  app.id = 'app';
  document.body.appendChild(app);
  const container = document.createElement('div');
  app.appendChild(container);
  return container;
}

function hitPolygon(container: HTMLElement, islandId: string): SVGPolygonElement {
  const polys = container.querySelectorAll(
    `[data-island-id="${islandId}"] polygon`
  );
  expect(polys.length).toBeGreaterThanOrEqual(2);
  return polys[polys.length - 1] as SVGPolygonElement;
}

describe('Remainder Islands polish — reduced-motion CSS', () => {
  it('injector includes prefers-reduced-motion overrides for glow and scale', () => {
    injectRemainderIslandsStyles();
    const css =
      document.getElementById('remainder-islands-styles')?.textContent ?? '';
    expect(css).toMatch(/@media \(prefers-reduced-motion: reduce\)/);
    expect(css).toMatch(/\.island\.valid polygon:first-child/);
    expect(css).toMatch(/\.remainder-player-score\.active/);
    expect(css).toMatch(/transform:\s*none/);
  });
});

describe('Remainder Islands polish — focusable only when activatable', () => {
  it('valid interactive islands are buttons; inactive islands are not', () => {
    const base = createInitialState();
    const valid = base.islands[0]!;
    const invalid = base.islands[1]!;
    const svg = renderBoard(
      {
        ...base,
        phase: 'selectIsland',
        currentRoll: { die1: 2, die2: 2, total: 4 },
        validIslands: [valid.id],
      },
      () => undefined,
      () => undefined,
      true
    );

    const validGroup = svg.querySelector(`[data-island-id="${valid.id}"]`);
    const invalidGroup = svg.querySelector(`[data-island-id="${invalid.id}"]`);
    expect(validGroup?.getAttribute('role')).toBe('button');
    expect(validGroup?.getAttribute('tabindex')).toBe('0');
    expect(invalidGroup?.getAttribute('role')).toBeNull();
    expect(invalidGroup?.getAttribute('aria-label')).toBeTruthy();
  });

  it('interactive=false never exposes role=button on islands', () => {
    const base = createInitialState();
    const island = base.islands[0]!;
    const svg = renderBoard(
      {
        ...base,
        phase: 'selectIsland',
        currentRoll: { die1: 1, die2: 1, total: 2 },
        validIslands: [island.id],
      },
      () => undefined,
      () => undefined,
      false
    );
    const group = svg.querySelector(`[data-island-id="${island.id}"]`);
    expect(group?.getAttribute('role')).toBeNull();
    expect(group?.getAttribute('aria-label')).toBeTruthy();
  });
});

describe('Remainder Islands polish — pointerdown+click claim-once', () => {
  it('pointerdown then click activates the island only once', () => {
    let i = 0;
    vi.spyOn(Math, 'random').mockImplementation(() => {
      i += 1;
      return ((0.17 * 1000 + i * 37) % 1000) / 1000;
    });

    const container = mount();
    initGame(container);
    newGameVsHuman();

    container
      .querySelector('.remainder-btn-roll')!
      .dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(getCurrentState().phase).toBe('selectIsland');
    const islandId = getCurrentState().validIslands[0];
    expect(islandId).toBeTruthy();

    const hit = hitPolygon(container, islandId);
    hit.dispatchEvent(new Event('pointerdown', { bubbles: true }));
    // Second event on the same hit node must not double-apply (phase already advanced).
    hit.dispatchEvent(new MouseEvent('click', { bubbles: true }));

    expect(getCurrentState().moveHistory).toHaveLength(1);
    expect(getCurrentState().moveHistory[0]?.island.id).toBe(islandId);
    expect(getCurrentState().phase).toBe('rolling');
  });
});

describe('Remainder Islands polish — empty-valid skip status', () => {
  it('announces a soft-lock skip when a roll finds no open islands', () => {
    let i = 0;
    vi.spyOn(Math, 'random').mockImplementation(() => {
      i += 1;
      return ((0.41 * 1000 + i * 37) % 1000) / 1000;
    });

    const container = mount();
    initGame(container);
    newGameVsHuman();

    // Own every island for the opponent so the next roll has zero valids.
    const locked = getCurrentState();
    for (const island of locked.islands) {
      island.owner = 'player2';
    }

    container
      .querySelector('.remainder-btn-roll')!
      .dispatchEvent(new MouseEvent('click', { bubbles: true }));

    expect(getCurrentState().currentPlayer).toBe('player2');
    expect(getCurrentState().phase).toBe('rolling');
    expect(container.textContent).toMatch(/No open islands/i);
  });
});
