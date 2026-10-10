/**
 * Read-only progress / stats dashboard.
 * Data comes only from existing storage APIs — no new keys or writers.
 * Rendered with safe DOM APIs — stored profile/game ids never parse as HTML.
 */

import { clearElement } from '../core/dom-security';
import { getGameById } from '../core/game-registry';
import { navigate } from '../core/router';
import {
  storage,
  type Achievement,
  type GameStats,
  type PlayerProfile,
  type StreakData,
} from '../core/storage';

export interface StatsDashboardSnapshot {
  gameStats: Record<string, GameStats>;
  streak: StreakData;
  totalGamesPlayed: number;
  totalPlayTime: number;
  overallWinRate: number;
  profile: PlayerProfile | null;
  achievements: Achievement[];
}

/** Read a snapshot from the existing storage singleton (no writes). */
export function readStatsSnapshot(): StatsDashboardSnapshot {
  return {
    gameStats: storage.getAllGameStats(),
    streak: storage.getStreak(),
    totalGamesPlayed: storage.getTotalGamesPlayed(),
    totalPlayTime: storage.getTotalPlayTime(),
    overallWinRate: storage.getOverallWinRate(),
    profile: storage.getProfile(),
    achievements: storage.getAchievements(),
  };
}

export function formatPlayTime(ms: number): string {
  if (ms <= 0) {
    return '0 min';
  }

  const totalMinutes = Math.floor(ms / 60_000);
  if (totalMinutes < 60) {
    return `${totalMinutes} min`;
  }

  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  if (minutes === 0) {
    return `${hours}h`;
  }
  return `${hours}h ${minutes}m`;
}

export function formatWinRate(rate: number): string {
  if (!Number.isFinite(rate) || rate <= 0) {
    return '0%';
  }
  return `${Math.round(rate * 100)}%`;
}

export function formatLastPlayed(timestamp: number): string {
  if (!timestamp) {
    return '—';
  }
  try {
    return new Date(timestamp).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return '—';
  }
}

function gameDisplayName(gameId: string): { name: string; icon: string } {
  const info = getGameById(gameId);
  if (info) {
    return { name: info.name, icon: info.icon };
  }
  return { name: gameId, icon: '🎮' };
}

function sortGameStats(stats: Record<string, GameStats>): GameStats[] {
  return Object.values(stats).sort((a, b) => b.lastPlayed - a.lastPlayed);
}

function appendSummaryHeader(
  parent: HTMLElement,
  snapshot: StatsDashboardSnapshot
): void {
  const section = document.createElement('section');
  section.className = 'stats-dashboard-summary';
  section.setAttribute('aria-label', 'Overall progress');

  if (snapshot.profile?.name) {
    const profile = document.createElement('p');
    profile.className = 'stats-dashboard-profile';
    profile.append('Playing as ');
    const strong = document.createElement('strong');
    strong.textContent = snapshot.profile.name;
    profile.appendChild(strong);
    section.appendChild(profile);
  }

  const grid = document.createElement('div');
  grid.className = 'stats-summary-grid';

  const items: Array<[string | number, string]> = [
    [snapshot.streak.currentStreak, 'Day streak'],
    [snapshot.totalGamesPlayed, 'Games played'],
    [formatPlayTime(snapshot.totalPlayTime), 'Play time'],
    [formatWinRate(snapshot.overallWinRate), 'Win rate'],
  ];
  if (snapshot.achievements.length > 0) {
    items.push([snapshot.achievements.length, 'Achievements']);
  }

  for (const [value, label] of items) {
    const item = document.createElement('div');
    item.className = 'stats-summary-item';
    const valueEl = document.createElement('span');
    valueEl.className = 'stats-summary-value';
    valueEl.textContent = String(value);
    const labelEl = document.createElement('span');
    labelEl.className = 'stats-summary-label';
    labelEl.textContent = label;
    item.append(valueEl, labelEl);
    grid.appendChild(item);
  }

  section.appendChild(grid);

  if (snapshot.streak.bestStreak > 0) {
    const best = document.createElement('p');
    best.className = 'stats-dashboard-best-streak';
    best.textContent = `Best streak: ${snapshot.streak.bestStreak} day${
      snapshot.streak.bestStreak === 1 ? '' : 's'
    }`;
    section.appendChild(best);
  }

  parent.appendChild(section);
}

function appendEmptyState(parent: HTMLElement): void {
  const section = document.createElement('section');
  section.className = 'stats-dashboard-empty';
  section.setAttribute('role', 'status');

  const h2 = document.createElement('h2');
  h2.textContent = 'No recorded games yet';
  const p = document.createElement('p');
  p.textContent =
    'Progress appears here after a game finishes and is saved. Some games may not record results yet — this list only shows what is already stored.';
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'stats-dashboard-cta';
  btn.dataset.action = 'home';
  btn.textContent = 'Pick a game to play';

  section.append(h2, p, btn);
  parent.appendChild(section);
}

function appendGameRow(parent: HTMLElement, stats: GameStats): void {
  const { name, icon } = gameDisplayName(stats.gameId);
  const winRate =
    stats.gamesPlayed > 0
      ? formatWinRate(stats.gamesWon / stats.gamesPlayed)
      : '—';

  const article = document.createElement('article');
  article.className = 'stats-game-card';
  article.dataset.gameId = stats.gameId;

  const header = document.createElement('div');
  header.className = 'stats-game-card-header';
  const iconEl = document.createElement('span');
  iconEl.className = 'stats-game-icon';
  iconEl.setAttribute('aria-hidden', 'true');
  iconEl.textContent = icon;
  const titles = document.createElement('div');
  const h3 = document.createElement('h3');
  h3.className = 'stats-game-name';
  h3.textContent = name;
  const last = document.createElement('p');
  last.className = 'stats-game-last';
  last.textContent = `Last played ${formatLastPlayed(stats.lastPlayed)}`;
  titles.append(h3, last);
  header.append(iconEl, titles);

  const dl = document.createElement('dl');
  dl.className = 'stats-game-metrics';
  const metrics: Array<[string, string | number]> = [
    ['Played', stats.gamesPlayed],
    ['Won', stats.gamesWon],
    ['Lost', stats.gamesLost],
    ['Draw', stats.gamesDraw],
    ['Win rate', winRate],
    ['Time', formatPlayTime(stats.totalPlayTime)],
    ['Win streak', stats.currentWinStreak],
    ['Best streak', stats.bestWinStreak],
  ];
  for (const [dt, dd] of metrics) {
    const wrap = document.createElement('div');
    const dtEl = document.createElement('dt');
    dtEl.textContent = dt;
    const ddEl = document.createElement('dd');
    ddEl.textContent = String(dd);
    wrap.append(dtEl, ddEl);
    dl.appendChild(wrap);
  }

  article.append(header, dl);
  parent.appendChild(article);
}

function appendGameList(
  parent: HTMLElement,
  snapshot: StatsDashboardSnapshot
): void {
  const rows = sortGameStats(snapshot.gameStats);
  if (rows.length === 0) {
    appendEmptyState(parent);
    return;
  }

  const section = document.createElement('section');
  section.className = 'stats-dashboard-games';
  section.setAttribute('aria-label', 'Per-game progress');

  const h2 = document.createElement('h2');
  h2.textContent = 'By game';
  const note = document.createElement('p');
  note.className = 'stats-dashboard-note';
  note.textContent =
    'Only games that have saved a finished result appear here.';
  const list = document.createElement('div');
  list.className = 'stats-game-list';
  for (const row of rows) {
    appendGameRow(list, row);
  }

  section.append(h2, note, list);
  parent.appendChild(section);
}

/** Build dashboard DOM from a snapshot (testable without writing storage). */
export function renderStatsDashboardFromSnapshot(
  container: HTMLElement,
  snapshot: StatsDashboardSnapshot
): void {
  clearElement(container);

  const wrapper = document.createElement('div');
  wrapper.className = 'stats-dashboard';

  const header = document.createElement('header');
  header.className = 'game-header';
  const back = document.createElement('button');
  back.id = 'back-btn';
  back.className = 'back-button';
  back.type = 'button';
  back.setAttribute('aria-label', 'Back to game list');
  back.textContent = '← Games';
  const title = document.createElement('h1');
  title.id = 'stats-title';
  title.textContent = 'Your Progress';
  header.append(back, title);

  const main = document.createElement('div');
  main.className = 'stats-main';
  main.setAttribute('role', 'region');
  main.setAttribute('aria-labelledby', 'stats-title');

  const isEmpty = Object.keys(snapshot.gameStats).length === 0;
  if (!isEmpty) {
    appendSummaryHeader(main, snapshot);
  }
  appendGameList(main, snapshot);

  wrapper.append(header, main);
  container.appendChild(wrapper);

  const goHome = () => {
    navigate('/');
  };
  wrapper.querySelector('#back-btn')?.addEventListener('click', goHome);
  wrapper.querySelectorAll('[data-action="home"]').forEach((el) => {
    el.addEventListener('click', goHome);
  });
}

export function renderStatsDashboard(container: HTMLElement): void {
  renderStatsDashboardFromSnapshot(container, readStatsSnapshot());
}
