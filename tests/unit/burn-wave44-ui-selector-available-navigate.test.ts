/**
 * Wave 44 overnight HEAVY — game-selector available card navigate.
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { renderGameSelector } from '../../src/ui/game-selector';
import { GAMES } from '../../src/core/game-registry';
import * as router from '../../src/core/router';

describe('Wave 44 UI — selector navigate', () => {
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

  it('click and Enter navigate available game', () => {
    const nav = vi.spyOn(router, 'navigate').mockImplementation(() => undefined);
    renderGameSelector(container);
    const available = GAMES.find((g) => g.available)!;
    const card = [...container.querySelectorAll('.game-card')].find((el) =>
      el.getAttribute('aria-label')?.startsWith(available.name)
    ) as HTMLElement;
    expect(card).toBeTruthy();
    card.click();
    expect(nav).toHaveBeenCalledWith(`/game/${available.id}`);
    card.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    expect(nav).toHaveBeenCalledTimes(2);
  });
});
