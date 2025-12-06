// Fraction Pinball Game Rules
// Challenge generation, answer checking, and scoring

import {
  FractionPinballState,
  ConversionChallenge,
  PlayerStats,
  PinballTarget,
  getOpponent,
  getPlayerStats,
  TARGET_POINTS,
} from './types';
import { Fraction, COMMON_FRACTIONS } from '../../core/fractions/types';
import { toDecimal, simplify, areEquivalent } from '../../core/fractions/arithmetic';

// =============================================================================
// Challenge Generation
// =============================================================================

/**
 * Get fractions suitable for conversion challenges
 */
function getConvertibleFractions(): Fraction[] {
  // Use fractions that have nice decimal representations
  return COMMON_FRACTIONS.filter(f => {
    const decimal = f.numerator / f.denominator;
    // Check if decimal is terminating (ends within 4 decimal places)
    const rounded = Math.round(decimal * 10000) / 10000;
    return Math.abs(decimal - rounded) < 0.00001;
  });
}

/**
 * Format decimal for display
 */
export function formatDecimal(value: number): string {
  // Round to 4 decimal places max
  const rounded = Math.round(value * 10000) / 10000;

  // Remove trailing zeros
  if (Number.isInteger(rounded)) {
    return String(rounded);
  }

  return String(rounded);
}

/**
 * Format fraction for display
 */
export function formatFraction(fraction: Fraction): string {
  if (fraction.denominator === 1) {
    return String(fraction.numerator);
  }
  return `${fraction.numerator}/${fraction.denominator}`;
}

/**
 * Generate wrong decimal answers
 */
function generateWrongDecimals(correct: number, count: number): string[] {
  const wrongs: string[] = [];
  const seen = new Set<string>();
  seen.add(formatDecimal(correct));

  const strategies = [
    () => correct + 0.1,
    () => correct - 0.1,
    () => correct * 2,
    () => correct / 2,
    () => Math.round(correct * 10) / 10 + 0.05,
    () => 1 - correct,
    () => correct + 0.25,
    () => correct - 0.25,
  ];

  let attempts = 0;
  while (wrongs.length < count && attempts < 30) {
    const strategy = strategies[Math.floor(Math.random() * strategies.length)];
    const value = strategy();

    if (value > 0 && value < 10) {
      const formatted = formatDecimal(value);
      if (!seen.has(formatted)) {
        seen.add(formatted);
        wrongs.push(formatted);
      }
    }
    attempts++;
  }

  // Fill with random decimals if needed
  while (wrongs.length < count) {
    const value = Math.random() * 2;
    const formatted = formatDecimal(value);
    if (!seen.has(formatted)) {
      seen.add(formatted);
      wrongs.push(formatted);
    }
  }

  return wrongs;
}

/**
 * Generate wrong fraction answers
 */
function generateWrongFractions(correct: Fraction, count: number): string[] {
  const wrongs: string[] = [];
  const seen = new Set<string>();
  seen.add(formatFraction(simplify(correct)));

  const strategies = [
    () => ({ numerator: correct.numerator + 1, denominator: correct.denominator }),
    () => ({ numerator: correct.numerator - 1, denominator: correct.denominator }),
    () => ({ numerator: correct.numerator, denominator: correct.denominator + 1 }),
    () => ({ numerator: correct.numerator, denominator: correct.denominator - 1 }),
    () => ({ numerator: correct.denominator, denominator: correct.numerator || 1 }),
    () => ({ numerator: correct.numerator * 2, denominator: correct.denominator }),
    () => ({ numerator: correct.numerator, denominator: correct.denominator * 2 }),
  ];

  let attempts = 0;
  while (wrongs.length < count && attempts < 30) {
    const strategy = strategies[Math.floor(Math.random() * strategies.length)];
    const fraction = strategy();

    if (fraction.numerator > 0 && fraction.denominator > 0) {
      const simplified = simplify(fraction);
      const formatted = formatFraction(simplified);

      if (!seen.has(formatted) && !areEquivalent(fraction, correct)) {
        seen.add(formatted);
        wrongs.push(formatted);
      }
    }
    attempts++;
  }

  // Fill with random fractions if needed
  while (wrongs.length < count) {
    const num = Math.floor(Math.random() * 9) + 1;
    const den = Math.floor(Math.random() * 9) + 1;
    const formatted = `${num}/${den}`;
    if (!seen.has(formatted)) {
      seen.add(formatted);
      wrongs.push(formatted);
    }
  }

  return wrongs;
}

/**
 * Shuffle array
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
 * Generate a conversion challenge
 */
export function generateChallenge(challengeNumber: number): ConversionChallenge {
  const fractions = getConvertibleFractions();
  const fraction = fractions[Math.floor(Math.random() * fractions.length)];
  const decimal = toDecimal(fraction);

  // Alternate between types
  const type = challengeNumber % 2 === 0 ? 'fractionToDecimal' : 'decimalToFraction';

  let correctAnswer: string;
  let wrongs: string[];

  if (type === 'fractionToDecimal') {
    correctAnswer = formatDecimal(decimal);
    wrongs = generateWrongDecimals(decimal, 3);
  } else {
    correctAnswer = formatFraction(simplify(fraction));
    wrongs = generateWrongFractions(fraction, 3);
  }

  const answerChoices = shuffleArray([correctAnswer, ...wrongs]);

  return {
    id: `challenge-${challengeNumber}`,
    type,
    fraction,
    decimal,
    answerChoices,
    correctAnswer,
  };
}

// =============================================================================
// Answer Checking
// =============================================================================

/**
 * Check if answer is correct
 */
export function checkAnswer(challenge: ConversionChallenge, answer: string): boolean {
  return answer === challenge.correctAnswer;
}

// =============================================================================
// Scoring
// =============================================================================

/**
 * Calculate points for correct answer (hit a random target)
 */
export function hitRandomTarget(targets: PinballTarget[]): { target: PinballTarget; points: number } {
  // Weight towards lower-value targets
  const weights = TARGET_POINTS.map((_, i) => Math.pow(0.6, i));
  const totalWeight = weights.reduce((a, b) => a + b, 0);

  let random = Math.random() * totalWeight;
  let targetIndex = 0;

  for (let i = 0; i < weights.length; i++) {
    random -= weights[i];
    if (random <= 0) {
      targetIndex = i;
      break;
    }
  }

  const target = targets[targetIndex];
  return { target, points: target.value };
}

// =============================================================================
// State Updates
// =============================================================================

/**
 * Submit answer
 */
export function submitAnswer(
  state: FractionPinballState,
  answer: string
): FractionPinballState {
  if (!state.currentChallenge || state.phase !== 'answering') {
    return state;
  }

  const isCorrect = checkAnswer(state.currentChallenge, answer);
  const currentStats = getPlayerStats(state, state.currentPlayer);

  // Calculate new stats
  let newStats: PlayerStats;

  if (isCorrect) {
    const { points } = hitRandomTarget(state.targets);
    newStats = {
      ...currentStats,
      score: currentStats.score + points,
      correctAnswers: currentStats.correctAnswers + 1,
    };
  } else {
    newStats = {
      ...currentStats,
      wrongAnswers: currentStats.wrongAnswers + 1,
      ballsRemaining: currentStats.ballsRemaining - 1,
    };
  }

  const newPlayer1Stats = state.currentPlayer === 'player1' ? newStats : state.player1Stats;
  const newPlayer2Stats = state.currentPlayer === 'player2' ? newStats : state.player2Stats;

  return {
    ...state,
    selectedAnswer: answer,
    isCorrect,
    phase: 'showResult',
    player1Stats: newPlayer1Stats,
    player2Stats: newPlayer2Stats,
  };
}

/**
 * Continue to next challenge or end game
 */
export function nextChallenge(state: FractionPinballState): FractionPinballState {
  const nextRound = state.roundNumber + 1;
  const nextPlayer = getOpponent(state.currentPlayer);

  // Check if game should end
  const p1Stats = state.player1Stats;
  const p2Stats = state.player2Stats;

  const isGameOver = nextRound > state.maxRounds ||
    (p1Stats.ballsRemaining <= 0 && p2Stats.ballsRemaining <= 0);

  if (isGameOver) {
    let winner: FractionPinballState['winner'] = null;
    if (p1Stats.score > p2Stats.score) winner = 'player1';
    else if (p2Stats.score > p1Stats.score) winner = 'player2';

    return {
      ...state,
      phase: 'gameOver',
      winner,
      currentChallenge: null,
      selectedAnswer: null,
      isCorrect: null,
    };
  }

  // Generate next challenge
  const nextChallengeData = generateChallenge(nextRound);

  return {
    ...state,
    currentPlayer: nextPlayer,
    phase: 'answering',
    currentChallenge: nextChallengeData,
    selectedAnswer: null,
    isCorrect: null,
    roundNumber: nextRound,
  };
}

/**
 * Start game with first challenge
 */
export function startGame(state: FractionPinballState): FractionPinballState {
  const firstChallenge = generateChallenge(1);

  return {
    ...state,
    currentChallenge: firstChallenge,
    phase: 'answering',
  };
}
