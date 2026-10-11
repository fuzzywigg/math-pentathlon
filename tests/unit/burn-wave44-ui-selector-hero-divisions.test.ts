/**
 * Wave 44 overnight HEAVY — game-selector hero + division counts.
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { renderGameSelector } from '../../src/ui/game-selector';
import { DIVISIONS, GAMES } from '../../src/core/game-registry';

describe('Wave 44 UI — selector hero/divisions', () => {
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

  it('renders hero and one accordion per division', () => {
    renderGameSelector(container);
    expect(container.querySelector('.game-selector-hero')).toBeTruthy();
    expect(container.querySelectorAll('.division-accordion')).toHaveLength(DIVISIONS.length);
    const first = container.querySelector('.division-accordion');
    expect(first?.classList.contains('accordion-open')).toBe(true);
    expect(container.querySelectorAll('.game-card').length).toBeGreaterThan(0);
    expect(GAMES.length).toBeGreaterThan(0);
  });
});
