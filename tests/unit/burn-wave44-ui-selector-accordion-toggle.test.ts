/**
 * Wave 44 overnight HEAVY — selector accordion header toggle.
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { renderGameSelector } from '../../src/ui/game-selector';
import { DIVISIONS } from '../../src/core/game-registry';

describe('Wave 44 UI — accordion toggle', () => {
  let container: HTMLElement;
  // Direct prototype assign is not undone by vi.restoreAllMocks (q-mp-1180).
  const hadScrollIntoView = Object.prototype.hasOwnProperty.call(
    Element.prototype,
    'scrollIntoView'
  );
  const originalScrollIntoView = Element.prototype.scrollIntoView;
  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
    Element.prototype.scrollIntoView = vi.fn();
  });
  afterEach(() => {
    container.remove();
    vi.restoreAllMocks();
    if (hadScrollIntoView) {
      Element.prototype.scrollIntoView = originalScrollIntoView;
    } else {
      Reflect.deleteProperty(Element.prototype, 'scrollIntoView');
    }
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
