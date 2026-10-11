/**
 * Wave 44 overnight HEAVY — game-selector hero + division counts.
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { renderGameSelector } from '../../src/ui/game-selector';
import { DIVISIONS, GAMES } from '../../src/core/game-registry';

describe('Wave 44 UI — selector hero/divisions', () => {
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
