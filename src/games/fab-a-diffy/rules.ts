// Fab-a-Diffy Game Rules
// Fraction combination logic, matching, and scoring

import {
  FabADiffyState,
  FractionBar,
  AnswerBar,
  FabMove,
  Player,
  FRACTION_BAR_VALUES,
  ANSWER_BAR_VALUES,
  createBarId,
  createAnswerId,
  getOpponent,
  shuffleArray,
} from './types';
import { Fraction, FractionOperation } from '../../core/fractions/types';
import {
  add,
  subtract,
  multiply,
  divide,
  simplify,
  areEquivalent,
  formatFraction,
} from '../../core/fractions/arithmetic';

// =============================================================================
// State Creation
// =============================================================================

/**
 * Create initial game state
 */
export function createInitialState(): FabADiffyState {
  // Create fraction bars from the standard set
  const fractionBars = new Map<string, FractionBar>();
  const shuffledBars = shuffleArray(FRACTION_BAR_VALUES);

  shuffledBars.forEach((fraction, index) => {
    const id = createBarId(index);
    fractionBars.set(id, {
      id,
      fraction: { ...fraction },
      owner: null,
      used: false,
    });
  });

  // Create answer bars
  const answerBars = new Map<string, AnswerBar>();
  const shuffledAnswers = shuffleArray(ANSWER_BAR_VALUES);

  shuffledAnswers.forEach((fraction, index) => {
    const id = createAnswerId(index);
    answerBars.set(id, {
      id,
      fraction: simplify({ ...fraction }),
      claimedBy: null,
    });
  });

  return {
    fractionBars,
    answerBars,
    currentPlayer: 'player1',
    selectedBar1: null,
    selectedBar2: null,
    selectedOperation: null,
    phase: 'selectingBar1',
    winner: null,
    moveHistory: [],
    scores: { player1: 0, player2: 0 },
  };
}

// =============================================================================
// Bar Selection
// =============================================================================

/**
 * Select first fraction bar
 */
export function selectBar1(state: FabADiffyState, barId: string): FabADiffyState {
  if (state.phase !== 'selectingBar1') return state;

  const bar = state.fractionBars.get(barId);
  if (!bar || bar.used) return state;

  return {
    ...state,
    selectedBar1: barId,
    phase: 'selectingBar2',
  };
}

/**
 * Select second fraction bar
 */
export function selectBar2(state: FabADiffyState, barId: string): FabADiffyState {
  if (state.phase !== 'selectingBar2') return state;
  if (barId === state.selectedBar1) return state;

  const bar = state.fractionBars.get(barId);
  if (!bar || bar.used) return state;

  return {
    ...state,
    selectedBar2: barId,
    phase: 'selectingOperation',
  };
}

/**
 * Clear selection and start over
 */
export function clearSelection(state: FabADiffyState): FabADiffyState {
  return {
    ...state,
    selectedBar1: null,
    selectedBar2: null,
    selectedOperation: null,
    phase: 'selectingBar1',
  };
}

// =============================================================================
// Operations
// =============================================================================

/**
 * Calculate the result of combining two fractions
 */
export function calculateResult(
  a: Fraction,
  b: Fraction,
  operation: FractionOperation
): Fraction | null {
  try {
    let result: Fraction;

    switch (operation) {
      case 'add':
        result = add(a, b);
        break;
      case 'subtract':
        result = subtract(a, b);
        break;
      case 'multiply':
        result = multiply(a, b);
        break;
      case 'divide':
        if (b.numerator === 0) return null;
        result = divide(a, b);
        break;
      default:
        return null;
    }

    return simplify(result);
  } catch {
    return null;
  }
}

/**
 * Get all possible results from two selected bars
 */
export function getPossibleResults(
  bar1: FractionBar,
  bar2: FractionBar
): Array<{ operation: FractionOperation; result: Fraction }> {
  const operations: FractionOperation[] = ['add', 'subtract', 'multiply', 'divide'];
  const results: Array<{ operation: FractionOperation; result: Fraction }> = [];

  for (const op of operations) {
    const result = calculateResult(bar1.fraction, bar2.fraction, op);
    if (result && result.numerator >= 0) {
      // Only non-negative results
      results.push({ operation: op, result });
    }

    // Also try reverse order for non-commutative operations
    if (op === 'subtract' || op === 'divide') {
      const reverseResult = calculateResult(bar2.fraction, bar1.fraction, op);
      if (reverseResult && reverseResult.numerator >= 0) {
        // Check if already have this result
        if (!results.some((r) => areEquivalent(r.result, reverseResult))) {
          results.push({ operation: op, result: reverseResult });
        }
      }
    }
  }

  return results;
}

/**
 * Find which answer bars match a given result
 */
export function findMatchingAnswers(
  state: FabADiffyState,
  result: Fraction
): string[] {
  const matches: string[] = [];

  for (const [id, answer] of state.answerBars) {
    if (answer.claimedBy === null && areEquivalent(answer.fraction, result)) {
      matches.push(id);
    }
  }

  return matches;
}

/**
 * Select an operation and find matching answers
 */
export function selectOperation(
  state: FabADiffyState,
  operation: FractionOperation
): FabADiffyState {
  if (state.phase !== 'selectingOperation') return state;
  if (!state.selectedBar1 || !state.selectedBar2) return state;

  const bar1 = state.fractionBars.get(state.selectedBar1);
  const bar2 = state.fractionBars.get(state.selectedBar2);
  if (!bar1 || !bar2) return state;

  return {
    ...state,
    selectedOperation: operation,
    phase: 'confirmingMove',
  };
}

// =============================================================================
// Move Execution
// =============================================================================

/**
 * Execute a move - claim an answer bar
 */
export function executeMove(
  state: FabADiffyState,
  answerId: string
): FabADiffyState {
  if (state.phase !== 'confirmingMove') return state;
  if (!state.selectedBar1 || !state.selectedBar2 || !state.selectedOperation) {
    return state;
  }

  const bar1 = state.fractionBars.get(state.selectedBar1);
  const bar2 = state.fractionBars.get(state.selectedBar2);
  const answer = state.answerBars.get(answerId);

  if (!bar1 || !bar2 || !answer || answer.claimedBy !== null) {
    return state;
  }

  // Calculate result
  const result = calculateResult(bar1.fraction, bar2.fraction, state.selectedOperation);
  if (!result || !areEquivalent(result, answer.fraction)) {
    return state;
  }

  // Mark bars as used
  const newFractionBars = new Map(state.fractionBars);
  newFractionBars.set(bar1.id, { ...bar1, used: true });
  newFractionBars.set(bar2.id, { ...bar2, used: true });

  // Claim answer bar
  const newAnswerBars = new Map(state.answerBars);
  newAnswerBars.set(answerId, { ...answer, claimedBy: state.currentPlayer });

  // Record move
  const move: FabMove = {
    player: state.currentPlayer,
    bar1Id: state.selectedBar1,
    bar2Id: state.selectedBar2,
    operation: state.selectedOperation,
    resultId: answerId,
    moveNumber: state.moveHistory.length + 1,
  };

  // Update scores
  const newScores = { ...state.scores };
  newScores[state.currentPlayer]++;

  // Check for winner
  const winner = checkWinner(newAnswerBars, newFractionBars);

  // Switch turns
  const nextPlayer = winner ? state.currentPlayer : getOpponent(state.currentPlayer);

  return {
    ...state,
    fractionBars: newFractionBars,
    answerBars: newAnswerBars,
    currentPlayer: nextPlayer,
    selectedBar1: null,
    selectedBar2: null,
    selectedOperation: null,
    phase: winner ? 'gameOver' : 'selectingBar1',
    winner,
    moveHistory: [...state.moveHistory, move],
    scores: newScores,
  };
}

/**
 * Pass turn (when no valid moves available)
 */
export function passTurn(state: FabADiffyState): FabADiffyState {
  const newState = {
    ...state,
    currentPlayer: getOpponent(state.currentPlayer),
    selectedBar1: null,
    selectedBar2: null,
    selectedOperation: null,
    phase: 'selectingBar1' as const,
  };

  // Check if game should end (both players pass)
  if (!hasAnyValidMove(newState)) {
    return {
      ...newState,
      phase: 'gameOver',
      winner: determineWinner(newState.scores),
    };
  }

  return newState;
}

// =============================================================================
// Win Detection
// =============================================================================

/**
 * Check for winner
 */
export function checkWinner(
  answerBars: Map<string, AnswerBar>,
  fractionBars: Map<string, FractionBar>
): Player | null {
  // Count claimed answers
  let player1Claims = 0;
  let player2Claims = 0;

  for (const answer of answerBars.values()) {
    if (answer.claimedBy === 'player1') player1Claims++;
    else if (answer.claimedBy === 'player2') player2Claims++;
  }

  // Check if all answers are claimed
  const totalAnswers = answerBars.size;
  if (player1Claims + player2Claims >= totalAnswers) {
    return player1Claims > player2Claims ? 'player1' : 'player2';
  }

  // Check if all fraction bars are used
  let usedBars = 0;
  for (const bar of fractionBars.values()) {
    if (bar.used) usedBars++;
  }

  // If most bars are used, end game
  if (usedBars >= fractionBars.size - 1) {
    return player1Claims > player2Claims ? 'player1' :
           player2Claims > player1Claims ? 'player2' : null;
  }

  return null;
}

/**
 * Determine winner based on scores
 */
function determineWinner(scores: { player1: number; player2: number }): Player | null {
  if (scores.player1 > scores.player2) return 'player1';
  if (scores.player2 > scores.player1) return 'player2';
  return null; // Tie
}

/**
 * Check if any valid moves exist
 */
export function hasAnyValidMove(state: FabADiffyState): boolean {
  const availableBars = Array.from(state.fractionBars.values()).filter((b) => !b.used);
  if (availableBars.length < 2) return false;

  // Check if any pair can make a matching result
  for (let i = 0; i < availableBars.length; i++) {
    for (let j = i + 1; j < availableBars.length; j++) {
      const results = getPossibleResults(availableBars[i], availableBars[j]);
      for (const { result } of results) {
        const matches = findMatchingAnswers(state, result);
        if (matches.length > 0) return true;
      }
    }
  }

  return false;
}

// =============================================================================
// Display Helpers
// =============================================================================

/**
 * Get operation symbol
 */
export function getOperationSymbol(operation: FractionOperation): string {
  switch (operation) {
    case 'add':
      return '+';
    case 'subtract':
      return '−';
    case 'multiply':
      return '×';
    case 'divide':
      return '÷';
  }
}

/**
 * Format move for history display
 */
export function formatMove(state: FabADiffyState, move: FabMove): string {
  const bar1 = state.fractionBars.get(move.bar1Id);
  const bar2 = state.fractionBars.get(move.bar2Id);
  const answer = state.answerBars.get(move.resultId);

  if (!bar1 || !bar2 || !answer) return '?';

  const symbol = getOperationSymbol(move.operation);
  const f1 = formatFraction(bar1.fraction);
  const f2 = formatFraction(bar2.fraction);
  const result = formatFraction(answer.fraction);

  return `${f1} ${symbol} ${f2} = ${result}`;
}
