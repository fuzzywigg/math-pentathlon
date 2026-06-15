// Dice System Demo - Test page for dice functionality

import { DiceSelector, COMMON_DICE_SETS, rollMultiple, renderRollResult } from '../core/dice';

export function renderDiceDemo(container: HTMLElement): void {
  container.innerHTML = '';

  const wrapper = document.createElement('div');
  wrapper.className = 'dice-demo';
  wrapper.innerHTML = `
    <style>
      .dice-demo {
        max-width: 800px;
        margin: 0 auto;
        padding: 2rem;
      }
      .dice-demo h1 {
        text-align: center;
        color: #1a237e;
        margin-bottom: 2rem;
      }
      .demo-section {
        margin-bottom: 2rem;
        padding: 1.5rem;
        background: #f5f5f5;
        border-radius: 12px;
      }
      .demo-section h2 {
        margin-top: 0;
        color: #333;
        font-size: 1.25rem;
        border-bottom: 2px solid #ddd;
        padding-bottom: 0.5rem;
        margin-bottom: 1rem;
      }
      .quick-roll-area {
        display: flex;
        flex-wrap: wrap;
        gap: 1rem;
        margin-bottom: 1rem;
      }
      .quick-roll-btn {
        padding: 0.75rem 1.25rem;
        background: #1976d2;
        color: white;
        border: none;
        border-radius: 8px;
        cursor: pointer;
        font-size: 0.9rem;
        font-weight: 500;
        transition: background 0.2s;
      }
      .quick-roll-btn:hover {
        background: #1565c0;
      }
      .quick-roll-result {
        margin-top: 1rem;
        padding: 1rem;
        background: white;
        border-radius: 8px;
        min-height: 80px;
      }
      .selector-container {
        background: white;
        border-radius: 12px;
      }
      .log-area {
        margin-top: 1rem;
        padding: 1rem;
        background: #263238;
        color: #4fc3f7;
        border-radius: 8px;
        font-family: monospace;
        font-size: 0.85rem;
        max-height: 200px;
        overflow-y: auto;
      }
      .log-entry {
        margin: 0.25rem 0;
      }
      .back-link {
        display: inline-block;
        margin-bottom: 1rem;
        color: #1976d2;
        text-decoration: none;
      }
      .back-link:hover {
        text-decoration: underline;
      }
    </style>

    <a href="#/" class="back-link">&larr; Back to Games</a>
    <h1>🎲 Dice System Demo</h1>

    <div class="demo-section">
      <h2>Quick Roll (No Animation)</h2>
      <div class="quick-roll-area">
        <button class="quick-roll-btn" data-dice="d6" data-count="1">Roll 1d6</button>
        <button class="quick-roll-btn" data-dice="d6" data-count="2">Roll 2d6</button>
        <button class="quick-roll-btn" data-dice="d6" data-count="3">Roll 3d6</button>
        <button class="quick-roll-btn" data-dice="d20" data-count="1">Roll 1d20</button>
        <button class="quick-roll-btn" data-dice="d10" data-count="2">Roll 2d10</button>
      </div>
      <div class="quick-roll-result" id="quick-roll-result">
        <span style="color: #999; font-style: italic;">Click a button to roll</span>
      </div>
    </div>

    <div class="demo-section">
      <h2>Interactive Selector (2d6 - Standard)</h2>
      <div class="selector-container" id="selector-2d6"></div>
      <div class="log-area" id="log-2d6"></div>
    </div>

    <div class="demo-section">
      <h2>Interactive Selector (3 Polyhedral - Prime Gold Style)</h2>
      <div class="selector-container" id="selector-poly"></div>
      <div class="log-area" id="log-poly"></div>
    </div>

    <div class="demo-section">
      <h2>Possible Sums Display</h2>
      <div class="selector-container" id="selector-sums"></div>
    </div>
  `;

  container.appendChild(wrapper);

  // Quick roll buttons
  const quickRollResult = wrapper.querySelector('#quick-roll-result') as HTMLElement;
  wrapper.querySelectorAll('.quick-roll-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const diceType = btn.getAttribute('data-dice') as 'd6' | 'd20' | 'd10';
      const count = parseInt(btn.getAttribute('data-count') || '1');
      const result = rollMultiple(diceType, count);
      renderRollResult(result, quickRollResult, { showTotal: true });
    });
  });

  // Interactive selector - 2d6
  const selector2d6Container = wrapper.querySelector('#selector-2d6') as HTMLElement;
  const log2d6 = wrapper.querySelector('#log-2d6') as HTMLElement;

  new DiceSelector(selector2d6Container, {
    diceSet: COMMON_DICE_SETS.standard,
    multiSelect: true,
    onSelectionChange: (dice, sum) => {
      addLog(log2d6, `Selection changed: ${dice.map(d => d.value).join(' + ')} = ${sum}`);
    },
    onRollComplete: (result) => {
      addLog(log2d6, `Rolled: [${result.rolls.map(d => d.value).join(', ')}] Total: ${result.total}`);
    },
    onConfirm: (selectedDice, sum) => {
      addLog(log2d6, `✓ Confirmed: ${selectedDice.map(d => d.value).join(' + ')} = ${sum}`);
    },
  });

  // Interactive selector - Polyhedral
  const selectorPolyContainer = wrapper.querySelector('#selector-poly') as HTMLElement;
  const logPoly = wrapper.querySelector('#log-poly') as HTMLElement;

  new DiceSelector(selectorPolyContainer, {
    diceSet: COMMON_DICE_SETS.primeGold,
    multiSelect: true,
    onSelectionChange: (dice, sum) => {
      addLog(logPoly, `Selection: ${dice.map(d => `${d.diceType}:${d.value}`).join(', ')} = ${sum}`);
    },
    onRollComplete: (result) => {
      addLog(logPoly, `Rolled: ${result.rolls.map(d => `${d.diceType}:${d.value}`).join(', ')}`);
    },
    onConfirm: (_dice, sum) => {
      addLog(logPoly, `✓ Confirmed sum: ${sum}`);
    },
  });

  // Possible sums display
  const selectorSumsContainer = wrapper.querySelector('#selector-sums') as HTMLElement;

  new DiceSelector(selectorSumsContainer, {
    diceSet: COMMON_DICE_SETS.triple,
    multiSelect: true,
    showPossibleSums: true,
    autoRoll: true,
  });
}

function addLog(container: HTMLElement, message: string): void {
  const entry = document.createElement('div');
  entry.className = 'log-entry';
  entry.textContent = `[${new Date().toLocaleTimeString()}] ${message}`;
  container.insertBefore(entry, container.firstChild);

  // Keep only last 20 entries
  while (container.children.length > 20) {
    container.removeChild(container.lastChild!);
  }
}
