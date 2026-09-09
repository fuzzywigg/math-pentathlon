import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { renderGameSelector } from '../../src/ui/game-selector';
import { DIVISIONS } from '../../src/core/game-registry';

describe('game-selector division tabs', () => {
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

  it('opens the matching accordion when a Division II+ tab is clicked', () => {
    renderGameSelector(container);

    const divisionII = DIVISIONS[1];
    expect(divisionII).toBeDefined();

    const tab = container.querySelector(
      `.division-tab[data-division="${divisionII.name}"]`
    ) as HTMLButtonElement;
    expect(tab).toBeTruthy();

    expect(() => tab.click()).not.toThrow();

    const sections = container.querySelectorAll('.division-accordion');
    expect(sections.length).toBe(DIVISIONS.length);

    sections.forEach((section) => {
      const isTarget = section.getAttribute('data-division') === divisionII.name;
      expect(section.classList.contains('accordion-open')).toBe(isTarget);
    });

    const targetSection = container.querySelector(
      `.division-accordion[data-division="${divisionII.name}"]`
    );
    expect(targetSection).toBeTruthy();
    expect(targetSection?.querySelector('.accordion-header')?.getAttribute('aria-expanded')).toBe(
      'true'
    );
    expect(tab.classList.contains('active')).toBe(true);
  });

  it('opens Division III and IV tabs without collapsing all sections', () => {
    renderGameSelector(container);

    for (const division of DIVISIONS.slice(1)) {
      const tab = container.querySelector(
        `.division-tab[data-division="${division.name}"]`
      ) as HTMLButtonElement;
      expect(() => tab.click()).not.toThrow();

      const openSections = container.querySelectorAll('.division-accordion.accordion-open');
      expect(openSections.length).toBe(1);
      expect(openSections[0].getAttribute('data-division')).toBe(division.name);
    }
  });
});
