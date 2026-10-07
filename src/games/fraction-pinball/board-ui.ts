// Fraction Pinball Board UI
// Renders the pinball-style game board, challenges, and scores

import { FractionPinballState, Player, getPlayerStats } from './types';
import { formatDecimal, formatFraction } from './rules';
import { seatIcon } from '../../ui/player-colors';

// =============================================================================
// Challenge Display
// =============================================================================

export interface PinballChallengeOptions {
  /** When false, disable choice buttons (computer answering). */
  allowInput?: boolean;
}

/**
 * Render the conversion challenge
 */
export function renderChallenge(
  state: FractionPinballState,
  onAnswerSelect: (answer: string) => void,
  options: PinballChallengeOptions = {}
): HTMLElement {
  const allowInput = options.allowInput !== false;
  const container = document.createElement('div');
  container.className = 'pinball-challenge';

  if (!state.currentChallenge) {
    container.innerHTML =
      '<div class="pinball-no-challenge">No challenge loaded</div>';
    return container;
  }

  const challenge = state.currentChallenge;

  // Question display
  const question = document.createElement('div');
  question.className = 'pinball-question';

  if (challenge.type === 'fractionToDecimal') {
    question.innerHTML = `
      <div class="pinball-instruction">Convert to decimal:</div>
      <div class="pinball-value pinball-fraction">${formatFraction(challenge.fraction)}</div>
    `;
  } else {
    question.innerHTML = `
      <div class="pinball-instruction">Convert to fraction:</div>
      <div class="pinball-value pinball-decimal">${formatDecimal(challenge.decimal)}</div>
    `;
  }

  container.appendChild(question);

  // Answer choices (only in answering phase)
  if (state.phase === 'answering') {
    const choices = document.createElement('div');
    choices.className = 'pinball-choices';

    for (const choice of challenge.answerChoices) {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'pinball-choice-btn';
      btn.type = 'button';
      btn.textContent = choice;
      btn.setAttribute('aria-label', `Answer ${choice}`);
      if (allowInput) {
        btn.addEventListener('click', () => onAnswerSelect(choice));
      } else {
        btn.disabled = true;
        btn.setAttribute('aria-disabled', 'true');
      }
      choices.appendChild(btn);
    }

    container.appendChild(choices);
  }

  return container;
}

// =============================================================================
// Result Display
// =============================================================================

export interface PinballResultOptions {
  /** Points just awarded on a hit (display-only; 0 on miss). */
  pointsAwarded?: number;
  /**
   * When false, omit Continue (AI auto-advances). Defaults to true.
   */
  showContinue?: boolean;
}

/**
 * Render result after answering
 */
export function renderResult(
  state: FractionPinballState,
  onContinue: () => void,
  options: PinballResultOptions = {}
): HTMLElement {
  const container = document.createElement('div');
  container.className = 'pinball-result';

  if (state.phase !== 'showResult' || !state.currentChallenge) {
    return container;
  }

  const pointsAwarded = options.pointsAwarded ?? 0;
  const showContinue = options.showContinue !== false;

  const feedback = document.createElement('div');
  feedback.className = `pinball-feedback ${state.isCorrect ? 'correct' : 'incorrect'}`;

  if (state.isCorrect) {
    // Default copy preserves overnight exact-match leftovers when points omitted.
    const hitText =
      pointsAwarded > 0 ? 'HIT!' : 'HIT! Points scored!';
    const pointsLine =
      pointsAwarded > 0
        ? `<div class="pinball-points">+${pointsAwarded} points</div>`
        : '';
    feedback.innerHTML = `
      <div class="pinball-feedback-icon">🎯</div>
      <div class="pinball-feedback-text">${hitText}</div>
      ${pointsLine}
      <div class="pinball-animation">★ ★ ★</div>
    `;
  } else {
    feedback.innerHTML = `
      <div class="pinball-feedback-icon">✗</div>
      <div class="pinball-feedback-text">Miss! Ball lost.</div>
      <div class="pinball-correct">Correct: ${state.currentChallenge.correctAnswer}</div>
    `;
  }

  container.appendChild(feedback);

  if (showContinue) {
    const continueBtn = document.createElement('button');
    continueBtn.className = 'pinball-continue-btn';
    continueBtn.type = 'button';
    continueBtn.textContent = 'Continue';
    continueBtn.setAttribute('aria-label', 'Continue to next challenge');
    continueBtn.addEventListener('click', onContinue);
    container.appendChild(continueBtn);
  } else {
    const auto = document.createElement('div');
    auto.className = 'pinball-auto-advance';
    auto.textContent = 'Next challenge…';
    container.appendChild(auto);
  }

  return container;
}

// =============================================================================
// Pinball Board Visual
// =============================================================================

/**
 * Render decorative pinball board (non-interactive atmosphere).
 */
export function renderPinballBoard(_state: FractionPinballState): SVGElement {
  const width = 300;
  const height = 400;

  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('width', String(width));
  svg.setAttribute('height', String(height));
  svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
  svg.classList.add('pinball-board');
  svg.setAttribute('role', 'img');
  svg.setAttribute('aria-hidden', 'true');
  svg.setAttribute('focusable', 'false');
  svg.style.pointerEvents = 'none';

  // Board background
  const bg = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
  bg.setAttribute('width', String(width));
  bg.setAttribute('height', String(height));
  bg.setAttribute('fill', '#1a237e');
  bg.setAttribute('rx', '10');
  svg.appendChild(bg);

  // Decorative elements
  const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');

  const gradient = document.createElementNS(
    'http://www.w3.org/2000/svg',
    'radialGradient'
  );
  gradient.setAttribute('id', 'target-glow');
  gradient.innerHTML = `
    <stop offset="0%" stop-color="#ffeb3b" stop-opacity="0.8"/>
    <stop offset="100%" stop-color="#ffeb3b" stop-opacity="0"/>
  `;
  defs.appendChild(gradient);
  svg.appendChild(defs);

  // Targets
  const targetPositions = [
    { x: 150, y: 80, value: 100 },
    { x: 80, y: 140, value: 50 },
    { x: 220, y: 140, value: 50 },
    { x: 100, y: 220, value: 30 },
    { x: 200, y: 220, value: 30 },
    { x: 60, y: 290, value: 20 },
    { x: 150, y: 280, value: 20 },
    { x: 240, y: 290, value: 20 },
    { x: 100, y: 350, value: 10 },
    { x: 200, y: 350, value: 10 },
  ];

  for (const pos of targetPositions) {
    const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');

    // Glow
    const glow = document.createElementNS(
      'http://www.w3.org/2000/svg',
      'circle'
    );
    glow.setAttribute('cx', String(pos.x));
    glow.setAttribute('cy', String(pos.y));
    glow.setAttribute('r', '25');
    glow.setAttribute('fill', 'url(#target-glow)');
    group.appendChild(glow);

    // Target circle
    const circle = document.createElementNS(
      'http://www.w3.org/2000/svg',
      'circle'
    );
    circle.setAttribute('cx', String(pos.x));
    circle.setAttribute('cy', String(pos.y));
    circle.setAttribute('r', '18');
    circle.setAttribute('fill', pos.value >= 50 ? '#f44336' : '#4caf50');
    circle.setAttribute('stroke', '#fff');
    circle.setAttribute('stroke-width', '2');
    group.appendChild(circle);

    // Value text
    const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    text.setAttribute('x', String(pos.x));
    text.setAttribute('y', String(pos.y + 5));
    text.setAttribute('text-anchor', 'middle');
    text.setAttribute('fill', '#fff');
    text.setAttribute('font-size', '12');
    text.setAttribute('font-weight', 'bold');
    text.textContent = String(pos.value);
    group.appendChild(text);

    svg.appendChild(group);
  }

  // Flippers at bottom
  const leftFlipper = document.createElementNS(
    'http://www.w3.org/2000/svg',
    'rect'
  );
  leftFlipper.setAttribute('x', '40');
  leftFlipper.setAttribute('y', '380');
  leftFlipper.setAttribute('width', '60');
  leftFlipper.setAttribute('height', '10');
  leftFlipper.setAttribute('fill', '#ff9800');
  leftFlipper.setAttribute('rx', '5');
  leftFlipper.setAttribute('transform', 'rotate(-20 70 385)');
  svg.appendChild(leftFlipper);

  const rightFlipper = document.createElementNS(
    'http://www.w3.org/2000/svg',
    'rect'
  );
  rightFlipper.setAttribute('x', '200');
  rightFlipper.setAttribute('y', '380');
  rightFlipper.setAttribute('width', '60');
  rightFlipper.setAttribute('height', '10');
  rightFlipper.setAttribute('fill', '#ff9800');
  rightFlipper.setAttribute('rx', '5');
  rightFlipper.setAttribute('transform', 'rotate(20 230 385)');
  svg.appendChild(rightFlipper);

  return svg;
}

// =============================================================================
// Score Display
// =============================================================================

export type PinballGameMode = 'human-vs-human' | 'human-vs-ai';

/**
 * Render player scores
 */
export function renderScores(
  state: FractionPinballState,
  gameMode: PinballGameMode = 'human-vs-human'
): HTMLElement {
  const container = document.createElement('div');
  container.className = 'pinball-scores';

  const p1Stats = getPlayerStats(state, 'player1');
  const p2Stats = getPlayerStats(state, 'player2');
  const p1Name = gameMode === 'human-vs-ai' ? 'You' : 'Blue';
  const p2Name = gameMode === 'human-vs-ai' ? 'Computer' : 'Red';
  const p1Balls = Math.max(0, p1Stats.ballsRemaining);
  const p2Balls = Math.max(0, p2Stats.ballsRemaining);

  container.innerHTML = `
    <div class="pinball-player-score ${state.currentPlayer === 'player1' ? 'active' : ''} player1">
      <div class="pinball-player-name">${p1Name}</div>
      <div class="pinball-score-value">${p1Stats.score}</div>
      <div class="pinball-balls" aria-label="${p1Balls} balls remaining">${seatIcon('player1').repeat(p1Balls)}</div>
    </div>
    <div class="pinball-round">
      <div class="pinball-round-label">Round</div>
      <div class="pinball-round-value">${state.roundNumber}/${state.maxRounds}</div>
    </div>
    <div class="pinball-player-score ${state.currentPlayer === 'player2' ? 'active' : ''} player2">
      <div class="pinball-player-name">${p2Name}</div>
      <div class="pinball-score-value">${p2Stats.score}</div>
      <div class="pinball-balls" aria-label="${p2Balls} balls remaining">${seatIcon('player2').repeat(p2Balls)}</div>
    </div>
  `;

  return container;
}

// =============================================================================
// Game Over Display
// =============================================================================

/**
 * Render game over screen
 */
export function renderGameOver(
  state: FractionPinballState,
  gameMode: PinballGameMode = 'human-vs-human'
): HTMLElement {
  const container = document.createElement('div');
  container.className = 'pinball-game-over';

  const p1Stats = getPlayerStats(state, 'player1');
  const p2Stats = getPlayerStats(state, 'player2');
  const p1Name = gameMode === 'human-vs-ai' ? 'You' : 'Blue';
  const p2Name = gameMode === 'human-vs-ai' ? 'Computer' : 'Red';

  let winnerText: string;
  if (state.winner === 'player1') {
    winnerText =
      gameMode === 'human-vs-ai' ? 'You win! 🏆' : 'Blue Wins! 🏆';
  } else if (state.winner === 'player2') {
    winnerText =
      gameMode === 'human-vs-ai' ? 'Computer wins! 🏆' : 'Red Wins! 🏆';
  } else {
    winnerText = "It's a Draw!";
  }

  container.innerHTML = `
    <div class="pinball-winner-banner">${winnerText}</div>
    <div class="pinball-final-scores">
      <div class="pinball-final-score player1">
        <div class="pinball-final-name">${p1Name}</div>
        <div class="pinball-final-value">${p1Stats.score} pts</div>
        <div class="pinball-final-stats">
          ${p1Stats.correctAnswers} hits
        </div>
      </div>
      <div class="pinball-final-score player2">
        <div class="pinball-final-name">${p2Name}</div>
        <div class="pinball-final-value">${p2Stats.score} pts</div>
        <div class="pinball-final-stats">
          ${p2Stats.correctAnswers} hits
        </div>
      </div>
    </div>
  `;

  return container;
}

// =============================================================================
// Helper Functions
// =============================================================================

export function getPlayerName(player: Player): string {
  return player === 'player1' ? 'Blue' : 'Red';
}

// =============================================================================
// Styles
// =============================================================================

export function injectFractionPinballStyles(): void {
  if (document.getElementById('fraction-pinball-styles')) return;

  const style = document.createElement('style');
  style.id = 'fraction-pinball-styles';
  style.textContent = `
    .pinball-game-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 16px;
      padding: 16px;
      max-width: 800px;
      margin: 0 auto;
    }

    .pinball-main {
      display: flex;
      gap: 24px;
      align-items: flex-start;
      flex-wrap: wrap;
      justify-content: center;
    }

    /* Challenge first in reading/tab order; decorative board secondary. */
    .pinball-challenge,
    .pinball-result {
      order: 1;
    }

    .pinball-board {
      order: 2;
      border-radius: 12px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.3);
      max-width: 100%;
      height: auto;
    }

    .pinball-challenge {
      background: white;
      border-radius: 12px;
      padding: 24px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
      min-width: min(300px, 100%);
      flex: 1 1 280px;
    }

    .pinball-question {
      text-align: center;
      margin-bottom: 20px;
    }

    .pinball-instruction {
      font-size: 16px;
      color: #666;
      margin-bottom: 12px;
    }

    .pinball-value {
      font-size: 48px;
      font-weight: bold;
      color: #333;
    }

    .pinball-fraction {
      font-family: 'Times New Roman', serif;
    }

    .pinball-choices {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 12px;
    }

    .pinball-choice-btn {
      padding: 16px 24px;
      min-height: 48px;
      min-width: 48px;
      font-size: 20px;
      font-weight: 600;
      border: 2px solid #ddd;
      border-radius: 8px;
      background: white;
      cursor: pointer;
      transition: all 0.2s;
      touch-action: manipulation;
    }

    .pinball-choice-btn:hover:not(:disabled) {
      border-color: #2196F3;
      background: #e3f2fd;
      transform: translateY(-2px);
    }

    .pinball-choice-btn:disabled {
      cursor: not-allowed;
      opacity: 0.7;
    }

    .pinball-result {
      text-align: center;
    }

    .pinball-feedback {
      padding: 24px;
      border-radius: 12px;
      margin-bottom: 16px;
    }

    .pinball-feedback.correct {
      background: linear-gradient(135deg, #c8e6c9, #a5d6a7);
      color: #2e7d32;
    }

    .pinball-feedback.incorrect {
      background: #ffebee;
      color: #c62828;
    }

    .pinball-feedback-icon {
      font-size: 48px;
      margin-bottom: 8px;
    }

    .pinball-feedback-text {
      font-size: 24px;
      font-weight: bold;
    }

    .pinball-points {
      font-size: 20px;
      font-weight: 600;
      margin-top: 6px;
    }

    .pinball-auto-advance {
      font-size: 16px;
      color: #666;
      margin-top: 8px;
    }

    .pinball-animation {
      font-size: 24px;
      animation: pulse 0.5s ease-in-out infinite alternate;
    }

    @keyframes pulse {
      from { transform: scale(1); }
      to { transform: scale(1.2); }
    }

    .pinball-correct {
      margin-top: 12px;
      font-size: 16px;
    }

    .pinball-continue-btn {
      padding: 12px 32px;
      min-height: 48px;
      min-width: 48px;
      font-size: 18px;
      font-weight: 600;
      background: #2196F3;
      color: white;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.2s;
      touch-action: manipulation;
    }

    .pinball-continue-btn:hover {
      background: #1976d2;
    }

    .pinball-scores {
      display: flex;
      align-items: center;
      gap: 24px;
      width: 100%;
      justify-content: space-around;
    }

    .pinball-player-score {
      text-align: center;
      padding: 12px 24px;
      border-radius: 8px;
      background: #f5f5f5;
      transition: all 0.3s;
    }

    .pinball-player-score.active {
      transform: scale(1.05);
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    }

    .pinball-player-name {
      font-size: 14px;
      font-weight: 600;
      text-transform: uppercase;
    }

    .pinball-player-score.player1 .pinball-player-name { color: #1565c0; }
    .pinball-player-score.player2 .pinball-player-name { color: #c62828; }

    .pinball-score-value {
      font-size: 32px;
      font-weight: bold;
      color: #333;
    }

    .pinball-balls {
      font-size: 14px;
      min-height: 20px;
    }

    .pinball-round {
      text-align: center;
    }

    .pinball-round-label {
      font-size: 12px;
      color: #999;
      text-transform: uppercase;
    }

    .pinball-round-value {
      font-size: 20px;
      font-weight: bold;
      color: #333;
    }

    .pinball-status {
      font-size: 18px;
      font-weight: 500;
      padding: 8px 16px;
      border-radius: 8px;
    }

    .pinball-status.player1 {
      background: #e3f2fd;
      color: #1565c0;
    }

    .pinball-status.player2 {
      background: #ffebee;
      color: #c62828;
    }

    .pinball-game-over {
      text-align: center;
    }

    .pinball-winner-banner {
      font-size: 32px;
      font-weight: bold;
      padding: 16px 32px;
      background: linear-gradient(135deg, #ffd700, #ffb700);
      color: #333;
      border-radius: 12px;
      margin-bottom: 24px;
    }

    .pinball-final-scores {
      display: flex;
      gap: 24px;
      justify-content: center;
    }

    .pinball-final-score {
      padding: 20px 32px;
      border-radius: 12px;
      background: white;
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    }

    .pinball-final-score.player1 { border-top: 4px solid var(--color-player1, #2196F3); }
    .pinball-final-score.player2 { border-top: 4px solid var(--color-player2, #e53935); }

    .pinball-final-name {
      font-size: 18px;
      font-weight: 600;
    }

    .pinball-final-value {
      font-size: 28px;
      font-weight: bold;
      color: #333;
    }

    .pinball-final-stats {
      font-size: 14px;
      color: #666;
      margin-top: 8px;
    }

    @media (pointer: coarse) {
      .pinball-choice-btn,
      .pinball-continue-btn {
        min-height: 48px;
        min-width: 48px;
      }

      .pinball-choices {
        gap: 14px;
      }

      /* Shrink decorative board so the challenge stays in the first viewport. */
      .pinball-board {
        width: min(220px, 42vw);
        height: auto;
      }
    }

    @media (max-width: 720px) {
      .pinball-main {
        flex-direction: column;
        align-items: center;
      }

      .pinball-board {
        width: min(240px, 70vw);
        height: auto;
      }

      .pinball-challenge {
        width: 100%;
        min-width: 0;
      }
    }

    @media (prefers-reduced-motion: reduce) {
      .pinball-animation {
        animation: none !important;
      }

      .pinball-choice-btn:hover:not(:disabled),
      .pinball-player-score.active {
        transform: none;
      }
    }
  `;
  document.head.appendChild(style);
}
