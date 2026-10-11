/**
 * Wave 44 overnight HEAVY — selector accordion header toggle.
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { renderGameSelector } from '../../src/ui/game-selector';
import { DIVISIONS } from '../../src/core/game-registry';

describe('Wave 44 UI — accordion toggle', () => {
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

  it('header click closes then reopens first division', () => {
    renderGameSelector(container);
    const section = container.querySelector(
      `.division-accordion[data-division="${DIVISIONS[0].name}"]`
    ) as HTMLElement;
    const header = section.querySelector('.accordion-header') as HTMLButtonElement;
    expect(section.classList.contains('accordion-open')).toBe(true);
    header.click();
    expect(section.classList.contains('accordion-open')).toBe(false);
    expect(header.getAttribute('aria-expanded')).toBe('false');
    header.click();
    expect(section.classList.contains('accordion-open')).toBe(true);
  });
});
