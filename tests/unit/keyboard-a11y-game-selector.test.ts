/**
 * Keyboard a11y — main menu: closed division panels leave the tab order;
 * open panel game cards stay Enter/Space activatable.
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { renderGameSelector } from '../../src/ui/game-selector';
import { DIVISIONS } from '../../src/core/game-registry';
import * as router from '../../src/core/router';

describe('Keyboard a11y — game selector menu', () => {
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

  it('marks closed accordion panels inert so their cards are not tab stops', () => {
    renderGameSelector(container);

    const sections = [
      ...container.querySelectorAll('.division-accordion'),
    ] as HTMLElement[];
    expect(sections.length).toBe(DIVISIONS.length);

    sections.forEach((section) => {
      const panel = section.querySelector('.accordion-panel') as HTMLElement;
      const open = section.classList.contains('accordion-open');
      if (open) {
        expect(panel.hasAttribute('inert')).toBe(false);
        expect(panel.getAttribute('aria-hidden')).toBe('false');
      } else {
        expect(panel.hasAttribute('inert')).toBe(true);
        expect(panel.getAttribute('aria-hidden')).toBe('true');
      }
    });
  });

  it('switching division tabs updates inert + aria-selected', () => {
    renderGameSelector(container);
    const divisionII = DIVISIONS[1];
    const tab = container.querySelector(
      `.division-tab[data-division="${divisionII.name}"]`
    ) as HTMLButtonElement;

    tab.click();

    const target = container.querySelector(
      `.division-accordion[data-division="${divisionII.name}"]`
    ) as HTMLElement;
    const targetPanel = target.querySelector('.accordion-panel') as HTMLElement;
    expect(targetPanel.hasAttribute('inert')).toBe(false);

    container.querySelectorAll('.division-accordion').forEach((section) => {
      if (section === target) return;
      const panel = section.querySelector('.accordion-panel') as HTMLElement;
      expect(panel.hasAttribute('inert')).toBe(true);
    });

    expect(tab.getAttribute('aria-selected')).toBe('true');
    container.querySelectorAll('.division-tab').forEach((other) => {
      if (other === tab) return;
      expect(other.getAttribute('aria-selected')).toBe('false');
    });
  });

  it('available game cards are focusable and activate on Enter/Space', () => {
    const navigateSpy = vi.spyOn(router, 'navigate').mockImplementation(() => undefined);

    renderGameSelector(container);
    const card = container.querySelector(
      '.accordion-open .game-card:not(.game-card-disabled)'
    ) as HTMLElement;
    expect(card).toBeTruthy();
    expect(card.getAttribute('tabindex')).toBe('0');
    expect(card.getAttribute('role')).toBe('button');

    card.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Enter', bubbles: true })
    );
    expect(navigateSpy).toHaveBeenCalled();

    navigateSpy.mockClear();
    card.dispatchEvent(
      new KeyboardEvent('keydown', { key: ' ', bubbles: true })
    );
    expect(navigateSpy).toHaveBeenCalled();
  });
});
