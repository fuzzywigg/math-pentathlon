// Game selector / landing page UI with accordion divisions

import { GAMES, DIVISIONS, GameInfo, getGamesByDivision } from '../core/game-registry';
import { navigate } from '../core/router';

function createGameCard(game: GameInfo): HTMLElement {
  const card = document.createElement('div');
  card.className = `game-card ${game.available ? '' : 'game-card-disabled'}`;
  card.setAttribute('role', 'button');
  card.setAttribute('tabindex', game.available ? '0' : '-1');
  card.setAttribute('aria-label', `${game.name} - ${game.available ? 'Available' : 'Coming Soon'}`);

  const icon = document.createElement('div');
  icon.className = 'game-card-icon';
  icon.textContent = game.icon;
  card.appendChild(icon);

  const content = document.createElement('div');
  content.className = 'game-card-content';

  const title = document.createElement('h3');
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
  difficulty.textContent = game.difficulty.charAt(0).toUpperCase() + game.difficulty.slice(1);
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

function createDivisionAccordion(divisionName: string, gradeRange: string, description: string, isFirst: boolean): HTMLElement {
  const section = document.createElement('section');
  section.className = `division-accordion ${isFirst ? 'accordion-open' : ''}`;
  section.setAttribute('data-division', divisionName);

  const games = getGamesByDivision(divisionName);
  const availableCount = games.filter(g => g.available).length;
  const isComplete = availableCount === games.length;

  // Accordion header (clickable)
  const header = document.createElement('button');
  header.className = 'accordion-header';
  header.setAttribute('aria-expanded', isFirst ? 'true' : 'false');
  header.setAttribute('aria-controls', `games-${divisionName.replace(/\s+/g, '-').toLowerCase()}`);

  const headerContent = document.createElement('div');
  headerContent.className = 'accordion-header-content';

  const titleRow = document.createElement('div');
  titleRow.className = 'division-title-row';

  const title = document.createElement('span');
  title.className = 'division-title';
  title.textContent = divisionName;
  titleRow.appendChild(title);

  const grade = document.createElement('span');
  grade.className = 'division-grade';
  grade.textContent = gradeRange;
  titleRow.appendChild(grade);

  if (isComplete) {
    const completeBadge = document.createElement('span');
    completeBadge.className = 'division-complete-badge';
    completeBadge.textContent = 'Complete!';
    titleRow.appendChild(completeBadge);
  } else if (availableCount > 0) {
    const progressBadge = document.createElement('span');
    progressBadge.className = 'division-progress-badge';
    progressBadge.textContent = `${availableCount}/${games.length} Available`;
    titleRow.appendChild(progressBadge);
  }

  headerContent.appendChild(titleRow);

  const desc = document.createElement('p');
  desc.className = 'division-description';
  desc.textContent = description;
  headerContent.appendChild(desc);

  header.appendChild(headerContent);

  // Chevron icon
  const chevron = document.createElement('span');
  chevron.className = 'accordion-chevron';
  chevron.innerHTML = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>`;
  header.appendChild(chevron);

  section.appendChild(header);

  // Accordion panel (collapsible)
  const panel = document.createElement('div');
  panel.className = 'accordion-panel';
  panel.id = `games-${divisionName.replace(/\s+/g, '-').toLowerCase()}`;

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

function toggleAccordion(section: HTMLElement, open: boolean): void {
  const header = section.querySelector('.accordion-header') as HTMLButtonElement;
  const panel = section.querySelector('.accordion-panel') as HTMLElement;

  if (open) {
    section.classList.add('accordion-open');
    header.setAttribute('aria-expanded', 'true');
    // Set max-height to scrollHeight for smooth animation
    panel.style.maxHeight = panel.scrollHeight + 'px';
  } else {
    section.classList.remove('accordion-open');
    header.setAttribute('aria-expanded', 'false');
    panel.style.maxHeight = '0px';
  }
}

export function renderGameSelector(container: HTMLElement): void {
  container.innerHTML = '';

  const wrapper = document.createElement('div');
  wrapper.className = 'game-selector';

  // Hero Header
  const hero = document.createElement('header');
  hero.className = 'game-selector-hero';

  const heroContent = document.createElement('div');
  heroContent.className = 'hero-content';

  const logo = document.createElement('div');
  logo.className = 'hero-logo';
  logo.innerHTML = `
    <span class="logo-icon">🏆</span>
    <div class="logo-text">
      <h1>Math Pentathlon</h1>
      <p class="tagline">Practice Edition</p>
    </div>
  `;
  heroContent.appendChild(logo);

  const heroDescription = document.createElement('p');
  heroDescription.className = 'hero-description';
  heroDescription.textContent = 'Master mathematical thinking through strategic gameplay. Practice your favorite Math Pentathlon games at home!';
  heroContent.appendChild(heroDescription);

  // Stats row
  const stats = document.createElement('div');
  stats.className = 'hero-stats';

  const totalGames = GAMES.length;
  const availableGames = GAMES.filter(g => g.available).length;

  stats.innerHTML = `
    <div class="stat">
      <span class="stat-number">${availableGames}</span>
      <span class="stat-label">Games Ready</span>
    </div>
    <div class="stat">
      <span class="stat-number">${DIVISIONS.length}</span>
      <span class="stat-label">Divisions</span>
    </div>
    <div class="stat">
      <span class="stat-number">${totalGames - availableGames}</span>
      <span class="stat-label">Coming Soon</span>
    </div>
  `;
  heroContent.appendChild(stats);

  hero.appendChild(heroContent);
  wrapper.appendChild(hero);

  // Division tabs for quick nav
  const tabNav = document.createElement('nav');
  tabNav.className = 'division-tabs';
  tabNav.setAttribute('aria-label', 'Division navigation');

  DIVISIONS.forEach((div, index) => {
    const games = getGamesByDivision(div.name);
    const availableCount = games.filter(g => g.available).length;

    const tab = document.createElement('button');
    tab.className = `division-tab ${index === 0 ? 'active' : ''}`;
    tab.setAttribute('data-division', div.name);
    tab.innerHTML = `
      <span class="tab-name">${div.name}</span>
      <span class="tab-grade">${div.gradeRange}</span>
      ${availableCount > 0 ? `<span class="tab-count">${availableCount}</span>` : ''}
    `;

    tabNav.appendChild(tab);
  });

  wrapper.appendChild(tabNav);

  // Accordion container
  const accordionContainer = document.createElement('div');
  accordionContainer.className = 'accordion-container';

  DIVISIONS.forEach((div, index) => {
    accordionContainer.appendChild(
      createDivisionAccordion(div.name, div.gradeRange, div.description, index === 0)
    );
  });

  wrapper.appendChild(accordionContainer);

  // Footer
  const footer = document.createElement('footer');
  footer.className = 'game-selector-footer';
  footer.innerHTML = `
    <p>Select a game to start practicing!</p>
    <p class="footer-note">
      Math Pentathlon is a registered trademark of the Pentathlon Institute.
      This is an unofficial practice tool.
    </p>
  `;
  wrapper.appendChild(footer);

  container.appendChild(wrapper);

  // Initialize accordion heights for open sections
  const allSections = wrapper.querySelectorAll('.division-accordion');
  allSections.forEach((section) => {
    const panel = section.querySelector('.accordion-panel') as HTMLElement;
    if (section.classList.contains('accordion-open')) {
      panel.style.maxHeight = panel.scrollHeight + 'px';
    } else {
      panel.style.maxHeight = '0px';
    }
  });

  // Tab click handlers - open accordion and scroll
  tabNav.querySelectorAll('.division-tab').forEach((tab) => {
    tab.addEventListener('click', () => {
      const divisionName = tab.getAttribute('data-division');
      const targetSection = wrapper.querySelector(`[data-division="${divisionName}"]`) as HTMLElement;

      if (targetSection) {
        // Close all accordions
        allSections.forEach((section) => {
          toggleAccordion(section as HTMLElement, false);
        });

        // Open the target accordion
        toggleAccordion(targetSection, true);

        // Scroll to the section
        setTimeout(() => {
          targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 50);

        // Update active tab
        tabNav.querySelectorAll('.division-tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
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
          section.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 50);
      }

      // Update active tab
      tabNav.querySelectorAll('.division-tab').forEach((tab) => {
        const tabDivision = tab.getAttribute('data-division');
        tab.classList.toggle('active', !isOpen && tabDivision === divisionName);
      });
    });
  });
}
