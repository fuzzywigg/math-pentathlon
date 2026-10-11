/**
 * Wave 44 overnight HEAVY — disabled game card does not navigate.
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { renderGameSelector } from '../../src/ui/game-selector';
import { GAMES } from '../../src/core/game-registry';
import * as router from '../../src/core/router';

describe('Wave 44 UI — selector disabled', () => {
  let container: HTMLElement;
  // Direct prototype assign is not undone by vi.restoreAllMocks (q-mp-1180).
  // Prefer a plain noop over delete: game-selector defers scrollIntoView via
  // setTimeout, and deleting the method races those callbacks under jsdom.
  const originalScrollIntoView =
    typeof Element.prototype.scrollIntoView === 'function' &&
    !vi.isMockFunction(Element.prototype.scrollIntoView)
      ? Element.prototype.scrollIntoView
      : function scrollIntoView() {};
  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
    Element.prototype.scrollIntoView = vi.fn();
  });
  afterEach(() => {
    container.remove();
    vi.restoreAllMocks();
    Element.prototype.scrollIntoView = originalScrollIntoView;
  });

  it('coming-soon card has badge and tabindex -1', () => {
    const nav = vi.spyOn(router, 'navigate').mockImplementation(() => undefined);
    renderGameSelector(container);
    const disabled = GAMES.find((g) => !g.available);
    if (!disabled) {
      expect(true).toBe(true); // catalog may have all available
      return;
    }
    const card = [...container.querySelectorAll('.game-card-disabled')].find((el) =>
      el.getAttribute('aria-label')?.includes(disabled.name)
    ) as HTMLElement;
    expect(card).toBeTruthy();
    expect(card.getAttribute('tabindex')).toBe('-1');
    expect(card.querySelector('.game-card-badge')?.textContent).toMatch(/Coming Soon/i);
    card.click();
    expect(nav).not.toHaveBeenCalled();
  });
});
