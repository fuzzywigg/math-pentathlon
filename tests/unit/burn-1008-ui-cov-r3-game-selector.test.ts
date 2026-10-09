/**
 * burn-1008-mp-ui-coverage-round-3 — game-selector coming-soon badge +
 * accordion/tab scroll edges. Isolated (vi.mock registry + prefetch).
 * Tests-only; pins current behavior.
 */
import { afterEach, describe, expect, it, vi } from 'vitest';

vi.mock('../../src/core/game-registry', async () => {
  const actual = await vi.importActual<
    typeof import('../../src/core/game-registry')
  >('../../src/core/game-registry');
  const unavailable = {
    id: 'coming-soon-probe',
    name: 'Coming Soon Probe',
    division: actual.DIVISIONS[0]!.name,
    gradeRange: 'Grades K-1',
    description: 'Unavailable card for coverage',
    playerCount: '2',
    difficulty: 'beginner' as const,
    icon: '🧪',
    available: false,
  };
  return {
    ...actual,
    GAMES: [...actual.GAMES, unavailable],
    getGamesByDivision: (division: string) =>
      [...actual.GAMES, unavailable].filter((g) => g.division === division),
  };
});

vi.mock('../../src/ui/game-prefetch', () => ({
  prefetchGameChunk: vi.fn(),
  prefetchGameChunksIdle: vi.fn(),
}));

import { renderGameSelector } from '../../src/ui/game-selector';

describe('burn-1008 ui-cov-r3 game-selector', () => {
  afterEach(() => {
    document.body.innerHTML = '';
    vi.useRealTimers();
  });

  it('renders Coming Soon badge for unavailable games and toggles accordion', () => {
    vi.useFakeTimers();
    const root = document.createElement('div');
    document.body.appendChild(root);
    HTMLElement.prototype.scrollIntoView = vi.fn();
    const scrollSpy = HTMLElement.prototype.scrollIntoView as ReturnType<
      typeof vi.fn
    >;

    renderGameSelector(root);

    const badge = root.querySelector('.game-card-badge');
    expect(badge).toBeTruthy();
    const disabledCard = root.querySelector('.game-card-disabled');
    expect(disabledCard?.getAttribute('tabindex')).toBe('-1');

    const headers = [
      ...root.querySelectorAll('.accordion-header'),
    ] as HTMLButtonElement[];
    expect(headers.length).toBeGreaterThan(1);

    const firstOpen = root.querySelector(
      '.division-accordion.accordion-open'
    ) as HTMLElement;
    const firstHeader = firstOpen.querySelector(
      '.accordion-header'
    ) as HTMLButtonElement;
    firstHeader.click();
    expect(firstOpen.classList.contains('accordion-open')).toBe(false);

    const closed = [
      ...root.querySelectorAll('.division-accordion:not(.accordion-open)'),
    ][0] as HTMLElement;
    const closedHeader = closed.querySelector(
      '.accordion-header'
    ) as HTMLButtonElement;
    closedHeader.click();
    expect(closed.classList.contains('accordion-open')).toBe(true);
    vi.advanceTimersByTime(50);
    expect(scrollSpy).toHaveBeenCalled();

    const tab = root.querySelector(
      '.division-tab:not(.active)'
    ) as HTMLButtonElement | null;
    if (tab) {
      tab.click();
      vi.advanceTimersByTime(50);
      expect(tab.getAttribute('aria-selected')).toBe('true');
    }
  });
});
