/**
 * Read-only progress / stats dashboard.
 * Data comes only from existing storage APIs — no new keys or writers.
 */

import { getGameById } from '../core/game-registry';
import { navigate } from '../core/router';
import { storage } from '../core/storage';
import type {
  Achievement,
  GameStats,
  PlayerProfile,
  StreakData,
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

function escapeText(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
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

function buildSummaryHeader(snapshot: StatsDashboardSnapshot): string {
  const profileName = snapshot.profile?.name
    ? `<p class="stats-dashboard-profile">Playing as <strong>${escapeText(snapshot.profile.name)}</strong></p>`
    : '';

  const achievementCount = snapshot.achievements.length;
  const achievementsNote =
    achievementCount > 0
      ? `<div class="stats-summary-item">
          <span class="stats-summary-value">${achievementCount}</span>
          <span class="stats-summary-label">Achievements</span>
        </div>`
      : '';

  return `
    <section class="stats-dashboard-summary" aria-label="Overall progress">
      ${profileName}
      <div class="stats-summary-grid">
        <div class="stats-summary-item">
          <span class="stats-summary-value">${snapshot.streak.currentStreak}</span>
          <span class="stats-summary-label">Day streak</span>
        </div>
        <div class="stats-summary-item">
          <span class="stats-summary-value">${snapshot.totalGamesPlayed}</span>
          <span class="stats-summary-label">Games played</span>
        </div>
        <div class="stats-summary-item">
          <span class="stats-summary-value">${escapeText(formatPlayTime(snapshot.totalPlayTime))}</span>
          <span class="stats-summary-label">Play time</span>
        </div>
        <div class="stats-summary-item">
          <span class="stats-summary-value">${escapeText(formatWinRate(snapshot.overallWinRate))}</span>
          <span class="stats-summary-label">Win rate</span>
        </div>
        ${achievementsNote}
      </div>
      ${
        snapshot.streak.bestStreak > 0
          ? `<p class="stats-dashboard-best-streak">Best streak: ${snapshot.streak.bestStreak} day${snapshot.streak.bestStreak === 1 ? '' : 's'}</p>`
          : ''
      }
    </section>
  `;
}

function buildEmptyState(): string {
  return `
    <section class="stats-dashboard-empty" role="status">
      <h2>No recorded games yet</h2>
      <p>
        Progress appears here after a game finishes and is saved.
        Some games may not record results yet — this list only shows what is already stored.
      </p>
      <button type="button" class="stats-dashboard-cta" data-action="home">
        Pick a game to play
      </button>
    </section>
  `;
}

function buildGameRow(stats: GameStats): string {
  const { name, icon } = gameDisplayName(stats.gameId);
  const winRate =
    stats.gamesPlayed > 0 ? formatWinRate(stats.gamesWon / stats.gamesPlayed) : '—';

  return `
    <article class="stats-game-card" data-game-id="${escapeText(stats.gameId)}">
      <div class="stats-game-card-header">
        <span class="stats-game-icon" aria-hidden="true">${escapeText(icon)}</span>
        <div>
          <h3 class="stats-game-name">${escapeText(name)}</h3>
          <p class="stats-game-last">Last played ${escapeText(formatLastPlayed(stats.lastPlayed))}</p>
        </div>
      </div>
      <dl class="stats-game-metrics">
        <div>
          <dt>Played</dt>
          <dd>${stats.gamesPlayed}</dd>
        </div>
        <div>
          <dt>Won</dt>
          <dd>${stats.gamesWon}</dd>
        </div>
        <div>
          <dt>Lost</dt>
          <dd>${stats.gamesLost}</dd>
        </div>
        <div>
          <dt>Draw</dt>
          <dd>${stats.gamesDraw}</dd>
        </div>
        <div>
          <dt>Win rate</dt>
          <dd>${escapeText(winRate)}</dd>
        </div>
        <div>
          <dt>Time</dt>
          <dd>${escapeText(formatPlayTime(stats.totalPlayTime))}</dd>
        </div>
        <div>
          <dt>Win streak</dt>
          <dd>${stats.currentWinStreak}</dd>
        </div>
        <div>
          <dt>Best streak</dt>
          <dd>${stats.bestWinStreak}</dd>
        </div>
      </dl>
    </article>
  `;
}

function buildGameList(snapshot: StatsDashboardSnapshot): string {
  const rows = sortGameStats(snapshot.gameStats);
  if (rows.length === 0) {
    return buildEmptyState();
  }

  return `
    <section class="stats-dashboard-games" aria-label="Per-game progress">
      <h2>By game</h2>
      <p class="stats-dashboard-note">
        Only games that have saved a finished result appear here.
      </p>
      <div class="stats-game-list">
        ${rows.map(buildGameRow).join('')}
      </div>
    </section>
  `;
}

/** Build dashboard DOM from a snapshot (testable without writing storage). */
export function renderStatsDashboardFromSnapshot(
  container: HTMLElement,
  snapshot: StatsDashboardSnapshot
): void {
  container.innerHTML = '';

  const wrapper = document.createElement('div');
  wrapper.className = 'stats-dashboard';

  const isEmpty = Object.keys(snapshot.gameStats).length === 0;

  wrapper.innerHTML = `
    <header class="game-header">
      <button id="back-btn" class="back-button" type="button" aria-label="Back to game list">← Games</button>
      <h1>Your Progress</h1>
    </header>
    ${isEmpty ? '' : buildSummaryHeader(snapshot)}
    ${buildGameList(snapshot)}
  `;

  container.appendChild(wrapper);

  const goHome = () => navigate('/');
  wrapper.querySelector('#back-btn')?.addEventListener('click', goHome);
  wrapper.querySelectorAll('[data-action="home"]').forEach((el) => {
    el.addEventListener('click', goHome);
  });
}

export function renderStatsDashboard(container: HTMLElement): void {
  renderStatsDashboardFromSnapshot(container, readStatsSnapshot());
}
