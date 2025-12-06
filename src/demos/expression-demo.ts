// Expression Builder Demo Page
// Interactive demo for testing expression building, parsing, and evaluation

import { navigate } from '../core/router';
import {
  ExpressionCard,
  TargetChallenge,
  createNumberCard,
  createOperatorCard,
  createParenCard,
  createExpressionDeck,
  MAKE_TEN_CHALLENGES,
  TWENTY_FOUR_CHALLENGES,
} from '../core/expressions/types';
import {
  evaluate,
  solveTargetChallenge,
  validateSolution,
  evaluateEquation,
  formatNumber,
} from '../core/expressions/evaluator';
import {
  injectExpressionStyles,
  renderTargetDisplay,
  renderChallengeCard,
  renderCalculatorDisplay,
  createInteractiveBuilder,
} from '../core/expressions/expression-ui';

export function renderExpressionDemo(container: HTMLElement): void {
  injectExpressionStyles();

  container.innerHTML = `
    <header class="game-header">
      <button id="back-btn" class="back-button" aria-label="Back to home">← Back</button>
      <h1>Expression Builder Demo</h1>
    </header>

    <div class="demo-container">
      <div class="demo-section">
        <h2>Expression Evaluator</h2>
        <p>Type mathematical expressions and see the result</p>

        <div class="calc-input-container">
          <input type="text" id="calc-input" placeholder="e.g., 2 + 3 * 4" />
          <button id="calc-btn">Calculate</button>
        </div>

        <div id="calc-result"></div>

        <div class="example-expressions">
          <span>Try:</span>
          <button class="example-btn" data-expr="2 + 3 * 4">2 + 3 × 4</button>
          <button class="example-btn" data-expr="(2 + 3) * 4">(2 + 3) × 4</button>
          <button class="example-btn" data-expr="10 / 2 - 3">10 ÷ 2 - 3</button>
          <button class="example-btn" data-expr="2 ^ 3 + 1">2³ + 1</button>
        </div>
      </div>

      <div class="demo-section">
        <h2>Target Number Game</h2>
        <p>Select a challenge and build an expression to reach the target</p>

        <div class="challenge-grid" id="challenge-grid"></div>

        <div id="active-challenge" style="display: none;">
          <div id="challenge-target"></div>
          <div id="expression-builder"></div>
        </div>
      </div>

      <div class="demo-section">
        <h2>24 Game Solver</h2>
        <p>Enter 4 numbers and find all ways to make 24</p>

        <div class="solver-input">
          <input type="number" id="num1" value="1" min="1" max="13" />
          <input type="number" id="num2" value="2" min="1" max="13" />
          <input type="number" id="num3" value="3" min="1" max="13" />
          <input type="number" id="num4" value="4" min="1" max="13" />
          <button id="solve-btn">Find Solutions</button>
        </div>

        <div id="solutions-list"></div>
      </div>

      <div class="demo-section">
        <h2>Equation Checker</h2>
        <p>Enter an equation to verify if both sides are equal</p>

        <div class="equation-input-container">
          <input type="text" id="equation-input" placeholder="e.g., 2 + 2 = 4" />
          <button id="check-equation-btn">Check</button>
        </div>

        <div id="equation-result"></div>
      </div>

      <div class="demo-section">
        <h2>Card Builder</h2>
        <p>Drag cards to build expressions</p>

        <div id="card-builder-area"></div>
      </div>
    </div>

    <style>
      .demo-container {
        max-width: 900px;
        margin: 0 auto;
        padding: 1rem;
      }

      .demo-section {
        background: #f9f9f9;
        border-radius: 12px;
        padding: 1.5rem;
        margin-bottom: 1.5rem;
      }

      .demo-section h2 {
        margin: 0 0 0.5rem 0;
        color: #333;
      }

      .demo-section p {
        color: #666;
        margin: 0 0 1rem 0;
      }

      .calc-input-container,
      .equation-input-container {
        display: flex;
        gap: 0.5rem;
        margin-bottom: 1rem;
      }

      .calc-input-container input,
      .equation-input-container input {
        flex: 1;
        padding: 0.75rem;
        font-size: 1.1rem;
        border: 2px solid #ddd;
        border-radius: 8px;
        font-family: 'Courier New', monospace;
      }

      .calc-input-container button,
      .equation-input-container button {
        padding: 0.75rem 1.5rem;
        background: #2196f3;
        color: white;
        border: none;
        border-radius: 8px;
        cursor: pointer;
        font-weight: bold;
      }

      .calc-input-container button:hover,
      .equation-input-container button:hover {
        background: #1976d2;
      }

      .example-expressions {
        display: flex;
        gap: 0.5rem;
        align-items: center;
        flex-wrap: wrap;
        margin-top: 1rem;
      }

      .example-expressions span {
        color: #666;
      }

      .example-btn {
        padding: 0.5rem 1rem;
        background: white;
        border: 2px solid #ddd;
        border-radius: 6px;
        cursor: pointer;
        font-family: 'Courier New', monospace;
      }

      .example-btn:hover {
        border-color: #2196f3;
        background: #e3f2fd;
      }

      .challenge-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
        gap: 1rem;
        margin-bottom: 1.5rem;
      }

      .solver-input {
        display: flex;
        gap: 0.5rem;
        align-items: center;
        flex-wrap: wrap;
        margin-bottom: 1rem;
      }

      .solver-input input {
        width: 60px;
        padding: 0.5rem;
        text-align: center;
        font-size: 1.2rem;
        border: 2px solid #ddd;
        border-radius: 8px;
      }

      .solver-input button {
        padding: 0.5rem 1rem;
        background: #4caf50;
        color: white;
        border: none;
        border-radius: 8px;
        cursor: pointer;
        font-weight: bold;
      }

      .solver-input button:hover {
        background: #388e3c;
      }

      #solutions-list {
        background: white;
        border-radius: 8px;
        padding: 1rem;
        max-height: 300px;
        overflow-y: auto;
      }

      .solution-item {
        padding: 0.5rem;
        border-bottom: 1px solid #eee;
        font-family: 'Courier New', monospace;
      }

      .solution-item:last-child {
        border-bottom: none;
      }

      .solution-item.exact {
        color: #2e7d32;
        font-weight: bold;
      }

      #equation-result {
        padding: 1rem;
        background: white;
        border-radius: 8px;
        text-align: center;
        font-size: 1.25rem;
      }

      #equation-result.true {
        background: #e8f5e9;
        color: #2e7d32;
      }

      #equation-result.false {
        background: #ffebee;
        color: #c62828;
      }

      @media (max-width: 600px) {
        .solver-input input {
          width: 50px;
        }
      }
    </style>
  `;

  // Wire up back button
  const backBtn = document.getElementById('back-btn');
  if (backBtn) {
    backBtn.addEventListener('click', () => navigate('/'));
  }

  // Initialize sections
  initCalculator();
  initTargetGame();
  initSolver();
  initEquationChecker();
  initCardBuilder();
}

function initCalculator(): void {
  const input = document.getElementById('calc-input') as HTMLInputElement;
  const calcBtn = document.getElementById('calc-btn');
  const resultContainer = document.getElementById('calc-result');
  const exampleBtns = document.querySelectorAll('.example-btn');

  function calculate(): void {
    if (!input || !resultContainer) return;

    const expr = input.value.trim();
    if (!expr) {
      resultContainer.innerHTML = '';
      return;
    }

    const result = evaluate(expr);
    resultContainer.innerHTML = '';
    resultContainer.appendChild(
      renderCalculatorDisplay(expr, result.value, result.error)
    );
  }

  calcBtn?.addEventListener('click', calculate);
  input?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') calculate();
  });

  exampleBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      if (input) {
        input.value = (btn as HTMLElement).dataset.expr ?? '';
        calculate();
      }
    });
  });
}

function initTargetGame(): void {
  const challengeGrid = document.getElementById('challenge-grid');
  const activeChallenge = document.getElementById('active-challenge');
  const challengeTarget = document.getElementById('challenge-target');
  const expressionBuilder = document.getElementById('expression-builder');

  if (!challengeGrid) return;

  // Combine challenges
  const allChallenges = [...MAKE_TEN_CHALLENGES, ...TWENTY_FOUR_CHALLENGES.slice(0, 4)];

  // Render challenge cards
  for (const challenge of allChallenges) {
    challengeGrid.appendChild(
      renderChallengeCard(challenge, () => {
        selectChallenge(challenge);
      })
    );
  }

  function selectChallenge(challenge: TargetChallenge): void {
    if (!activeChallenge || !challengeTarget || !expressionBuilder) return;

    activeChallenge.style.display = 'block';

    // Show target
    challengeTarget.innerHTML = '';
    challengeTarget.appendChild(renderTargetDisplay(challenge));

    // Create cards from challenge numbers
    const cards: ExpressionCard[] = [];
    for (const num of challenge.numbers) {
      cards.push(createNumberCard(num));
    }
    // Add operator cards
    cards.push(createOperatorCard('+'));
    cards.push(createOperatorCard('-'));
    cards.push(createOperatorCard('*'));
    cards.push(createOperatorCard('/'));
    cards.push(createParenCard(true));
    cards.push(createParenCard(false));

    // Create interactive builder
    expressionBuilder.innerHTML = '';
    createInteractiveBuilder(expressionBuilder, {
      slotCount: challenge.numbers.length * 2 - 1, // Numbers + operators between them
      availableCards: cards,
      targetValue: challenge.target,
      onComplete: (expr, result) => {
        const validation = validateSolution(expr, challenge);
        if (validation.valid) {
          alert(`Correct! ${expr} = ${result}`);
        }
      },
    });
  }
}

function initSolver(): void {
  const solveBtn = document.getElementById('solve-btn');
  const solutionsList = document.getElementById('solutions-list');
  const numInputs = [
    document.getElementById('num1') as HTMLInputElement,
    document.getElementById('num2') as HTMLInputElement,
    document.getElementById('num3') as HTMLInputElement,
    document.getElementById('num4') as HTMLInputElement,
  ];

  solveBtn?.addEventListener('click', () => {
    if (!solutionsList) return;

    const numbers = numInputs.map((input) => parseInt(input.value, 10) || 1);

    solutionsList.innerHTML = '<div style="color: #666;">Searching...</div>';

    // Use setTimeout to allow UI to update
    setTimeout(() => {
      const challenge: TargetChallenge = {
        numbers,
        target: 24,
        operators: ['+', '-', '*', '/'],
        useAllNumbers: true,
        useEachOnce: true,
      };

      const solutions = solveTargetChallenge(challenge, 20);

      if (solutions.length === 0) {
        solutionsList.innerHTML =
          '<div style="color: #666;">No solutions found for these numbers.</div>';
        return;
      }

      solutionsList.innerHTML = '';
      for (const sol of solutions) {
        const item = document.createElement('div');
        item.className = `solution-item ${sol.isExact ? 'exact' : ''}`;
        item.innerHTML = `${sol.expression} = ${formatNumber(sol.result)}`;
        solutionsList.appendChild(item);
      }
    }, 10);
  });
}

function initEquationChecker(): void {
  const input = document.getElementById('equation-input') as HTMLInputElement;
  const checkBtn = document.getElementById('check-equation-btn');
  const resultEl = document.getElementById('equation-result');

  function checkEquation(): void {
    if (!input || !resultEl) return;

    const equation = input.value.trim();
    if (!equation) {
      resultEl.innerHTML = '';
      resultEl.className = '';
      return;
    }

    const result = evaluateEquation(equation);

    if (result.error) {
      resultEl.innerHTML = `Error: ${result.error}`;
      resultEl.className = 'false';
    } else {
      resultEl.className = result.isTrue ? 'true' : 'false';
      resultEl.innerHTML = result.isTrue
        ? `✓ True! Both sides equal ${formatNumber(result.leftValue)}`
        : `✗ False: ${formatNumber(result.leftValue)} ≠ ${formatNumber(result.rightValue)}`;
    }
  }

  checkBtn?.addEventListener('click', checkEquation);
  input?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') checkEquation();
  });
}

function initCardBuilder(): void {
  const builderArea = document.getElementById('card-builder-area');
  if (!builderArea) return;

  // Create a deck of cards
  const cards = createExpressionDeck({
    numbers: [1, 2, 3, 4, 5, 6, 7, 8, 9],
    operators: ['+', '-', '*', '/'],
    includeParens: true,
  });

  createInteractiveBuilder(builderArea, {
    slotCount: 7,
    availableCards: cards,
    onComplete: (expr, result) => {
      console.log(`Expression complete: ${expr} = ${result}`);
    },
  });
}
