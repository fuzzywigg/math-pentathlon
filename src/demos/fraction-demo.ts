// Fraction System Demo Page
// Interactive demo for testing fraction arithmetic and visualization

import {
  Fraction,
  COMMON_FRACTIONS,
  FRACTION_COLORS,
} from '../core/fractions/types';
import {
  simplify,
  toDecimal,
  formatFraction,
  parseFraction,
  compare,
  areEquivalent,
  findEquivalentFractions,
  performOperation,
} from '../core/fractions/arithmetic';
import {
  renderFractionBar,
  createInteractiveFractionBar,
  renderFractionComparison,
  injectFractionBarStyles,
  getFractionColor,
} from '../core/fractions/fraction-bar-ui';
import { navigate } from '../core/router';

export function renderFractionDemo(container: HTMLElement): void {
  injectFractionBarStyles();

  container.innerHTML = `
    <header class="game-header">
      <button id="back-btn" class="back-button" aria-label="Back to game list">← Back</button>
      <h1>Fraction System Demo</h1>
    </header>

    <div class="demo-container">
      <div class="demo-section">
        <h2>Visual Fraction Bars</h2>
        <p>Different styles of fraction visualization</p>

        <div class="demo-row">
          <div class="demo-item">
            <h3>Horizontal Bars</h3>
            <div id="horizontal-bars" class="fraction-display"></div>
          </div>
          <div class="demo-item">
            <h3>Vertical Bars</h3>
            <div id="vertical-bars" class="fraction-display vertical"></div>
          </div>
          <div class="demo-item">
            <h3>Circle (Pie) Charts</h3>
            <div id="circle-bars" class="fraction-display"></div>
          </div>
        </div>
      </div>

      <div class="demo-section">
        <h2>Fraction Arithmetic</h2>
        <p>Enter two fractions to perform operations</p>

        <div class="arithmetic-inputs">
          <div class="fraction-input-group">
            <label>Fraction A:</label>
            <input type="text" id="fraction-a" placeholder="3/4" value="3/4">
          </div>
          <div class="operation-selector">
            <button class="op-btn selected" data-op="add">+</button>
            <button class="op-btn" data-op="subtract">−</button>
            <button class="op-btn" data-op="multiply">×</button>
            <button class="op-btn" data-op="divide">÷</button>
          </div>
          <div class="fraction-input-group">
            <label>Fraction B:</label>
            <input type="text" id="fraction-b" placeholder="1/2" value="1/2">
          </div>
          <button id="calculate-btn" class="calculate-btn">Calculate</button>
        </div>

        <div id="arithmetic-result" class="arithmetic-result"></div>
      </div>

      <div class="demo-section">
        <h2>Interactive Fraction Bar</h2>
        <p>Click segments to set the fraction value</p>

        <div class="interactive-section">
          <div class="denominator-selector">
            <label>Denominator:</label>
            <select id="denominator-select">
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4" selected>4</option>
              <option value="5">5</option>
              <option value="6">6</option>
              <option value="8">8</option>
              <option value="10">10</option>
              <option value="12">12</option>
            </select>
          </div>
          <div id="interactive-bar" class="interactive-bar-container"></div>
          <div id="interactive-value" class="fraction-value">1/4</div>
        </div>
      </div>

      <div class="demo-section">
        <h2>Fraction Comparison</h2>
        <p>Compare two fractions visually</p>

        <div class="comparison-inputs">
          <input type="text" id="compare-a" placeholder="2/3" value="2/3">
          <span>vs</span>
          <input type="text" id="compare-b" placeholder="3/4" value="3/4">
          <button id="compare-btn">Compare</button>
        </div>

        <div id="comparison-result" class="comparison-result"></div>
      </div>

      <div class="demo-section">
        <h2>Equivalent Fractions</h2>
        <p>Find equivalent fractions for a given value</p>

        <div class="equivalent-inputs">
          <input type="text" id="equiv-fraction" placeholder="1/2" value="1/2">
          <button id="find-equiv-btn">Find Equivalents</button>
        </div>

        <div id="equivalent-result" class="equivalent-result"></div>
      </div>

      <div class="demo-section">
        <h2>Common Fractions Gallery</h2>
        <p>Visual reference of common fractions used in Math Pentathlon</p>

        <div id="fraction-gallery" class="fraction-gallery"></div>
      </div>
    </div>

    <style>
      .demo-container {
        max-width: 1000px;
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

      .demo-row {
        display: flex;
        gap: 2rem;
        flex-wrap: wrap;
      }

      .demo-item {
        flex: 1;
        min-width: 200px;
      }

      .demo-item h3 {
        margin: 0 0 1rem 0;
        font-size: 1rem;
        color: #555;
      }

      .fraction-display {
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
      }

      .fraction-display.vertical {
        flex-direction: row;
        align-items: flex-end;
        gap: 1.5rem;
      }

      .arithmetic-inputs {
        display: flex;
        align-items: center;
        gap: 1rem;
        flex-wrap: wrap;
        margin-bottom: 1rem;
      }

      .fraction-input-group {
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
      }

      .fraction-input-group label {
        font-size: 0.875rem;
        color: #666;
      }

      .fraction-input-group input {
        width: 80px;
        padding: 0.5rem;
        border: 2px solid #ddd;
        border-radius: 6px;
        font-size: 1rem;
        text-align: center;
      }

      .operation-selector {
        display: flex;
        gap: 0.25rem;
      }

      .op-btn {
        width: 40px;
        height: 40px;
        border: 2px solid #ddd;
        border-radius: 6px;
        background: white;
        font-size: 1.25rem;
        cursor: pointer;
        transition: all 0.2s;
      }

      .op-btn:hover {
        border-color: #2196f3;
      }

      .op-btn.selected {
        background: #2196f3;
        border-color: #2196f3;
        color: white;
      }

      .calculate-btn {
        padding: 0.5rem 1.5rem;
        background: #4caf50;
        color: white;
        border: none;
        border-radius: 6px;
        font-size: 1rem;
        cursor: pointer;
      }

      .calculate-btn:hover {
        background: #45a049;
      }

      .arithmetic-result {
        background: white;
        border-radius: 8px;
        padding: 1rem;
        min-height: 60px;
      }

      .arithmetic-result .steps {
        font-family: monospace;
        color: #555;
        margin-bottom: 0.5rem;
      }

      .arithmetic-result .final-result {
        font-size: 1.5rem;
        font-weight: bold;
        color: #2196f3;
      }

      .arithmetic-result .visual-result {
        margin-top: 1rem;
        display: flex;
        align-items: center;
        gap: 1rem;
      }

      .interactive-section {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 1rem;
      }

      .denominator-selector {
        display: flex;
        align-items: center;
        gap: 0.5rem;
      }

      .denominator-selector select {
        padding: 0.5rem;
        border: 2px solid #ddd;
        border-radius: 6px;
        font-size: 1rem;
      }

      .interactive-bar-container {
        padding: 1rem;
      }

      .fraction-value {
        font-size: 1.5rem;
        font-weight: bold;
        color: #333;
      }

      .comparison-inputs,
      .equivalent-inputs {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        margin-bottom: 1rem;
      }

      .comparison-inputs input,
      .equivalent-inputs input {
        width: 80px;
        padding: 0.5rem;
        border: 2px solid #ddd;
        border-radius: 6px;
        font-size: 1rem;
        text-align: center;
      }

      .comparison-inputs span {
        color: #666;
        font-weight: bold;
      }

      .comparison-inputs button,
      .equivalent-inputs button {
        padding: 0.5rem 1rem;
        background: #2196f3;
        color: white;
        border: none;
        border-radius: 6px;
        cursor: pointer;
      }

      .comparison-inputs button:hover,
      .equivalent-inputs button:hover {
        background: #1976d2;
      }

      .comparison-result {
        background: white;
        border-radius: 8px;
        padding: 1rem;
        min-height: 80px;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 0.5rem;
      }

      .comparison-text {
        font-size: 1.25rem;
        font-weight: bold;
      }

      .equivalent-result {
        background: white;
        border-radius: 8px;
        padding: 1rem;
        display: flex;
        flex-wrap: wrap;
        gap: 1rem;
        min-height: 60px;
      }

      .equivalent-item {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 0.25rem;
      }

      .equivalent-item span {
        font-size: 0.875rem;
        color: #666;
      }

      .fraction-gallery {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
        gap: 1rem;
      }

      .gallery-item {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 0.5rem;
        padding: 0.5rem;
        background: white;
        border-radius: 8px;
      }

      .gallery-item .label {
        font-size: 0.875rem;
        color: #333;
        font-weight: 500;
      }

      .gallery-item .decimal {
        font-size: 0.75rem;
        color: #888;
      }

      @media (max-width: 600px) {
        .demo-row {
          flex-direction: column;
        }

        .arithmetic-inputs {
          flex-direction: column;
          align-items: stretch;
        }

        .operation-selector {
          justify-content: center;
        }
      }
    </style>
  `;

  // Wire up back button
  const backBtn = document.getElementById('back-btn');
  if (backBtn) {
    backBtn.addEventListener('click', () => navigate('/'));
  }

  // Render visual fraction bars
  renderVisualBars();

  // Set up arithmetic calculator
  setupArithmeticCalculator();

  // Set up interactive bar
  setupInteractiveBar();

  // Set up comparison
  setupComparison();

  // Set up equivalent fractions finder
  setupEquivalentFinder();

  // Render fraction gallery
  renderFractionGallery();
}

function renderVisualBars(): void {
  const horizontalContainer = document.getElementById('horizontal-bars');
  const verticalContainer = document.getElementById('vertical-bars');
  const circleContainer = document.getElementById('circle-bars');

  const sampleFractions: Fraction[] = [
    { numerator: 1, denominator: 2 },
    { numerator: 2, denominator: 3 },
    { numerator: 3, denominator: 4 },
    { numerator: 5, denominator: 8 },
  ];

  if (horizontalContainer) {
    sampleFractions.forEach((f) => {
      const bar = renderFractionBar(f, {
        style: 'horizontal',
        width: 180,
        height: 30,
        colors: { filled: getFractionColor(f.denominator) },
      });
      horizontalContainer.appendChild(bar);
    });
  }

  if (verticalContainer) {
    sampleFractions.forEach((f) => {
      const bar = renderFractionBar(f, {
        style: 'vertical',
        width: 30,
        height: 120,
        showLabel: true,
        labelPosition: 'right',
        colors: { filled: getFractionColor(f.denominator) },
      });
      verticalContainer.appendChild(bar);
    });
  }

  if (circleContainer) {
    sampleFractions.forEach((f) => {
      const bar = renderFractionBar(f, {
        style: 'circle',
        width: 80,
        height: 80,
        colors: { filled: getFractionColor(f.denominator) },
      });
      circleContainer.appendChild(bar);
    });
  }
}

function setupArithmeticCalculator(): void {
  const inputA = document.getElementById('fraction-a') as HTMLInputElement;
  const inputB = document.getElementById('fraction-b') as HTMLInputElement;
  const opBtns = document.querySelectorAll('.op-btn');
  const calculateBtn = document.getElementById('calculate-btn');
  const resultContainer = document.getElementById('arithmetic-result');

  let currentOp: 'add' | 'subtract' | 'multiply' | 'divide' = 'add';

  opBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      opBtns.forEach((b) => b.classList.remove('selected'));
      btn.classList.add('selected');
      currentOp = (btn as HTMLElement).dataset.op as typeof currentOp;
    });
  });

  calculateBtn?.addEventListener('click', () => {
    const a = parseFraction(inputA.value);
    const b = parseFraction(inputB.value);

    if (!a || !b) {
      if (resultContainer) {
        resultContainer.innerHTML = '<p style="color: red;">Invalid fraction format. Use format like "3/4" or "1 1/2"</p>';
      }
      return;
    }

    const result = performOperation(a, b, currentOp);

    if (resultContainer) {
      const stepsHtml = result.steps?.map((s) => `<div>${s}</div>`).join('') || '';

      resultContainer.innerHTML = `
        <div class="steps">${stepsHtml}</div>
        <div class="final-result">${formatFraction(result.simplified)} = ${result.decimal.toFixed(4)}</div>
        <div class="visual-result">
          <span>Visual:</span>
          <div id="result-bar"></div>
        </div>
      `;

      const barContainer = document.getElementById('result-bar');
      if (barContainer) {
        const bar = renderFractionBar(result.simplified, {
          width: 200,
          height: 35,
          colors: { filled: getFractionColor(result.simplified.denominator) },
        });
        barContainer.appendChild(bar);
      }
    }
  });

  // Trigger initial calculation
  calculateBtn?.click();
}

function setupInteractiveBar(): void {
  const container = document.getElementById('interactive-bar');
  const denominatorSelect = document.getElementById('denominator-select') as HTMLSelectElement;
  const valueDisplay = document.getElementById('interactive-value');

  let currentDenom = 4;
  let currentNumer = 1;

  function renderInteractive(): void {
    if (!container) return;
    container.innerHTML = '';

    const bar = createInteractiveFractionBar(
      { numerator: currentNumer, denominator: currentDenom },
      currentDenom,
      (newFraction) => {
        currentNumer = newFraction.numerator;
        if (valueDisplay) {
          valueDisplay.textContent = formatFraction(newFraction);
        }
        renderInteractive();
      },
      { width: 300, height: 50 }
    );

    container.appendChild(bar);
  }

  denominatorSelect?.addEventListener('change', () => {
    currentDenom = parseInt(denominatorSelect.value, 10);
    currentNumer = Math.min(currentNumer, currentDenom);
    if (valueDisplay) {
      valueDisplay.textContent = formatFraction({ numerator: currentNumer, denominator: currentDenom });
    }
    renderInteractive();
  });

  renderInteractive();
}

function setupComparison(): void {
  const inputA = document.getElementById('compare-a') as HTMLInputElement;
  const inputB = document.getElementById('compare-b') as HTMLInputElement;
  const compareBtn = document.getElementById('compare-btn');
  const resultContainer = document.getElementById('comparison-result');

  compareBtn?.addEventListener('click', () => {
    const a = parseFraction(inputA.value);
    const b = parseFraction(inputB.value);

    if (!a || !b) {
      if (resultContainer) {
        resultContainer.innerHTML = '<p style="color: red;">Invalid fraction format</p>';
      }
      return;
    }

    if (resultContainer) {
      resultContainer.innerHTML = '';

      const comparison = renderFractionComparison(a, b, {
        width: 150,
        height: 35,
      });
      resultContainer.appendChild(comparison);

      const compResult = compare(a, b);
      const textDiv = document.createElement('div');
      textDiv.className = 'comparison-text';

      if (compResult < 0) {
        textDiv.textContent = `${formatFraction(a)} is less than ${formatFraction(b)}`;
      } else if (compResult > 0) {
        textDiv.textContent = `${formatFraction(a)} is greater than ${formatFraction(b)}`;
      } else {
        textDiv.textContent = `${formatFraction(a)} equals ${formatFraction(b)}`;
      }

      resultContainer.appendChild(textDiv);

      // Show decimal values
      const decimalDiv = document.createElement('div');
      decimalDiv.style.cssText = 'color: #888; font-size: 0.875rem;';
      decimalDiv.textContent = `(${toDecimal(a).toFixed(4)} vs ${toDecimal(b).toFixed(4)})`;
      resultContainer.appendChild(decimalDiv);
    }
  });

  // Trigger initial comparison
  compareBtn?.click();
}

function setupEquivalentFinder(): void {
  const input = document.getElementById('equiv-fraction') as HTMLInputElement;
  const findBtn = document.getElementById('find-equiv-btn');
  const resultContainer = document.getElementById('equivalent-result');

  findBtn?.addEventListener('click', () => {
    const fraction = parseFraction(input.value);

    if (!fraction) {
      if (resultContainer) {
        resultContainer.innerHTML = '<p style="color: red;">Invalid fraction format</p>';
      }
      return;
    }

    const simplified = simplify(fraction);
    const equivalents = findEquivalentFractions(simplified, 24);

    if (resultContainer) {
      resultContainer.innerHTML = '';

      // Show simplified form first
      const simplifiedItem = document.createElement('div');
      simplifiedItem.className = 'equivalent-item';
      simplifiedItem.innerHTML = `
        <span>Simplified</span>
      `;
      const simplifiedBar = renderFractionBar(simplified, {
        style: 'horizontal',
        width: 80,
        height: 25,
        showLabel: true,
        colors: { filled: getFractionColor(simplified.denominator) },
      });
      simplifiedItem.insertBefore(simplifiedBar, simplifiedItem.firstChild);
      resultContainer.appendChild(simplifiedItem);

      // Show equivalent fractions
      equivalents.forEach((eq) => {
        if (!areEquivalent(eq, simplified) || eq.denominator !== simplified.denominator) {
          const item = document.createElement('div');
          item.className = 'equivalent-item';
          item.innerHTML = `<span>/ ${eq.denominator}</span>`;

          const bar = renderFractionBar(eq, {
            style: 'horizontal',
            width: 80,
            height: 25,
            showLabel: true,
            colors: { filled: getFractionColor(eq.denominator) },
          });
          item.insertBefore(bar, item.firstChild);
          resultContainer.appendChild(item);
        }
      });
    }
  });

  // Trigger initial find
  findBtn?.click();
}

function renderFractionGallery(): void {
  const gallery = document.getElementById('fraction-gallery');
  if (!gallery) return;

  COMMON_FRACTIONS.forEach((f) => {
    const item = document.createElement('div');
    item.className = 'gallery-item';

    const bar = renderFractionBar(f, {
      style: 'circle',
      width: 60,
      height: 60,
      showLabel: false,
      colors: { filled: FRACTION_COLORS[f.denominator] || '#607d8b' },
    });

    item.appendChild(bar);

    const label = document.createElement('span');
    label.className = 'label';
    label.textContent = formatFraction(f);
    item.appendChild(label);

    const decimal = document.createElement('span');
    decimal.className = 'decimal';
    decimal.textContent = toDecimal(f).toFixed(3);
    item.appendChild(decimal);

    gallery.appendChild(item);
  });
}
