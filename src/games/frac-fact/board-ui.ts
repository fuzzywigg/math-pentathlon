// Frac Fact Board UI
// Renders fraction problems, answer choices, and game status

import { FracFactState, Player, getPlayerStats } from './types';
import { Fraction } from '../../core/fractions/types';
import { getOperationSymbol } from './rules';

// =============================================================================
// Fraction Visual Rendering
// =============================================================================

/**
 * Create an SVG representation of a fraction
 */
function createFractionSVG(
  fraction: Fraction,
  size: 'small' | 'medium' | 'large' = 'medium'
): SVGElement {
  const sizes = {
    small: { width: 40, height: 50, fontSize: 16, lineWidth: 30 },
    medium: { width: 60, height: 70, fontSize: 24, lineWidth: 45 },
    large: { width: 80, height: 90, fontSize: 32, lineWidth: 60 },
  };

  const s = sizes[size];
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('width', String(s.width));
  svg.setAttribute('height', String(s.height));
  svg.setAttribute('viewBox', `0 0 ${s.width} ${s.height}`);
  svg.classList.add('fraction-svg');

  // Whole number case
  if (fraction.denominator === 1) {
    const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    text.setAttribute('x', String(s.width / 2));
    text.setAttribute('y', String(s.height / 2 + s.fontSize / 3));
    text.setAttribute('text-anchor', 'middle');
    text.setAttribute('font-size', String(s.fontSize));
    text.setAttribute('font-weight', 'bold');
    text.setAttribute('fill', '#333');
    text.textContent = String(fraction.numerator);
    svg.appendChild(text);
    return svg;
  }

  // Fraction with numerator and denominator
  const centerY = s.height / 2;

  // Numerator
  const numText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
  numText.setAttribute('x', String(s.width / 2));
  numText.setAttribute('y', String(centerY - 8));
  numText.setAttribute('text-anchor', 'middle');
  numText.setAttribute('font-size', String(s.fontSize));
  numText.setAttribute('font-weight', 'bold');
  numText.setAttribute('fill', '#333');
  numText.textContent = String(fraction.numerator);
  svg.appendChild(numText);

  // Fraction line
  const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
  line.setAttribute('x1', String((s.width - s.lineWidth) / 2));
  line.setAttribute('y1', String(centerY));
  line.setAttribute('x2', String((s.width + s.lineWidth) / 2));
  line.setAttribute('y2', String(centerY));
  line.setAttribute('stroke', '#333');
  line.setAttribute('stroke-width', '2');
  svg.appendChild(line);

  // Denominator
  const denText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
  denText.setAttribute('x', String(s.width / 2));
  denText.setAttribute('y', String(centerY + s.fontSize + 2));
  denText.setAttribute('text-anchor', 'middle');
  denText.setAttribute('font-size', String(s.fontSize));
  denText.setAttribute('font-weight', 'bold');
  denText.setAttribute('fill', '#333');
  denText.textContent = String(fraction.denominator);
  svg.appendChild(denText);

  return svg;
}

// =============================================================================
// Problem Display
// =============================================================================

/**
 * Render the current fraction problem
 */
export function renderProblem(state: FracFactState): HTMLElement {
  const container = document.createElement('div');
  container.className = 'frac-problem';

  if (!state.currentProblem) {
    container.innerHTML = '<div class="frac-no-problem">No problem loaded</div>';
    return container;
  }

  const problem = state.currentProblem;

  // Problem display: operand1 operation operand2 = ?
  const problemDisplay = document.createElement('div');
  problemDisplay.className = 'frac-problem-display';

  // First operand
  const op1Container = document.createElement('div');
  op1Container.className = 'frac-operand';
  op1Container.appendChild(createFractionSVG(problem.operand1, 'large'));
  problemDisplay.appendChild(op1Container);

  // Operation symbol
  const opSymbol = document.createElement('div');
  opSymbol.className = 'frac-operation';
  opSymbol.textContent = getOperationSymbol(problem.operation);
  problemDisplay.appendChild(opSymbol);

  // Second operand
  const op2Container = document.createElement('div');
  op2Container.className = 'frac-operand';
  op2Container.appendChild(createFractionSVG(problem.operand2, 'large'));
  problemDisplay.appendChild(op2Container);

  // Equals sign
  const equals = document.createElement('div');
  equals.className = 'frac-equals';
  equals.textContent = '=';
  problemDisplay.appendChild(equals);

  // Question mark or answer
  const answerBox = document.createElement('div');
  answerBox.className = 'frac-answer-box';

  if (state.selectedAnswer && state.phase === 'showingResult') {
    answerBox.appendChild(createFractionSVG(state.selectedAnswer, 'large'));
    answerBox.classList.add(state.isCorrect ? 'correct' : 'incorrect');
  } else {
    answerBox.textContent = '?';
  }

  problemDisplay.appendChild(answerBox);
  container.appendChild(problemDisplay);

  return container;
}

// =============================================================================
// Answer Choices
// =============================================================================

/**
 * Render answer choice buttons
 */
export function renderAnswerChoices(
  state: FracFactState,
  onSelect: (answer: Fraction) => void
): HTMLElement {
  const container = document.createElement('div');
  container.className = 'frac-choices';

  if (!state.currentProblem || state.phase !== 'playing') {
    return container;
  }

  for (const choice of state.currentProblem.answerChoices) {
    const button = document.createElement('button');
    button.className = 'frac-choice-btn';
    button.appendChild(createFractionSVG(choice, 'medium'));

    button.addEventListener('click', () => onSelect(choice));
    container.appendChild(button);
  }

  return container;
}

// =============================================================================
// Result Display
// =============================================================================

/**
 * Render result feedback after answering
 */
export function renderResult(state: FracFactState, onContinue: () => void): HTMLElement {
  const container = document.createElement('div');
  container.className = 'frac-result';

  if (state.phase !== 'showingResult' || !state.currentProblem) {
    return container;
  }

  const feedback = document.createElement('div');
  feedback.className = `frac-feedback ${state.isCorrect ? 'correct' : 'incorrect'}`;

  if (state.isCorrect) {
    feedback.innerHTML = `
      <div class="frac-feedback-icon">✓</div>
      <div class="frac-feedback-text">Correct!</div>
    `;
  } else {
    const correctSvg = createFractionSVG(state.currentProblem.correctAnswer, 'medium');
    feedback.innerHTML = `
      <div class="frac-feedback-icon">✗</div>
      <div class="frac-feedback-text">Incorrect. The answer is:</div>
      <div class="frac-correct-answer"></div>
    `;
    feedback.querySelector('.frac-correct-answer')?.appendChild(correctSvg);
  }

  container.appendChild(feedback);

  // Continue button
  const continueBtn = document.createElement('button');
  continueBtn.className = 'frac-continue-btn';
  continueBtn.textContent = 'Continue';
  continueBtn.addEventListener('click', onContinue);
  container.appendChild(continueBtn);

  return container;
}

// =============================================================================
// Score Display
// =============================================================================

/**
 * Render player scores
 */
export function renderScores(state: FracFactState): HTMLElement {
  const container = document.createElement('div');
  container.className = 'frac-scores';

  const p1Stats = getPlayerStats(state, 'player1');
  const p2Stats = getPlayerStats(state, 'player2');

  // Player 1 score
  const p1Score = document.createElement('div');
  p1Score.className = `frac-player-score ${state.currentPlayer === 'player1' ? 'active' : ''}`;
  p1Score.innerHTML = `
    <div class="frac-player-name player1">Blue</div>
    <div class="frac-score-value">${p1Stats.score}</div>
    <div class="frac-streak">${p1Stats.currentStreak > 0 ? `🔥 ${p1Stats.currentStreak}` : ''}</div>
  `;
  container.appendChild(p1Score);

  // Progress indicator
  const progress = document.createElement('div');
  progress.className = 'frac-progress';
  progress.innerHTML = `
    <div class="frac-progress-text">Problem ${state.problemsCompleted + 1} of ${state.maxProblems}</div>
    <div class="frac-progress-bar">
      <div class="frac-progress-fill" style="width: ${(state.problemsCompleted / state.maxProblems) * 100}%"></div>
    </div>
  `;
  container.appendChild(progress);

  // Player 2 score
  const p2Score = document.createElement('div');
  p2Score.className = `frac-player-score ${state.currentPlayer === 'player2' ? 'active' : ''}`;
  p2Score.innerHTML = `
    <div class="frac-player-name player2">Red</div>
    <div class="frac-score-value">${p2Stats.score}</div>
    <div class="frac-streak">${p2Stats.currentStreak > 0 ? `🔥 ${p2Stats.currentStreak}` : ''}</div>
  `;
  container.appendChild(p2Score);

  return container;
}

// =============================================================================
// Game Over Display
// =============================================================================

/**
 * Render game over screen
 */
export function renderGameOver(state: FracFactState): HTMLElement {
  const container = document.createElement('div');
  container.className = 'frac-game-over';

  const p1Stats = getPlayerStats(state, 'player1');
  const p2Stats = getPlayerStats(state, 'player2');

  let winnerText: string;
  if (state.winner === 'player1') {
    winnerText = 'Blue Wins! 🎉';
  } else if (state.winner === 'player2') {
    winnerText = 'Red Wins! 🎉';
  } else {
    winnerText = "It's a Draw!";
  }

  container.innerHTML = `
    <div class="frac-winner-banner">${winnerText}</div>
    <div class="frac-final-scores">
      <div class="frac-final-score player1">
        <div class="frac-final-name">Blue</div>
        <div class="frac-final-value">${p1Stats.score} points</div>
        <div class="frac-final-stats">
          ${p1Stats.correctAnswers}/${p1Stats.correctAnswers + p1Stats.wrongAnswers} correct
          • Best streak: ${p1Stats.bestStreak}
        </div>
      </div>
      <div class="frac-final-score player2">
        <div class="frac-final-name">Red</div>
        <div class="frac-final-value">${p2Stats.score} points</div>
        <div class="frac-final-stats">
          ${p2Stats.correctAnswers}/${p2Stats.correctAnswers + p2Stats.wrongAnswers} correct
          • Best streak: ${p2Stats.bestStreak}
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

export function injectFracFactStyles(): void {
  if (document.getElementById('frac-fact-styles')) return;

  const style = document.createElement('style');
  style.id = 'frac-fact-styles';
  style.textContent = `
    .frac-game-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 20px;
      padding: 20px;
      max-width: 800px;
      margin: 0 auto;
    }

    .frac-problem {
      background: white;
      border-radius: 12px;
      padding: 24px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    }

    .frac-problem-display {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 16px;
      flex-wrap: wrap;
    }

    .frac-operand {
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .frac-operation,
    .frac-equals {
      font-size: 36px;
      font-weight: bold;
      color: #666;
    }

    .frac-answer-box {
      min-width: 80px;
      min-height: 90px;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 3px dashed #ccc;
      border-radius: 8px;
      font-size: 48px;
      color: #999;
      transition: all 0.3s;
    }

    .frac-answer-box.correct {
      border-color: #4caf50;
      background: #e8f5e9;
    }

    .frac-answer-box.incorrect {
      border-color: #f44336;
      background: #ffebee;
    }

    .frac-choices {
      display: flex;
      gap: 12px;
      flex-wrap: wrap;
      justify-content: center;
    }

    .frac-choice-btn {
      padding: 12px 20px;
      border: 2px solid #ddd;
      border-radius: 8px;
      background: white;
      cursor: pointer;
      transition: all 0.2s;
    }

    .frac-choice-btn:hover {
      border-color: #2196F3;
      background: #e3f2fd;
      transform: translateY(-2px);
      box-shadow: 0 4px 8px rgba(0,0,0,0.1);
    }

    .frac-result {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 16px;
    }

    .frac-feedback {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8px;
      padding: 20px 40px;
      border-radius: 12px;
    }

    .frac-feedback.correct {
      background: #e8f5e9;
      color: #2e7d32;
    }

    .frac-feedback.incorrect {
      background: #ffebee;
      color: #c62828;
    }

    .frac-feedback-icon {
      font-size: 48px;
    }

    .frac-feedback-text {
      font-size: 24px;
      font-weight: bold;
    }

    .frac-correct-answer {
      margin-top: 8px;
    }

    .frac-continue-btn {
      padding: 12px 32px;
      font-size: 18px;
      font-weight: 600;
      background: #2196F3;
      color: white;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.2s;
    }

    .frac-continue-btn:hover {
      background: #1976d2;
      transform: translateY(-1px);
    }

    .frac-scores {
      display: flex;
      align-items: center;
      gap: 24px;
      width: 100%;
      justify-content: space-between;
    }

    .frac-player-score {
      text-align: center;
      padding: 12px 24px;
      border-radius: 8px;
      background: #f5f5f5;
      transition: all 0.3s;
    }

    .frac-player-score.active {
      transform: scale(1.05);
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    }

    .frac-player-name {
      font-size: 14px;
      font-weight: 600;
      text-transform: uppercase;
    }

    .frac-player-name.player1 { color: #1565c0; }
    .frac-player-name.player2 { color: #c62828; }

    .frac-score-value {
      font-size: 32px;
      font-weight: bold;
      color: #333;
    }

    .frac-streak {
      font-size: 14px;
      height: 20px;
    }

    .frac-progress {
      flex: 1;
      max-width: 200px;
      text-align: center;
    }

    .frac-progress-text {
      font-size: 14px;
      color: #666;
      margin-bottom: 8px;
    }

    .frac-progress-bar {
      height: 8px;
      background: #e0e0e0;
      border-radius: 4px;
      overflow: hidden;
    }

    .frac-progress-fill {
      height: 100%;
      background: linear-gradient(90deg, #2196F3, #4caf50);
      transition: width 0.3s;
    }

    .frac-game-over {
      text-align: center;
    }

    .frac-winner-banner {
      font-size: 36px;
      font-weight: bold;
      padding: 20px 40px;
      background: linear-gradient(135deg, #ffd700, #ffb700);
      color: #333;
      border-radius: 12px;
      margin-bottom: 24px;
    }

    .frac-final-scores {
      display: flex;
      gap: 24px;
      justify-content: center;
    }

    .frac-final-score {
      padding: 20px 32px;
      border-radius: 12px;
      background: white;
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    }

    .frac-final-score.player1 { border-top: 4px solid #2196F3; }
    .frac-final-score.player2 { border-top: 4px solid #e53935; }

    .frac-final-name {
      font-size: 18px;
      font-weight: 600;
      margin-bottom: 8px;
    }

    .frac-final-value {
      font-size: 28px;
      font-weight: bold;
      color: #333;
    }

    .frac-final-stats {
      font-size: 14px;
      color: #666;
      margin-top: 8px;
    }

    .frac-status {
      font-size: 18px;
      font-weight: 500;
      padding: 8px 16px;
      border-radius: 8px;
    }

    .frac-status.player1 {
      background: #e3f2fd;
      color: #1565c0;
    }

    .frac-status.player2 {
      background: #ffebee;
      color: #c62828;
    }

    .frac-controls {
      display: flex;
      gap: 12px;
      flex-wrap: wrap;
      justify-content: center;
    }

    .frac-btn {
      padding: 10px 20px;
      font-size: 14px;
      font-weight: 600;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      transition: all 0.2s;
    }

    .frac-btn:hover {
      transform: translateY(-1px);
      opacity: 0.9;
    }

    .frac-btn-primary {
      background: #2196F3;
      color: white;
    }

    .frac-btn-secondary {
      background: #9e9e9e;
      color: white;
    }
  `;
  document.head.appendChild(style);
}
