// Expression Evaluator
// Parsing, tokenizing, and evaluating mathematical expressions

import {
  ExpressionToken,
  ExpressionNode,
  EvaluationResult,
  VariableMap,
  Operator,
  ExpressionSlot,
  ExpressionValidation,
  TargetChallenge,
  TargetSolution,
  Equation,
  EquationResult,
  ArithmeticOperator,
} from './types';

// =============================================================================
// Tokenizer
// =============================================================================

/**
 * Convert a string expression into tokens
 */
export function tokenize(expression: string): ExpressionToken[] {
  const tokens: ExpressionToken[] = [];
  let i = 0;

  while (i < expression.length) {
    const char = expression[i];

    // Skip whitespace
    if (/\s/.test(char)) {
      i++;
      continue;
    }

    // Numbers (including decimals)
    if (/[0-9]/.test(char) || (char === '.' && /[0-9]/.test(expression[i + 1] ?? ''))) {
      let numStr = '';
      while (i < expression.length && /[0-9.]/.test(expression[i])) {
        numStr += expression[i];
        i++;
      }
      tokens.push({ type: 'number', value: parseFloat(numStr) });
      continue;
    }

    // Operators
    if (['+', '-', '*', '/', '^', '=', '<', '>'].includes(char)) {
      // Check for ≤ or ≥ (<=, >=)
      if ((char === '<' || char === '>') && expression[i + 1] === '=') {
        tokens.push({ type: 'operator', value: (char === '<' ? '≤' : '≥') as Operator });
        i += 2;
        continue;
      }
      tokens.push({ type: 'operator', value: char as Operator });
      i++;
      continue;
    }

    // Unicode operators
    if (['≤', '≥', '×', '÷'].includes(char)) {
      let op: Operator;
      if (char === '×') op = '*';
      else if (char === '÷') op = '/';
      else op = char as Operator;
      tokens.push({ type: 'operator', value: op });
      i++;
      continue;
    }

    // Parentheses
    if (char === '(') {
      tokens.push({ type: 'lparen' });
      i++;
      continue;
    }
    if (char === ')') {
      tokens.push({ type: 'rparen' });
      i++;
      continue;
    }

    // Variables (letters)
    if (/[a-zA-Z]/.test(char)) {
      let name = '';
      while (i < expression.length && /[a-zA-Z0-9_]/.test(expression[i])) {
        name += expression[i];
        i++;
      }
      tokens.push({ type: 'variable', name });
      continue;
    }

    // Unknown character - skip
    i++;
  }

  return tokens;
}

// =============================================================================
// Parser (Recursive Descent)
// =============================================================================

/**
 * Parse tokens into an AST
 */
export function parse(tokens: ExpressionToken[]): ExpressionNode {
  let pos = 0;

  function peek(): ExpressionToken | undefined {
    return tokens[pos];
  }

  function consume(): ExpressionToken {
    return tokens[pos++];
  }

  function parseExpression(): ExpressionNode {
    return parseAdditive();
  }

  function parseAdditive(): ExpressionNode {
    let left = parseMultiplicative();

    while (peek()?.type === 'operator' && ['+', '-'].includes((peek() as { value: Operator }).value)) {
      const op = (consume() as { type: 'operator'; value: Operator }).value;
      const right = parseMultiplicative();
      left = { type: 'binary', operator: op, left, right };
    }

    return left;
  }

  function parseMultiplicative(): ExpressionNode {
    let left = parsePower();

    while (peek()?.type === 'operator' && ['*', '/'].includes((peek() as { value: Operator }).value)) {
      const op = (consume() as { type: 'operator'; value: Operator }).value;
      const right = parsePower();
      left = { type: 'binary', operator: op, left, right };
    }

    return left;
  }

  function parsePower(): ExpressionNode {
    let left = parseUnary();

    while (peek()?.type === 'operator' && (peek() as { value: Operator }).value === '^') {
      consume();
      const right = parseUnary();
      left = { type: 'binary', operator: '^', left, right };
    }

    return left;
  }

  function parseUnary(): ExpressionNode {
    if (peek()?.type === 'operator' && (peek() as { value: Operator }).value === '-') {
      consume();
      const operand = parseUnary();
      return { type: 'unary', operator: '-', operand };
    }
    return parsePrimary();
  }

  function parsePrimary(): ExpressionNode {
    const token = peek();

    if (!token) {
      throw new Error('Unexpected end of expression');
    }

    if (token.type === 'number') {
      consume();
      return { type: 'number', value: token.value };
    }

    if (token.type === 'variable') {
      consume();
      return { type: 'variable', name: token.name };
    }

    if (token.type === 'lparen') {
      consume();
      const expr = parseExpression();
      if (peek()?.type !== 'rparen') {
        throw new Error('Expected closing parenthesis');
      }
      consume();
      return expr;
    }

    throw new Error(`Unexpected token: ${JSON.stringify(token)}`);
  }

  const result = parseExpression();

  if (pos < tokens.length) {
    throw new Error(`Unexpected token at position ${pos}`);
  }

  return result;
}

// =============================================================================
// Evaluator
// =============================================================================

/**
 * Evaluate an AST node
 */
export function evaluateNode(node: ExpressionNode, variables?: VariableMap): number {
  switch (node.type) {
    case 'number':
      return node.value;

    case 'variable': {
      const value = variables?.get(node.name);
      if (value === undefined) {
        throw new Error(`Undefined variable: ${node.name}`);
      }
      return value;
    }

    case 'unary':
      return -evaluateNode(node.operand, variables);

    case 'binary': {
      const left = evaluateNode(node.left, variables);
      const right = evaluateNode(node.right, variables);

      switch (node.operator) {
        case '+':
          return left + right;
        case '-':
          return left - right;
        case '*':
          return left * right;
        case '/':
          if (right === 0) throw new Error('Division by zero');
          return left / right;
        case '^':
          return Math.pow(left, right);
        default:
          throw new Error(`Unknown operator: ${node.operator}`);
      }
    }
  }
}

/**
 * Evaluate a string expression
 */
export function evaluate(expression: string, variables?: VariableMap): EvaluationResult {
  try {
    const tokens = tokenize(expression);
    if (tokens.length === 0) {
      return { success: false, error: 'Empty expression' };
    }

    const ast = parse(tokens);
    const value = evaluateNode(ast, variables);

    return { success: true, value };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
}

// =============================================================================
// Expression Slot Validation & Evaluation
// =============================================================================

/**
 * Convert expression slots to a string expression
 */
export function slotsToExpression(slots: ExpressionSlot[]): string {
  return slots
    .map((slot) => slot.card?.content ?? '')
    .filter((s) => s !== '')
    .join(' ');
}

/**
 * Validate expression slots
 */
export function validateSlots(slots: ExpressionSlot[]): ExpressionValidation {
  const errors: string[] = [];
  const filledSlots = slots.filter((s) => s.card !== null);

  if (filledSlots.length === 0) {
    return { isValid: false, canEvaluate: false, errors: ['No cards placed'] };
  }

  // Check for consecutive operators
  let lastWasOperator = false;
  let parenDepth = 0;

  for (const slot of filledSlots) {
    const card = slot.card!;

    if (card.tokenType === 'operator') {
      if (lastWasOperator) {
        errors.push('Consecutive operators not allowed');
      }
      lastWasOperator = true;
    } else if (card.tokenType === 'number') {
      lastWasOperator = false;
    } else if (card.tokenType === 'lparen') {
      parenDepth++;
      lastWasOperator = true; // After ( we need a number
    } else if (card.tokenType === 'rparen') {
      parenDepth--;
      if (parenDepth < 0) {
        errors.push('Unmatched closing parenthesis');
      }
      lastWasOperator = false;
    }
  }

  if (parenDepth !== 0) {
    errors.push('Unmatched parentheses');
  }

  // Check expression doesn't start or end with operator
  const first = filledSlots[0]?.card;
  const last = filledSlots[filledSlots.length - 1]?.card;

  if (first?.tokenType === 'operator' && first.operator !== '-') {
    errors.push('Expression cannot start with an operator');
  }

  if (last?.tokenType === 'operator') {
    errors.push('Expression cannot end with an operator');
  }

  const isValid = errors.length === 0;

  // Try to evaluate
  if (isValid) {
    const exprStr = slotsToExpression(slots);
    const result = evaluate(exprStr);

    if (result.success) {
      return { isValid: true, canEvaluate: true, result: result.value, errors: [] };
    } else {
      return { isValid: true, canEvaluate: false, errors: [result.error ?? 'Evaluation failed'] };
    }
  }

  return { isValid, canEvaluate: false, errors };
}

// =============================================================================
// Target Challenge Solving
// =============================================================================

/**
 * Generate all permutations of an array
 */
function* permutations<T>(arr: T[]): Generator<T[]> {
  if (arr.length <= 1) {
    yield arr;
    return;
  }

  for (let i = 0; i < arr.length; i++) {
    const rest = [...arr.slice(0, i), ...arr.slice(i + 1)];
    for (const perm of permutations(rest)) {
      yield [arr[i], ...perm];
    }
  }
}

/**
 * Generate all possible operator combinations
 */
function* operatorCombinations(operators: Operator[], count: number): Generator<Operator[]> {
  if (count === 0) {
    yield [];
    return;
  }

  for (const op of operators) {
    for (const rest of operatorCombinations(operators, count - 1)) {
      yield [op, ...rest];
    }
  }
}

/**
 * Build an expression string from numbers and operators
 */
function buildExpression(numbers: number[], operators: Operator[]): string {
  if (numbers.length === 0) return '';
  if (numbers.length === 1) return numbers[0].toString();

  let expr = numbers[0].toString();
  for (let i = 0; i < operators.length && i < numbers.length - 1; i++) {
    expr += ` ${operators[i]} ${numbers[i + 1]}`;
  }
  return expr;
}

/**
 * Build expressions with parentheses for 4 numbers
 */
function buildParenExpressions(nums: number[], ops: Operator[]): string[] {
  if (nums.length !== 4 || ops.length !== 3) return [buildExpression(nums, ops)];

  const [a, b, c, d] = nums;
  const [op1, op2, op3] = ops;

  return [
    // No parens (left to right)
    `${a} ${op1} ${b} ${op2} ${c} ${op3} ${d}`,
    // ((a op b) op c) op d - same as no parens
    // (a op (b op c)) op d
    `(${a} ${op1} (${b} ${op2} ${c})) ${op3} ${d}`,
    // a op ((b op c) op d)
    `${a} ${op1} ((${b} ${op2} ${c}) ${op3} ${d})`,
    // a op (b op (c op d))
    `${a} ${op1} (${b} ${op2} (${c} ${op3} ${d}))`,
    // (a op b) op (c op d)
    `(${a} ${op1} ${b}) ${op2} (${c} ${op3} ${d})`,
  ];
}

/**
 * Find solutions to a target challenge
 */
export function solveTargetChallenge(
  challenge: TargetChallenge,
  maxSolutions: number = 10
): TargetSolution[] {
  const solutions: TargetSolution[] = [];
  const seen = new Set<string>();
  const arithmeticOps = challenge.operators.filter((op): op is ArithmeticOperator =>
    ['+', '-', '*', '/'].includes(op)
  );

  // Generate permutations of numbers
  for (const numPerm of permutations(challenge.numbers)) {
    // Generate operator combinations
    for (const ops of operatorCombinations(arithmeticOps, numPerm.length - 1)) {
      // Build expressions (with parens for 4 numbers)
      const expressions =
        numPerm.length === 4 ? buildParenExpressions(numPerm, ops) : [buildExpression(numPerm, ops)];

      for (const expr of expressions) {
        if (seen.has(expr)) continue;
        seen.add(expr);

        const result = evaluate(expr);
        if (result.success && result.value !== undefined) {
          const isExact = Math.abs(result.value - challenge.target) < 0.0001;

          if (isExact || Math.abs(result.value - challenge.target) <= 1) {
            solutions.push({
              expression: expr,
              result: result.value,
              numbersUsed: numPerm,
              isExact,
            });

            if (solutions.length >= maxSolutions) {
              return solutions;
            }
          }
        }
      }
    }
  }

  // Sort by exactness then by expression length
  solutions.sort((a, b) => {
    if (a.isExact !== b.isExact) return a.isExact ? -1 : 1;
    return a.expression.length - b.expression.length;
  });

  return solutions;
}

/**
 * Check if a solution is valid for a challenge
 */
export function validateSolution(
  expression: string,
  challenge: TargetChallenge
): { valid: boolean; error?: string } {
  const result = evaluate(expression);

  if (!result.success) {
    return { valid: false, error: result.error };
  }

  if (Math.abs((result.value ?? 0) - challenge.target) > 0.0001) {
    return { valid: false, error: `Result ${result.value} does not equal target ${challenge.target}` };
  }

  // Check numbers used
  const tokens = tokenize(expression);
  const numbersUsed = tokens
    .filter((t): t is { type: 'number'; value: number } => t.type === 'number')
    .map((t) => t.value);

  if (challenge.useEachOnce) {
    const available = [...challenge.numbers];
    for (const num of numbersUsed) {
      const idx = available.indexOf(num);
      if (idx === -1) {
        return { valid: false, error: `Number ${num} not available or used multiple times` };
      }
      available.splice(idx, 1);
    }
  }

  if (challenge.useAllNumbers && numbersUsed.length !== challenge.numbers.length) {
    return { valid: false, error: 'Must use all available numbers' };
  }

  return { valid: true };
}

// =============================================================================
// Equation Handling
// =============================================================================

/**
 * Parse an equation string (with =)
 */
export function parseEquation(equation: string): Equation | null {
  const parts = equation.split('=');
  if (parts.length !== 2) return null;

  try {
    const leftTokens = tokenize(parts[0].trim());
    const rightTokens = tokenize(parts[1].trim());

    return {
      left: parse(leftTokens),
      right: parse(rightTokens),
    };
  } catch {
    return null;
  }
}

/**
 * Check if an equation is true
 */
export function checkEquation(equation: Equation, variables?: VariableMap): EquationResult {
  try {
    const leftValue = evaluateNode(equation.left, variables);
    const rightValue = evaluateNode(equation.right, variables);

    return {
      isTrue: Math.abs(leftValue - rightValue) < 0.0001,
      leftValue,
      rightValue,
    };
  } catch (error) {
    return {
      isTrue: false,
      leftValue: NaN,
      rightValue: NaN,
      error: (error as Error).message,
    };
  }
}

/**
 * Evaluate an equation string
 */
export function evaluateEquation(equation: string, variables?: VariableMap): EquationResult {
  const parsed = parseEquation(equation);
  if (!parsed) {
    return { isTrue: false, leftValue: NaN, rightValue: NaN, error: 'Invalid equation format' };
  }
  return checkEquation(parsed, variables);
}

// =============================================================================
// Expression Formatting
// =============================================================================

/**
 * Format a number for display (handle decimals nicely)
 */
export function formatNumber(n: number): string {
  if (Number.isInteger(n)) return n.toString();
  return n.toFixed(4).replace(/\.?0+$/, '');
}

/**
 * Convert AST back to string
 */
export function astToString(node: ExpressionNode): string {
  switch (node.type) {
    case 'number':
      return formatNumber(node.value);

    case 'variable':
      return node.name;

    case 'unary':
      return `-(${astToString(node.operand)})`;

    case 'binary': {
      const left = astToString(node.left);
      const right = astToString(node.right);
      return `(${left} ${node.operator} ${right})`;
    }
  }
}

/**
 * Simplify an expression (basic)
 */
export function simplifyExpression(expression: string): string {
  const result = evaluate(expression);
  if (result.success && result.value !== undefined) {
    return formatNumber(result.value);
  }
  return expression;
}
