// Frac Fact Game Rules
// Problem generation, answer checking, and scoring

import {
  FracFactState,
  FractionProblem,
  PlayerStats,
  Difficulty,
  Player,
  getOpponent,
  getPlayerStats,
  POINTS_PER_CORRECT,
  STREAK_BONUS,
} from './types';
import {
  Fraction,
  FractionOperation,
  COMMON_FRACTIONS,
} from '../../core/fractions/types';
import {
  performOperation,
  simplify,
  areEquivalent,
} from '../../core/fractions/arithmetic';

// =============================================================================
// Problem Generation
// =============================================================================

/**
 * Get fractions based on difficulty
 */
function getFractionsForDifficulty(difficulty: Difficulty): Fraction[] {
  switch (difficulty) {
    case 'easy':
      // Simple fractions with small denominators
      return COMMON_FRACTIONS.filter(f => f.denominator <= 4);
    case 'medium':
      // Common fractions
      return COMMON_FRACTIONS.filter(f => f.denominator <= 8);
    case 'hard':
      // All common fractions
      return COMMON_FRACTIONS;
  }
}

/**
 * Get operations based on difficulty
 */
function getOperationsForDifficulty(difficulty: Difficulty): FractionOperation[] {
  switch (difficulty) {
    case 'easy':
      return ['add', 'subtract'];
    case 'medium':
      return ['add', 'subtract', 'multiply'];
    case 'hard':
      return ['add', 'subtract', 'multiply', 'divide'];
  }
}

/**
 * Generate a random fraction for the difficulty
 */
function randomFraction(difficulty: Difficulty): Fraction {
  const fractions = getFractionsForDifficulty(difficulty);
  return fractions[Math.floor(Math.random() * fractions.length)];
}

/**
 * Generate wrong answer choices (distractors)
 */
function generateDistractors(correctAnswer: Fraction, count: number): Fraction[] {
  const distractors: Fraction[] = [];
  const seen = new Set<string>();
  seen.add(`${correctAnswer.numerator}/${correctAnswer.denominator}`);

  // Common mistake patterns
  const generateWrongAnswer = (): Fraction | null => {
    const strategies = [
      // Add numerators and denominators separately (common mistake)
      () => ({
        numerator: correctAnswer.numerator + 1,
        denominator: correctAnswer.denominator,
      }),
      // Subtract 1 from numerator
      () => ({
        numerator: Math.max(1, correctAnswer.numerator - 1),
        denominator: correctAnswer.denominator,
      }),
      // Wrong denominator
      () => ({
        numerator: correctAnswer.numerator,
        denominator: correctAnswer.denominator + 1,
      }),
      // Double denominator
      () => ({
        numerator: correctAnswer.numerator,
        denominator: correctAnswer.denominator * 2,
      }),
      // Flip numerator and denominator
      () => ({
        numerator: correctAnswer.denominator,
        denominator: correctAnswer.numerator || 1,
      }),
      // Random nearby fraction
      () => ({
        numerator: correctAnswer.numerator + Math.floor(Math.random() * 3) - 1,
        denominator: Math.max(1, correctAnswer.denominator + Math.floor(Math.random() * 3) - 1),
      }),
    ];

    const strategy = strategies[Math.floor(Math.random() * strategies.length)];
    const result = strategy();

    // Ensure valid fraction
    if (result.numerator < 0 || result.denominator <= 0) return null;

    const simplified = simplify(result);
    const key = `${simplified.numerator}/${simplified.denominator}`;

    if (seen.has(key)) return null;

    seen.add(key);
    return simplified;
  };

  let attempts = 0;
  while (distractors.length < count && attempts < 50) {
    const wrong = generateWrongAnswer();
    if (wrong) {
      distractors.push(wrong);
    }
    attempts++;
  }

  // Fill remaining with random fractions if needed
  while (distractors.length < count) {
    const num = Math.floor(Math.random() * 10) + 1;
    const den = Math.floor(Math.random() * 10) + 1;
    const frac = simplify({ numerator: num, denominator: den });
    const key = `${frac.numerator}/${frac.denominator}`;

    if (!seen.has(key)) {
      seen.add(key);
      distractors.push(frac);
    }
  }

  return distractors;
}

/**
 * Shuffle array in place
 */
function shuffleArray<T>(array: T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

/**
 * Generate a new fraction problem
 */
export function generateProblem(difficulty: Difficulty, problemNumber: number): FractionProblem {
  const operations = getOperationsForDifficulty(difficulty);
  const operation = operations[Math.floor(Math.random() * operations.length)];

  let operand1: Fraction;
  let operand2: Fraction;
  let correctAnswer: Fraction;

  // Keep generating until we get a valid problem
  let attempts = 0;
  do {
    operand1 = randomFraction(difficulty);
    operand2 = randomFraction(difficulty);

    // For subtraction, ensure first operand is larger to avoid negative results
    if (operation === 'subtract') {
      const val1 = operand1.numerator / operand1.denominator;
      const val2 = operand2.numerator / operand2.denominator;
      if (val1 < val2) {
        [operand1, operand2] = [operand2, operand1];
      }
    }

    // For division, avoid division by zero and very small results
    if (operation === 'divide' && operand2.numerator === 0) {
      operand2 = { numerator: 1, denominator: 2 };
    }

    correctAnswer = performOperation(operand1, operand2, operation).simplified;
    attempts++;
  } while (
    attempts < 20 &&
    (correctAnswer.numerator < 0 ||
     correctAnswer.denominator > 100 ||
     correctAnswer.numerator > 100)
  );

  // Generate answer choices
  const distractors = generateDistractors(correctAnswer, 3);
  const answerChoices = shuffleArray([correctAnswer, ...distractors]);

  return {
    id: `problem-${problemNumber}`,
    operand1,
    operand2,
    operation,
    correctAnswer,
    answerChoices,
  };
}

// =============================================================================
// Answer Checking
// =============================================================================

/**
 * Check if the selected answer is correct
 */
export function checkAnswer(problem: FractionProblem, selectedAnswer: Fraction): boolean {
  return areEquivalent(problem.correctAnswer, selectedAnswer);
}

// =============================================================================
// State Updates
// =============================================================================

/**
 * Submit an answer and update game state
 */
export function submitAnswer(
  state: FracFactState,
  selectedAnswer: Fraction
): FracFactState {
  if (!state.currentProblem || state.phase !== 'playing') {
    return state;
  }

  const isCorrect = checkAnswer(state.currentProblem, selectedAnswer);
  const currentStats = getPlayerStats(state, state.currentPlayer);

  // Update stats
  const newStats: PlayerStats = {
    ...currentStats,
    correctAnswers: isCorrect ? currentStats.correctAnswers + 1 : currentStats.correctAnswers,
    wrongAnswers: isCorrect ? currentStats.wrongAnswers : currentStats.wrongAnswers + 1,
    currentStreak: isCorrect ? currentStats.currentStreak + 1 : 0,
    bestStreak: isCorrect
      ? Math.max(currentStats.bestStreak, currentStats.currentStreak + 1)
      : currentStats.bestStreak,
    score: isCorrect
      ? currentStats.score + POINTS_PER_CORRECT + (currentStats.currentStreak * STREAK_BONUS)
      : currentStats.score,
  };

  const newPlayer1Stats = state.currentPlayer === 'player1' ? newStats : state.player1Stats;
  const newPlayer2Stats = state.currentPlayer === 'player2' ? newStats : state.player2Stats;

  return {
    ...state,
    selectedAnswer,
    isCorrect,
    phase: 'showingResult',
    player1Stats: newPlayer1Stats,
    player2Stats: newPlayer2Stats,
    problemHistory: [
      ...state.problemHistory,
      {
        problem: state.currentProblem,
        player: state.currentPlayer,
        selectedAnswer,
        isCorrect,
        timeSpent: 0,
      },
    ],
  };
}

/**
 * Move to next problem or end game
 */
export function nextProblem(state: FracFactState): FracFactState {
  const newProblemsCompleted = state.problemsCompleted + 1;

  // Check if game is over
  if (newProblemsCompleted >= state.maxProblems) {
    // Determine winner
    const p1Score = state.player1Stats.score;
    const p2Score = state.player2Stats.score;

    let winner: Player | null = null;
    if (p1Score > p2Score) winner = 'player1';
    else if (p2Score > p1Score) winner = 'player2';
    // If tied, winner stays null (draw)

    return {
      ...state,
      phase: 'gameOver',
      problemsCompleted: newProblemsCompleted,
      winner,
      currentProblem: null,
      selectedAnswer: null,
      isCorrect: null,
    };
  }

  // Generate next problem and switch player
  const nextPlayer = getOpponent(state.currentPlayer);
  const nextProblemData = generateProblem(state.difficulty, newProblemsCompleted + 1);

  return {
    ...state,
    currentPlayer: nextPlayer,
    phase: 'playing',
    currentProblem: nextProblemData,
    selectedAnswer: null,
    isCorrect: null,
    problemsCompleted: newProblemsCompleted,
  };
}

/**
 * Start the game with first problem
 */
export function startGame(state: FracFactState): FracFactState {
  const firstProblem = generateProblem(state.difficulty, 1);

  return {
    ...state,
    currentProblem: firstProblem,
    phase: 'playing',
  };
}

// =============================================================================
// Display Helpers
// =============================================================================

/**
 * Get operation symbol
 */
export function getOperationSymbol(operation: FractionOperation): string {
  switch (operation) {
    case 'add': return '+';
    case 'subtract': return '−';
    case 'multiply': return '×';
    case 'divide': return '÷';
  }
}

/**
 * Format fraction as string
 */
export function formatFraction(fraction: Fraction): string {
  if (fraction.denominator === 1) {
    return String(fraction.numerator);
  }
  return `${fraction.numerator}/${fraction.denominator}`;
}
