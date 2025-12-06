// Fraction Pinball Game Types
// Fraction-decimal conversion game with pinball-style scoring

import { Fraction } from '../../core/fractions/types';

export type Player = 'player1' | 'player2';

// A conversion challenge
export interface ConversionChallenge {
  id: string;
  type: 'fractionToDecimal' | 'decimalToFraction';
  fraction: Fraction;
  decimal: number;
  answerChoices: string[];  // Mix of fractions and decimals as display strings
  correctAnswer: string;
}

// Pinball targets/zones with different point values
export interface PinballTarget {
  id: string;
  value: number;  // Points for hitting this target
  label: string;
  hit: boolean;
}

// Game phases
export type GamePhase =
  | 'answering'   // Answer the conversion question
  | 'showResult'  // Show if correct
  | 'gameOver';

// Player stats
export interface PlayerStats {
  score: number;
  correctAnswers: number;
  wrongAnswers: number;
  ballsRemaining: number;
}

// Game state
export interface FractionPinballState {
  currentPlayer: Player;
  phase: GamePhase;

  // Current challenge
  currentChallenge: ConversionChallenge | null;
  selectedAnswer: string | null;
  isCorrect: boolean | null;

  // Pinball targets
  targets: PinballTarget[];

  // Player stats
  player1Stats: PlayerStats;
  player2Stats: PlayerStats;

  // Game progress
  roundNumber: number;
  maxRounds: number;

  // Winner
  winner: Player | null;
}

// Configuration
export const INITIAL_BALLS = 5;
export const MAX_ROUNDS = 10;

// Point values for targets
export const TARGET_POINTS = [10, 20, 30, 50, 100];

// Create initial targets
function createTargets(): PinballTarget[] {
  return TARGET_POINTS.map((value, index) => ({
    id: `target-${index}`,
    value,
    label: `${value}`,
    hit: false,
  }));
}

// Create initial player stats
function createPlayerStats(): PlayerStats {
  return {
    score: 0,
    correctAnswers: 0,
    wrongAnswers: 0,
    ballsRemaining: INITIAL_BALLS,
  };
}

// Create initial game state
export function createInitialState(): FractionPinballState {
  return {
    currentPlayer: 'player1',
    phase: 'answering',
    currentChallenge: null,
    selectedAnswer: null,
    isCorrect: null,
    targets: createTargets(),
    player1Stats: createPlayerStats(),
    player2Stats: createPlayerStats(),
    roundNumber: 1,
    maxRounds: MAX_ROUNDS,
    winner: null,
  };
}

// Get opponent
export function getOpponent(player: Player): Player {
  return player === 'player1' ? 'player2' : 'player1';
}

// Get player stats
export function getPlayerStats(state: FractionPinballState, player: Player): PlayerStats {
  return player === 'player1' ? state.player1Stats : state.player2Stats;
}
