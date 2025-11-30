/**
 * Timer and Scoring UI Components
 * Visual display and controls for timers and scores
 */

import type {
  TimerInstance,
  TimerStyle,
  TimerDisplayOptions,
  ScoringState,
  ScoreStyle,
  ScoreDisplayOptions,
  LeaderboardEntry,
} from './types';
import {
  DEFAULT_TIMER_STYLE,
  DEFAULT_TIMER_DISPLAY,
  DEFAULT_SCORE_STYLE,
  DEFAULT_SCORE_DISPLAY,
} from './types';
import { formatTime, isTimerWarning, isTimerCritical, getTimerProgress } from './timer';
import { getLeaderboard, getRecentEntries } from './scoring';

/**
 * Render a timer display
 */
export function renderTimer(
  timer: TimerInstance,
  style: TimerStyle = DEFAULT_TIMER_STYLE,
  displayOptions: TimerDisplayOptions = DEFAULT_TIMER_DISPLAY
): HTMLElement {
  const container = document.createElement('div');
  container.classList.add('timer-display');
  container.style.display = 'flex';
  container.style.flexDirection = 'column';
  container.style.alignItems = 'center';
  container.style.backgroundColor = style.backgroundColor;
  container.style.borderRadius = `${style.borderRadius}px`;
  container.style.padding = `${style.padding}px`;
  container.style.fontFamily = style.fontFamily;

  // Time display
  const timeEl = document.createElement('div');
  timeEl.classList.add('timer-time');
  const value = timer.config.direction === 'down' ? timer.remaining : timer.elapsed;
  timeEl.textContent = formatTime(value, displayOptions);
  timeEl.style.fontSize = `${style.fontSize}px`;
  timeEl.style.fontWeight = 'bold';

  // Set color based on state
  if (isTimerCritical(timer)) {
    timeEl.style.color = style.criticalColor;
    timeEl.classList.add('critical');
  } else if (isTimerWarning(timer)) {
    timeEl.style.color = style.warningColor;
    timeEl.classList.add('warning');
  } else {
    timeEl.style.color = style.normalColor;
  }

  container.appendChild(timeEl);

  // Progress bar (for countdown)
  if (timer.config.direction === 'down') {
    const progressContainer = document.createElement('div');
    progressContainer.classList.add('timer-progress-container');
    progressContainer.style.width = '100%';
    progressContainer.style.height = '4px';
    progressContainer.style.backgroundColor = '#ddd';
    progressContainer.style.borderRadius = '2px';
    progressContainer.style.marginTop = '8px';
    progressContainer.style.overflow = 'hidden';

    const progressBar = document.createElement('div');
    progressBar.classList.add('timer-progress-bar');
    progressBar.style.height = '100%';
    progressBar.style.width = `${getTimerProgress(timer)}%`;
    progressBar.style.backgroundColor = isTimerCritical(timer)
      ? style.criticalColor
      : isTimerWarning(timer)
        ? style.warningColor
        : style.normalColor;
    progressBar.style.transition = 'width 0.1s linear';

    progressContainer.appendChild(progressBar);
    container.appendChild(progressContainer);
  }

  // State indicator
  const stateEl = document.createElement('div');
  stateEl.classList.add('timer-state');
  stateEl.textContent = timer.state.toUpperCase();
  stateEl.style.fontSize = '12px';
  stateEl.style.color = '#666';
  stateEl.style.marginTop = '4px';
  container.appendChild(stateEl);

  return container;
}

/**
 * Render timer controls
 */
export function renderTimerControls(
  onStart: () => void,
  onPause: () => void,
  onReset: () => void,
  currentState: 'stopped' | 'running' | 'paused'
): HTMLElement {
  const container = document.createElement('div');
  container.classList.add('timer-controls');
  container.style.display = 'flex';
  container.style.gap = '8px';
  container.style.marginTop = '12px';

  const createButton = (text: string, onClick: () => void, disabled: boolean = false) => {
    const btn = document.createElement('button');
    btn.textContent = text;
    btn.disabled = disabled;
    btn.style.padding = '8px 16px';
    btn.style.border = 'none';
    btn.style.borderRadius = '4px';
    btn.style.cursor = disabled ? 'not-allowed' : 'pointer';
    btn.style.fontWeight = '500';
    btn.style.backgroundColor = disabled ? '#ccc' : '#2196f3';
    btn.style.color = disabled ? '#666' : '#fff';
    btn.addEventListener('click', onClick);
    return btn;
  };

  if (currentState === 'running') {
    container.appendChild(createButton('Pause', onPause));
  } else {
    container.appendChild(createButton(currentState === 'paused' ? 'Resume' : 'Start', onStart));
  }

  container.appendChild(createButton('Reset', onReset));

  return container;
}

/**
 * Render a player's score display
 */
export function renderPlayerScore(
  playerId: string,
  playerName: string,
  score: number,
  style: ScoreStyle = DEFAULT_SCORE_STYLE,
  highlight: boolean = false
): HTMLElement {
  const container = document.createElement('div');
  container.classList.add('player-score');
  container.dataset.playerId = playerId;
  container.style.display = 'flex';
  container.style.justifyContent = 'space-between';
  container.style.alignItems = 'center';
  container.style.padding = '12px 16px';
  container.style.backgroundColor = highlight ? style.highlightColor : style.backgroundColor;
  container.style.borderRadius = `${style.borderRadius}px`;
  container.style.fontFamily = style.fontFamily;
  container.style.marginBottom = '4px';

  const nameEl = document.createElement('span');
  nameEl.classList.add('player-name');
  nameEl.textContent = playerName;
  nameEl.style.fontSize = `${style.fontSize * 0.75}px`;
  nameEl.style.color = style.textColor;

  const scoreEl = document.createElement('span');
  scoreEl.classList.add('score-value');
  scoreEl.textContent = String(score);
  scoreEl.style.fontSize = `${style.fontSize}px`;
  scoreEl.style.fontWeight = 'bold';
  scoreEl.style.color = score >= 0 ? style.positiveColor : style.negativeColor;

  container.appendChild(nameEl);
  container.appendChild(scoreEl);

  return container;
}

/**
 * Render the full scoreboard
 */
export function renderScoreboard(
  state: ScoringState,
  style: ScoreStyle = DEFAULT_SCORE_STYLE,
  options: ScoreDisplayOptions = DEFAULT_SCORE_DISPLAY,
  currentPlayerId?: string
): HTMLElement {
  const container = document.createElement('div');
  container.classList.add('scoreboard');
  container.style.backgroundColor = '#f5f5f5';
  container.style.borderRadius = '8px';
  container.style.padding = '16px';

  // Header
  const header = document.createElement('h3');
  header.textContent = 'Scoreboard';
  header.style.margin = '0 0 12px 0';
  header.style.fontSize = '18px';
  header.style.color = '#333';
  container.appendChild(header);

  // Get sorted leaderboard
  const leaderboard = getLeaderboard(state, currentPlayerId);

  // Render each player
  for (const entry of leaderboard) {
    const playerEl = renderPlayerScore(
      entry.playerId,
      options.showRank ? `${entry.rank}. ${entry.playerName}` : entry.playerName,
      entry.score,
      style,
      entry.isCurrentPlayer
    );
    container.appendChild(playerEl);
  }

  return container;
}

/**
 * Render leaderboard
 */
export function renderLeaderboard(
  entries: LeaderboardEntry[],
  style: ScoreStyle = DEFAULT_SCORE_STYLE,
  maxEntries: number = 10
): HTMLElement {
  const container = document.createElement('div');
  container.classList.add('leaderboard');
  container.style.backgroundColor = '#fff';
  container.style.borderRadius = '8px';
  container.style.padding = '16px';
  container.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';

  const header = document.createElement('h3');
  header.textContent = 'Leaderboard';
  header.style.margin = '0 0 16px 0';
  header.style.color = '#333';
  container.appendChild(header);

  const displayEntries = entries.slice(0, maxEntries);

  for (const entry of displayEntries) {
    const row = document.createElement('div');
    row.classList.add('leaderboard-entry');
    row.style.display = 'flex';
    row.style.alignItems = 'center';
    row.style.padding = '8px 0';
    row.style.borderBottom = '1px solid #eee';

    if (entry.isCurrentPlayer) {
      row.style.backgroundColor = style.highlightColor;
      row.style.margin = '0 -16px';
      row.style.padding = '8px 16px';
    }

    // Rank badge
    const rankBadge = document.createElement('span');
    rankBadge.classList.add('rank-badge');
    rankBadge.textContent = String(entry.rank);
    rankBadge.style.width = '28px';
    rankBadge.style.height = '28px';
    rankBadge.style.borderRadius = '50%';
    rankBadge.style.display = 'flex';
    rankBadge.style.alignItems = 'center';
    rankBadge.style.justifyContent = 'center';
    rankBadge.style.fontWeight = 'bold';
    rankBadge.style.fontSize = '14px';
    rankBadge.style.marginRight = '12px';

    // Color based on rank
    if (entry.rank === 1) {
      rankBadge.style.backgroundColor = '#ffd700';
      rankBadge.style.color = '#333';
    } else if (entry.rank === 2) {
      rankBadge.style.backgroundColor = '#c0c0c0';
      rankBadge.style.color = '#333';
    } else if (entry.rank === 3) {
      rankBadge.style.backgroundColor = '#cd7f32';
      rankBadge.style.color = '#fff';
    } else {
      rankBadge.style.backgroundColor = '#e0e0e0';
      rankBadge.style.color = '#666';
    }

    const nameEl = document.createElement('span');
    nameEl.textContent = entry.playerName;
    nameEl.style.flex = '1';
    nameEl.style.color = style.textColor;

    const scoreEl = document.createElement('span');
    scoreEl.textContent = String(entry.score);
    scoreEl.style.fontWeight = 'bold';
    scoreEl.style.fontSize = '18px';
    scoreEl.style.color = style.positiveColor;

    row.appendChild(rankBadge);
    row.appendChild(nameEl);
    row.appendChild(scoreEl);
    container.appendChild(row);
  }

  return container;
}

/**
 * Render score history for a player
 */
export function renderScoreHistory(
  state: ScoringState,
  playerId: string,
  style: ScoreStyle = DEFAULT_SCORE_STYLE,
  limit: number = 5
): HTMLElement {
  const container = document.createElement('div');
  container.classList.add('score-history');
  container.style.backgroundColor = '#fff';
  container.style.borderRadius = '4px';
  container.style.padding = '12px';

  const header = document.createElement('h4');
  header.textContent = 'Recent Activity';
  header.style.margin = '0 0 8px 0';
  header.style.fontSize = '14px';
  header.style.color = '#666';
  container.appendChild(header);

  const entries = getRecentEntries(state, playerId, limit);

  if (entries.length === 0) {
    const emptyEl = document.createElement('div');
    emptyEl.textContent = 'No score history';
    emptyEl.style.color = '#999';
    emptyEl.style.fontStyle = 'italic';
    container.appendChild(emptyEl);
    return container;
  }

  for (const entry of entries) {
    const row = document.createElement('div');
    row.classList.add('history-entry');
    row.style.display = 'flex';
    row.style.justifyContent = 'space-between';
    row.style.padding = '4px 0';
    row.style.fontSize = '14px';

    const reasonEl = document.createElement('span');
    reasonEl.textContent = entry.reason;
    reasonEl.style.color = '#666';

    const pointsEl = document.createElement('span');
    const sign = entry.points >= 0 ? '+' : '';
    pointsEl.textContent = `${sign}${entry.points}`;
    pointsEl.style.fontWeight = 'bold';
    pointsEl.style.color = entry.points >= 0 ? style.positiveColor : style.negativeColor;

    row.appendChild(reasonEl);
    row.appendChild(pointsEl);
    container.appendChild(row);
  }

  return container;
}

/**
 * Animate a score change
 */
export function animateScoreChange(
  element: HTMLElement,
  delta: number,
  duration: number = 300
): void {
  const indicator = document.createElement('div');
  indicator.classList.add('score-change-indicator');
  indicator.textContent = delta >= 0 ? `+${delta}` : String(delta);
  indicator.style.position = 'absolute';
  indicator.style.fontSize = '20px';
  indicator.style.fontWeight = 'bold';
  indicator.style.color = delta >= 0 ? '#4caf50' : '#f44336';
  indicator.style.opacity = '1';
  indicator.style.transition = `all ${duration}ms ease-out`;
  indicator.style.pointerEvents = 'none';

  const rect = element.getBoundingClientRect();
  indicator.style.left = `${rect.right + 10}px`;
  indicator.style.top = `${rect.top}px`;

  document.body.appendChild(indicator);

  // Trigger animation
  requestAnimationFrame(() => {
    indicator.style.transform = 'translateY(-20px)';
    indicator.style.opacity = '0';
  });

  setTimeout(() => {
    indicator.remove();
  }, duration);
}

/**
 * Get CSS styles for timer and scoring components
 */
export function getTimerScoringStyles(): string {
  return `
    .timer-display {
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }
    .timer-time.warning {
      animation: pulse-warning 1s ease-in-out infinite;
    }
    .timer-time.critical {
      animation: pulse-critical 0.5s ease-in-out infinite;
    }
    .timer-progress-bar {
      transition: width 0.1s linear, background-color 0.3s ease;
    }
    .timer-controls button {
      transition: background-color 0.2s, transform 0.1s;
    }
    .timer-controls button:hover:not(:disabled) {
      filter: brightness(1.1);
    }
    .timer-controls button:active:not(:disabled) {
      transform: scale(0.98);
    }
    .player-score {
      transition: background-color 0.2s ease;
      box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
    }
    .player-score:hover {
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }
    .score-value {
      transition: transform 0.2s ease;
    }
    .score-value.animate {
      animation: score-pop 0.3s ease-out;
    }
    .leaderboard-entry {
      transition: background-color 0.2s ease;
    }
    .score-change-indicator {
      z-index: 1000;
    }
    @keyframes pulse-warning {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.7; }
    }
    @keyframes pulse-critical {
      0%, 100% { opacity: 1; transform: scale(1); }
      50% { opacity: 0.8; transform: scale(1.02); }
    }
    @keyframes score-pop {
      0% { transform: scale(1); }
      50% { transform: scale(1.2); }
      100% { transform: scale(1); }
    }
  `;
}

/**
 * Inject timer and scoring styles into document
 */
export function injectTimerScoringStyles(): void {
  const styleId = 'timer-scoring-ui-styles';
  if (document.getElementById(styleId)) return;

  const style = document.createElement('style');
  style.id = styleId;
  style.textContent = getTimerScoringStyles();
  document.head.appendChild(style);
}
