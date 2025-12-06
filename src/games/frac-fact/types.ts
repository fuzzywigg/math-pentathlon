// Frac Fact Game Types
// Fraction arithmetic challenge game - solve fraction problems to score points

import { Fraction, FractionOperation } from '../../core/fractions/types';

export type Player = 'player1' | 'player2';

// Difficulty affects the complexity of fractions used
export type Difficulty = 'easy' | 'medium' | 'hard';

// A fraction problem to solve
export interface FractionProblem {
  id: string;
  operand1: Fraction;
  operand2: Fraction;
  operation: FractionOperation;
  correctAnswer: Fraction;
  answerChoices: Fraction[];  // Multiple choice options
}

// Player's game stats
export interface PlayerStats {
  score: number;
  correctAnswers: number;
  wrongAnswers: number;
  currentStreak: number;
  bestStreak: number;
}

// Game phases
export type GamePhase = 'playing' | 'showingResult' | 'gameOver';

// Game state
export interface FracFactState {
  currentPlayer: Player;
  phase: GamePhase;

  // Current problem
  currentProblem: FractionProblem | null;
  selectedAnswer: Fraction | null;
  isCorrect: boolean | null;

  // Problems completed
  problemsCompleted: number;
  maxProblems: number;  // Total problems in the game

  // Player stats
  player1Stats: PlayerStats;
  player2Stats: PlayerStats;

  // Difficulty
  difficulty: Difficulty;

  // Winner (null until game over)
  winner: Player | null;

  // Problem history
  problemHistory: ProblemResult[];
}

// Result of a problem attempt
export interface ProblemResult {
  problem: FractionProblem;
  player: Player;
  selectedAnswer: Fraction;
  isCorrect: boolean;
  timeSpent: number;  // in milliseconds
}

// Constants
export const DEFAULT_MAX_PROBLEMS = 10;
export const POINTS_PER_CORRECT = 10;
export const STREAK_BONUS = 5;  // Extra points for each problem in a streak

// Create initial player stats
function createPlayerStats(): PlayerStats {
  return {
    score: 0,
    correctAnswers: 0,
    wrongAnswers: 0,
    currentStreak: 0,
    bestStreak: 0,
  };
}

// Create initial game state
export function createInitialState(difficulty: Difficulty = 'medium'): FracFactState {
  return {
    currentPlayer: 'player1',
    phase: 'playing',
    currentProblem: null,
    selectedAnswer: null,
    isCorrect: null,
    problemsCompleted: 0,
    maxProblems: DEFAULT_MAX_PROBLEMS,
    player1Stats: createPlayerStats(),
    player2Stats: createPlayerStats(),
    difficulty,
    winner: null,
    problemHistory: [],
  };
}

// Get opponent
export function getOpponent(player: Player): Player {
  return player === 'player1' ? 'player2' : 'player1';
}

// Get player stats
export function getPlayerStats(state: FracFactState, player: Player): PlayerStats {
  return player === 'player1' ? state.player1Stats : state.player2Stats;
}
