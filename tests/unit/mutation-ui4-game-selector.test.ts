/**
 * q-mp-144 mutation audit UI wave 4 — kill survivors in ui/game-selector.
 * Structural / a11y pins only — no player-facing copy string asserts.
 * Avoid vi.mock of game-prefetch: under isolate:false the real module may
 * already be loaded, so mock call counts flake in CI.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { DIVISIONS, GAMES } from '../../src/core/game-registry';
import { renderGameSelector } from '../../src/ui/game-selector';

describe('mutation-ui4 game-selector', () => {
  let container: HTMLElement;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
    Element.prototype.scrollIntoView = vi.fn();
  });

  afterEach(() => {
    container.remove();
    vi.restoreAllMocks();
  });

  it('opens only the first division on initial render (index === 0)', () => {
    // Survivors: L301/L304/L330 `index === 0` → `!==` and `0 → 1`.
    renderGameSelector(container);

    const open = [
      ...container.querySelectorAll('.division-accordion.accordion-open'),
    ] as HTMLElement[];
    expect(open).toHaveLength(1);
    expect(open[0]!.getAttribute('data-division')).toBe(DIVISIONS[0]!.name);

    const closed = container.querySelectorAll(
      '.division-accordion:not(.accordion-open)'
    );
    expect(closed.length).toBe(DIVISIONS.length - 1);

    const tabs = [
      ...container.querySelectorAll('.division-tab'),
    ] as HTMLButtonElement[];
    expect(tabs.length).toBe(DIVISIONS.length);
    expect(tabs[0]!.classList.contains('active')).toBe(true);
    expect(tabs[0]!.getAttribute('aria-selected')).toBe('true');
    for (let i = 1; i < tabs.length; i++) {
      expect(tabs[i]!.classList.contains('active')).toBe(false);
      expect(tabs[i]!.getAttribute('aria-selected')).toBe('false');
    }
  });

  it('capitalizes difficulty label from the difficulty-* class token', () => {
    // Survivors: L54 charAt(0)/slice(1)/`+` arithmetic on difficulty display.
    renderGameSelector(container);
    const labels = [
      ...container.querySelectorAll('.game-card-difficulty'),
    ] as HTMLElement[];
    expect(labels.length).toBeGreaterThan(0);

    for (const el of labels) {
      const token = [...el.classList].find(
        (c) => c.startsWith('difficulty-') && c !== 'game-card-difficulty'
      );
      expect(token).toBeTruthy();
      const difficulty = token!.slice('difficulty-'.length);
      expect(difficulty.length).toBeGreaterThan(0);
      const expected = difficulty.charAt(0).toUpperCase() + difficulty.slice(1);
      expect(el.textContent).toBe(expected);
      // Pin exact transform lengths so slice(1)→slice(0|2) cannot hide.
      expect(el.textContent!.length).toBe(difficulty.length);
      expect(el.textContent![0]).toBe(difficulty[0]!.toUpperCase());
      expect(el.textContent!.slice(1)).toBe(difficulty.slice(1));
    }
  });

  it('available cards stay badge-free; unavailable cards get a badge', () => {
    // Survivor: L60 remove `!` on `if (!game.available)` would badge available cards.
    renderGameSelector(container);

    const available = GAMES.filter((g) => g.available);
    const unavailable = GAMES.filter((g) => !g.available);
    expect(available.length).toBeGreaterThan(0);

    const cards = [
      ...container.querySelectorAll('.game-card'),
    ] as HTMLElement[];
    const enabled = cards.filter(
      (c) => !c.classList.contains('game-card-disabled')
    );
    const disabled = cards.filter((c) =>
      c.classList.contains('game-card-disabled')
    );

    for (const card of enabled) {
      expect(card.querySelector('.game-card-badge')).toBeNull();
      expect(card.getAttribute('tabindex')).toBe('0');
    }
    // When the registry has no unavailable games, disabled set is empty — still OK.
    for (const card of disabled) {
      expect(card.querySelector('.game-card-badge')).toBeTruthy();
      expect(card.getAttribute('tabindex')).toBe('-1');
    }
    void unavailable;
  });

  // Pinned: `{ passive: true }` → `false` on pointerenter is not observable in jsdom.
  it.skip('pointerenter warm listener passive flag (pinned boolean flip)', () => {
    expect(true).toBe(true);
  });

  // Pinned: `!header || !panel` → `&&` needs a half-missing accordion DOM.
  it.skip('toggleAccordion early-return || vs && (pinned)', () => {
    expect(true).toBe(true);
  });
});
