// Game selector / landing page UI with accordion divisions

import {
  GAMES,
  DIVISIONS,
  GameInfo,
  getGamesByDivision,
} from '../core/game-registry';
import {
  clearElement,
  replaceWithSafeHtml,
  safeHtml,
} from '../core/dom-security';
import { navigate } from '../core/router';
import { prefetchGameChunk, prefetchGameChunksIdle } from './game-prefetch';
import { scrollBehaviorForMotion } from './reduced-motion';

function createGameCard(game: GameInfo): HTMLElement {
  const card = document.createElement('div');
  card.className = `game-card ${game.available ? '' : 'game-card-disabled'}`;
  card.setAttribute('role', 'button');
  card.setAttribute('tabindex', game.available ? '0' : '-1');
  card.setAttribute(
    'aria-label',
    `${game.name} - ${game.available ? 'Available' : 'Coming Soon'}`
  );

  const icon = document.createElement('div');
  icon.className = 'game-card-icon';
  icon.textContent = game.icon;
  card.appendChild(icon);

  const content = document.createElement('div');
  content.className = 'game-card-content';

  // h2 keeps heading order under page h1 (avoid skipping to h3).
  const title = document.createElement('h2');
  title.className = 'game-card-title';
  title.textContent = game.name;
  content.appendChild(title);

  const description = document.createElement('p');
  description.className = 'game-card-description';
  description.textContent = game.description;
  content.appendChild(description);

  const meta = document.createElement('div');
  meta.className = 'game-card-meta';

  const playerCount = document.createElement('span');
  playerCount.className = 'game-card-players';
  playerCount.textContent = game.playerCount;
  meta.appendChild(playerCount);

  const difficulty = document.createElement('span');
  difficulty.className = `game-card-difficulty difficulty-${game.difficulty}`;
  difficulty.textContent =
    game.difficulty.charAt(0).toUpperCase() + game.difficulty.slice(1);
  meta.appendChild(difficulty);

  content.appendChild(meta);
  card.appendChild(content);

  if (!game.available) {
    const badge = document.createElement('div');
    badge.className = 'game-card-badge';
    badge.textContent = 'Coming Soon';
    card.appendChild(badge);
  }

  // Click handler
  if (game.available) {
    const handleClick = () => {
      navigate(`/game/${game.id}`);
    };

    // Warm the game chunk on intent (hover / focus) for cheaper tablets.
    const warm = () => {
      prefetchGameChunk(game.id);
    };
    card.addEventListener('pointerenter', warm, { passive: true });
    card.addEventListener('focus', warm);

    card.addEventListener('click', handleClick);
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handleClick();
      }
    });
  }

  return card;
}

function createDivisionAccordion(
  divisionName: string,
  gradeRange: string,
  description: string,
  isFirst: boolean
): HTMLElement {
  const section = document.createElement('section');
  section.className = `division-accordion ${isFirst ? 'accordion-open' : ''}`;
  section.setAttribute('data-division', divisionName);

  const games = getGamesByDivision(divisionName);

  // Accordion header (clickable)
  const header = document.createElement('button');
  header.className = 'accordion-header';
  header.setAttribute('aria-expanded', isFirst ? 'true' : 'false');
  header.setAttribute(
    'aria-controls',
    `games-${divisionName.replace(/\s+/g, '-').toLowerCase()}`
  );

  const headerContent = document.createElement('div');
  headerContent.className = 'accordion-header-content';

  const titleRow = document.createElement('div');
  titleRow.className = 'division-title-row';

  const titleId = `division-title-${divisionName.replace(/\s+/g, '-').toLowerCase()}`;
  const title = document.createElement('span');
  title.className = 'division-title';
  title.id = titleId;
  title.textContent = divisionName;
  titleRow.appendChild(title);
  section.setAttribute('aria-labelledby', titleId);

  const grade = document.createElement('span');
  grade.className = 'division-grade';
  grade.textContent = gradeRange;
  titleRow.appendChild(grade);

  // Game count badge
  const gameCount = document.createElement('span');
  gameCount.className = 'division-game-count';
  gameCount.textContent = `${games.length} games`;
  titleRow.appendChild(gameCount);

  headerContent.appendChild(titleRow);

  const desc = document.createElement('p');
  desc.className = 'division-description';
  desc.textContent = description;
  headerContent.appendChild(desc);

  header.appendChild(headerContent);

  // Chevron icon (trusted constant SVG markup)
  const chevron = document.createElement('span');
  chevron.className = 'accordion-chevron';
  const chevronTpl = document.createElement('template');
  chevronTpl.innerHTML = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>`;
  chevron.appendChild(chevronTpl.content);
  header.appendChild(chevron);

  section.appendChild(header);

  // Accordion panel (collapsible)
  const panel = document.createElement('div');
  panel.className = 'accordion-panel';
  panel.id = `games-${divisionName.replace(/\s+/g, '-').toLowerCase()}`;
  panel.setAttribute('role', 'region');
  panel.setAttribute('aria-labelledby', titleId);

  const panelInner = document.createElement('div');
  panelInner.className = 'accordion-panel-inner';

  // Games grid
  const grid = document.createElement('div');
  grid.className = 'game-grid';

  games.forEach((game) => {
    grid.appendChild(createGameCard(game));
  });

  panelInner.appendChild(grid);
  panel.appendChild(panelInner);
  section.appendChild(panel);

  return section;
}

function setPanelKeyboardAccess(panel: HTMLElement, open: boolean): void {
  // Closed panels stay in the DOM for animation, but must leave the tab order.
  if (open) {
    panel.removeAttribute('inert');
    panel.setAttribute('aria-hidden', 'false');
  } else {
    panel.setAttribute('inert', '');
    panel.setAttribute('aria-hidden', 'true');
  }
}

function toggleAccordion(section: HTMLElement, open: boolean): void {
  const header = section.querySelector(
    '.accordion-header'
  ) as HTMLButtonElement | null;
  const panel = section.querySelector('.accordion-panel') as HTMLElement | null;
  if (!header || !panel) {
    return;
  }

  if (open) {
    section.classList.add('accordion-open');
    header.setAttribute('aria-expanded', 'true');
    setPanelKeyboardAccess(panel, true);
    // Set max-height to scrollHeight for smooth animation
    panel.style.maxHeight = panel.scrollHeight + 'px';
  } else {
    section.classList.remove('accordion-open');
    header.setAttribute('aria-expanded', 'false');
    setPanelKeyboardAccess(panel, false);
    panel.style.maxHeight = '0px';
  }
}

export function renderGameSelector(container: HTMLElement): void {
  clearElement(container);

  const wrapper = document.createElement('div');
  wrapper.className = 'game-selector';

  // Hero Header
  const hero = document.createElement('header');
  hero.className = 'game-selector-hero';

  const heroContent = document.createElement('div');
  heroContent.className = 'hero-content';

  const logo = document.createElement('div');
  logo.className = 'hero-logo';
  // trusted constant markup
  const logoTpl = document.createElement('template');
  logoTpl.innerHTML = `
    <span class="logo-icon">🏆</span>
    <div class="logo-text">
      <h1>Math Pentathlon</h1>
      <p class="tagline">Practice Edition</p>
    </div>
  `;
  logo.appendChild(logoTpl.content);
  heroContent.appendChild(logo);

  const heroDescription = document.createElement('p');
  heroDescription.className = 'hero-description';
  heroDescription.textContent =
    'Master mathematical thinking through strategic gameplay. Practice your favorite Math Pentathlon games at home!';
  heroContent.appendChild(heroDescription);

  // Stats row - simplified since all games are complete
  const stats = document.createElement('div');
  stats.className = 'hero-stats';

  replaceWithSafeHtml(
    stats,
    safeHtml`
    <div class="stat">
      <span class="stat-number">${GAMES.length}</span>
      <span class="stat-label">Games</span>
    </div>
    <div class="stat">
      <span class="stat-number">${DIVISIONS.length}</span>
      <span class="stat-label">Divisions</span>
    </div>
    <div class="stat">
      <span class="stat-number">K–7</span>
      <span class="stat-label">Grades</span>
    </div>
  `
  );
  heroContent.appendChild(stats);

  const heroActions = document.createElement('div');
  heroActions.className = 'hero-actions';

  const progressLink = document.createElement('a');
  progressLink.className = 'hero-progress-link';
  progressLink.href = '#/stats';
  progressLink.textContent = 'Your Progress';
  progressLink.setAttribute('aria-label', 'View your play progress and stats');
  progressLink.addEventListener('click', (event) => {
    event.preventDefault();
    navigate('/stats');
  });
  heroActions.appendChild(progressLink);
  heroContent.appendChild(heroActions);

  hero.appendChild(heroContent);
  wrapper.appendChild(hero);

  // Division tabs for quick nav (tablist + tab so aria-selected is valid for axe)
  const tabNav = document.createElement('nav');
  tabNav.className = 'division-tabs';
  tabNav.setAttribute('role', 'tablist');
  tabNav.setAttribute('aria-label', 'Division navigation');

  DIVISIONS.forEach((div, index) => {
    const panelId = `games-${div.name.replace(/\s+/g, '-').toLowerCase()}`;
    const tab = document.createElement('button');
    tab.type = 'button';
    tab.className = `division-tab ${index === 0 ? 'active' : ''}`;
    tab.setAttribute('role', 'tab');
    tab.setAttribute('data-division', div.name);
    tab.setAttribute('aria-selected', index === 0 ? 'true' : 'false');
    tab.setAttribute('aria-controls', panelId);
    tab.id = `division-tab-${div.name.replace(/\s+/g, '-').toLowerCase()}`;
    replaceWithSafeHtml(
      tab,
      safeHtml`
      <span class="tab-name">${div.name}</span>
      <span class="tab-grade">${div.gradeRange}</span>
    `
    );

    tabNav.appendChild(tab);
  });

  wrapper.appendChild(tabNav);

  // Accordion container
  const accordionContainer = document.createElement('div');
  accordionContainer.className = 'accordion-container';

  DIVISIONS.forEach((div, index) => {
    accordionContainer.appendChild(
      createDivisionAccordion(
        div.name,
        div.gradeRange,
        div.description,
        index === 0
      )
    );
  });

  wrapper.appendChild(accordionContainer);

  // Footer (trusted constant markup)
  const footer = document.createElement('footer');
  footer.className = 'game-selector-footer';
  const footerTpl = document.createElement('template');
  footerTpl.innerHTML = `
    <p>Select a game to start practicing!</p>
    <p class="footer-note">
      Math Pentathlon is a registered trademark of the Pentathlon Institute.
      This is an unofficial practice tool.
    </p>
  `;
  footer.appendChild(footerTpl.content);
  wrapper.appendChild(footer);

  container.appendChild(wrapper);

  // Initialize accordion heights + keyboard reachability for open sections
  const allSections = wrapper.querySelectorAll('.division-accordion');
  allSections.forEach((section) => {
    const panel = section.querySelector('.accordion-panel') as HTMLElement;
    const open = section.classList.contains('accordion-open');
    setPanelKeyboardAccess(panel, open);
    if (open) {
      panel.style.maxHeight = panel.scrollHeight + 'px';
    } else {
      panel.style.maxHeight = '0px';
    }
  });

  const syncActiveTab = (divisionName: string | null, active: boolean) => {
    tabNav.querySelectorAll('.division-tab').forEach((tab) => {
      const isActive =
        active && tab.getAttribute('data-division') === divisionName;
      tab.classList.toggle('active', isActive);
      tab.setAttribute('aria-selected', isActive ? 'true' : 'false');
    });
  };

  // Tab click handlers - open accordion and scroll
  tabNav.querySelectorAll('.division-tab').forEach((tab) => {
    tab.addEventListener('click', () => {
      const divisionName = tab.getAttribute('data-division');
      // Scope to accordion sections — tabs also use data-division and would match first
      const targetSection = wrapper.querySelector(
        `.division-accordion[data-division="${divisionName}"]`
      ) as HTMLElement | null;

      if (targetSection) {
        // Close all accordions
        allSections.forEach((section) => {
          toggleAccordion(section as HTMLElement, false);
        });

        // Open the target accordion
        toggleAccordion(targetSection, true);

        // Scroll to the section
        setTimeout(() => {
          targetSection.scrollIntoView({
            behavior: scrollBehaviorForMotion(),
            block: 'start',
          });
        }, 50);

        syncActiveTab(divisionName, true);
      }
    });
  });

  // Accordion header click handlers
  allSections.forEach((section) => {
    const header = section.querySelector('.accordion-header');

    header?.addEventListener('click', () => {
      const isOpen = section.classList.contains('accordion-open');
      const divisionName = section.getAttribute('data-division');

      // Close all accordions
      allSections.forEach((s) => {
        toggleAccordion(s as HTMLElement, false);
      });

      // If it wasn't open, open it and scroll
      if (!isOpen) {
        toggleAccordion(section as HTMLElement, true);

        // Scroll to header
        setTimeout(() => {
          section.scrollIntoView({
            behavior: scrollBehaviorForMotion(),
            block: 'start',
          });
        }, 50);
      }

      syncActiveTab(divisionName, !isOpen);
    });
  });

  // Idle-warm the first open division so the first tap is snappier offline-ish.
  const firstDivisionGames = getGamesByDivision(DIVISIONS[0]?.name ?? '')
    .filter((g) => g.available)
    .map((g) => g.id);
  prefetchGameChunksIdle(firstDivisionGames, { max: 3 });
}
