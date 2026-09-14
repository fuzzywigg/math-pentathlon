/**
 * Wave 25 — landing game-selector hero / cards / accordion / tabs / navigation.
 * Deepens beyond game-selector.test.ts tab smoke. Distinct from wave 24 inventory.
 * Tests-only. No product inventing.
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

import { renderGameSelector } from '../../src/ui/game-selector';
import { DIVISIONS, GAMES } from '../../src/core/game-registry';

vi.mock('../../src/core/router', () => ({
  navigate: vi.fn(),
}));

import { navigate } from '../../src/core/router';

let container: HTMLElement;

beforeEach(() => {
  container = document.createElement('div');
  document.body.appendChild(container);
  Element.prototype.scrollIntoView = vi.fn();
  vi.mocked(navigate).mockClear();
});

afterEach(() => {
  container.remove();
  vi.restoreAllMocks();
});

describe('Wave 25 game-selector — hero + catalog chrome', () => {
  it('renders brand hero, division count stats, progress link, footer', () => {
    renderGameSelector(container);

    expect(container.querySelector('.game-selector-hero')).toBeTruthy();
    expect(container.textContent).toContain('Math Pentathlon');
    expect(container.textContent).toContain('Practice Edition');
    expect(container.querySelector('.hero-stats')?.textContent).toContain(
      String(GAMES.length)
    );
    expect(container.querySelector('.hero-stats')?.textContent).toContain(
      String(DIVISIONS.length)
    );
    expect(container.querySelector('.hero-stats')?.textContent).toContain(
      'K-6'
    );

    const progress = container.querySelector(
      '.hero-progress-link'
    ) as HTMLAnchorElement;
    expect(progress.getAttribute('href')).toBe('#/stats');
    expect(progress.getAttribute('aria-label')).toMatch(/progress/i);
    progress.click();
    expect(navigate).toHaveBeenCalledWith('/stats');

    expect(
      container.querySelector('.game-selector-footer')?.textContent
    ).toMatch(/Select a game/i);
  });

  it('renders one tab and accordion per division; first open only', () => {
    renderGameSelector(container);
    const tabs = container.querySelectorAll('.division-tab');
    const sections = container.querySelectorAll('.division-accordion');
    expect(tabs.length).toBe(DIVISIONS.length);
    expect(sections.length).toBe(DIVISIONS.length);

    expect(tabs[0].classList.contains('active')).toBe(true);
    expect(sections[0].classList.contains('accordion-open')).toBe(true);
    expect(
      sections[0]
        .querySelector('.accordion-header')
        ?.getAttribute('aria-expanded')
    ).toBe('true');

    for (let i = 1; i < sections.length; i++) {
      expect(sections[i].classList.contains('accordion-open')).toBe(false);
      expect(
        sections[i]
          .querySelector('.accordion-header')
          ?.getAttribute('aria-expanded')
      ).toBe('false');
    }
  });
});

describe('Wave 25 game-selector — cards + navigation', () => {
  it('available cards navigate on click and Enter/Space; disabled stay put', () => {
    renderGameSelector(container);

    const available = GAMES.find((g) => g.available);
    const unavailable = GAMES.find((g) => !g.available);
    expect(available).toBeTruthy();

    const availableCard = Array.from(
      container.querySelectorAll('.game-card')
    ).find((card) =>
      card.getAttribute('aria-label')?.startsWith(`${available!.name} -`)
    ) as HTMLElement;
    expect(availableCard).toBeTruthy();
    expect(availableCard.getAttribute('tabindex')).toBe('0');
    expect(availableCard.classList.contains('game-card-disabled')).toBe(false);

    availableCard.click();
    expect(navigate).toHaveBeenCalledWith(`/game/${available!.id}`);
    vi.mocked(navigate).mockClear();

    availableCard.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Enter', bubbles: true })
    );
    expect(navigate).toHaveBeenCalledWith(`/game/${available!.id}`);
    vi.mocked(navigate).mockClear();

    availableCard.dispatchEvent(
      new KeyboardEvent('keydown', { key: ' ', bubbles: true })
    );
    expect(navigate).toHaveBeenCalledWith(`/game/${available!.id}`);

    if (unavailable) {
      const disabledCard = Array.from(
        container.querySelectorAll('.game-card')
      ).find((card) =>
        card.getAttribute('aria-label')?.startsWith(`${unavailable.name} -`)
      ) as HTMLElement | undefined;
      if (disabledCard) {
        vi.mocked(navigate).mockClear();
        expect(disabledCard.classList.contains('game-card-disabled')).toBe(
          true
        );
        expect(disabledCard.getAttribute('tabindex')).toBe('-1');
        expect(
          disabledCard.querySelector('.game-card-badge')?.textContent
        ).toBe('Coming Soon');
        disabledCard.click();
        expect(navigate).not.toHaveBeenCalled();
      }
    }
  });

  it('card meta shows player count and capitalized difficulty', () => {
    renderGameSelector(container);
    const sample = GAMES.find((g) => g.available)!;
    const card = Array.from(container.querySelectorAll('.game-card')).find(
      (c) => c.getAttribute('aria-label')?.startsWith(`${sample.name} -`)
    )!;
    expect(card.querySelector('.game-card-players')?.textContent).toBe(
      sample.playerCount
    );
    const diff = card.querySelector('.game-card-difficulty');
    expect(diff?.classList.contains(`difficulty-${sample.difficulty}`)).toBe(
      true
    );
    expect(diff?.textContent).toBe(
      sample.difficulty.charAt(0).toUpperCase() + sample.difficulty.slice(1)
    );
  });
});

describe('Wave 25 game-selector — accordion / tab interactions', () => {
  it('header click opens closed section and closes others; re-click closes all', () => {
    vi.useFakeTimers();
    renderGameSelector(container);
    const sections = Array.from(
      container.querySelectorAll('.division-accordion')
    ) as HTMLElement[];
    expect(sections.length).toBeGreaterThan(1);

    const secondHeader = sections[1].querySelector(
      '.accordion-header'
    ) as HTMLButtonElement;
    secondHeader.click();
    expect(sections[1].classList.contains('accordion-open')).toBe(true);
    expect(sections[0].classList.contains('accordion-open')).toBe(false);
    vi.advanceTimersByTime(60);
    expect(Element.prototype.scrollIntoView).toHaveBeenCalled();

    const activeTabs = container.querySelectorAll('.division-tab.active');
    expect(activeTabs.length).toBe(1);
    expect(activeTabs[0].getAttribute('data-division')).toBe(
      sections[1].getAttribute('data-division')
    );

    // re-click open header → closes (exclusive accordion)
    secondHeader.click();
    expect(
      container.querySelectorAll('.division-accordion.accordion-open').length
    ).toBe(0);
    expect(container.querySelectorAll('.division-tab.active').length).toBe(0);
    vi.useRealTimers();
  });

  it('division tabs open matching accordion and update active class', () => {
    renderGameSelector(container);
    for (const division of DIVISIONS) {
      const tab = container.querySelector(
        `.division-tab[data-division="${division.name}"]`
      ) as HTMLButtonElement;
      tab.click();
      const open = container.querySelectorAll(
        '.division-accordion.accordion-open'
      );
      expect(open.length).toBe(1);
      expect(open[0].getAttribute('data-division')).toBe(division.name);
      expect(tab.classList.contains('active')).toBe(true);
    }
  });

  it('division game-count badge matches getGamesByDivision length', () => {
    renderGameSelector(container);
    for (const division of DIVISIONS) {
      const section = container.querySelector(
        `.division-accordion[data-division="${division.name}"]`
      )!;
      const countBadge = section.querySelector('.division-game-count');
      const cards = section.querySelectorAll('.game-card');
      expect(countBadge?.textContent).toBe(`${cards.length} games`);
      expect(section.querySelector('.division-grade')?.textContent).toBe(
        division.gradeRange
      );
    }
  });
});
